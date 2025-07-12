import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Auth & Onboarding pages
import AuthPage from './pages/auth/AuthPage';
import SignUpPage from './pages/signup';
import TestOnboarding from './pages/TestOnboarding';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import SalesRepOnboarding from './pages/onboarding/sales-rep';
import ManagerOnboarding from './pages/onboarding/manager';
import OnboardingTest from './pages/OnboardingTest';
import OnboardingGuard from './components/OnboardingGuard';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Routes>
          {/* Existing routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Test Onboarding Route - Temporary for testing */}
          <Route path="/test-onboarding" element={<TestOnboarding />} />
          
          {/* Onboarding routes */}
          <Route path="/onboarding" element={<OnboardingGuard><OnboardingPage /></OnboardingGuard>} />
          <Route path="/onboarding/sales-rep" element={<SalesRepOnboarding />} />
          <Route path="/onboarding/manager" element={<ManagerOnboarding />} />
          <Route path="/onboarding-test" element={<OnboardingTest />} />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
