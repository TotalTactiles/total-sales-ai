

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import MonthlyForecast from '@/components/Manager/MonthlyForecast';
import MarketingOverview from '@/components/Manager/MarketingOverview';
import ManagerPulse from '@/components/Manager/ManagerPulse';
import EnhancedTeamPerformance from '@/components/Manager/EnhancedTeamPerformance';
import TeamRewardsSnapshot from '@/components/Manager/TeamRewardsSnapshot';
import ManagerAIDailyBriefing from '@/components/Manager/ManagerAIDailyBriefing';
import CustomizableManagerCards from '@/components/Manager/CustomizableManagerCards';
import { AIInsightsModal } from '@/components/Manager/AIInsightsModal';

const ManagerDashboard: React.FC = () => {
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (data: any) => {
    setSelectedInsight(data);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-5"> {/* Reduced padding */}
        <div className="max-w-5xl mx-auto space-y-5"> {/* Reduced spacing */}
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900"> {/* Reduced text size */}
                Manager Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Executive overview and team insights</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Zap className="h-2.5 w-2.5 mr-1" /> {/* Reduced icon size */}
              AI-Powered Insights
            </Badge>
          </div>

          {/* Customizable Key Metrics Grid */}
          <CustomizableManagerCards onCardClick={handleCardClick} />

          {/* Monthly Forecast */}
          <MonthlyForecast onCardClick={handleCardClick} />

          {/* Manager Pulse - AI Recommended Actions */}
          <ManagerPulse />

          {/* Marketing Overview */}
          <MarketingOverview onCardClick={handleCardClick} />

          {/* Enhanced Team Performance */}
          <EnhancedTeamPerformance />

          {/* Team Rewards Overview */}
          <TeamRewardsSnapshot />
        </div>
      </div>

      {/* AI Daily Summary Sidebar */}
      <div className="w-72 bg-white border-l border-slate-200 p-5 overflow-y-auto flex-shrink-0"> {/* Reduced width and padding */}
        <ManagerAIDailyBriefing />
        
        <div className="mt-5 space-y-3.5"> {/* Reduced spacing */}
          <h3 className="text-lg font-semibold text-slate-900">Today's Priority Actions</h3>
          
          <div className="space-y-2.5"> {/* Reduced spacing */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5"> {/* Reduced padding */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-800">High Priority</span>
              </div>
              <p className="text-xs text-red-700">Michael Chen needs immediate coaching - 25% behind target</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5"> {/* Reduced padding */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800">Medium Priority</span>
              </div>
              <p className="text-xs text-yellow-700">3 enterprise deals need final push - potential $45K</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5"> {/* Reduced padding */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Opportunity</span>
              </div>
              <p className="text-xs text-blue-700">Sarah's techniques could boost team performance by 15%</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Modal */}
      {selectedInsight && (
        <AIInsightsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedInsight}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;

