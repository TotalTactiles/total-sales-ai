
import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';

interface ErrorInfo {
  error: Error;
  errorInfo: string;
  timestamp: Date;
  userId?: string;
  route?: string;
}

export const useErrorBoundary = () => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const { createNotification } = useNotifications();

  const logError = (error: Error, errorInfo?: string) => {
    const errorEntry: ErrorInfo = {
      error,
      errorInfo: errorInfo || error.stack || 'No stack trace available',
      timestamp: new Date(),
      route: window.location.pathname
    };

    setErrors(prev => [...prev, errorEntry]);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Application Error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Create user notification for critical errors
    if (error.name !== 'ChunkLoadError') {
      createNotification({
        type: 'system',
        title: 'Application Error',
        message: `An error occurred: ${error.message}`,
        metadata: { error: error.message, route: window.location.pathname }
      });
    }

    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, or Bugsnag
  };

  const clearErrors = () => {
    setErrors([]);
  };

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logError(new Error(event.message), event.filename + ':' + event.lineno);
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      logError(new Error(event.reason), 'Unhandled Promise Rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  return {
    errors,
    logError,
    clearErrors
  };
};
