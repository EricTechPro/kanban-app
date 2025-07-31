import { Controller, Get, Post, Body, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * Simple email/password login
   */
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  /**
   * Initiate Gmail OAuth flow
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // This endpoint triggers the Google OAuth flow
    // The actual redirect is handled by Passport
  }

  /**
   * Handle OAuth callback from Google
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as any;

      // Passport has already exchanged the code for tokens
      // The tokens are available in the user object
      const result = await this.authService.handleOAuthCallbackWithTokens(
        user.email,
        user.accessToken,
        user.refreshToken,
      );

      // Redirect to frontend with success
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/success?token=${result.jwt}`);
    } catch (error) {
      // Redirect to frontend with error
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent(error.message)}`);
    }
  }

  /**
   * Get OAuth authorization URL
   */
  @Get('google/url')
  getGoogleAuthUrl() {
    return {
      url: this.authService.generateAuthUrl(),
    };
  }
}