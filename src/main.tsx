
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { optimizeForMobile } from './utils/mobileOptimization';

// Initialize mobile optimizations
try {
  optimizeForMobile();
} catch (error) {
  console.warn('Mobile optimization failed:', error);
}

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
      });
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (error) {
    console.warn('Performance monitoring failed:', error);
  }
}

// Create root with error handling
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = ReactDOM.createRoot(container);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render app:', error);
  // Render a simple error message
  root.render(
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Application Error</h1>
      <p>The application failed to load. Please refresh the page.</p>
      <details style={{ marginTop: '20px', textAlign: 'left' }}>
        <summary>Error Details</summary>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
      </details>
    </div>
  );
}

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
