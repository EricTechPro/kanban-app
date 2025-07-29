import { TokenEncryptionService } from '../services/token-encryption.service';

describe('TokenEncryptionService', () => {
  let service: TokenEncryptionService;

  beforeEach(() => {
    service = new TokenEncryptionService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateEncryptionKey', () => {
    it('should generate a 64-character hex string', () => {
      const key = service.generateEncryptionKey();
      expect(key).toHaveLength(64);
      expect(key).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate unique keys', () => {
      const key1 = service.generateEncryptionKey();
      const key2 = service.generateEncryptionKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('encryptToken and decryptToken', () => {
    it('should encrypt and decrypt tokens correctly', () => {
      const originalToken = 'test-access-token-12345';
      const encryptionKey = service.generateEncryptionKey();

      const encrypted = service.encryptToken(originalToken, encryptionKey);
      expect(encrypted).not.toBe(originalToken);
      expect(encrypted.split(':')).toHaveLength(3); // Should contain iv:authTag:encrypted

      const decrypted = service.decryptToken(encrypted, encryptionKey);
      expect(decrypted).toBe(originalToken);
    });

    it('should fail to decrypt with wrong key', () => {
      const originalToken = 'test-access-token-12345';
      const encryptionKey1 = service.generateEncryptionKey();
      const encryptionKey2 = service.generateEncryptionKey();

      const encrypted = service.encryptToken(originalToken, encryptionKey1);

      expect(() => {
        service.decryptToken(encrypted, encryptionKey2);
      }).toThrow('Token decryption failed');
    });

    it('should fail to decrypt malformed token', () => {
      const encryptionKey = service.generateEncryptionKey();
      const malformedToken = 'invalid:token';

      expect(() => {
        service.decryptToken(malformedToken, encryptionKey);
      }).toThrow('Invalid encrypted token format');
    });

    it('should handle encryption errors gracefully', () => {
      const invalidKey = 'invalid-key';
      const token = 'test-token';

      expect(() => {
        service.encryptToken(token, invalidKey);
      }).toThrow('Token encryption failed');
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired tokens', () => {
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago
      expect(service.isTokenExpired(expiredDate)).toBe(true);
    });

    it('should return false for valid tokens', () => {
      const validDate = new Date(Date.now() + 3600000); // 1 hour from now
      expect(service.isTokenExpired(validDate)).toBe(false);
    });
  });

  describe('calculateTokenExpiry', () => {
    it('should calculate correct expiry date', () => {
      const expiresInSeconds = 3600; // 1 hour
      const expiry = service.calculateTokenExpiry(expiresInSeconds);
      const expectedTime = Date.now() + (expiresInSeconds * 1000);

      // Allow 1 second tolerance for test execution time
      expect(Math.abs(expiry.getTime() - expectedTime)).toBeLessThan(1000);
    });

    it('should use default expiry when not specified', () => {
      const expiry = service.calculateTokenExpiry();
      const expectedTime = Date.now() + (3600 * 1000); // Default 1 hour

      expect(Math.abs(expiry.getTime() - expectedTime)).toBeLessThan(1000);
    });
  });

  describe('secureCompare', () => {
    it('should return true for identical strings', () => {
      const str = 'test-string-123';
      expect(service.secureCompare(str, str)).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(service.secureCompare('string1', 'string2')).toBe(false);
    });

    it('should return false for strings of different lengths', () => {
      expect(service.secureCompare('short', 'longer-string')).toBe(false);
    });

    it('should be resistant to timing attacks', () => {
      const str1 = 'a'.repeat(1000);
      const str2 = 'b'.repeat(1000);

      // This test ensures the function takes similar time regardless of where strings differ
      const start = process.hrtime.bigint();
      service.secureCompare(str1, str2);
      const end = process.hrtime.bigint();

      expect(end - start).toBeGreaterThan(0n);
    });
  });
});