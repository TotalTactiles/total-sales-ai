import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import LeadIntelligenceHeader from './LeadIntelligenceHeader';
import LeadDetailsCard from './LeadDetailsCard';
import LeadSummary from './LeadSummary';
import LeadTimeline from './LeadTimeline';
import LeadComms from './LeadComms';
import LeadNotesEnhanced from './LeadNotesEnhanced';
import LeadTasksEnhanced from './LeadTasksEnhanced';
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
  
  const {
    trackEvent,
    trackClick,
    trackTabOpen
  } = useUsageTracking();
  const {
    logGhostIntent
  } = useAIBrainInsights();

  useEffect(() => {
    if (lead) {
      setLeadData(lead);
      setIsSensitive(lead.isSensitive);
    }
  }, [lead]);

  const handleLeadUpdate = (field: string, value: any) => {
    if (leadData) {
      const updatedLead = {
        ...leadData,
        [field]: value
      };
      setLeadData(updatedLead);
      trackEvent({
        feature: 'lead_field_update',
        action: field.includes('voice') ? 'voice_edit' : 'manual_edit',
        context: field,
        metadata: {
          leadId: leadData.id,
          field,
          newValue: value
        }
      });
    }
  };

  useEffect(() => {
    if (isOpen && lead) {
      trackEvent({
        feature: 'lead_intelligence_panel',
        action: 'open',
        context: `lead_${lead.id}`,
        metadata: {
          leadScore: lead.score,
          priority: lead.priority
        }
      });
    }
  }, [isOpen, lead, trackEvent]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackTabOpen('lead_intelligence_panel', `tab_${tab}`);
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
      metadata: {
        leadId: lead?.id,
        leadScore: lead?.score
      }
    });
    toast.success('AI Assistant is now handling this lead. You\'ll be notified of major updates.');
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    trackClick('voice_controls', voiceEnabled ? 'disable' : 'enable');
  };

  const handleRationaleModeChange = () => {
    setRationaleMode(!rationaleMode);
  };

  if (!isOpen || !leadData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] h-[96vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0 shrink-0 py-[18px] my-0">
          <LeadIntelligenceHeader 
            lead={leadData} 
            isSensitive={isSensitive} 
            voiceEnabled={voiceEnabled} 
            aiDelegationMode={aiDelegationMode} 
            onClose={onClose} 
            onVoiceToggle={handleVoiceToggle} 
            onSensitiveToggle={() => setIsSensitive(!isSensitive)} 
            onAIDelegation={handleAIDelegation} 
          />
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Sidebar - Lead Details Card */}
          <div className="w-80 border-r border-gray-200 bg-slate-50 shrink-0">
            <div className="p-4 h-full overflow-y-auto">
              <LeadDetailsCard 
                lead={leadData} 
                onUpdate={handleLeadUpdate}
                isSensitive={isSensitive}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs - Updated order: Summary → Notes → Tasks → Comms → Timeline */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
              <div className="border-b px-4 shrink-0">
                <TabsList className="grid w-full grid-cols-5 h-10">
                  <TabsTrigger value="summary" className="text-sm">Summary</TabsTrigger>
                  <TabsTrigger value="notes" className="text-sm">Notes</TabsTrigger>
                  <TabsTrigger value="tasks" className="text-sm">Tasks</TabsTrigger>
                  <TabsTrigger value="comms" className="text-sm">Comms</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-sm">Timeline</TabsTrigger>
                </TabsList>
              </div>

              {/* Scrollable Tab Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <TabsContent value="summary" className="h-full m-0 p-0">
                  <div className="text-sm h-full overflow-y-auto">
                    <LeadSummary 
                      lead={leadData} 
                      rationaleMode={rationaleMode} 
                      aiDelegationMode={aiDelegationMode} 
                      isSensitive={isSensitive} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="h-full m-0 p-0">
                  <div className="text-sm h-full overflow-y-auto">
                    <LeadNotesEnhanced 
                      lead={leadData} 
                      aiDelegationMode={aiDelegationMode}
                      onUpdate={handleLeadUpdate}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="h-full m-0 p-0">
                  <div className="text-sm h-full overflow-y-auto">
                    <LeadTasksEnhanced 
                      lead={leadData} 
                      aiDelegationMode={aiDelegationMode}
                      onUpdate={handleLeadUpdate}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="comms" className="h-full m-0 p-0">
                  <div className="text-sm h-full overflow-y-auto">
                    <LeadComms 
                      lead={leadData} 
                      aiDelegationMode={aiDelegationMode} 
                      isSensitive={isSensitive} 
                      rationaleMode={rationaleMode} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="h-full m-0 p-0">
                  <div className="text-sm h-full overflow-y-auto p-4">
                    <LeadTimeline lead={leadData} rationaleMode={rationaleMode} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right AI Assistant Panel */}
          <div className={`${aiPanelVisible ? 'w-80' : 'w-12'} border-l border-gray-200 bg-white transition-all duration-300 shrink-0 relative`}>
            <div className="lg:hidden absolute top-2 left-2 z-10">
              <Button variant="ghost" size="sm" onClick={() => setAiPanelVisible(!aiPanelVisible)}>
                {aiPanelVisible ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            <div className={`h-full ${aiPanelVisible ? 'block' : 'hidden lg:block'}`}>
              {aiPanelVisible ? (
                <div className="h-full flex flex-col">
                  <AIAssistantTab 
                    lead={leadData} 
                    voiceEnabled={voiceEnabled} 
                    rationaleMode={rationaleMode} 
                    onRationaleModeChange={handleRationaleModeChange}
                    onLeadUpdate={handleLeadUpdate}
                  />
                </div>
              ) : (
                <div className="p-4 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setAiPanelVisible(true)} className="rotate-90">
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
