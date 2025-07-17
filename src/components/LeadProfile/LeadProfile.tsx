
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Bot, Sparkles, Mail, MessageSquare, Phone, Calendar } from 'lucide-react';
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
}

const LeadProfile: React.FC<LeadProfileProps> = ({
  lead,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [aiDelegationMode, setAiDelegationMode] = useState(false);
  const [leadData, setLeadData] = useState(lead);
  const [selectedEmailThread, setSelectedEmailThread] = useState<any>(null);
  const [selectedSMSThread, setSelectedSMSThread] = useState<any>(null);
  
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
    toast.success('AI Assistant is now handling this lead. You\'ll be notified of major updates.');
  };

  // Mock recent communications data
  const recentComms = {
    emails: [
      {
        id: '1',
        subject: 'Follow-up on Demo Discussion',
        preview: 'Thank you for taking the time to discuss our solution...',
        timestamp: '2 hours ago',
        direction: 'sent',
        thread: [
          { id: '1a', content: 'Thank you for taking the time to discuss our solution. I wanted to follow up...', timestamp: '2 hours ago', direction: 'sent' },
          { id: '1b', content: 'Thanks for reaching out. I\'d like to schedule another call...', timestamp: '1 hour ago', direction: 'received' }
        ]
      },
      {
        id: '2',
        subject: 'Pricing Information Request',
        preview: 'Here\'s the pricing breakdown you requested...',
        timestamp: '1 day ago',
        direction: 'sent',
        thread: [
          { id: '2a', content: 'Here\'s the pricing breakdown you requested for the enterprise plan...', timestamp: '1 day ago', direction: 'sent' }
        ]
      }
    ],
    sms: [
      {
        id: '1',
        preview: 'Quick question about the proposal timeline...',
        timestamp: '30 minutes ago',
        direction: 'received',
        thread: [
          { id: '1a', content: 'Quick question about the proposal timeline - when can we expect it?', timestamp: '30 minutes ago', direction: 'received' },
          { id: '1b', content: 'I\'ll have it ready by tomorrow morning. Will send it over first thing!', timestamp: '25 minutes ago', direction: 'sent' }
        ]
      }
    ]
  };

  const generateAISummary = () => {
    return `${leadData?.name} from ${leadData?.company} is a high-potential prospect with a score of ${leadData?.score}%. Last contacted ${leadData?.lastContact}, they've shown strong interest in our enterprise solution. Recent interactions indicate budget approval is pending, with decision timeline of 2-3 weeks. Key pain points: scalability and integration challenges. Recommended next action: Send ROI calculator and schedule technical demo.`;
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
              <div className="p-4 space-y-4">
                {/* AI Summary Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Bot className="h-4 w-4 text-blue-600" />
                      AI Lead Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-700 leading-relaxed">{generateAISummary()}</p>
                  </CardContent>
                </Card>

                {/* Recent Communications */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Recent Communications</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {/* Recent Emails */}
                    {recentComms.emails.slice(0, 2).map(email => (
                      <div 
                        key={email.id} 
                        className="p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => setSelectedEmailThread(email)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="h-3 w-3 text-blue-600" />
                          <Badge variant={email.direction === 'sent' ? 'default' : 'secondary'} className="text-xs">
                            {email.direction}
                          </Badge>
                          <span className="text-xs text-gray-500">{email.timestamp}</span>
                        </div>
                        <p className="text-xs font-medium truncate">{email.subject}</p>
                        <p className="text-xs text-gray-600 truncate">{email.preview}</p>
                      </div>
                    ))}

                    {/* Recent SMS */}
                    {recentComms.sms.slice(0, 2).map(sms => (
                      <div 
                        key={sms.id} 
                        className="p-2 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                        onClick={() => setSelectedSMSThread(sms)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3 w-3 text-green-600" />
                          <Badge variant={sms.direction === 'sent' ? 'default' : 'secondary'} className="text-xs">
                            {sms.direction}
                          </Badge>
                          <span className="text-xs text-gray-500">{sms.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{sms.preview}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

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

        {/* Email Thread Modal */}
        {selectedEmailThread && (
          <Dialog open={!!selectedEmailThread} onOpenChange={() => setSelectedEmailThread(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedEmailThread.subject}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEmailThread(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {selectedEmailThread.thread.map((message: any) => (
                    <div key={message.id} className={`p-3 rounded-lg ${message.direction === 'sent' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={message.direction === 'sent' ? 'default' : 'secondary'} className="text-xs">
                          {message.direction === 'sent' ? 'You' : leadData.name}
                        </Badge>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}

        {/* SMS Thread Modal */}
        {selectedSMSThread && (
          <Dialog open={!!selectedSMSThread} onOpenChange={() => setSelectedSMSThread(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">SMS Conversation</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSMSThread(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {selectedSMSThread.thread.map((message: any) => (
                    <div key={message.id} className={`flex ${message.direction === 'sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${message.direction === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.direction === 'sent' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadProfile;
