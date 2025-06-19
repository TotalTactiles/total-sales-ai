
import { logger } from './logger';

export interface AppError extends Error {
  code?: string;
  context?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class AppErrorHandler {
  static createError(
    message: string, 
    code?: string, 
    context?: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): AppError {
    const error = new Error(message) as AppError;
    error.code = code;
    error.context = context;
    error.severity = severity;
    return error;
  }

  static handleError(error: AppError | Error, fallbackMessage = 'An unexpected error occurred') {
    const appError = error as AppError;
    
    logger.error('Application error:', {
      message: error.message,
      code: appError.code,
      context: appError.context,
      severity: appError.severity,
      stack: error.stack
    });

    // Return user-friendly message
    return appError.code ? `${appError.code}: ${error.message}` : fallbackMessage;
  }

  static isAuthError(error: any): boolean {
    return error?.code?.startsWith('auth_') || error?.message?.includes('authentication');
  }

  static isNetworkError(error: any): boolean {
    return error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch');
  }
}

// Common error types
export const ERROR_CODES = {
  AUTH_FAILED: 'auth_failed',
  AUTH_EXPIRED: 'auth_expired',
  PROFILE_NOT_FOUND: 'profile_not_found',
  LEAD_NOT_FOUND: 'lead_not_found',
  NETWORK_ERROR: 'network_error',
  VALIDATION_ERROR: 'validation_error',
  PERMISSION_DENIED: 'permission_denied'
} as const;
