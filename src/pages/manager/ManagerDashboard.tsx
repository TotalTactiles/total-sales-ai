
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import CEOEAAssistant from '@/components/AI/CEOEAAssistant';

const ManagerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Executive overview and AI-powered insights</p>
        </div>
        
        <CEOEAAssistant />
      </div>
    </div>
  );
};

export default ManagerDashboard;
