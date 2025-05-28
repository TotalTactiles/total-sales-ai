
import { supabase } from '@/integrations/supabase/client';

export interface ZohoError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export class ZohoErrorHandler {
  async handleAPIError(response: Response, context: string): Promise<void> {
    try {
      const errorData = await response.json();
      
      const error: ZohoError = {
        code: `HTTP_${response.status}`,
        message: errorData.message || response.statusText,
        details: errorData,
        timestamp: new Date(),
        context
      };

      await this.logError(error, context);
      
      // Throw appropriate error based on status
      switch (response.status) {
        case 401:
          throw new Error('Zoho authentication failed - please reconnect');
        case 403:
          throw new Error('Insufficient permissions for Zoho CRM');
        case 404:
          throw new Error('Zoho resource not found');
        case 429:
          throw new Error('Zoho API rate limit exceeded');
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error('Zoho service temporarily unavailable');
        default:
          throw new Error(`Zoho API error: ${error.message}`);
      }
    } catch (parseError) {
      // If we can't parse the error response, create a generic error
      const error: ZohoError = {
        code: `HTTP_${response.status}`,
        message: response.statusText || 'Unknown Zoho API error',
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
        provider: 'zoho',
        error_type: 'api_error',
        error_code: error.code || 'UNKNOWN',
        error_message: error.message || error.toString(),
        error_details: error.details || error,
        context,
        timestamp: new Date().toISOString(),
        user_id: await this.getCurrentUserId()
      };

      // Log to developer error logs
      await supabase
        .from('error_logs')
        .insert(errorLog);

      // Also log to console for immediate debugging
      console.error('Zoho Error:', {
        context,
        error: error.message || error,
        details: error.details,
        timestamp: new Date().toISOString()
      });

    } catch (logError) {
      // Fallback to console logging if database logging fails
      console.error('Failed to log Zoho error to database:', logError);
      console.error('Original Zoho error:', error);
    }
  }

  async handleConnectionError(error: any): Promise<void> {
    const connectionError: ZohoError = {
      code: 'CONNECTION_FAILED',
      message: 'Failed to connect to Zoho CRM',
      details: error,
      timestamp: new Date(),
      context: 'connection_test'
    };

    await this.logError(connectionError, 'Connection Test');
    
    // Notify user about connection issues
    await this.notifyUser('Zoho CRM connection failed. Please check your credentials and try again.');
  }

  async handleSyncError(leadId: string, error: any): Promise<void> {
    const syncError: ZohoError = {
      code: 'SYNC_FAILED',
      message: `Failed to sync lead ${leadId}`,
      details: error,
      timestamp: new Date(),
      context: 'lead_sync'
    };

    await this.logError(syncError, `Lead Sync - ${leadId}`);
    
    // Log sync failure for monitoring
    await supabase
      .from('sync_failures')
      .insert({
        provider: 'zoho',
        resource_type: 'lead',
        resource_id: leadId,
        error_message: error.message || error.toString(),
        retry_count: 0,
        created_at: new Date().toISOString()
      });
  }

  async handleValidationError(data: any, validationErrors: string[]): Promise<void> {
    const validationError: ZohoError = {
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
    const rateLimitError: ZohoError = {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Zoho API rate limit exceeded. Retry after ${retryAfter} seconds.`,
      details: { retryAfter },
      timestamp: new Date(),
      context: 'rate_limiting'
    };

    await this.logError(rateLimitError, 'Rate Limiting');
    
    // Update rate limit status in database
    await supabase
      .from('api_usage')
      .upsert({
        provider: 'zoho',
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
      // This could trigger a toast notification or in-app notification
      // For now, we'll log it as a user notification
      console.warn('User Notification:', message);
      
      // Could also store in a notifications table
      const userId = await this.getCurrentUserId();
      if (userId) {
        await supabase
          .from('user_notifications')
          .insert({
            user_id: userId,
            type: 'error',
            title: 'Zoho CRM Integration Error',
            message,
            read: false,
            created_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Failed to notify user:', error);
    }
  }

  createRetryableError(originalError: any, retryCount: number): Error {
    const error = new Error(`${originalError.message} (Retry ${retryCount}/3)`);
    (error as any).retryable = true;
    (error as any).retryCount = retryCount;
    return error;
  }

  isRetryableError(error: any): boolean {
    // Define which errors are worth retrying
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
