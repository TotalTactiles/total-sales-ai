
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import LeadSourceIntegrations from '@/components/Manager/LeadSourceIntegrations';
import TopRightPanel from '@/components/Manager/TopRightPanel';

const ManagerLeads: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64">
        {/* Top Bar with Panel */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-bold">Lead Management</h1>
            <p className="text-muted-foreground">AI-powered lead source integrations and routing</p>
          </div>
          <TopRightPanel />
        </div>
        
        <div className="p-6">
          <LeadSourceIntegrations />
        </div>
      </div>
    </div>
  );
};

export default ManagerLeads;
