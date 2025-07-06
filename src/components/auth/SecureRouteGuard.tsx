
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { logger } from '@/utils/logger';

interface SecureRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const SecureRouteGuard: React.FC<SecureRouteGuardProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, profile, loading } = useAuth();
  const { isDemoUser, demoRole } = useDemoMode();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    logger.warn('🔒 Unauthorized access attempt - redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Determine user role - prioritize demo role for demo users
  const userRole = isDemoUser ? demoRole : profile?.role;

  // Check if user has required role
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    logger.warn('🔒 Insufficient permissions:', { 
      userRole, 
      requiredRoles: allowedRoles,
      isDemoUser 
    });
    
    // Redirect to appropriate dashboard based on their actual role
    const redirectPath = 
      userRole === 'developer' || userRole === 'admin' ? '/developer/dashboard' :
      userRole === 'manager' ? '/manager/dashboard' :
      '/sales/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  logger.info('✅ Access granted:', { 
    userRole, 
    requiredRoles: allowedRoles,
    isDemoUser 
  });

  return <>{children}</>;
};

export default SecureRouteGuard;
