
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import LeadsAI from '@/components/AI/LeadsAI';

const ManagerLeadManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">AI-powered lead scoring and optimization</p>
        </div>
        
        <LeadsAI />
      </div>
    </div>
  );
};

export default ManagerLeadManagement;
