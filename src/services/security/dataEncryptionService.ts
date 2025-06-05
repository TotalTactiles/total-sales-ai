
import { encodeBase64, decodeBase64 } from './base64Service';

export class DataEncryptionService {
  private static instance: DataEncryptionService;
  private keyPromise: Promise<CryptoKey>;

  private constructor() {
    const envKey =
      (typeof process !== 'undefined' && process.env.DATA_ENCRYPTION_KEY_B64) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DATA_ENCRYPTION_KEY_B64);

    const keyB64 = envKey || 'b4nhn4DvmRll8uXzYr5BJHVLFvyomHE4WJahSbv95Jk='; // demo key
    const keyBytes = Uint8Array.from(decodeBase64(keyB64), c => c.charCodeAt(0));
    this.keyPromise = crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static getInstance(): DataEncryptionService {
    if (!DataEncryptionService.instance) {
      DataEncryptionService.instance = new DataEncryptionService();
    }
    return DataEncryptionService.instance;
  }

  async encryptSensitiveData(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(jsonString);
      const key = await this.keyPromise;
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

      const combined = new Uint8Array(iv.byteLength + cipher.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(cipher), iv.byteLength);

      return encodeBase64(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      try {
        const jsonString = JSON.stringify(data);
        return encodeBase64(jsonString); // Fallback to basic encoding
      } catch {
        return JSON.stringify(data);
      }
    }
  }

  async decryptSensitiveData(encryptedData: string): Promise<any> {
    try {
      const combined = Uint8Array.from(decodeBase64(encryptedData), c => c.charCodeAt(0));
      if (combined.byteLength <= 12) throw new Error('Invalid encrypted payload');

      const iv = combined.slice(0, 12);
      const dataBytes = combined.slice(12);
      const key = await this.keyPromise;
      const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, dataBytes);
      const jsonString = new TextDecoder().decode(plainBuffer);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption failed:', error);
      try {
        const jsonString = decodeBase64(encryptedData);
        return JSON.parse(jsonString);
      } catch {
        try {
          return JSON.parse(encryptedData); // Try parsing as unencrypted JSON
        } catch {
          return encryptedData; // Return as string if all else fails
        }
      }
    }
  }

  segmentDataByUser(data: any, userId: string, companyId: string): any {
    // Ensure data is properly segmented and tagged
    return {
      ...data,
      _metadata: {
        userId,
        companyId,
        segmented: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  validateDataAccess(data: any, requestingUserId: string, requestingCompanyId: string): boolean {
    if (!data._metadata) {
      return false; // No metadata means access denied
    }

    // User can only access their own data or company-wide data
    return data._metadata.userId === requestingUserId || 
           data._metadata.companyId === requestingCompanyId;
  }
}

export const dataEncryptionService = DataEncryptionService.getInstance();
