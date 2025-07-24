
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { logger } from '@/utils/logger';
import { setupAPIInterceptors } from './utils/apiInterceptor';
import { optimizeForMobile } from './utils/mobileOptimization';

// Initialize mobile optimizations with error handling
try {
  optimizeForMobile();
  logger.info('Mobile optimizations applied successfully');
  setupAPIInterceptors();
} catch (error) {
  logger.warn('Mobile optimization failed:', error);
}

// Performance monitoring for development
if (process.env.NODE_ENV === 'development') {
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 100) {
          logger.info(`Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (error) {
    logger.warn('Performance monitoring setup failed:', error);
  }
}

// Error Fallback Component
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
    <div className="text-center max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
      <p className="text-gray-600 mb-6">
        Something went wrong. Please refresh the page to try again.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Refresh Page
      </button>
      <details className="mt-6 text-left">
        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          Error Details
        </summary>
        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded border overflow-auto">
          {error.stack || error.message}
        </pre>
      </details>
    </div>
  </div>
);

// Get root container
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = ReactDOM.createRoot(container);

// Global error handlers
window.addEventListener('error', (event) => {
  logger.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection:', event.reason);
});

// Render app with error boundary
try {
  root.render(
    <React.StrictMode>
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <App />
      </React.Suspense>
    </React.StrictMode>
  );
  logger.info('App rendered successfully');
} catch (error) {
  logger.error('Failed to render app:', error);
  root.render(<ErrorFallback error={error as Error} />);
}
