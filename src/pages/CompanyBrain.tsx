
import React from 'react';
import Navigation from '@/components/Navigation';
import CompanyBrainManager from '@/components/CompanyBrain/CompanyBrainManager';
import CompanyBrainSalesRep from '@/components/CompanyBrain/CompanyBrainSalesRep';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const CompanyBrain = () => {
  const { profile, user, loading } = useAuth();

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

  // Route managers to the dedicated manager page
  if (profile?.role === 'manager') {
    return <Navigate to="/manager/company-brain" replace />;
  }
  
  // Route to appropriate component based on user role
  const isSalesRep = profile?.role === 'sales_rep';
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1">
        {isSalesRep ? <CompanyBrainSalesRep /> : <CompanyBrainManager />}
      </div>
    </div>
  );
};

export default CompanyBrain;
