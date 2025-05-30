
export interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
}

export type LogCategory = 
  | 'automation' 
  | 'voice_ai' 
  | 'crm' 
  | 'system' 
  | 'ui' 
  | 'api'
  | 'ai_brain'
  | 'system_health'
  | 'elevenlabs'
  | 'speech_synthesis'
  | 'retell_ai'
  | 'security';

class Logger {
  private static instance: Logger;
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, data?: any, category: LogCategory = 'system') {
    console.log(`[${category.toUpperCase()}] INFO: ${message}`, data);
  }

  warn(message: string, data?: any, category: LogCategory = 'system') {
    console.warn(`[${category.toUpperCase()}] WARN: ${message}`, data);
  }

  error(message: string, error?: any, category: LogCategory = 'system') {
    console.error(`[${category.toUpperCase()}] ERROR: ${message}`, error);
  }

  debug(message: string, data?: any, category: LogCategory = 'system') {
    console.debug(`[${category.toUpperCase()}] DEBUG: ${message}`, data);
  }
}

export const logger = Logger.getInstance();
