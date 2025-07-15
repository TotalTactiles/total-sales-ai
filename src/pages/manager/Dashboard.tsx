
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import TopRightPanel from '@/components/Manager/TopRightPanel';

const ManagerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64">
        {/* Top Bar with Panel */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
            <p className="text-muted-foreground">Overview of your team and business performance</p>
          </div>
          <TopRightPanel />
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Team Performance</h3>
              <p className="text-muted-foreground">Monitor your team's progress and achievements</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Lead Pipeline</h3>
              <p className="text-muted-foreground">Track leads through your sales process</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Revenue Metrics</h3>
              <p className="text-muted-foreground">View revenue trends and forecasts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
