
import React from 'react';
import Navigation from '@/components/Navigation';
import CompanyBrainManager from '@/components/CompanyBrain/CompanyBrainManager';
import CompanyBrainSalesRep from '@/components/CompanyBrain/CompanyBrainSalesRep';
import { useAuth } from '@/contexts/AuthContext';

const CompanyBrain = () => {
  const { profile } = useAuth();
  
  // Route to appropriate component based on user role
  const isManager = profile?.role === 'manager' || profile?.role === 'admin';
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1">
        {isManager ? <CompanyBrainManager /> : <CompanyBrainSalesRep />}
      </div>
    </div>
  );
};

export default CompanyBrain;
