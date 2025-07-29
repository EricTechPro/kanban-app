"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenEncryptionService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let TokenEncryptionService = class TokenEncryptionService {
    constructor() {
        this.algorithm = 'aes-256-cbc';
    }
    generateEncryptionKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    encryptToken(token, encryptionKey) {
        try {
            const key = Buffer.from(encryptionKey, 'hex');
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipher(this.algorithm, key);
            let encrypted = cipher.update(token, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const hmac = crypto.createHmac('sha256', key);
            hmac.update(iv.toString('hex') + encrypted);
            const authTag = hmac.digest('hex');
            return iv.toString('hex') + ':' + authTag + ':' + encrypted;
        }
        catch (error) {
            throw new Error(`Token encryption failed: ${error.message}`);
        }
    }
    decryptToken(encryptedToken, encryptionKey) {
        try {
            const key = Buffer.from(encryptionKey, 'hex');
            const parts = encryptedToken.split(':');
            if (parts.length !== 3) {
                throw new Error('Invalid encrypted token format - expected iv:authTag:encrypted');
            }
            const iv = Buffer.from(parts[0], 'hex');
            const providedAuthTag = parts[1];
            const encrypted = parts[2];
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
        }
        catch (error) {
            throw new Error(`Token decryption failed: ${error.message}`);
        }
    }
    isTokenExpired(expiryDate) {
        return new Date() > expiryDate;
    }
    calculateTokenExpiry(expiresInSeconds = 3600) {
        return new Date(Date.now() + expiresInSeconds * 1000);
    }
    secureCompare(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return result === 0;
    }
};
exports.TokenEncryptionService = TokenEncryptionService;
exports.TokenEncryptionService = TokenEncryptionService = __decorate([
    (0, common_1.Injectable)()
], TokenEncryptionService);
//# sourceMappingURL=token-encryption.service.js.map