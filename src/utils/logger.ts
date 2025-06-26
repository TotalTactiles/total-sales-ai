
interface LogContext {
  [key: string]: any;
}

export const logger = {
  info: (message: string, context?: LogContext | string, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    const contextData = typeof context === 'string' ? { data: context } : context;
    console.log(`${prefix} ${message}`, contextData || '');
  },
  
  error: (message: string, error?: any, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    console.error(`${prefix} ${message}`, error || '');
  },
  
  warn: (message: string, context?: LogContext | string, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    const contextData = typeof context === 'string' ? { data: context } : context;
    console.warn(`${prefix} ${message}`, contextData || '');
  },
  
  debug: (message: string, context?: LogContext | string, category?: string) => {
    const prefix = category ? `[${category.toUpperCase()}]` : '';
    const contextData = typeof context === 'string' ? { data: context } : context;
    console.debug(`${prefix} ${message}`, contextData || '');
  }
};
