
import React from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
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
  const userRole = isDemoUser ? demoRole : profile?.role;
  
  logger.info('🧭 Routing authenticated user:', { 
    userId: user.id, 
    role: userRole,
    email: user.email,
    isDemoUser,
    demoRole 
  });

  return (
    <Routes>
      {/* Developer OS Routes - Dark theme with comprehensive system monitoring */}
      <Route path="/developer/*" element={
        <SecureRouteGuard allowedRoles={['developer', 'admin']}>
          <div className="min-h-screen bg-gray-900">
            <UnifiedLayout>
              <Routes>
                <Route path="dashboard" element={<DeveloperDashboard />} />
                <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
              </Routes>
            </UnifiedLayout>
          </div>
        </SecureRouteGuard>
      } />
      
      {/* Manager OS Routes - Blue/purple gradient professional theme */}
      <Route path="/manager/*" element={
        <SecureRouteGuard allowedRoles={['manager', 'admin']}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <UnifiedLayout>
              <Routes>
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
              </Routes>
            </UnifiedLayout>
          </div>
        </SecureRouteGuard>
      } />
      
      {/* Sales OS Routes - Light gradient with modern sales-focused design */}
      <Route path="/sales/*" element={
        <SecureRouteGuard allowedRoles={['sales_rep', 'admin']}>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <UnifiedLayout>
              <Routes>
                <Route path="dashboard" element={<SalesRepDashboard />} />
                <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
              </Routes>
            </UnifiedLayout>
          </div>
        </SecureRouteGuard>
      } />
      
      {/* Role-based default redirect */}
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
      
      {/* Auth redirect for authenticated users - prevent auth page access when logged in */}
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
