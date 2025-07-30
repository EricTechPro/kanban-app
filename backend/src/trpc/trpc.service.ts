import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as trpcExpress from '@trpc/server/adapters/express';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { appRouter } from './app.router';
import { createContext } from './context';

@Injectable()
export class TrpcService {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  getMiddleware() {
    return trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: createContext(this.authService, this.prisma, this.jwtService),
    });
  }

  getRouter() {
    return appRouter;
  }
}