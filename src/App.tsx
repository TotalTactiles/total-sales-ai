
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import AppRoutes from '@/router/AppRoutes';
import GlobalFeedback from '@/components/feedback/GlobalFeedback';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import { TSAMAIProvider } from '@/contexts/TSAMAIContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TSAMAIProvider>
            <UnifiedAIProvider>
              <div className="min-h-screen w-full">
                <GlobalFeedback />
                <AppRoutes />
              </div>
            </UnifiedAIProvider>
          </TSAMAIProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
