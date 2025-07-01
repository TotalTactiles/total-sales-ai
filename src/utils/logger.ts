
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  component?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private createLogEntry(level: LogLevel, message: string, data?: any, component?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      component
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output for development
    const consoleMethod = entry.level === 'error' ? 'error' : 
                         entry.level === 'warn' ? 'warn' : 'log';
    
    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;
    const suffix = entry.component ? ` (${entry.component})` : '';
    
    console[consoleMethod](`${prefix} ${entry.message}${suffix}`, entry.data || '');
  }

  info(message: string, data?: any, component?: string) {
    this.addLog(this.createLogEntry('info', message, data, component));
  }

  warn(message: string, data?: any, component?: string) {
    this.addLog(this.createLogEntry('warn', message, data, component));
  }

  error(message: string, error?: any, component?: string) {
    this.addLog(this.createLogEntry('error', message, error, component));
  }

  debug(message: string, data?: any, component?: string) {
    if (process.env.NODE_ENV === 'development') {
      this.addLog(this.createLogEntry('debug', message, data, component));
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
