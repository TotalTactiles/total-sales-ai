
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
import { useCallManager } from '@/hooks/useCallManager';
import { Lead } from '@/types/lead';
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
import PopOutCallWindow from '@/components/Calling/PopOutCallWindow';
import { ScheduleEventModal, ReminderTaskModal } from '@/components/Dashboard/PipelinePulseModals';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads } = useMockData();
  const { activeCalls, initiateCall, endCall, minimizeCall, maximizeCall, updateCall } = useCallManager();
  
  // Modal states
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [selectedCoaching, setSelectedCoaching] = useState<any>(null);
  const [scheduleModal, setScheduleModal] = useState<{isOpen: boolean, leadName: string}>({isOpen: false, leadName: ''});
  const [reminderModal, setReminderModal] = useState<{isOpen: boolean, leadName: string}>({isOpen: false, leadName: ''});

  const handleCallInitiate = (lead: Lead) => {
    const callId = initiateCall(lead);
    console.log('Call initiated for lead:', lead.name, 'with callId:', callId);
  };

  const handleCallEnd = (callId: string) => {
    endCall(callId);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-5">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Top Section with Performance Cards and Voice Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <PerformanceCardsGrid />
          </div>
          
          <div>
            <VoiceBriefing userName={profile?.full_name || 'Sales Rep'} />
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AIRecommendations onRecommendationClick={handleRecommendationClick} />
          <AICoachingPanel onCoachingClick={handleCoachingClick} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <OptimizedPipelinePulse 
              leads={leads} 
              onScheduleEvent={(leadName) => setScheduleModal({isOpen: true, leadName})}
              onAddReminder={(leadName) => setReminderModal({isOpen: true, leadName})}
              onCallInitiate={handleCallInitiate}
            />
          </div>

          <div className="space-y-5">
            <AISummaryCard />
            <AIOptimizedSchedule />
          </div>
        </div>

        {/* Rewards Progress Section */}
        <div className="mt-5">
          <RewardsProgress />
        </div>

        {/* AI Assistant Contextual Bubble */}
        <UnifiedAIBubble 
          context={{
            workspace: 'dashboard',
            currentLead: undefined,
            isCallActive: activeCalls.length > 0
          }}
        />

        {/* Active Call Windows */}
        {activeCalls.map(call => (
          <PopOutCallWindow
            key={call.id}
            lead={call.lead}
            isOpen={true}
            onClose={() => handleCallEnd(call.id)}
            callSessionId={call.sessionId}
          />
        ))}

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
      </div>
    </div>
  );
};

export default SalesRepDashboard;
