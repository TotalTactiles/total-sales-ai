
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/hooks/useDemoMode';
import { logger } from '@/utils/logger';

// Layout imports
import SalesRepOS from '@/layouts/SalesRepOS';
import ManagerOS from '@/layouts/ManagerOS';
import DeveloperOS from '@/layouts/DeveloperOS';

// Legacy imports for backward compatibility
import Dashboard from '@/components/dashboard/Dashboard';

const MainLayout: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const { isDemoMode, demoUser } = useDemoMode();

  // Determine user role with better fallback logic
  const getUserRole = () => {
    // Check for developer mode first
    const devMode = localStorage.getItem('developerMode') === 'true';
    const viewMode = localStorage.getItem('viewMode') as 'sales_rep' | 'manager' | 'developer';
    
    if (devMode && viewMode === 'developer') {
      return 'developer';
    }
    
    // Use profile role if available
    if (profile?.role) {
      return profile.role;
    }
    
    // Use demo user role if in demo mode
    if (isDemoMode && demoUser?.role) {
      return demoUser.role;
    }
    
    // Fallback based on current path
    if (location.pathname.startsWith('/manager')) {
      return 'manager';
    }
    if (location.pathname.startsWith('/developer')) {
      return 'developer';
    }
    return 'sales_rep';
  };

  const userRole = getUserRole();

  logger.info('🔄 MainLayout routing:', {
    userRole,
    isDemo: isDemoMode,
    demoUserRole: demoUser?.role,
    profileRole: profile?.role,
    userId: user?.id,
    currentPath: location.pathname,
    devMode: localStorage.getItem('developerMode'),
    viewMode: localStorage.getItem('viewMode')
  });

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
    logger.warn('🚨 User not authenticated in MainLayout');
    return <Navigate to="/auth" replace />;
  }

  // Handle Developer OS routing (including developer mode)
  if (userRole === 'developer' || userRole === 'admin') {
    return (
      <Routes>
        <Route path="/developer/*" element={<DeveloperOS />} />
        <Route path="/" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="/*" element={<Navigate to="/developer/dashboard" replace />} />
      </Routes>
    );
  }

  // Handle Manager OS routing
  if (userRole === 'manager') {
    return (
      <Routes>
        {/* Manager OS routes */}
        <Route path="/manager/*" element={<ManagerOS />} />
        
        {/* Legacy manager routes - redirect to new structure */}
        <Route path="/dashboard/manager" element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="/manager-dashboard" element={<Navigate to="/manager/dashboard" replace />} />
        
        {/* Root redirect for managers */}
        <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="/*" element={<Navigate to="/manager/dashboard" replace />} />
      </Routes>
    );
  }

  // Handle Sales Rep OS routing (default)
  return (
    <Routes>
      <Route path="/sales/*" element={<SalesRepOS />} />
      
      {/* Legacy sales routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leads" element={<Navigate to="/sales/leads" replace />} />
      <Route path="/dialer" element={<Navigate to="/sales/dialer" replace />} />
      <Route path="/analytics" element={<Navigate to="/sales/analytics" replace />} />
      <Route path="/company-brain" element={<Navigate to="/sales/brain" replace />} />
      
      {/* Root redirect for sales reps */}
      <Route path="/" element={<Navigate to="/sales/dashboard" replace />} />
      <Route path="/*" element={<Navigate to="/sales/dashboard" replace />} />
    </Routes>
  );
};

export default MainLayout;
