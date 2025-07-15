
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import TopRightPanel from '@/components/Manager/TopRightPanel';

const ManagerTeam: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64">
        {/* Top Bar with Panel */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">Manage your sales team and performance</p>
          </div>
          <TopRightPanel />
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Team Overview</h3>
            <p className="text-muted-foreground">Team management features coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerTeam;
