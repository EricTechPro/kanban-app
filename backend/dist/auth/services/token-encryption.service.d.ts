export declare class TokenEncryptionService {
    private readonly algorithm;
    generateEncryptionKey(): string;
    encryptToken(token: string, encryptionKey: string): string;
    decryptToken(encryptedToken: string, encryptionKey: string): string;
    isTokenExpired(expiryDate: Date): boolean;
    calculateTokenExpiry(expiresInSeconds?: number): Date;
    secureCompare(a: string, b: string): boolean;
}
