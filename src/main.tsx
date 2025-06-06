
import { logger } from '@/utils/logger';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './theme.css';
import { optimizeForMobile } from './utils/mobileOptimization';

// Initialize mobile optimizations with error handling
try {
  optimizeForMobile();
  logger.info('Mobile optimizations applied successfully');
} catch (error) {
  logger.warn('Mobile optimization failed:', error);
}

// Performance monitoring for development
if (process.env.NODE_ENV === 'development') {
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 100) { // Only log slow operations
          logger.info(`Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (error) {
    logger.warn('Performance monitoring setup failed:', error);
  }
}

// Enhanced error boundary for the entire app
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-5 text-center font-sans">
    <h1 className="mb-4 text-[#dc2626]">Application Error</h1>
    <p className="mb-5 text-gray-500">
      Something went wrong. Please refresh the page to try again.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mb-5 rounded-md bg-blue-500 px-4 py-2 text-white cursor-pointer"
    >
      Refresh Page
    </button>
    <details className="mt-5 text-left max-w-[600px]">
      <summary className="cursor-pointer mb-2">Error Details</summary>
      <pre className="overflow-auto rounded bg-gray-100 p-3 text-xs">
        {error.stack || error.message}
      </pre>
    </details>
  </div>
);

// Get root container with validation
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found. Please ensure index.html has a div with id="root"');
}

const root = ReactDOM.createRoot(container);

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection:', event.reason);
});

try {
  root.render(
    <React.StrictMode>
      <React.Suspense fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f4f6', 
              borderTop: '4px solid #3b82f6', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280' }}>Loading application...</p>
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

// Service Worker registration for offline support (production only)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logger.info('SW registered successfully:', registration.scope);
      })
      .catch((registrationError) => {
        logger.warn('SW registration failed:', registrationError);
      });
  });
}
