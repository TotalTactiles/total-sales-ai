
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import CompanyBrainManager from '@/components/CompanyBrain/CompanyBrainManager';

const ManagerCompanyBrain = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64">
        <CompanyBrainManager />
      </div>
    </div>
  );
};

export default ManagerCompanyBrain;
