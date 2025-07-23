
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall, 
  MessageSquare, 
  Eye, 
  FileText, 
  Brain,
  Settings,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { useCallSession } from '@/hooks/telephony/useCallSession';
import { useSMSConversation } from '@/hooks/telephony/useSMSConversation';
import { useCallSupervision } from '@/hooks/telephony/useCallSupervision';
import CallRecordingPanel from '@/components/CallManagement/CallRecordingPanel';
import { Lead } from '@/types/lead';

interface EnhancedDialerInterfaceProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onLeadSelect: (lead: Lead) => void;
}

const EnhancedDialerInterface: React.FC<EnhancedDialerInterfaceProps> = ({
  leads,
  selectedLead,
  onLeadSelect
}) => {
  const [activeTab, setActiveTab] = useState('dialer');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const {
    callSession,
    callEvents,
    isLoading: callLoading,
    initiateCall,
    createCallEvent,
    updateCallSession
  } = useCallSession(currentSessionId);

  const {
    conversations,
    isLoading: smsLoading,
    sendMessage,
    createThread
  } = useSMSConversation();

  const {
    supervisions,
    activeSupervision,
    startSupervision,
    endSupervision
  } = useCallSupervision(currentSessionId);

  const handleInitiateCall = async (lead: Lead) => {
    if (!lead.phone) return;

    const sessionId = await initiateCall(
      lead.phone,
      lead.id,
      'outbound'
    );

    if (sessionId) {
      setCurrentSessionId(sessionId);
      setActiveTab('active-call');
    }
  };

  const handleSendSMS = async (lead: Lead, message: string) => {
    if (!lead.phone) return;

    await sendMessage(lead.phone, message, lead.id);
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-100 text-green-800';
      case 'ringing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dialer">Dialer</TabsTrigger>
          <TabsTrigger value="active-call">Active Call</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="supervision">Supervision</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dialer" className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Lead List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Lead Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => onLeadSelect(lead)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.company}</p>
                          <p className="text-sm text-gray-500">{lead.phone}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline">{lead.status}</Badge>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInitiateCall(lead);
                              }}
                              disabled={callLoading}
                            >
                              <PhoneCall className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('sms');
                              }}
                            >
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Lead Details */}
            {selectedLead && (
              <Card>
                <CardHeader>
                  <CardTitle>Lead Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">{selectedLead.name}</h3>
                      <p className="text-gray-600">{selectedLead.company}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedLead.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedLead.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge>{selectedLead.status}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="font-medium">{selectedLead.score}/100</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleInitiateCall(selectedLead)}
                        disabled={callLoading}
                        className="flex-1"
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('sms')}
                        className="flex-1"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send SMS
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active-call" className="h-full">
          {callSession ? (
            <div className="space-y-6">
              {/* Call Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5" />
                    Active Call
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-lg">
                        {callSession.direction === 'outbound' ? callSession.to_number : callSession.from_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {callSession.direction} call • {callSession.duration}s
                      </p>
                    </div>
                    <Badge className={getCallStatusColor(callSession.status)}>
                      {callSession.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => createCallEvent('hold', {})}
                    >
                      Hold
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => createCallEvent('mute', {})}
                    >
                      Mute
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => createCallEvent('recording_start', {})}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Record
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateCallSession({ status: 'completed' })}
                    >
                      End Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Call Recording Panel */}
              <CallRecordingPanel callSession={callSession} />
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active call</p>
                  <p className="text-sm text-gray-500">Start a call from the dialer tab</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sms" className="h-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {smsLoading ? (
                <div className="text-center py-8">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No SMS conversations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <div key={conversation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{conversation.phone_number}</p>
                          <p className="text-sm text-gray-600">
                            {conversation.direction} • {new Date(conversation.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={conversation.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {conversation.status}
                        </Badge>
                      </div>
                      <p className="text-sm">{conversation.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supervision" className="h-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Call Supervision
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentSessionId ? (
                <div className="space-y-4">
                  {activeSupervision ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Active Supervision</p>
                        <Badge>{activeSupervision.supervision_type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Started: {new Date(activeSupervision.started_at).toLocaleString()}
                      </p>
                      <Button
                        variant="destructive"
                        onClick={() => endSupervision()}
                      >
                        End Supervision
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Start supervising the current call
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => startSupervision('listen')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Listen
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => startSupervision('whisper')}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Whisper
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => startSupervision('barge')}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Barge In
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active call to supervise</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="h-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Call Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Analytics dashboard coming soon</p>
                <p className="text-sm text-gray-500">
                  View call performance, sentiment analysis, and more
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDialerInterface;
