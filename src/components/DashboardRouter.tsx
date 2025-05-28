
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRouter = () => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Route based on user role or demo mode
  const userStatus = localStorage.getItem('userStatus');
  const demoRole = localStorage.getItem('demoRole');
  
  // Handle demo mode with new OS structure
  if (userStatus === 'demo' && demoRole) {
    switch (demoRole) {
      case 'sales-rep':
        return <Navigate to="/sales" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'admin':
      case 'developer':
        return <Navigate to="/developer" replace />;
      default:
        return <Navigate to="/sales" replace />;
    }
  }
  
  // Handle authenticated users based on profile role using new OS structure
  const role = profile?.role || 'sales_rep';
  
  switch (role) {
    case 'developer':
    case 'admin':
      return <Navigate to="/developer" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'sales_rep':
    default:
      return <Navigate to="/sales" replace />;
  }
};

export default DashboardRouter;
