
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import AppRoutes from '@/router/AppRoutes';
import DemoUserSetup from '@/components/DemoUserSetup';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DemoModeProvider>
            <UnifiedAIProvider>
              <div className="min-h-screen bg-white">
                <DemoUserSetup />
                <AppRoutes />
                <Toaster />
              </div>
            </UnifiedAIProvider>
          </DemoModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
