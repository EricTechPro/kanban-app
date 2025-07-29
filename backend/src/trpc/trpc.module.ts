import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule { }