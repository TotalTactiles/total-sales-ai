
export const logger = {
  info: (message: string, data?: any, context?: string) => {
    const prefix = context ? `[${context.toUpperCase()}]` : '';
    console.log(`${prefix}[INFO] ${message}`, data || '');
  },
  
  error: (message: string, error?: any, context?: string) => {
    const prefix = context ? `[${context.toUpperCase()}]` : '';
    console.error(`${prefix}[ERROR] ${message}`, error || '');
  },
  
  warn: (message: string, data?: any, context?: string) => {
    const prefix = context ? `[${context.toUpperCase()}]` : '';
    console.warn(`${prefix}[WARN] ${message}`, data || '');
  },
  
  debug: (message: string, data?: any, context?: string) => {
    const prefix = context ? `[${context.toUpperCase()}]` : '';
    console.debug(`${prefix}[DEBUG] ${message}`, data || '');
  }
};
