
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Clock,
  Users,
  Brain,
  Settings,
  Star,
  MessageSquare,
  Mail,
  Calendar,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useIntegrations } from '@/hooks/useIntegrations';
import { toast } from 'sonner';
import LeadPriorityQueue from './LeadPriorityQueue';
import CallInterface from './CallInterface';
import AIAssistantPanel from './AIAssistantPanel';
import WorkflowSelector from './WorkflowSelector';
import CallFeedback from './CallFeedback';

interface AutoDialerInterfaceProps {
  leads: Lead[];
  currentLead?: Lead | null;
  onLeadSelect: (lead: Lead) => void;
}

const AutoDialerInterface: React.FC<AutoDialerInterfaceProps> = ({
  leads,
  currentLead,
  onLeadSelect
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiAssistantActive, setAiAssistantActive] = useState(true);
  const [autopilotMode, setAutopilotMode] = useState(false);
  const [callOutcome, setCallOutcome] = useState<string>('');
  
  const { makeCall, isLoading } = useIntegrations();

  // Prioritize leads by urgency and speed-to-lead
  const prioritizedLeads = leads
    .filter(lead => !lead.doNotCall)
    .sort((a, b) => {
      // High priority first
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by speed-to-lead (newer leads first)
      const speedDiff = (a.speedToLead || 999) - (b.speedToLead || 999);
      if (speedDiff !== 0) return speedDiff;
      
      // Finally by conversion likelihood
      return (b.conversionLikelihood || 0) - (a.conversionLikelihood || 0);
    });

  const hotLeads = prioritizedLeads.filter(lead => lead.priority === 'high');
  const speedToLeadCritical = prioritizedLeads.filter(lead => (lead.speedToLead || 0) < 5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleStartCall = async () => {
    if (!currentLead) {
      toast.error('Please select a lead to call');
      return;
    }

    const result = await makeCall(currentLead.phone, currentLead.id, currentLead.name);
    
    if (result.success) {
      setIsCallActive(true);
      setCallDuration(0);
      toast.success(`Call connected to ${currentLead.name}`);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setShowFeedback(true);
    toast.info('Call ended. Please provide feedback.');
  };

  const handleCallOutcome = (outcome: string) => {
    setCallOutcome(outcome);
    setShowFeedback(true);
    setIsCallActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Lead Queue & AI Assistant */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Auto-Dialer</h2>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                {prioritizedLeads.length} Leads
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutopilotMode(!autopilotMode)}
                className={autopilotMode ? 'bg-blue-100 text-blue-800' : ''}
              >
                <Zap className="h-4 w-4 mr-1" />
                {autopilotMode ? 'Autopilot ON' : 'Manual'}
              </Button>
            </div>
          </div>

          {/* Speed-to-Lead Alert */}
          {speedToLeadCritical.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {speedToLeadCritical.length} Fresh Leads (&lt;5min)
                </span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Call within 5 minutes for 21x higher conversion rate
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="queue" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
              <TabsTrigger value="queue">Lead Queue</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="queue" className="mt-4 px-4">
              <LeadPriorityQueue
                leads={prioritizedLeads}
                currentLead={currentLead}
                onLeadSelect={onLeadSelect}
                hotLeads={hotLeads}
                speedToLeadCritical={speedToLeadCritical}
              />
            </TabsContent>
            
            <TabsContent value="ai" className="mt-4 px-4">
              <AIAssistantPanel
                currentLead={currentLead}
                isCallActive={isCallActive}
                onSuggestion={(suggestion) => toast.info(suggestion)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Center Panel - Call Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              {currentLead ? (
                <div>
                  <h1 className="text-2xl font-bold">{currentLead.name}</h1>
                  <p className="text-gray-600">{currentLead.company} • {currentLead.phone}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getPriorityColor(currentLead.priority)}>
                      {currentLead.priority.toUpperCase()} PRIORITY
                    </Badge>
                    {currentLead.speedToLead !== undefined && (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentLead.speedToLead}min old
                      </Badge>
                    )}
                    {currentLead.autopilotEnabled && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Zap className="h-3 w-3 mr-1" />
                        Autopilot Active
                      </Badge>
                    )}
                    {currentLead.doNotCall && (
                      <Badge className="bg-red-100 text-red-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Do Not Call
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold">Auto-Dialer Ready</h1>
                  <p className="text-gray-600">Select a lead to start calling</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isCallActive && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-mono text-lg">{formatTime(callDuration)}</span>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={isCallActive ? handleEndCall : handleStartCall}
                  disabled={!currentLead || isLoading}
                  className={isCallActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                >
                  {isCallActive ? (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      End Call
                    </>
                  ) : (
                    <>
                      <PhoneCall className="h-4 w-4 mr-2" />
                      {isLoading ? 'Calling...' : 'Start Call'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 p-6">
          {isCallActive && currentLead ? (
            <CallInterface
              lead={currentLead}
              callDuration={callDuration}
              isMuted={isMuted}
              onMuteToggle={() => setIsMuted(!isMuted)}
              onCallOutcome={handleCallOutcome}
              aiAssistantActive={aiAssistantActive}
            />
          ) : currentLead ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Lead Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p>{currentLead.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Source</label>
                      <p>{currentLead.source}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Lead Score</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${currentLead.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{currentLead.score}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Conversion Likelihood</label>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>{currentLead.conversionLikelihood}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Best Call Time:</strong> Now (78% connect rate for this industry)
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Talking Points:</strong> Focus on ROI and time savings based on their company size
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Follow-up:</strong> Send pricing info immediately after call for 34% higher close rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <Phone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Dial</h3>
              <p className="text-gray-600">Select a lead from the queue to start calling</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <CallFeedback
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          callOutcome={callOutcome}
          leadName={currentLead?.name || ''}
          onFeedbackSubmit={(feedback) => {
            console.log('Call feedback:', feedback);
            toast.success('Feedback submitted successfully');
          }}
        />
      )}
    </div>
  );
};

export default AutoDialerInterface;
