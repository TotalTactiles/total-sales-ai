
// Simple base64 encoding/decoding service
export class Base64Service {
  static encode(data: string): string {
    try {
      return btoa(data);
    } catch (error) {
      console.error('Base64 encoding failed:', error);
      return '';
    }
  }

  static decode(encodedData: string): string {
    try {
      return atob(encodedData);
    } catch (error) {
      console.error('Base64 decoding failed:', error);
      return '';
    }
  }
}

export const encodeBase64 = Base64Service.encode;
export const decodeBase64 = Base64Service.decode;
