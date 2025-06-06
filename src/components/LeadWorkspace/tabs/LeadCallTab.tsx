import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Phone, PhoneCall, Clock, Mic, MicOff, Brain, Save, Zap } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useRetellAI } from '@/hooks/useRetellAI';
import { useCallStatus } from '@/hooks/useCallStatus';

interface LeadCallTabProps {
  lead: Lead;
}

const LeadCallTab: React.FC<LeadCallTabProps> = ({ lead }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const { makeCall, isLoading } = useIntegrations();
  const { makeConversationalCall, isLoading: isAICallLoading } = useRetellAI();
  const [callSid, setCallSid] = useState<string>();
  const { status: callStatus, duration } = useCallStatus(callSid);

  useEffect(() => {
    if (!callStatus) return;
    if (callStatus === 'completed' || callStatus === 'failed' || callStatus === 'no-answer') {
      setIsRecording(false);
      setCallSid(undefined);
      if (callStatus === 'failed') {
        toast.error('Call failed');
      }
    }
  }, [callStatus]);

  const mockCallHistory = [
    {
      id: 1,
      type: 'outbound',
      duration: '18m 23s',
      timestamp: '2 days ago',
      status: 'completed',
      summary: 'Discovery call - discussed pain points and budget. Very positive, interested in Q1 implementation.',
      sentiment: 'positive'
    },
    {
      id: 2,
      type: 'outbound',
      duration: '4m 12s',
      timestamp: '1 week ago',
      status: 'completed',
      summary: 'Quick follow-up call to schedule demo. Confirmed interest level is high.',
      sentiment: 'positive'
    },
    {
      id: 3,
      type: 'outbound',
      duration: '0m 0s',
      timestamp: '2 weeks ago',
      status: 'voicemail',
      summary: 'Left voicemail introducing our solution. Mentioned mutual connection.',
      sentiment: 'neutral'
    }
  ];

  const handleStartCall = async () => {
    const result = await makeCall(lead.phone, lead.id, lead.name);

    if (result.success) {
      // Start recording automatically when call begins
      setIsRecording(true);
      setCallSid(result.callSid);
      toast.success(`Call initiated to ${lead.name}. Call SID: ${result.callSid}`);
    } else {
      toast.error('Failed to start call');
    }
  };

  const handleNativeCall = () => {
    // Fallback to native mobile dialer
    window.location.href = `tel:${lead.phone}`;
    
    // Log the action
    toast.info(`Opening native dialer for ${lead.name}`);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? 'Recording stopped' : 'Recording started');
  };

  const handleAiAssist = () => {
    setIsAiAssisting(true);
    setTimeout(() => {
      const aiSummary = `Call Summary - ${new Date().toLocaleDateString()}

Key Discussion Points:
• ${lead.name} confirmed budget approval for Q1 implementation
• Main pain point: Manual processes taking 20+ hours/week
• Decision timeline: Needs solution in place by March 1st
• Competition: Also evaluating CompetitorX, but we have relationship advantage

Next Steps:
• Send ROI calculator by end of week
• Schedule product demo for next Tuesday 2 PM EST
• Follow up with technical requirements document

Sentiment: Very positive, high buying intent
Probability: 85% likely to move forward`;

      setCallNotes(aiSummary);
      setIsAiAssisting(false);
      toast.success('AI has generated call summary and next steps');
    }, 2000);
  };

  const handleAIConversationCall = async () => {
    const result = await makeConversationalCall(lead);
    
    if (result.success) {
      setIsRecording(true); // Auto-start recording for AI calls
      toast.success(`AI Assistant is calling ${lead.name}. The conversation will be fully automated.`);
    }
  };

  const handleSaveNotes = () => {
    if (callNotes.trim()) {
      toast.success('Call notes saved successfully');
      setCallNotes('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'voicemail': return <Badge className="bg-yellow-100 text-yellow-800">Voicemail</Badge>;
      case 'missed': return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Call Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Call {lead.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="font-medium">{lead.phone}</div>
              <div className="text-sm text-slate-600">Best time to call: Today 2-4 PM (78% connect rate)</div>
              {callStatus && (
                <div className="text-sm mt-1">Status: {callStatus}{duration ? ` - ${duration}s` : ''}</div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleStartCall} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <PhoneCall className="h-4 w-4 mr-2" />
                {isLoading ? 'Calling...' : 'Manual Call'}
              </Button>
              <Button 
                onClick={handleNativeCall} 
                variant="outline"
              >
                <Phone className="h-4 w-4 mr-2" />
                Native Call
              </Button>
            </div>
          </div>

          {/* AI Conversation Call */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-purple-800">AI Conversation Call</div>
                <div className="text-sm text-purple-600">
                  Let our AI assistant have a full conversation with {lead.name}
                </div>
              </div>
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <Button
              onClick={handleAIConversationCall}
              disabled={isAICallLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isAICallLoading ? (
                <>
                  <Mic className="h-4 w-4 mr-2 animate-pulse" />
                  Starting AI Conversation...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Start AI Conversation
                </>
              )}
            </Button>
            <div className="text-xs text-purple-600 mt-2">
              ✨ AI will qualify, handle objections, and schedule follow-ups automatically
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              onClick={handleToggleRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording in progress...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Call Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Call Notes & Summary
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAiAssist}
              disabled={isAiAssisting}
            >
              <Brain className="h-4 w-4 mr-2" />
              {isAiAssisting ? 'AI Processing...' : 'AI Summary'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            placeholder="Take notes during your call or let AI generate a summary..."
            className="min-h-[200px]"
          />

          {isAiAssisting && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
                <span className="text-sm text-blue-700">AI is analyzing the call and generating summary with next steps...</span>
              </div>
            </div>
          )}

          <Button onClick={handleSaveNotes} disabled={!callNotes.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Call Notes
          </Button>
        </CardContent>
      </Card>

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Call History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCallHistory.map((call) => (
              <div key={call.id} className="border-l-4 border-blue-200 pl-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <span className="font-medium text-sm capitalize">{call.type} Call</span>
                    {getStatusBadge(call.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{getSentimentIcon(call.sentiment)}</span>
                    <span className="text-xs text-slate-500">{call.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-500">Duration: {call.duration}</span>
                </div>
                <p className="text-sm text-slate-600">{call.summary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Call Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            AI Call Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-xs text-slate-600">
              📞 Your call conversion rate: 67% (above team average of 52%)
            </p>
            <p className="text-xs text-slate-600">
              ⏰ Optimal call length for this lead type: 15-20 minutes
            </p>
            <p className="text-xs text-slate-600">
              🎯 Key phrases that resonate: "ROI", "time savings", "Q1 implementation"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadCallTab;
