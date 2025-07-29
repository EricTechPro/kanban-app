import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TokenEncryptionService {
  private readonly algorithm = 'aes-256-cbc';

  /**
   * Generate a unique encryption key for a user
   */
  generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Encrypt a token using the user's encryption key with AES-256-CBC
   */
  encryptToken(token: string, encryptionKey: string): string {
    try {
      const key = Buffer.from(encryptionKey, 'hex');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, key);

      let encrypted = cipher.update(token, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Create HMAC for integrity verification
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(iv.toString('hex') + encrypted);
      const authTag = hmac.digest('hex');

      // Format: iv:authTag:encrypted
      return iv.toString('hex') + ':' + authTag + ':' + encrypted;
    } catch (error) {
      throw new Error(`Token encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt a token using the user's encryption key with integrity verification
   */
  decryptToken(encryptedToken: string, encryptionKey: string): string {
    try {
      const key = Buffer.from(encryptionKey, 'hex');
      const parts = encryptedToken.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted token format - expected iv:authTag:encrypted');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const providedAuthTag = parts[1];
      const encrypted = parts[2];

      // Verify integrity
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(parts[0] + encrypted);
      const calculatedAuthTag = hmac.digest('hex');

      if (!this.secureCompare(providedAuthTag, calculatedAuthTag)) {
        throw new Error('Token integrity verification failed');
      }

      const decipher = crypto.createDecipher(this.algorithm, key);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Token decryption failed: ${error.message}`);
    }
  }

  /**
   * Check if a token is expired
   */
  isTokenExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate;
  }

  /**
   * Calculate token expiry date (typically 1 hour from now for access tokens)
   */
  calculateTokenExpiry(expiresInSeconds: number = 3600): Date {
    return new Date(Date.now() + expiresInSeconds * 1000);
  }

  /**
   * Securely compare two strings to prevent timing attacks
   */
  secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}