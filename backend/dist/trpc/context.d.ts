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
export declare const createContext: (authService: AuthService, prisma: PrismaService, jwtService: JwtService) => ({ req }: CreateExpressContextOptions) => Promise<Context>;
