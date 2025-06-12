
export function encodeBase64(input: string | Uint8Array): string {
  if (typeof input === 'string') {
    // Use btoa for string encoding in browsers
    return btoa(unescape(encodeURIComponent(input)));
  } else {
    // For Uint8Array, convert to string first
    const string = String.fromCharCode(...input);
    return btoa(string);
  }
}

export function decodeBase64(base64: string): string {
  try {
    // Use atob for base64 decoding in browsers
    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    console.error('Base64 decode error:', error);
    return base64; // Return original if decode fails
  }
}
