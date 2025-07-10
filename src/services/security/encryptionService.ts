
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export class EncryptionService {
  private static readonly ENCRYPTION_ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;

  // Encrypt sensitive data using Web Crypto API
  static async encryptSensitiveData(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);

      // Generate a random key for this encryption
      const key = await crypto.subtle.generateKey(
        {
          name: this.ENCRYPTION_ALGORITHM,
          length: this.KEY_LENGTH,
        },
        true,
        ['encrypt', 'decrypt']
      );

      // Generate a random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt the data
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: this.ENCRYPTION_ALGORITHM,
          iv: iv,
        },
        key,
        dataBuffer
      );

      // Export the key for storage
      const exportedKey = await crypto.subtle.exportKey('raw', key);

      // Combine IV + encrypted data + key
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength + exportedKey.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);
      combined.set(new Uint8Array(exportedKey), iv.length + encryptedBuffer.byteLength);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      logger.error('Encryption failed:', error);
      // Return obfuscated data as fallback
      return btoa(JSON.stringify({ encrypted: true, error: 'encryption_failed' }));
    }
  }

  // Decrypt sensitive data
  static async decryptSensitiveData(encryptedData: string): Promise<any> {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData)
          .split('')
          .map(char => char.charCodeAt(0))
      );

      // Extract components
      const iv = combined.slice(0, 12);
      const keyLength = this.KEY_LENGTH / 8; // Convert bits to bytes
      const encryptedBuffer = combined.slice(12, combined.length - keyLength);
      const keyBuffer = combined.slice(combined.length - keyLength);

      // Import the key
      const key = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        {
          name: this.ENCRYPTION_ALGORITHM,
          length: this.KEY_LENGTH,
        },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: this.ENCRYPTION_ALGORITHM,
          iv: iv,
        },
        key,
        encryptedBuffer
      );

      // Convert back to string and parse JSON
      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decryptedBuffer);
      return JSON.parse(decryptedString);
    } catch (error) {
      logger.error('Decryption failed:', error);
      return { decrypted: false, error: 'decryption_failed' };
    }
  }

  // Generate a secure hash for data integrity
  static async generateDataHash(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = new Uint8Array(hashBuffer);
      
      return Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      logger.error('Hash generation failed:', error);
      return 'hash_failed';
    }
  }

  // Generate a secure token
  static generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const encryptionService = new EncryptionService();
