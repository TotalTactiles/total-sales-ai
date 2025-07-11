
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import ManagerDashboardMetrics from '@/components/Manager/ManagerDashboardMetrics';
import MonthlyForecast from '@/components/Manager/MonthlyForecast';
import BusinessOperationsInsights from '@/components/Manager/BusinessOperationsInsights';
import MarketingPerformance from '@/components/Manager/MarketingPerformance';
import TeamPerformance from '@/components/Manager/TeamPerformance';
import TeamBadges from '@/components/Manager/TeamBadges';
import AIDailySummary from '@/components/Dashboard/AIDailySummary';
import ChatBubble from '@/components/AI/ChatBubble';

const Dashboard = () => {
  const aiSummary = "Good morning! Your team has achieved 68% month completion with strong pipeline data at $137,700. Revenue trends show +15.2% growth. AI suggests focusing on the 3 active rewards to maintain momentum.";

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-0 lg:ml-0 p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 text-sm">AI-enhanced team intelligence and control center</p>
        </div>
        
        {/* AI Daily Summary */}
        <div className="mb-6">
          <AIDailySummary summary={aiSummary} isFullUser={true} />
        </div>
        
        {/* Top Metrics Row */}
        <ManagerDashboardMetrics />
        
        {/* Monthly Forecast Section */}
        <div className="mb-6">
          <MonthlyForecast />
        </div>
        
        {/* Business Operations Insights */}
        <div className="mb-6">
          <BusinessOperationsInsights />
        </div>
        
        {/* Marketing & Sales Performance */}
        <div className="mb-6">
          <MarketingPerformance />
        </div>
        
        {/* Team Performance */}
        <div className="mb-6">
          <TeamPerformance />
        </div>
        
        {/* Team Badges */}
        <div className="mb-6">
          <TeamBadges />
        </div>
      </div>

      {/* AI Chat Bubble */}
      <ChatBubble 
        assistantType="dashboard" 
        enabled={true}
        context={{
          workspace: 'dashboard',
          userRole: 'manager'
        }}
      />
    </div>
  );
};

export default Dashboard;
