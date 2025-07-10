
// Base64 encoding/decoding utilities

export function encodeBase64(data: Uint8Array): string {
  // Convert Uint8Array to string first
  const binaryString = Array.from(data, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
}

export function decodeBase64(base64String: string): string {
  return atob(base64String);
}

export function encodeBase64FromArrayBuffer(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  return encodeBase64(uint8Array);
}
