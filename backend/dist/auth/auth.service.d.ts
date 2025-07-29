import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TokenEncryptionService } from './services/token-encryption.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private tokenEncryption;
    private readonly logger;
    private oauth2Client;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, tokenEncryption: TokenEncryptionService);
    generateAuthUrl(): string;
    handleOAuthCallback(code: string, userEmail: string): Promise<any>;
    getAuthStatus(userId: string): Promise<any>;
    refreshTokenIfNeeded(userId: string): Promise<string | null>;
    disconnectGmail(userId: string): Promise<void>;
    getValidAccessToken(userId: string): Promise<string>;
}
