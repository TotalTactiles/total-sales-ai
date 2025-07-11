
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ManagerNavigation />
      
      <div className="ml-0 lg:ml-0 p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-2">AI-enhanced team intelligence and executive control center</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
          {/* Main Dashboard Content - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top Metrics Row */}
            <ManagerDashboardMetrics />
            
            {/* Monthly Forecast Section */}
            <MonthlyForecast />
            
            {/* Business Operations Insights */}
            <BusinessOperationsInsights />
            
            {/* Marketing & Sales Performance */}
            <MarketingPerformance />
            
            {/* Team Performance */}
            <TeamPerformance />
            
            {/* Team Badges */}
            <TeamBadges />
          </div>
          
          {/* Right Sidebar - AI Daily Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AIDailySummary summary={aiSummary} isFullUser={true} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Bubble - Bottom Right */}
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
