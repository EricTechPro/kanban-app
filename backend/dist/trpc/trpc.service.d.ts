import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class TrpcService implements OnModuleInit {
    private authService;
    private prisma;
    private jwtService;
    private configService;
    constructor(authService: AuthService, prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    onModuleInit(): void;
}
