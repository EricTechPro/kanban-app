"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const token_encryption_service_1 = require("../services/token-encryption.service");
describe('AuthService', () => {
    let service;
    let prismaService;
    let tokenEncryption;
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };
    const mockConfigService = {
        get: jest.fn((key) => {
            const config = {
                GOOGLE_CLIENT_ID: 'test-client-id',
                GOOGLE_CLIENT_SECRET: 'test-client-secret',
                GOOGLE_CALLBACK_URL: 'http://localhost:3001/auth/google/callback',
            };
            return config[key];
        }),
    };
    const mockJwtService = {
        sign: jest.fn(() => 'mock-jwt-token'),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                token_encryption_service_1.TokenEncryptionService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        prismaService = module.get(prisma_service_1.PrismaService);
        tokenEncryption = module.get(token_encryption_service_1.TokenEncryptionService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('generateAuthUrl', () => {
        it('should generate a valid OAuth URL', () => {
            const authUrl = service.generateAuthUrl();
            expect(authUrl).toContain('https://accounts.google.com/o/oauth2/v2/auth');
            expect(authUrl).toContain('client_id=test-client-id');
            expect(authUrl).toContain('scope=');
        });
    });
    describe('getAuthStatus', () => {
        it('should return connected status for valid user', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                gmailConnected: true,
                tokenExpiry: new Date(Date.now() + 3600000),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.getAuthStatus('user-1');
            expect(result.connected).toBe(true);
            expect(result.email).toBe('test@example.com');
        });
        it('should return disconnected status for expired token', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                gmailConnected: true,
                tokenExpiry: new Date(Date.now() - 3600000),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.getAuthStatus('user-1');
            expect(result.connected).toBe(false);
        });
    });
    describe('disconnectGmail', () => {
        it('should clear OAuth data from database', async () => {
            const encryptionKey = tokenEncryption.generateEncryptionKey();
            const mockToken = 'test-access-token';
            const encryptedToken = tokenEncryption.encryptToken(mockToken, encryptionKey);
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                encryptedAccessToken: encryptedToken,
                tokenEncryptionKey: encryptionKey,
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.update.mockResolvedValue({});
            await service.disconnectGmail('user-1');
            expect(mockPrismaService.user.update).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                data: {
                    encryptedAccessToken: null,
                    encryptedRefreshToken: null,
                    tokenExpiry: null,
                    gmailConnected: false,
                },
            });
        });
        it('should handle missing user gracefully', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            await expect(service.disconnectGmail('non-existent-user')).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map