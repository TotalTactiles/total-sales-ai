
// Type guard to check if context is a valid object
export const isValidContext = (context: any): context is Record<string, any> => {
  return context && typeof context === 'object' && !Array.isArray(context);
};

// Enhanced type guard to safely cast Json to Record<string, any>
export const safeJsonToObject = (json: any): Record<string, any> => {
  if (!json) return {};
  if (typeof json === 'object' && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
};
