
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import LeadIntelligenceHeader from './LeadIntelligenceHeader';
import LeadSidebar from './LeadSidebar';
import AISummaryCard from './AISummaryCard';
import EditableLeadDetails from './EditableLeadDetails';
import LeadSummary from './LeadSummary';
import LeadTimeline from './LeadTimeline';
import LeadComms from './LeadComms';
import LeadTasks from './LeadTasks';
import AIAssistantTab from './AIAssistantTab';
import { Lead } from '@/types/lead';
import { Menu, X } from 'lucide-react';

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
  const [aiPanelVisible, setAiPanelVisible] = useState(true);
  const [leadData, setLeadData] = useState(lead);

  const { trackEvent, trackClick, trackTabOpen } = useUsageTracking();
  const { logGhostIntent } = useAIBrainInsights();

  // Update lead data and isSensitive when lead changes
  useEffect(() => {
    if (lead) {
      setLeadData(lead);
      setIsSensitive(lead.isSensitive);
    }
  }, [lead]);

  const handleLeadUpdate = (field: string, value: any) => {
    if (leadData) {
      const updatedLead = { ...leadData, [field]: value };
      setLeadData(updatedLead);
      
      trackEvent({
        feature: 'lead_field_update',
        action: 'manual_edit',
        context: field,
        metadata: { leadId: leadData.id, field, newValue: value }
      });
    }
  };

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
  if (!isOpen || !leadData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <LeadIntelligenceHeader
            lead={leadData}
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
          {/* Left Sidebar - Lead Details */}
          <div className="w-80 border-r border-gray-200 bg-white">
            <div className="p-4 space-y-4 h-full overflow-y-auto">
              <EditableLeadDetails 
                lead={leadData} 
                onUpdate={handleLeadUpdate}
              />
              <LeadSidebar lead={leadData} isSensitive={isSensitive} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* AI Summary - Always visible above tabs */}
            <div className="p-6 pb-0">
              <AISummaryCard 
                lead={leadData}
                aiDelegationMode={aiDelegationMode}
              />
            </div>

            {/* Tabs - Reduced from 5 to 4 columns (removed AI Assistant) */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
              <div className="border-b px-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="comms">Comms</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
              </div>

              {/* Scrollable Tab Content */}
              <div className="flex-1 overflow-hidden">
                <TabsContent value="summary" className="h-full m-0 overflow-y-auto">
                  <LeadSummary 
                    lead={leadData} 
                    rationaleMode={rationaleMode}
                    aiDelegationMode={aiDelegationMode}
                    isSensitive={isSensitive}
                  />
                </TabsContent>

                <TabsContent value="timeline" className="h-full m-0 overflow-y-auto">
                  <LeadTimeline 
                    lead={leadData}
                    rationaleMode={rationaleMode}
                  />
                </TabsContent>

                <TabsContent value="comms" className="h-full m-0 overflow-y-auto">
                  <LeadComms 
                    lead={leadData}
                    aiDelegationMode={aiDelegationMode}
                    isSensitive={isSensitive}
                    rationaleMode={rationaleMode}
                  />
                </TabsContent>

                <TabsContent value="tasks" className="h-full m-0 overflow-y-auto">
                  <LeadTasks 
                    lead={leadData}
                    aiDelegationMode={aiDelegationMode}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right AI Assistant Panel - Always visible */}
          <div className={`${aiPanelVisible ? 'w-80' : 'w-12'} border-l border-gray-200 bg-white transition-all duration-300 lg:relative fixed lg:static top-0 right-0 h-full z-50`}>
            {/* Mobile toggle button */}
            <div className="lg:hidden absolute top-4 left-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiPanelVisible(!aiPanelVisible)}
              >
                {aiPanelVisible ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* AI Assistant Panel Content */}
            <div className={`h-full ${aiPanelVisible ? 'block' : 'hidden lg:block'}`}>
              {aiPanelVisible ? (
                <div className="h-full">
                  <AIAssistantTab 
                    lead={leadData}
                    voiceEnabled={voiceEnabled}
                    rationaleMode={rationaleMode}
                    onRationaleModeChange={setRationaleMode}
                  />
                </div>
              ) : (
                <div className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiPanelVisible(true)}
                    className="rotate-90"
                  >
                    AI
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadIntelligencePanel;
