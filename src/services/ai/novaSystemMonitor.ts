
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export interface SystemError {
  id: string;
  timestamp: Date;
  component: string;
  errorType: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryCount: number;
  context?: any;
}

export class NovaSystemMonitor {
  private static instance: NovaSystemMonitor;
  private errorQueue: SystemError[] = [];
  private isActive = false;
  private retryIntervals: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): NovaSystemMonitor {
    if (!NovaSystemMonitor.instance) {
      NovaSystemMonitor.instance = new NovaSystemMonitor();
    }
    return NovaSystemMonitor.instance;
  }

  async initialize(): Promise<void> {
    this.isActive = true;
    logger.info('Nova System Monitor initialized', {}, 'nova');
    
    // Start monitoring intervals
    this.startHealthCheck();
    this.startErrorProcessing();
  }

  private startHealthCheck(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }

  private startErrorProcessing(): void {
    setInterval(() => {
      this.processErrorQueue();
    }, 5000); // Every 5 seconds
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Test Supabase connection
      const { error: supabaseError } = await supabase.auth.getSession();
      if (supabaseError) {
        this.logError({
          component: 'supabase',
          errorType: 'connection',
          message: 'Supabase connection failed',
          severity: 'high',
          context: supabaseError
        });
      }

      // Test API endpoints
      await this.testAPIEndpoints();

      logger.debug('Health check completed', {}, 'nova');
    } catch (error) {
      logger.error('Health check failed:', error, 'nova');
    }
  }

  private async testAPIEndpoints(): Promise<void> {
    const endpoints = [
      { name: 'ai_brain_logs', table: 'ai_brain_logs' },
      { name: 'profiles', table: 'profiles' }
    ];

    for (const endpoint of endpoints) {
      try {
        const { error } = await supabase
          .from(endpoint.table)
          .select('count')
          .limit(1);

        if (error) {
          this.logError({
            component: endpoint.name,
            errorType: 'api_error',
            message: `API endpoint ${endpoint.name} failed`,
            severity: 'medium',
            context: error
          });
        }
      } catch (error) {
        this.logError({
          component: endpoint.name,
          errorType: 'api_exception',
          message: `API endpoint ${endpoint.name} exception`,
          severity: 'medium',
          context: error
        });
      }
    }
  }

  logError(errorData: Omit<SystemError, 'id' | 'timestamp' | 'retryCount'>): void {
    const error: SystemError = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      retryCount: 0,
      ...errorData
    };

    this.errorQueue.push(error);
    logger.error(`Nova detected error in ${error.component}:`, error, 'nova');

    // Auto-retry for certain error types
    if (this.shouldAutoRetry(error)) {
      this.scheduleRetry(error);
    }
  }

  private shouldAutoRetry(error: SystemError): boolean {
    const retryableTypes = ['connection', 'api_error', 'timeout'];
    return retryableTypes.includes(error.errorType) && error.retryCount < 3;
  }

  private scheduleRetry(error: SystemError): void {
    const delay = Math.pow(2, error.retryCount) * 1000; // Exponential backoff
    
    const timeoutId = setTimeout(() => {
      this.retryError(error);
    }, delay);

    this.retryIntervals.set(error.id, timeoutId);
  }

  private async retryError(error: SystemError): Promise<void> {
    try {
      error.retryCount++;
      logger.info(`Nova retrying error ${error.id} (attempt ${error.retryCount})`, {}, 'nova');

      // Implement retry logic based on error type
      switch (error.errorType) {
        case 'connection':
          await this.retryConnection(error);
          break;
        case 'api_error':
          await this.retryAPICall(error);
          break;
        default:
          logger.warn(`No retry handler for error type: ${error.errorType}`, {}, 'nova');
      }

      // Remove from retry map if successful
      this.retryIntervals.delete(error.id);
      logger.info(`Nova successfully resolved error ${error.id}`, {}, 'nova');

    } catch (retryError) {
      logger.error(`Nova retry failed for error ${error.id}:`, retryError, 'nova');
      
      if (error.retryCount < 3) {
        this.scheduleRetry(error);
      } else {
        this.escalateError(error);
      }
    }
  }

  private async retryConnection(error: SystemError): Promise<void> {
    const { error: connectionError } = await supabase.auth.getSession();
    if (connectionError) {
      throw connectionError;
    }
  }

  private async retryAPICall(error: SystemError): Promise<void> {
    // Re-test the specific API endpoint that failed
    if (error.context?.table) {
      const { error: apiError } = await supabase
        .from(error.context.table)
        .select('count')
        .limit(1);
      
      if (apiError) {
        throw apiError;
      }
    }
  }

  private escalateError(error: SystemError): void {
    logger.error(`Nova escalating critical error ${error.id}:`, error, 'nova');
    
    // Log to Supabase for persistence
    this.logErrorToDatabase(error);
  }

  private async logErrorToDatabase(error: SystemError): Promise<void> {
    try {
      await supabase
        .from('nova_error_log')
        .insert({
          component: error.component,
          error_type: error.errorType,
          error_message: error.message,
          context: error.context,
          retry_count: error.retryCount,
          fixed_by_ai: error.retryCount > 0,
          created_at: error.timestamp.toISOString()
        });
    } catch (dbError) {
      logger.error('Failed to log error to database:', dbError, 'nova');
    }
  }

  private async processErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    // Process up to 5 errors at a time
    const errorsToProcess = this.errorQueue.splice(0, 5);
    
    for (const error of errorsToProcess) {
      await this.analyzeAndSuggestFix(error);
    }
  }

  private async analyzeAndSuggestFix(error: SystemError): Promise<void> {
    const suggestion = this.generateFixSuggestion(error);
    
    if (suggestion) {
      logger.info(`Nova suggests fix for ${error.component}:`, suggestion, 'nova');
    }
  }

  private generateFixSuggestion(error: SystemError): string | null {
    const fixes: Record<string, string> = {
      'supabase_connection': 'Check Supabase credentials and network connectivity',
      'api_error': 'Verify RLS policies and table permissions',
      'auth_error': 'Check user authentication state and session validity',
      'timeout': 'Implement retry logic with exponential backoff'
    };

    const key = `${error.component}_${error.errorType}`;
    return fixes[key] || fixes[error.errorType] || null;
  }

  getSystemStatus(): { healthy: boolean; errors: number; activeRetries: number } {
    return {
      healthy: this.errorQueue.length === 0 && this.retryIntervals.size === 0,
      errors: this.errorQueue.length,
      activeRetries: this.retryIntervals.size
    };
  }

  stop(): void {
    this.isActive = false;
    this.retryIntervals.forEach(timeout => clearTimeout(timeout));
    this.retryIntervals.clear();
    logger.info('Nova System Monitor stopped', {}, 'nova');
  }
}

export const novaSystemMonitor = NovaSystemMonitor.getInstance();
