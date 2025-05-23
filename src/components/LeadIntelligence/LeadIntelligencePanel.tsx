
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import LeadIntelligenceHeader from './LeadIntelligenceHeader';
import LeadSidebar from './LeadSidebar';
import LeadSummary from './LeadSummary';
import LeadTimeline from './LeadTimeline';
import LeadComms from './LeadComms';
import LeadTasks from './LeadTasks';
import AIAssistantTab from './AIAssistantTab';
import { Lead } from '@/types/lead';

interface LeadIntelligencePanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const LeadIntelligencePanel: React.FC<LeadIntelligencePanelProps> = ({
  lead,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [rationaleMode, setRationaleMode] = useState(true);
  const [aiDelegationMode, setAiDelegationMode] = useState(false);
  const [isSensitive, setIsSensitive] = useState(false);

  const { trackEvent, trackClick, trackTabOpen } = useUsageTracking();
  const { logGhostIntent } = useAIBrainInsights();

  // Update isSensitive when lead changes
  useEffect(() => {
    if (lead) {
      setIsSensitive(lead.isSensitive);
    }
  }, [lead]);

  useEffect(() => {
    if (isOpen && lead) {
      trackEvent({
        feature: 'lead_intelligence_panel',
        action: 'open',
        context: `lead_${lead.id}`,
        metadata: { leadScore: lead.score, priority: lead.priority }
      });
    }
  }, [isOpen, lead, trackEvent]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackTabOpen('lead_intelligence_panel', `tab_${tab}`);
  };

  const handleSensitiveToggle = () => {
    setIsSensitive(!isSensitive);
    trackEvent({
      feature: 'sensitive_toggle',
      action: 'toggle',
      context: 'lead_intelligence_panel',
      outcome: !isSensitive ? 'enabled' : 'disabled'
    });
    
    toast.success(
      !isSensitive 
        ? 'Lead marked as sensitive. AI will request approval for all actions.' 
        : 'Sensitive mode disabled. AI can act autonomously.'
    );
  };

  const handleAIDelegation = () => {
    if (isSensitive) {
      toast.warning('Cannot delegate sensitive leads. Remove sensitive tag first.');
      logGhostIntent('ai_delegation', 'Tried to delegate sensitive lead - requires approval mode');
      return;
    }
    
    setAiDelegationMode(true);
    trackEvent({
      feature: 'ai_delegation',
      action: 'activate',
      context: 'lead_intelligence_panel',
      metadata: { leadId: lead?.id, leadScore: lead?.score }
    });
    
    toast.success('AI Assistant is now handling this lead. You\'ll be notified of major updates.');
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    trackClick('voice_controls', voiceEnabled ? 'disable' : 'enable');
  };

  // Don't render if dialog is not open or lead is null
  if (!isOpen || !lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <LeadIntelligenceHeader
            lead={lead}
            isSensitive={isSensitive}
            voiceEnabled={voiceEnabled}
            aiDelegationMode={aiDelegationMode}
            onClose={onClose}
            onVoiceToggle={handleVoiceToggle}
            onSensitiveToggle={handleSensitiveToggle}
            onAIDelegation={handleAIDelegation}
          />
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          <LeadSidebar lead={lead} isSensitive={isSensitive} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
              <div className="border-b px-6 pt-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="comms">Comms</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="ai" className="relative">
                    AI Assistant
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="summary" className="h-full m-0">
                  <LeadSummary 
                    lead={lead} 
                    rationaleMode={rationaleMode}
                    aiDelegationMode={aiDelegationMode}
                    isSensitive={isSensitive}
                  />
                </TabsContent>

                <TabsContent value="timeline" className="h-full m-0">
                  <LeadTimeline 
                    lead={lead}
                    rationaleMode={rationaleMode}
                  />
                </TabsContent>

                <TabsContent value="comms" className="h-full m-0">
                  <LeadComms 
                    lead={lead}
                    aiDelegationMode={aiDelegationMode}
                    isSensitive={isSensitive}
                    rationaleMode={rationaleMode}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="h-full m-0">
                  <LeadTasks 
                    lead={lead}
                    aiDelegationMode={aiDelegationMode}
                  />
                </TabsContent>

                <TabsContent value="ai" className="h-full m-0">
                  <AIAssistantTab 
                    lead={lead}
                    voiceEnabled={voiceEnabled}
                    rationaleMode={rationaleMode}
                    onRationaleModeChange={setRationaleMode}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadIntelligencePanel;
