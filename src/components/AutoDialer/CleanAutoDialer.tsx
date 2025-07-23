import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  MessageSquare, 
  Play, 
  Pause, 
  SkipForward, 
  Settings, 
  BarChart3, 
  Users,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  TrendingUp,
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useCallSession } from '@/hooks/telephony/useCallSession';
import { useAdvancedAnalytics } from '@/hooks/telephony/useAdvancedAnalytics';
import { useCallRecording } from '@/hooks/telephony/useCallRecording';
import { useCallSupervision } from '@/hooks/telephony/useCallSupervision';
import { useSMSConversation } from '@/hooks/telephony/useSMSConversation';
import { toast } from 'sonner';

interface CleanAutoDialerProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

const CleanAutoDialer: React.FC<CleanAutoDialerProps> = ({ leads, onLeadSelect }) => {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isDialing, setIsDialing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [autoMode, setAutoMode] = useState(false);

  // Hooks
  const { callSession, callEvents, initiateCall, updateCallSession, createCallEvent } = useCallSession(currentSessionId);
  const { callAnalytics, smsAnalytics, repPerformance } = useAdvancedAnalytics(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0]
  );
  const { recordings, transcribeRecording, analyzeRecording } = useCallRecording(currentSessionId);
  const { canSupervise, startSupervision, endSupervision } = useCallSupervision(currentSessionId);
  const { messages, sendSMS } = useSMSConversation(currentLead?.phone);

  // Auto-select optimal lead
  useEffect(() => {
    if (!currentLead && leads.length > 0) {
      const scoredLeads = leads
        .map(lead => {
          let score = 0;
          if ((lead.speedToLead || 0) < 5) score += 100;
          else if ((lead.speedToLead || 0) < 15) score += 50;
          score += (lead.conversionLikelihood || 0);
          if (lead.priority === 'high') score *= 1.5;
          return { lead, score };
        })
        .sort((a, b) => b.score - a.score);

      if (scoredLeads.length > 0) {
        const optimalLead = scoredLeads[0].lead;
        setCurrentLead(optimalLead);
        onLeadSelect(optimalLead);
      }
    }
  }, [leads, currentLead, onLeadSelect]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleStartCall = async () => {
    if (!currentLead) {
      toast.error('Please select a lead first');
      return;
    }

    setIsDialing(true);
    try {
      const sessionId = await initiateCall(currentLead.phone, currentLead.id);
      if (sessionId) {
        setCurrentSessionId(sessionId);
        setIsCallActive(true);
        setIsRecording(true);
        toast.success(`Calling ${currentLead.name}...`);
      }
    } catch (error) {
      toast.error('Failed to initiate call');
    } finally {
      setIsDialing(false);
    }
  };

  const handleEndCall = async () => {
    if (currentSessionId) {
      await updateCallSession({ status: 'completed', ended_at: new Date().toISOString() });
      await createCallEvent('hangup');
    }
    setIsCallActive(false);
    setCurrentSessionId(null);
    setIsRecording(false);
    setCallDuration(0);
    
    // Auto-select next lead if in auto mode
    if (autoMode) {
      const currentIndex = leads.findIndex(lead => lead.id === currentLead?.id);
      const nextIndex = (currentIndex + 1) % leads.length;
      if (nextIndex < leads.length) {
        const nextLead = leads[nextIndex];
        setCurrentLead(nextLead);
        onLeadSelect(nextLead);
        setTimeout(() => handleStartCall(), 2000);
      }
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (currentSessionId) {
      createCallEvent(isMuted ? 'mute' : 'mute', { muted: !isMuted });
    }
  };

  const handleSendSMS = async (message: string) => {
    if (currentLead) {
      await sendSMS(message, currentLead.id);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const freshLeads = leads.filter(lead => (lead.speedToLead || 0) < 15);
  const highPriorityLeads = leads.filter(lead => lead.priority === 'high');

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fresh Leads</p>
                <p className="text-2xl font-bold text-orange-600">{freshLeads.length}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityLeads.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Answer Rate</p>
                <p className="text-2xl font-bold text-green-600">{callAnalytics?.answer_rate.toFixed(1) || 0}%</p>
              </div>
              <Phone className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SMS Response</p>
                <p className="text-2xl font-bold text-purple-600">{smsAnalytics?.response_rate.toFixed(1) || 0}%</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
        {/* Left Panel - Current Lead & Controls */}
        <div className="col-span-4 space-y-4">
          {/* Current Lead Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Current Lead
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={autoMode ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setAutoMode(!autoMode)}
                  >
                    {autoMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {autoMode ? 'Auto On' : 'Auto Off'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentLead ? (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{currentLead.name}</h3>
                      <p className="text-sm text-gray-600">{currentLead.company}</p>
                      <p className="text-xs text-gray-500">{currentLead.phone}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={currentLead.priority === 'high' ? 'destructive' : 'secondary'}>
                        {currentLead.priority}
                      </Badge>
                      <Badge variant="outline">
                        {currentLead.conversionLikelihood}% likely
                      </Badge>
                      {(currentLead.speedToLead || 0) < 15 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Fresh
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Call Status */}
                  {isCallActive && (
                    <div className="mb-3 p-2 bg-green-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-800">Call Active</span>
                        </div>
                        <span className="text-sm font-mono text-green-700">{formatDuration(callDuration)}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Call Controls */}
                  <div className="flex gap-2">
                    {!isCallActive ? (
                      <Button 
                        onClick={handleStartCall}
                        disabled={isDialing}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        {isDialing ? 'Dialing...' : `Call ${currentLead.name}`}
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={handleMuteToggle}
                          variant="outline"
                          size="sm"
                          className={isMuted ? 'bg-red-100 text-red-700' : ''}
                        >
                          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button 
                          onClick={handleEndCall}
                          variant="destructive"
                          className="flex-1"
                        >
                          End Call
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No lead selected</p>
                  <p className="text-sm">AI will auto-select optimal leads</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSendSMS("Hi, I tried calling you. Are you available for a quick chat?")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Follow-up SMS
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => currentSessionId && transcribeRecording(recordings[0]?.id)}
              >
                <Brain className="h-4 w-4 mr-2" />
                Transcribe Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => currentSessionId && analyzeRecording(recordings[0]?.id)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze Call
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Lead Queue */}
        <div className="col-span-5 space-y-4">
          <Card className="bg-white shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lead Queue</span>
                <Badge variant="outline">{leads.length} leads</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-y-auto">
              <div className="space-y-3">
                {leads.slice(0, 10).map((lead) => (
                  <div
                    key={lead.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      currentLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentLead(lead);
                      onLeadSelect(lead);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{lead.name}</h4>
                          <Badge variant={lead.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {lead.priority}
                          </Badge>
                          {(lead.speedToLead || 0) < 15 && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              Fresh
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                        <p className="text-xs text-gray-500">{lead.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{lead.conversionLikelihood}%</p>
                        <p className="text-xs text-gray-500">likelihood</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Analytics & Performance */}
        <div className="col-span-3 space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{callAnalytics?.answer_rate.toFixed(0) || 0}%</div>
                  <div className="text-xs text-gray-500">Answer Rate</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{callAnalytics?.total_calls || 0}</div>
                  <div className="text-xs text-gray-500">Total Calls</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{smsAnalytics?.total_messages || 0}</div>
                  <div className="text-xs text-gray-500">SMS Sent</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{Math.round(callAnalytics?.average_duration || 0)}s</div>
                  <div className="text-xs text-gray-500">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 Best calling window: 10-11 AM (73% answer rate)
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🎯 Fresh leads convert 2.3x better - prioritize speed-to-lead
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  📱 SMS follow-ups increase callback rate by 45%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {repPerformance.slice(0, 3).map((rep, index) => (
                <div key={rep.rep_id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium">{rep.rep_name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{rep.calls_answered}</p>
                    <p className="text-xs text-gray-500">calls</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CleanAutoDialer;
