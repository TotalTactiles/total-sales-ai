import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';

export interface ClickUpError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export class ClickUpErrorHandler {
  async handleAPIError(response: Response, context: string): Promise<void> {
    try {
      const errorData = await response.json();
      
      const error: ClickUpError = {
        code: `HTTP_${response.status}`,
        message: errorData.err || errorData.message || response.statusText,
        details: errorData,
        timestamp: new Date(),
        context
      };

      await this.logError(error, context);
      
      switch (response.status) {
        case 401:
          throw new Error('ClickUp authentication failed - please reconnect');
        case 403:
          throw new Error('Insufficient permissions for ClickUp');
        case 404:
          throw new Error('ClickUp resource not found');
        case 429:
          throw new Error('ClickUp API rate limit exceeded');
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error('ClickUp service temporarily unavailable');
        default:
          throw new Error(`ClickUp API error: ${error.message}`);
      }
    } catch (parseError) {
      const error: ClickUpError = {
        code: `HTTP_${response.status}`,
        message: response.statusText || 'Unknown ClickUp API error',
        timestamp: new Date(),
        context
      };
      
      await this.logError(error, context);
      throw new Error(error.message);
    }
  }

  async logError(error: any, context: string): Promise<void> {
    try {
      const errorLog = {
        provider: 'clickup',
        error_type: 'api_error',
        error_code: error.code || 'UNKNOWN',
        error_message: error.message || error.toString(),
        error_details: error.details || error,
        context,
        timestamp: new Date().toISOString(),
        user_id: await this.getCurrentUserId()
      };

      // Use type assertion for the new table
      await (supabase as any)
        .from('error_logs')
        .insert(errorLog);

      logger.error('ClickUp Error:', {
        context,
        error: error.message || error,
        details: error.details,
        timestamp: new Date().toISOString()
      });

    } catch (logError) {
      logger.error('Failed to log ClickUp error to database:', logError);
      logger.error('Original ClickUp error:', error);
    }
  }

  async handleConnectionError(error: any): Promise<void> {
    const connectionError: ClickUpError = {
      code: 'CONNECTION_FAILED',
      message: 'Failed to connect to ClickUp',
      details: error,
      timestamp: new Date(),
      context: 'connection_test'
    };

    await this.logError(connectionError, 'Connection Test');
    await this.notifyUser('ClickUp connection failed. Please check your credentials and try again.');
  }

  async handleSyncError(taskId: string, error: any): Promise<void> {
    const syncError: ClickUpError = {
      code: 'SYNC_FAILED',
      message: `Failed to sync task ${taskId}`,
      details: error,
      timestamp: new Date(),
      context: 'task_sync'
    };

    await this.logError(syncError, `Task Sync - ${taskId}`);
    
    // Use type assertion for the new table
    await (supabase as any)
      .from('sync_failures')
      .insert({
        provider: 'clickup',
        resource_type: 'task',
        resource_id: taskId,
        error_message: error.message || error.toString(),
        retry_count: 0,
        created_at: new Date().toISOString()
      });
  }

  async handleValidationError(data: any, validationErrors: string[]): Promise<void> {
    const validationError: ClickUpError = {
      code: 'VALIDATION_FAILED',
      message: 'Data validation failed',
      details: {
        data,
        errors: validationErrors
      },
      timestamp: new Date(),
      context: 'data_validation'
    };

    await this.logError(validationError, 'Data Validation');
  }

  async handleRateLimitError(retryAfter: number): Promise<void> {
    const rateLimitError: ClickUpError = {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `ClickUp API rate limit exceeded. Retry after ${retryAfter} seconds.`,
      details: { retryAfter },
      timestamp: new Date(),
      context: 'rate_limiting'
    };

    await this.logError(rateLimitError, 'Rate Limiting');
    
    // Use type assertion for the new table
    await (supabase as any)
      .from('api_usage')
      .upsert({
        provider: 'clickup',
        rate_limited_until: new Date(Date.now() + (retryAfter * 1000)).toISOString(),
        last_updated: new Date().toISOString()
      });
  }

  private async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch {
      return null;
    }
  }

  private async notifyUser(message: string): Promise<void> {
    try {
      logger.warn('User Notification:', message);
      
      const userId = await this.getCurrentUserId();
      if (userId) {
        // Use type assertion for the new table
        await (supabase as any)
          .from('user_notifications')
          .insert({
            user_id: userId,
            type: 'error',
            title: 'ClickUp Integration Error',
            message,
            read: false,
            created_at: new Date().toISOString()
          });
      }
    } catch (error) {
      logger.error('Failed to notify user:', error);
    }
  }

  createRetryableError(originalError: any, retryCount: number): Error {
    const error = new Error(`${originalError.message} (Retry ${retryCount}/3)`);
    (error as any).retryable = true;
    (error as any).retryCount = retryCount;
    return error;
  }

  isRetryableError(error: any): boolean {
    const retryableCodes = [
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'HTTP_500',
      'HTTP_502',
      'HTTP_503',
      'HTTP_504'
    ];

    return retryableCodes.some(code => 
      error.code === code || error.message?.includes(code)
    );
  }
}
