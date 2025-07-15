
import React from 'react';
import CompanyBrainManager from '@/components/CompanyBrain/CompanyBrainManager';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ManagerCompanyBrain = () => {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect if not a manager (but allow demo users)
  if (profile && profile.role !== 'manager' && profile.role !== 'developer') {
    return <Navigate to="/" replace />;
  }

  return <CompanyBrainManager />;
};

export default ManagerCompanyBrain;
