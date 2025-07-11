
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import DeploymentDashboard from '@/components/Deployment/DeploymentDashboard';

const DeploymentCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Deployment Center</h1>
              <p className="text-gray-600 mt-2">
                Orchestrate deployments across environments with enterprise-grade CI/CD automation
              </p>
            </div>
            
            <DeploymentDashboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeploymentCenter;
