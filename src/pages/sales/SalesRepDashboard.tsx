
import React, { useState } from 'react';
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
import AIRecommendationModal from '@/components/AI/AIRecommendationModal';
import AICoachingModal from '@/components/AI/AICoachingModal';
import { ScheduleEventModal, ReminderTaskModal } from '@/components/Dashboard/PipelinePulseModals';
import PerformanceInsightModal from '@/components/Dashboard/PerformanceInsightModal';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads } = useMockData();
  
  // Modal states
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [selectedCoaching, setSelectedCoaching] = useState<any>(null);
  const [scheduleModal, setScheduleModal] = useState<{isOpen: boolean, leadName: string}>({isOpen: false, leadName: ''});
  const [reminderModal, setReminderModal] = useState<{isOpen: boolean, leadName: string}>({isOpen: false, leadName: ''});
  const [performanceInsight, setPerformanceInsight] = useState<any>(null);

  const handleRecommendationClick = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
  };

  const handleCoachingClick = (coaching: any) => {
    setSelectedCoaching(coaching);
  };

  const handleRecommendationAction = (action: string) => {
    console.log('Recommendation action:', action, selectedRecommendation);
    setSelectedRecommendation(null);
  };

  const handleCoachingAction = (action: string) => {
    console.log('Coaching action:', action, selectedCoaching);
    setSelectedCoaching(null);
  };

  const handleScheduleEvent = (eventData: any) => {
    console.log('Schedule event:', eventData);
  };

  const handleAddReminder = (reminderData: any) => {
    console.log('Add reminder:', reminderData);
  };

  const handlePerformanceCardClick = (cardData: any) => {
    setPerformanceInsight(cardData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Section with Performance Cards and Voice Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Cards Grid - Now in top-left */}
          <div className="lg:col-span-2">
            <PerformanceCardsGrid onCardClick={handlePerformanceCardClick} />
          </div>
          
          {/* Voice Briefing - Right side */}
          <div>
            <VoiceBriefing userName={profile?.full_name || 'Sales Rep'} />
          </div>
        </div>

        {/* AI Recommendations - Moved higher for visibility */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRecommendations onRecommendationClick={handleRecommendationClick} />
          <AICoachingPanel onCoachingClick={handleCoachingClick} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Optimized Pipeline Pulse */}
          <div className="lg:col-span-2">
            <OptimizedPipelinePulse 
              leads={leads} 
              onScheduleEvent={(leadName) => setScheduleModal({isOpen: true, leadName})}
              onAddReminder={(leadName) => setReminderModal({isOpen: true, leadName})}
            />
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

        {/* AI Assistant Contextual Bubble */}
        <UnifiedAIBubble 
          context={{
            workspace: 'dashboard',
            currentLead: undefined,
            isCallActive: false
          }}
        />

        {/* Modals */}
        {selectedRecommendation && (
          <AIRecommendationModal
            isOpen={!!selectedRecommendation}
            onClose={() => setSelectedRecommendation(null)}
            recommendation={selectedRecommendation}
            onAction={handleRecommendationAction}
          />
        )}

        {selectedCoaching && (
          <AICoachingModal
            isOpen={!!selectedCoaching}
            onClose={() => setSelectedCoaching(null)}
            coaching={selectedCoaching}
            onAction={handleCoachingAction}
          />
        )}

        <ScheduleEventModal
          isOpen={scheduleModal.isOpen}
          onClose={() => setScheduleModal({isOpen: false, leadName: ''})}
          leadName={scheduleModal.leadName}
          onScheduleEvent={handleScheduleEvent}
        />

        <ReminderTaskModal
          isOpen={reminderModal.isOpen}
          onClose={() => setReminderModal({isOpen: false, leadName: ''})}
          leadName={reminderModal.leadName}
          onAddReminder={handleAddReminder}
        />

        {performanceInsight && (
          <PerformanceInsightModal
            isOpen={!!performanceInsight}
            onClose={() => setPerformanceInsight(null)}
            cardData={performanceInsight}
          />
        )}
      </div>
    </div>
  );
};

export default SalesRepDashboard;
