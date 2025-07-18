
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Bot, Sparkles } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import LeadProfileHeader from './LeadProfileHeader';
import LeadDetailsCard from './LeadDetailsCard';
import LeadSummaryTab from './LeadSummaryTab';
import LeadNotesTab from './LeadNotesTab';
import LeadTasksTab from './LeadTasksTab';
import LeadCommsTab from './LeadCommsTab';
import LeadTimelineTab from './LeadTimelineTab';
import AIAssistantTab from '../LeadIntelligence/AIAssistantTab';

interface LeadProfileProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onDelegateToAI?: (leadId: string) => void;
}

const LeadProfile: React.FC<LeadProfileProps> = ({
  lead,
  isOpen,
  onClose,
  onDelegateToAI
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [aiDelegationMode, setAiDelegationMode] = useState(false);
  const [leadData, setLeadData] = useState(lead);
  
  const {
    trackEvent,
    trackTabOpen
  } = useUsageTracking();
  const {
    logGhostIntent
  } = useAIBrainInsights();

  React.useEffect(() => {
    if (lead) {
      setLeadData(lead);
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
        action: 'manual_edit',
        context: field,
        metadata: {
          leadId: leadData.id,
          field,
          newValue: value
        }
      });
    }
  };

  React.useEffect(() => {
    if (isOpen && lead) {
      trackEvent({
        feature: 'lead_profile',
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
    trackTabOpen('lead_profile', `tab_${tab}`);
  };

  const handleAIDelegation = () => {
    if (leadData?.isSensitive) {
      toast.warning('Cannot delegate sensitive leads. Remove sensitive tag first.');
      logGhostIntent('ai_delegation', 'Tried to delegate sensitive lead - requires approval mode');
      return;
    }
    
    if (onDelegateToAI && leadData) {
      onDelegateToAI(leadData.id);
      setAiDelegationMode(true);
      trackEvent({
        feature: 'ai_delegation',
        action: 'activate',
        context: 'lead_profile',
        metadata: {
          leadId: lead?.id,
          leadScore: lead?.score
        }
      });
    }
  };

  if (!isOpen || !leadData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] h-[96vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0 shrink-0">
          <LeadProfileHeader 
            lead={leadData} 
            aiDelegationMode={aiDelegationMode} 
            onClose={onClose}
            onAIDelegation={handleAIDelegation} 
          />
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Sidebar - Lead Details Card */}
          <div className="w-80 border-r border-gray-200 bg-slate-50 shrink-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <LeadDetailsCard 
                  lead={leadData} 
                  onUpdate={handleLeadUpdate}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Main Content Area - Scrollable Tab Content */}
          <div className="flex-1 flex flex-col min-w-0">
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
              <div className="flex-1 overflow-hidden min-h-0">
                <TabsContent value="summary" className="h-full m-0 p-0">
                  <ScrollArea className="h-full">
                    <LeadSummaryTab 
                      lead={leadData} 
                      aiDelegationMode={aiDelegationMode} 
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="notes" className="h-full m-0 p-0">
                  <ScrollArea className="h-full">
                    <LeadNotesTab 
                      lead={leadData} 
                      aiDelegationMode={aiDelegationMode}
                      onUpdate={handleLeadUpdate}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="tasks" className="h-full m-0 p-0">
                  <ScrollArea className="h-full">
                    <LeadTasksTab 
                      lead={leadData} 
                      aiDelegationMode={aiDelegationMode}
                      onUpdate={handleLeadUpdate}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="comms" className="h-full m-0 p-0">
                  <ScrollArea className="h-full">
                    <LeadCommsTab 
                      lead={leadData} 
                      aiDelegationMode={aiDelegationMode}
                      onUpdate={handleLeadUpdate}
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="timeline" className="h-full m-0 p-0">
                  <ScrollArea className="h-full">
                    <LeadTimelineTab 
                      lead={leadData} 
                    />
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right AI Assistant Panel */}
          <div className="w-80 border-l border-gray-200 bg-white shrink-0">
            <ScrollArea className="h-full">
              <AIAssistantTab 
                lead={leadData} 
                voiceEnabled={false} 
                rationaleMode={true} 
                onRationaleModeChange={() => {}}
                onLeadUpdate={handleLeadUpdate}
              />
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadProfile;
