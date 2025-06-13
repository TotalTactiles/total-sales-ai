import React from 'react';
import { AlertTriangle } from 'lucide-react';

const FullPageError: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
    <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
    <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
    <p className="text-muted-foreground mb-4">Please refresh the page or try again later.</p>
    <button
      className="px-4 py-2 bg-primary text-primary-foreground rounded"
      onClick={() => window.location.reload()}
    >
      Refresh Page
    </button>
  </div>
);

export default FullPageError;
