"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const server_1 = require("@trpc/server");
const trpc_1 = require("../trpc");
exports.authRouter = (0, trpc_1.createTRPCRouter)({
    initiateGmailAuth: trpc_1.publicProcedure.query(async ({ ctx }) => {
        const authService = ctx.authService;
        const authUrl = authService.generateAuthUrl();
        return {
            authUrl,
            message: 'Redirect user to this URL to start OAuth flow',
        };
    }),
    getAuthStatus: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        const authService = ctx.authService;
        const userId = ctx.user.id;
        try {
            const status = await authService.getAuthStatus(userId);
            return status;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Failed to get auth status',
            });
        }
    }),
    disconnectGmail: trpc_1.protectedProcedure.mutation(async ({ ctx }) => {
        const authService = ctx.authService;
        const userId = ctx.user.id;
        try {
            await authService.disconnectGmail(userId);
            return {
                success: true,
                message: 'Gmail account disconnected successfully',
            };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to disconnect Gmail account',
            });
        }
    }),
    refreshToken: trpc_1.protectedProcedure.mutation(async ({ ctx }) => {
        const authService = ctx.authService;
        const userId = ctx.user.id;
        try {
            const accessToken = await authService.refreshTokenIfNeeded(userId);
            return {
                success: !!accessToken,
                message: accessToken ? 'Token refreshed successfully' : 'Token refresh failed',
            };
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to refresh token',
            });
        }
    }),
});
//# sourceMappingURL=auth.router.js.map