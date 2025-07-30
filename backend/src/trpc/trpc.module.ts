import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcService } from './trpc.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule { }