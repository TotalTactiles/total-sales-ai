
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import AIOrchestrationDashboard from '@/components/Manager/AIOrchestrationDashboard';

const AIOrchestration = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">AI Orchestration Control Center</h1>
              <p className="text-gray-600 mt-2">
                Monitor and control AI agent coordination, task distribution, and multi-modal processing
              </p>
            </div>
            
            <AIOrchestrationDashboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIOrchestration;
