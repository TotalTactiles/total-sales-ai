
import React from 'react';
import { Toaster } from 'sonner';

const GlobalFeedback: React.FC = () => {
  return (
    <Toaster 
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
        className: 'class',
      }}
    />
  );
};

export default GlobalFeedback;
