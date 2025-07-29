import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { AuthService } from '../../auth/auth.service';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = createTRPCRouter({
  /**
   * Initiate Gmail OAuth flow
   */
  initiateGmailAuth: publicProcedure.query(async ({ ctx }) => {
    const authService = ctx.authService as AuthService;
    const authUrl = authService.generateAuthUrl();

    return {
      authUrl,
      message: 'Redirect user to this URL to start OAuth flow',
    };
  }),

  /**
   * Get current Gmail connection status
   */
  getAuthStatus: protectedProcedure.query(async ({ ctx }) => {
    const authService = ctx.authService as AuthService;
    const userId = ctx.user.id;

    try {
      const status = await authService.getAuthStatus(userId);
      return status;
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Failed to get auth status',
      });
    }
  }),

  /**
   * Disconnect Gmail account
   */
  disconnectGmail: protectedProcedure.mutation(async ({ ctx }) => {
    const authService = ctx.authService as AuthService;
    const userId = ctx.user.id;

    try {
      await authService.disconnectGmail(userId);
      return {
        success: true,
        message: 'Gmail account disconnected successfully',
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to disconnect Gmail account',
      });
    }
  }),

  /**
   * Refresh access token if needed
   */
  refreshToken: protectedProcedure.mutation(async ({ ctx }) => {
    const authService = ctx.authService as AuthService;
    const userId = ctx.user.id;

    try {
      const accessToken = await authService.refreshTokenIfNeeded(userId);
      return {
        success: !!accessToken,
        message: accessToken ? 'Token refreshed successfully' : 'Token refresh failed',
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to refresh token',
      });
    }
  }),
});