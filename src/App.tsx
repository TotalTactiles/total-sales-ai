
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import SalesLayout from '@/layouts/SalesLayout';
import ManagerLayout from '@/layouts/ManagerLayout';
import { AIContextProvider } from '@/contexts/AIContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';

const queryClient = new QueryClient();

// Separate component to use useAuth after AuthProvider is available
function AppContent() {
  const { user, profile } = useAuth();

  useEffect(() => {
    const sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionStorage.setItem('session_id', crypto.randomUUID());
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {user && profile ? (
        profile.role === 'manager' ? (
          <ManagerLayout />
        ) : (
          <SalesLayout />
        )
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <UnifiedAIProvider>
              <AIContextProvider>
                <AppContent />
              </AIContextProvider>
            </UnifiedAIProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
