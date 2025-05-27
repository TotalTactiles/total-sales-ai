
import { logger } from '@/utils/logger';

export class EncryptionService {
  private static instance: EncryptionService;

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async encryptSensitiveData(data: any): Promise<string> {
    try {
      // In production, use proper AES-256 encryption
      // For demo purposes, using base64 encoding with salt
      const jsonString = JSON.stringify(data);
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(jsonString);
      
      // Combine salt + data for basic security
      const combined = new Uint8Array(salt.length + dataBytes.length);
      combined.set(salt);
      combined.set(dataBytes, salt.length);
      
      const encrypted = btoa(String.fromCharCode(...combined));
      
      logger.info('Data encrypted successfully', { 
        dataSize: jsonString.length,
        encryptedSize: encrypted.length 
      }, 'security');
      
      return encrypted;
    } catch (error) {
      logger.error('Encryption failed', error, 'security');
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  async decryptSensitiveData(encryptedData: string): Promise<any> {
    try {
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(c => c.charCodeAt(0))
      );
      
      // Extract data after salt (first 16 bytes)
      const dataBytes = combined.slice(16);
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(dataBytes);
      
      logger.info('Data decrypted successfully', { 
        decryptedSize: jsonString.length 
      }, 'security');
      
      return JSON.parse(jsonString);
    } catch (error) {
      logger.error('Decryption failed', error, 'security');
      throw new Error('Failed to decrypt data');
    }
  }

  generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  hashSensitiveField(value: string): string {
    // Simple hash for demo - use bcrypt or similar in production
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    return btoa(String.fromCharCode(...data)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  }
}

export const encryptionService = EncryptionService.getInstance();
