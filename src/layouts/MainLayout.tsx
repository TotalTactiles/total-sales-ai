
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/hooks/useDemoMode';

// Manager Components
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

// Sales Rep Components  
import SalesRepOS from '@/layouts/SalesRepOS';

// Developer Components
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

// Fallback
import NavigationFallback from '@/components/Navigation/NavigationFallback';

const MainLayout: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const { isDemo, demoUser } = useDemoMode();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading TSAM OS...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Determine user role - prioritize demo user role if available
  const userRole = demoUser?.role || profile?.role;
  
  console.log('🔄 MainLayout routing:', { 
    userRole, 
    isDemo, 
    demoUserRole: demoUser?.role,
    profileRole: profile?.role,
    userId: user.id 
  });

  // Role-based routing with proper redirects
  switch (userRole) {
    case 'manager':
      return (
        <div className="min-h-screen bg-gray-50">
          <ManagerNavigation />
          <main className="ml-64 p-6">
            <Routes>
              <Route path="/dashboard/manager" element={<ManagerDashboard />} />
              <Route path="/dashboard/manager/*" element={<ManagerDashboard />} />
              <Route path="/*" element={<Navigate to="/dashboard/manager" replace />} />
            </Routes>
          </main>
        </div>
      );

    case 'sales_rep':
      return (
        <Routes>
          <Route path="/sales/*" element={<SalesRepOS />} />
          <Route path="/*" element={<Navigate to="/sales/dashboard" replace />} />
        </Routes>
      );

    case 'developer':
      return (
        <div className="min-h-screen bg-gray-50">
          <DeveloperNavigation />
          <main className="ml-64 p-6">
            <Routes>
              <Route path="/dashboard/developer" element={<DeveloperDashboard />} />
              <Route path="/dashboard/developer/*" element={<DeveloperDashboard />} />
              <Route path="/*" element={<Navigate to="/dashboard/developer" replace />} />
            </Routes>
          </main>
        </div>
      );

    default:
      console.warn('🚨 Unknown user role or missing role:', userRole);
      return <NavigationFallback />;
  }
};

export default MainLayout;
