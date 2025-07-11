
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

export const base64Service = {
  encode: encryptSensitiveData,
  decode: decryptSensitiveData
};
