
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Star,
  Brain,
  Volume2,
  VolumeX,
  Shield,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import UsageTracker from '@/components/AIBrain/UsageTracker';
import LeadSummary from './LeadSummary';
import LeadTimeline from './LeadTimeline';
import LeadComms from './LeadComms';
import LeadTasks from './LeadTasks';
import AIAssistantTab from './AIAssistantTab';
import ConversionMeter from './ConversionMeter';
import VoiceControls from './VoiceControls';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  priority: 'high' | 'medium' | 'low';
  lastContact: string;
  score: number;
  tags: string[];
  isSensitive: boolean;
  conversionLikelihood: number;
}

interface LeadIntelligencePanelProps {
  lead: Lead;
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
  const [isSensitive, setIsSensitive] = useState(lead.isSensitive);

  const { trackEvent, trackClick, trackTabOpen } = useUsageTracking();
  const { logGhostIntent } = useAIBrainInsights();

  useEffect(() => {
    if (isOpen) {
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
      metadata: { leadId: lead.id, leadScore: lead.score }
    });
    
    toast.success('AI Assistant is now handling this lead. You\'ll be notified of major updates.');
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    trackClick('voice_controls', voiceEnabled ? 'disable' : 'enable');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-600" />
              Lead Intelligence: {lead.name}
              {isSensitive && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Sensitive
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <VoiceControls 
                enabled={voiceEnabled} 
                onToggle={handleVoiceToggle}
                leadName={lead.name}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSensitiveToggle}
                className={`${isSensitive ? 'border-red-300 text-red-700' : 'border-gray-300'}`}
              >
                <Shield className="h-4 w-4 mr-1" />
                {isSensitive ? 'Remove Sensitive' : 'Mark Sensitive'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAIDelegation}
                disabled={isSensitive || aiDelegationMode}
                className="border-blue-300 text-blue-700"
              >
                <Brain className="h-4 w-4 mr-1" />
                {aiDelegationMode ? 'AI Handling' : 'Delegate to AI'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Lead Info */}
          <div className="w-80 border-r bg-slate-50 p-6 overflow-y-auto">
            <UsageTracker feature="lead_sidebar" context="lead_intelligence_panel">
              <div className="space-y-6">
                {/* Lead Header */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-blue-600">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{lead.name}</h3>
                  <p className="text-slate-600">{lead.company}</p>
                  <Badge className={`mt-2 ${
                    lead.priority === 'high' ? 'bg-red-100 text-red-800' :
                    lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)} Priority
                  </Badge>
                </div>

                {/* Conversion Meter */}
                <ConversionMeter 
                  likelihood={lead.conversionLikelihood}
                  reasoning="Based on engagement level, response time, and industry patterns"
                />

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Lead Score</span>
                    <span className="font-semibold">{lead.score}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Last Contact</span>
                    <span className="font-semibold">{lead.lastContact}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge variant="outline">{lead.status}</Badge>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-slate-700">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <UsageTracker feature="quick_call" context="lead_sidebar">
                      <Button size="sm" variant="outline" className="w-full">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </UsageTracker>
                    <UsageTracker feature="quick_email" context="lead_sidebar">
                      <Button size="sm" variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </UsageTracker>
                    <UsageTracker feature="quick_sms" context="lead_sidebar">
                      <Button size="sm" variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        SMS
                      </Button>
                    </UsageTracker>
                    <UsageTracker feature="quick_schedule" context="lead_sidebar">
                      <Button size="sm" variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </UsageTracker>
                  </div>
                </div>

                {/* Tags */}
                {lead.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-slate-700 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </UsageTracker>
          </div>

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
