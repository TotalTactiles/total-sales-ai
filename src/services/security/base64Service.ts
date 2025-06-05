export function encodeBase64(input: string | Uint8Array): string {
  const buffer = typeof input === 'string' ? Buffer.from(input, 'utf-8') : Buffer.from(input);
  return buffer.toString('base64');
}

export function decodeBase64(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf-8');
}
