import React from 'react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading TSAM OS...", 
  subMessage = "Preparing your workspace" 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-foreground text-lg font-medium">{message}</p>
        <p className="text-muted-foreground text-sm mt-2">{subMessage}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;