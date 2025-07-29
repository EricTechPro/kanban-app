import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenEncryptionService } from '../services/token-encryption.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let tokenEncryption: TokenEncryptionService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        TokenEncryptionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    tokenEncryption = module.get<TokenEncryptionService>(TokenEncryptionService);
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
        tokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
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
        tokenExpiry: new Date(Date.now() - 3600000), // 1 hour ago
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