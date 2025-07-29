import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { appRouter } from './app.router';
import { createContext } from './context';

@Injectable()
export class TrpcService implements OnModuleInit {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  onModuleInit() {
    const app = express();

    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: createContext(this.authService, this.prisma, this.jwtService),
      }),
    );

    const port = this.configService.get<number>('TRPC_PORT') || 3002;
    app.listen(port, () => {
      console.log(`tRPC server running on port ${port}`);
    });
  }
}