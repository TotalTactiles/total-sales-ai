
import { supabase } from '@/integrations/supabase/client';

export interface LogEvent {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  userId?: string;
  context?: string;
  timestamp?: string;
}

class Logger {
  private static instance: Logger;
  private logQueue: LogEvent[] = [];
  private isProcessing = false;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async processLogQueue() {
    if (this.isProcessing || this.logQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      const logsToProcess = [...this.logQueue];
      this.logQueue = [];
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        logsToProcess.forEach(log => {
          const method = log.level === 'error' ? 'error' : 
                        log.level === 'warn' ? 'warn' : 'log';
          console[method](`[${log.level.toUpperCase()}] ${log.message}`, log.data || '');
        });
      }
      
      // Batch insert to database
      if (logsToProcess.length > 0) {
        await this.batchInsertLogs(logsToProcess);
      }
    } catch (error) {
      console.error('Failed to process log queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async batchInsertLogs(logs: LogEvent[]) {
    try {
      const logEntries = logs.map(log => ({
        type: 'system_log',
        event_summary: log.message,
        payload: {
          level: log.level,
          message: log.message,
          data: log.data,
          context: log.context,
          timestamp: log.timestamp || new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        },
        visibility: 'admin_only' as const
      }));

      const { error } = await supabase
        .from('ai_brain_logs')
        .insert(logEntries);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to insert logs to database:', error);
    }
  }

  log(event: LogEvent) {
    const logEntry: LogEvent = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    };
    
    this.logQueue.push(logEntry);
    
    // Process queue with debouncing
    setTimeout(() => this.processLogQueue(), 100);
  }

  debug(message: string, data?: any, context?: string, userId?: string) {
    this.log({ level: 'debug', message, data, context, userId });
  }

  info(message: string, data?: any, context?: string, userId?: string) {
    this.log({ level: 'info', message, data, context, userId });
  }

  warn(message: string, data?: any, context?: string, userId?: string) {
    this.log({ level: 'warn', message, data, context, userId });
  }

  error(message: string, data?: any, context?: string, userId?: string) {
    this.log({ level: 'error', message, data, context, userId });
  }

  // Performance logging
  performance(action: string, duration: number, context?: string, userId?: string) {
    this.info(`Performance: ${action}`, { duration, unit: 'ms' }, context, userId);
  }

  // AI interaction logging
  aiInteraction(interaction: string, data?: any, userId?: string) {
    this.info(`AI Interaction: ${interaction}`, data, 'ai_system', userId);
  }

  // Voice interaction logging
  voiceInteraction(action: string, data?: any, userId?: string) {
    this.info(`Voice: ${action}`, data, 'voice_system', userId);
  }
}

export const logger = Logger.getInstance();

// Performance measurement utility
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T> | T,
  context?: string,
  userId?: string
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.performance(name, duration, context, userId);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${name} failed after ${duration}ms`, error, context, userId);
    throw error;
  }
};
