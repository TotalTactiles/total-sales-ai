
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import BusinessOpsAI from '@/components/AI/BusinessOpsAI';

const ManagerBusinessOps = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Operations</h1>
          <p className="text-gray-600">KPI analysis and scenario simulations</p>
        </div>
        
        <BusinessOpsAI />
      </div>
    </div>
  );
};

export default ManagerBusinessOps;
