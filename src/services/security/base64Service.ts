
export const encryptSensitiveData = (data: string): string => {
  // Simple base64 encoding for demo purposes
  return btoa(data);
};

export const decryptSensitiveData = (encryptedData: string): string => {
  // Simple base64 decoding for demo purposes
  try {
    return atob(encryptedData);
  } catch {
    return encryptedData;
  }
};

export const encodeBase64FromArrayBuffer = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const encodeBase64 = encryptSensitiveData;
export const decodeBase64 = decryptSensitiveData;

export const base64Service = {
  encode: encryptSensitiveData,
  decode: decryptSensitiveData,
  encodeFromArrayBuffer: encodeBase64FromArrayBuffer
};
