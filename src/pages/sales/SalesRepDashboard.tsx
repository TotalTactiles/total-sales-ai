
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Clock,
  DollarSign,
  Zap,
  Brain,
  Headphones,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';
import AISummaryCard from '@/components/AI/AISummaryCard';
import AIRecommendations from '@/components/AI/AIRecommendations';
import AICoachingPanel from '@/components/AI/AICoachingPanel';
import VoiceBriefing from '@/components/AI/VoiceBriefing';
import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import PerformanceCardsGrid from '@/components/Dashboard/PerformanceCardsGrid';
import OptimizedPipelinePulse from '@/components/Dashboard/OptimizedPipelinePulse';
import RewardsProgress from '@/components/Dashboard/RewardsProgress';
import AIOptimizedSchedule from '@/components/Dashboard/AIOptimizedSchedule';
import SalesDemoActions from '@/components/demo/SalesDemoActions';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads } = useMockData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Demo Actions Panel */}
        <SalesDemoActions />

        {/* Top Section with Performance Cards and Voice Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Cards Grid - Now in top-left */}
          <div className="lg:col-span-2">
            <PerformanceCardsGrid />
          </div>
          
          {/* Voice Briefing - Right side */}
          <div>
            <VoiceBriefing userName={profile?.full_name || 'Sales Rep'} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Optimized Pipeline Pulse */}
          <div className="lg:col-span-2">
            <OptimizedPipelinePulse leads={leads} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Summary */}
            <AISummaryCard />

            {/* AI-Optimized Schedule */}
            <AIOptimizedSchedule />
          </div>
        </div>

        {/* Rewards Progress Section */}
        <div className="mt-6">
          <RewardsProgress />
        </div>

        {/* AI Recommendations and Coaching - Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRecommendations />
          <AICoachingPanel />
        </div>

        {/* AI Assistant Contextual Bubble */}
        <UnifiedAIBubble 
          context={{
            workspace: 'dashboard',
            currentLead: undefined,
            isCallActive: false
          }}
        />
      </div>
    </div>
  );
};

export default SalesRepDashboard;
