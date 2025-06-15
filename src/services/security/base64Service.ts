
export function encodeBase64(input: string | Uint8Array): string {
  if (typeof input === 'string') {
    // Use browser's btoa for strings
    return btoa(unescape(encodeURIComponent(input)));
  } else {
    // Convert Uint8Array to string and then encode
    const binaryString = Array.from(input)
      .map(byte => String.fromCharCode(byte))
      .join('');
    return btoa(binaryString);
  }
}

export function decodeBase64(base64: string): string {
  try {
    // Use browser's atob for decoding
    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    // Fallback for invalid base64
    return base64;
  }
}
