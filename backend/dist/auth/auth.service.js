"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const googleapis_1 = require("googleapis");
const prisma_service_1 = require("../prisma/prisma.service");
const token_encryption_service_1 = require("./services/token-encryption.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, tokenEncryption) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokenEncryption = tokenEncryption;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(this.configService.get('GOOGLE_CLIENT_ID'), this.configService.get('GOOGLE_CLIENT_SECRET'), this.configService.get('GOOGLE_CALLBACK_URL'));
    }
    generateAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.labels',
            'email',
            'profile',
        ];
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
        });
    }
    async handleOAuthCallback(code, userEmail) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            if (!tokens.access_token) {
                throw new common_1.UnauthorizedException('Failed to obtain access token');
            }
            let user = await this.prisma.user.findUnique({
                where: { email: userEmail },
            });
            if (!user) {
                const tokenEncryptionKey = this.tokenEncryption.generateEncryptionKey();
                user = await this.prisma.user.create({
                    data: {
                        email: userEmail,
                        tokenEncryptionKey,
                    },
                });
                this.logger.log(`Created new user: ${userEmail}`);
            }
            if (!user.tokenEncryptionKey) {
                const tokenEncryptionKey = this.tokenEncryption.generateEncryptionKey();
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { tokenEncryptionKey },
                });
            }
            const encryptedAccessToken = this.tokenEncryption.encryptToken(tokens.access_token, user.tokenEncryptionKey);
            let encryptedRefreshToken = null;
            if (tokens.refresh_token) {
                encryptedRefreshToken = this.tokenEncryption.encryptToken(tokens.refresh_token, user.tokenEncryptionKey);
            }
            const expiresInSeconds = tokens.expiry_date
                ? Math.max(Math.floor((tokens.expiry_date - Date.now()) / 1000), 300)
                : 3600;
            const tokenExpiry = this.tokenEncryption.calculateTokenExpiry(expiresInSeconds);
            const updatedUser = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    encryptedAccessToken,
                    encryptedRefreshToken,
                    tokenExpiry,
                    gmailConnected: true,
                },
            });
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
        }
        catch (error) {
            this.logger.error(`OAuth callback failed: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException(`OAuth authentication failed: ${error.message}`);
        }
    }
    async getAuthStatus(userId) {
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
                throw new common_1.UnauthorizedException('User not found');
            }
            const isExpired = user.tokenExpiry ? this.tokenEncryption.isTokenExpired(user.tokenExpiry) : true;
            const connected = user.gmailConnected && !isExpired;
            return {
                connected,
                email: user.email,
                tokenExpiry: user.tokenExpiry,
                needsRefresh: user.gmailConnected && isExpired,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get auth status for user ${userId}: ${error.message}`);
            throw error;
        }
    }
    async refreshTokenIfNeeded(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || !user.encryptedRefreshToken || !user.tokenEncryptionKey) {
                throw new common_1.UnauthorizedException('No refresh token available');
            }
            const needsRefresh = user.tokenExpiry ? this.tokenEncryption.isTokenExpired(user.tokenExpiry) : true;
            if (!needsRefresh) {
                return this.tokenEncryption.decryptToken(user.encryptedAccessToken, user.tokenEncryptionKey);
            }
            const refreshToken = this.tokenEncryption.decryptToken(user.encryptedRefreshToken, user.tokenEncryptionKey);
            this.oauth2Client.setCredentials({ refresh_token: refreshToken });
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            if (!credentials.access_token) {
                throw new common_1.UnauthorizedException('Failed to refresh access token');
            }
            const encryptedAccessToken = this.tokenEncryption.encryptToken(credentials.access_token, user.tokenEncryptionKey);
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
        }
        catch (error) {
            this.logger.error(`Token refresh failed for user ${userId}: ${error.message}`);
            throw new common_1.UnauthorizedException(`Token refresh failed: ${error.message}`);
        }
    }
    async disconnectGmail(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            if (user.encryptedAccessToken && user.tokenEncryptionKey) {
                try {
                    const accessToken = this.tokenEncryption.decryptToken(user.encryptedAccessToken, user.tokenEncryptionKey);
                    this.oauth2Client.setCredentials({ access_token: accessToken });
                    await this.oauth2Client.revokeCredentials();
                    this.logger.log(`Google tokens revoked for user: ${user.email}`);
                }
                catch (error) {
                    this.logger.warn(`Failed to revoke Google tokens for user ${user.email}: ${error.message}`);
                }
            }
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
        }
        catch (error) {
            this.logger.error(`Failed to disconnect Gmail for user ${userId}: ${error.message}`);
            throw error;
        }
    }
    async getValidAccessToken(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || !user.encryptedAccessToken || !user.tokenEncryptionKey) {
                throw new common_1.UnauthorizedException('No access token available');
            }
            const isExpired = user.tokenExpiry ? this.tokenEncryption.isTokenExpired(user.tokenExpiry) : true;
            if (!isExpired) {
                return this.tokenEncryption.decryptToken(user.encryptedAccessToken, user.tokenEncryptionKey);
            }
            return await this.refreshTokenIfNeeded(userId);
        }
        catch (error) {
            this.logger.error(`Failed to get valid access token for user ${userId}: ${error.message}`);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        token_encryption_service_1.TokenEncryptionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map