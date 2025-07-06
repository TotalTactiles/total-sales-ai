
import React from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import DeveloperDashboard from '@/pages/DeveloperDashboard';
import NewLandingPage from '@/pages/NewLandingPage';
import AuthPage from '@/pages/auth/AuthPage';
import SecureRouteGuard from '@/components/auth/SecureRouteGuard';
import { logger } from '@/utils/logger';

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();
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
  const userRole = profile?.role;
  
  logger.info('🧭 Routing authenticated user:', { 
    userId: user.id, 
    role: userRole,
    email: user.email 
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
              <Route path="dashboard" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Manager Dashboard</h1>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">✅ Manager OS fully operational</p>
                    <p className="text-blue-600 text-sm mt-2">Mock data and workflows active</p>
                  </div>
                </div>
              } />
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
              <Route path="dashboard" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Sales Dashboard</h1>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">✅ Sales OS fully operational</p>
                    <p className="text-green-600 text-sm mt-2">Mock leads and pipeline active</p>
                  </div>
                </div>
              } />
              <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
            </Routes>
          </UnifiedLayout>
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
