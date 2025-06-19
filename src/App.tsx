
import { Suspense, useEffect } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';

import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { agentConnectionService } from '@/services/ai/AgentConnectionService';
import { logger } from '@/utils/logger';

import Index from '@/pages/Index';
import AuthPage from '@/pages/auth/AuthPage';
import MainLayout from '@/layouts/MainLayout';
import RouteGuard from '@/components/auth/RouteGuard';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/sales/*",
    element: (
      <RouteGuard allowedRoles={['sales_rep']}>
        <MainLayout />
      </RouteGuard>
    ),
  },
  {
    path: "/manager/*",
    element: (
      <RouteGuard allowedRoles={['manager']}>
        <MainLayout />
      </RouteGuard>
    ),
  },
  {
    path: "/developer/*",
    element: (
      <RouteGuard allowedRoles={['developer', 'admin']}>
        <MainLayout />
      </RouteGuard>
    ),
  },
];

const AppContent = () => {
  const routing = useRoutes(routes);

  useEffect(() => {
    // Initialize AI agent connection service
    const initializeAgents = async () => {
      try {
        logger.info('Initializing AI agents...');
        const initialized = await agentConnectionService.initialize();
        
        if (initialized) {
          logger.info('AI agents initialized successfully');
        } else {
          logger.warn('AI agents initialization completed with warnings');
        }
      } catch (error) {
        logger.error('Failed to initialize AI agents:', error);
      }
    };

    initializeAgents();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Suspense fallback={<div>Loading...</div>}>
        {routing}
      </Suspense>
      <Toaster />
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
