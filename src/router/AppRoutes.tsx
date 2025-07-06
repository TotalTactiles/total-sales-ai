
import React from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import NewLandingPage from '@/pages/NewLandingPage';
import AuthPage from '@/pages/auth/AuthPage';
import SecureRouteGuard from '@/components/auth/SecureRouteGuard';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { logger } from '@/utils/logger';

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const { isDemoUser, demoRole } = useDemoMode();
  const [searchParams] = useSearchParams();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">Loading TSAM OS...</div>
          <div className="text-gray-400 text-sm mt-2">Initializing system...</div>
        </div>
      </div>
    );
  }

  // If no user, show public routes (landing page and auth)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/landing" element={<NewLandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // User is authenticated - determine their role and route accordingly
  const userRole = profile?.role || (isDemoUser ? demoRole : null);
  
  logger.info('🧭 Routing authenticated user:', { 
    userId: user.id, 
    role: userRole,
    email: user.email,
    isDemoUser,
    demoRole 
  });

  return (
    <Routes>
      {/* Developer OS Routes */}
      <Route path="/developer/*" element={
        <SecureRouteGuard allowedRoles={['developer', 'admin']}>
          <UnifiedLayout>
            <Routes>
              <Route path="dashboard" element={<DeveloperDashboard />} />
              <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
            </Routes>
          </UnifiedLayout>
        </SecureRouteGuard>
      } />
      
      {/* Manager OS Routes */}
      <Route path="/manager/*" element={
        <SecureRouteGuard allowedRoles={['manager', 'admin']}>
          <UnifiedLayout>
            <Routes>
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
            </Routes>
          </UnifiedLayout>
        </SecureRouteGuard>
      } />
      
      {/* Sales OS Routes */}
      <Route path="/sales/*" element={
        <SecureRouteGuard allowedRoles={['sales_rep', 'admin']}>
          <UnifiedLayout>
            <Routes>
              <Route path="dashboard" element={<SalesRepDashboard />} />
              <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
            </Routes>
          </UnifiedLayout>
        </SecureRouteGuard>
      } />
      
      {/* Role-based default redirect - Enhanced for demo users */}
      <Route path="/" element={
        <Navigate 
          to={
            userRole === 'developer' || userRole === 'admin' ? '/developer/dashboard' : 
            userRole === 'manager' ? '/manager/dashboard' : 
            '/sales/dashboard'
          } 
          replace 
        />
      } />
      
      {/* Auth redirect for authenticated users */}
      <Route path="/auth" element={
        <Navigate 
          to={
            userRole === 'developer' || userRole === 'admin' ? '/developer/dashboard' : 
            userRole === 'manager' ? '/manager/dashboard' : 
            '/sales/dashboard'
          } 
          replace 
        />
      } />
      
      {/* Catch all - redirect to appropriate dashboard */}
      <Route path="*" element={
        <Navigate 
          to={
            userRole === 'developer' || userRole === 'admin' ? '/developer/dashboard' : 
            userRole === 'manager' ? '/manager/dashboard' : 
            '/sales/dashboard'
          } 
          replace 
        />
      } />
    </Routes>
  );
};

export default AppRoutes;
