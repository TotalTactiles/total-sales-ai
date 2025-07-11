
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import CompanyDashboard from '@/components/Manager/CompanyDashboard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-0 lg:ml-0 p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Executive overview and company performance metrics</p>
        </div>
        
        <CompanyDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
