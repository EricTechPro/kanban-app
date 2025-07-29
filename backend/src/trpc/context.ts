import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

export interface Context {
  user?: {
    id: string;
    email: string;
  };
  authService: AuthService;
  prisma: PrismaService;
}

export const createContext = (
  authService: AuthService,
  prisma: PrismaService,
  jwtService: JwtService,
) => {
  return async ({ req }: CreateExpressContextOptions): Promise<Context> => {
    let user = undefined;

    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwtService.verify(token) as any;
        user = {
          id: decoded.userId,
          email: decoded.email,
        };
      } catch (error) {
        // Invalid token, user remains undefined
      }
    }

    return {
      user,
      authService,
      prisma,
    };
  };
};