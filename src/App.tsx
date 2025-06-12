
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

import { AuthProvider } from '@/contexts/AuthContext';
import { AIProvider } from '@/contexts/AIContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';

import ProtectedRoute from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

// Layout imports
import SalesLayout from '@/layouts/SalesLayout';
import ManagerLayout from '@/layouts/ManagerLayout';
import DeveloperLayout from '@/layouts/DeveloperLayout';

// Agent services
import { relevanceAIService } from '@/services/relevance/RelevanceAIService';
import { logger } from '@/utils/logger';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize AI services on app startup
    const initializeAIServices = async () => {
      try {
        logger.info('Initializing AI services...');
        await relevanceAIService.initialize();
        logger.info('AI services initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize AI services:', error);
      }
    };

    initializeAIServices();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Router>
          <AuthProvider>
            <AIProvider>
              <UnifiedAIProvider>
                <div className="min-h-screen bg-background">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* Protected routes */}
                    <Route path="/sales/*" element={
                      <ProtectedRoute>
                        <SalesLayout />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/manager/*" element={
                      <ProtectedRoute requiredRole="manager">
                        <ManagerLayout />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/developer/*" element={
                      <ProtectedRoute requiredRole="admin">
                        <DeveloperLayout />
                      </ProtectedRoute>
                    } />
                  </Routes>
                  
                  <Toaster 
                    position="top-right" 
                    expand={false} 
                    richColors 
                    closeButton
                  />
                </div>
              </UnifiedAIProvider>
            </AIProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
