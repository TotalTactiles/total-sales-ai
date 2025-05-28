
import React from 'react';
import Navigation from '@/components/Navigation';
import CompanyBrainManager from '@/components/CompanyBrain/CompanyBrainManager';
import { useAuth } from '@/contexts/AuthContext';

const CompanyBrain = () => {
  const { profile } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1">
        <CompanyBrainManager />
      </div>
    </div>
  );
};

export default CompanyBrain;
