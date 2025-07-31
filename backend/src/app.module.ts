import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrpcModule } from './trpc/trpc.module';
import { AuthController } from './controllers/auth.controller';
import { DealsController } from './controllers/deals.controller';
import { EmailsController } from './controllers/emails.controller';
import { GmailSyncController } from './controllers/gmail-sync.controller';
import { GmailLabelsService } from './services/gmail-labels.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TrpcModule,
  ],
  controllers: [
    AuthController,
    DealsController,
    EmailsController,
    GmailSyncController,
  ],
  providers: [GmailLabelsService],
})
export class AppModule { }