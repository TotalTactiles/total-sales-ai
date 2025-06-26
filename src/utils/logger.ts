
interface LogContext {
  [key: string]: any;
}

export const logger = {
  info: (message: string, context?: LogContext, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    console.log(`${prefix} ${message}`, context || '');
  },
  
  error: (message: string, error?: any, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    console.error(`${prefix} ${message}`, error || '');
  },
  
  warn: (message: string, context?: LogContext, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    console.warn(`${prefix} ${message}`, context || '');
  },
  
  debug: (message: string, context?: LogContext, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    console.debug(`${prefix} ${message}`, context || '');
  }
};
