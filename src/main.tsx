
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { optimizeForMobile } from './utils/mobileOptimization';

// Initialize mobile optimizations
optimizeForMobile();

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  // Monitor performance in development
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
    });
  });
  observer.observe({ entryTypes: ['measure', 'navigation'] });
}

// Create root with error handling
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

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
