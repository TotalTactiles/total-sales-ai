
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { TSAMAIProvider } from '@/contexts/TSAMAIContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import GlobalFeedback from '@/components/feedback/GlobalFeedback';
import NewLandingPage from '@/pages/NewLandingPage';
import AppRoutes from '@/router/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TSAMAIProvider>
            <UnifiedAIProvider>
              <div className="min-h-screen w-full overflow-hidden">
                <GlobalFeedback />
                <Routes>
                  {/* Landing Page */}
                  <Route path="/landing" element={<NewLandingPage />} />
                  
                  {/* Main App Routes */}
                  <Route path="/*" element={<AppRoutes />} />
                </Routes>
              </div>
            </UnifiedAIProvider>
          </TSAMAIProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
