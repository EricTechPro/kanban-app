import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';
import { TokenEncryptionService } from './services/token-encryption.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private oauth2Client: any;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenEncryption: TokenEncryptionService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    );
  }

  /**
   * Generate OAuth URL for Gmail authentication
   */
  generateAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.labels',
      'email',
      'profile',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force consent to get refresh token
    });
  }

  /**
   * Handle OAuth callback and store tokens
   */
  async handleOAuthCallback(code: string, userEmail: string): Promise<any> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new UnauthorizedException('Failed to obtain access token');
      }

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        // Generate encryption key for new user
        const tokenEncryptionKey = this.tokenEncryption.generateEncryptionKey();

        user = await this.prisma.user.create({
          data: {
            email: userEmail,
            tokenEncryptionKey,
          },
        });

        this.logger.log(`Created new user: ${userEmail}`);
      }

      // Ensure user has encryption key
      if (!user.tokenEncryptionKey) {
        const tokenEncryptionKey = this.tokenEncryption.generateEncryptionKey();
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { tokenEncryptionKey },
        });
      }

      // Encrypt tokens
      const encryptedAccessToken = this.tokenEncryption.encryptToken(
        tokens.access_token,
        user.tokenEncryptionKey,
      );

      let encryptedRefreshToken = null;
      if (tokens.refresh_token) {
        encryptedRefreshToken = this.tokenEncryption.encryptToken(
          tokens.refresh_token,
          user.tokenEncryptionKey,
        );
      }

      // Calculate token expiry with better handling
      const expiresInSeconds = tokens.expiry_date
        ? Math.max(Math.floor((tokens.expiry_date - Date.now()) / 1000), 300) // Minimum 5 minutes
        : 3600; // Default 1 hour

      const tokenExpiry = this.tokenEncryption.calculateTokenExpiry(expiresInSeconds);

      // Update user with encrypted tokens
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          encryptedAccessToken,
          encryptedRefreshToken,
          tokenExpiry,
          gmailConnected: true,
        },
      });

      // Generate JWT for frontend
      const jwt = this.jwtService.sign({
        userId: updatedUser.id,
        email: updatedUser.email,
      });

      this.logger.log(`OAuth callback successful for user: ${userEmail}`);

      return {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          gmailConnected: true,
        },
        jwt,
      };
    } catch (error) {
      this.logger.error(`OAuth callback failed: ${error.message}`, error.stack);
      throw new UnauthorizedException(`OAuth authentication failed: ${error.message}`);
    }
  }

  /**
   * Get current Gmail connection status for a user
   */
  async getAuthStatus(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          gmailConnected: true,
          tokenExpiry: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isExpired = user.tokenExpiry ? this.tokenEncryption.isTokenExpired(user.tokenExpiry) : true;
      const connected = user.gmailConnected && !isExpired;

      return {
        connected,
        email: user.email,
        tokenExpiry: user.tokenExpiry,
        needsRefresh: user.gmailConnected && isExpired,
      };
    } catch (error) {
      this.logger.error(`Failed to get auth status for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refresh access token if needed
   */
  async refreshTokenIfNeeded(userId: string): Promise<string | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.encryptedRefreshToken || !user.tokenEncryptionKey) {
        throw new UnauthorizedException('No refresh token available');
      }

      // Check if token needs refresh
      const needsRefresh = user.tokenExpiry ? this.tokenEncryption.isTokenExpired(user.tokenExpiry) : true;

      if (!needsRefresh) {
        // Token is still valid, decrypt and return
        return this.tokenEncryption.decryptToken(user.encryptedAccessToken!, user.tokenEncryptionKey);
      }

      // Decrypt refresh token
      const refreshToken = this.tokenEncryption.decryptToken(
        user.encryptedRefreshToken,
        user.tokenEncryptionKey,
      );

      // Use refresh token to get new access token
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        throw new UnauthorizedException('Failed to refresh access token');
      }

      // Encrypt and store new access token
      const encryptedAccessToken = this.tokenEncryption.encryptToken(
        credentials.access_token,
        user.tokenEncryptionKey,
      );

      const expiresInSeconds = credentials.expiry_date
        ? Math.max(Math.floor((credentials.expiry_date - Date.now()) / 1000), 300)
        : 3600;

      const tokenExpiry = this.tokenEncryption.calculateTokenExpiry(expiresInSeconds);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          encryptedAccessToken,
          tokenExpiry,
        },
      });

      this.logger.log(`Token refreshed successfully for user: ${user.email}`);
      return credentials.access_token;
    } catch (error) {
      this.logger.error(`Token refresh failed for user ${userId}: ${error.message}`);
      throw new UnauthorizedException(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Disconnect Gmail account and revoke tokens
   */
  async disconnectGmail(userId: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Try to revoke tokens with Google if possible
      if (user.encryptedAccessToken && user.tokenEncryptionKey) {
        try {
          const accessToken = this.tokenEncryption.decryptToken(
            user.encryptedAccessToken,
            user.tokenEncryptionKey,
          );

          this.oauth2Client.setCredentials({ access_token: accessToken });
          await this.oauth2Client.revokeCredentials();
          this.logger.log(`Google tokens revoked for user: ${user.email}`);
        } catch (error) {
          // Log error but continue with local cleanup
          this.logger.warn(`Failed to revoke Google tokens for user ${user.email}: ${error.message}`);
        }
      }

      // Clear tokens from database
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          encryptedAccessToken: null,
          encryptedRefreshToken: null,
          tokenExpiry: null,
          gmailConnected: false,
        },
      });

      this.logger.log(`Gmail disconnected successfully for user: ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to disconnect Gmail for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get valid access token for Gmail API calls
   */
  async getValidAccessToken(userId: string): Promise<string> {
    try {
      // First try to get current token
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.encryptedAccessToken || !user.tokenEncryptionKey) {
        throw new UnauthorizedException('No access token available');
      }

      // Check if token is expired
      const isExpired = user.tokenExpiry ? this.tokenEncryption.isTokenExpired(user.tokenExpiry) : true;

      if (!isExpired) {
        // Token is valid, return it
        return this.tokenEncryption.decryptToken(user.encryptedAccessToken, user.tokenEncryptionKey);
      }

      // Token is expired, try to refresh
      return await this.refreshTokenIfNeeded(userId);
    } catch (error) {
      this.logger.error(`Failed to get valid access token for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}