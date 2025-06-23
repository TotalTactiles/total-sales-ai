
// Simple logger implementation for the application
export const logger = {
  info: (message: string, data?: any, context?: string) => {
    const contextStr = context ? `[${context.toUpperCase()}]` : '';
    console.log(`[INFO] ${contextStr} ${message}`, data || '');
  },
  error: (message: string, data?: any, context?: string) => {
    const contextStr = context ? `[${context.toUpperCase()}]` : '';
    console.error(`[ERROR] ${contextStr} ${message}`, data || '');
  },
  warn: (message: string, data?: any, context?: string) => {
    const contextStr = context ? `[${context.toUpperCase()}]` : '';
    console.warn(`[WARN] ${contextStr} ${message}`, data || '');
  },
  debug: (message: string, data?: any, context?: string) => {
    const contextStr = context ? `[${context.toUpperCase()}]` : '';
    console.debug(`[DEBUG] ${contextStr} ${message}`, data || '');
  }
};
