
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, PhoneCall, MessageSquare, Users, Settings, Play, Pause, Volume2 } from 'lucide-react';
import { useCallSession } from '@/hooks/telephony/useCallSession';
import { useSMSConversation } from '@/hooks/telephony/useSMSConversation';
import { useCallRecording } from '@/hooks/telephony/useCallRecording';
import { useCallSupervision } from '@/hooks/telephony/useCallSupervision';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EnhancedDialerInterfaceProps {
  leads: any[];
  selectedLead?: any;
  onLeadSelect: (lead: any) => void;
}

const EnhancedDialerInterface: React.FC<EnhancedDialerInterfaceProps> = ({
  leads,
  selectedLead,
  onLeadSelect
}) => {
  const { user, profile } = useAuth();
  const [activeCallSession, setActiveCallSession] = useState<string | null>(null);
  
  const { 
    session, 
    events, 
    isLoading: callLoading,
    initiateCall,
    endCall,
    updateNotes
  } = useCallSession(activeCallSession);

  const { 
    messages, 
    isLoading: smsLoading,
    sendSMS
  } = useSMSConversation(selectedLead?.id, selectedLead?.phone);

  const { 
    recordings, 
    isLoading: recordingLoading,
    downloadRecording,
    transcribeRecording
  } = useCallRecording(activeCallSession);

  const {
    supervisions,
    activeSupervision,
    canSupervise,
    startSupervision,
    endSupervision
  } = useCallSupervision(activeCallSession);

  const handleInitiateCall = async (lead: any) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return;
    }

    const sessionId = await initiateCall(
      lead.phone,
      undefined,
      lead.id,
      user.id,
      profile.company_id,
      'outbound'
    );

    if (sessionId) {
      setActiveCallSession(sessionId);
      onLeadSelect(lead);
    }
  };

  const handleSendSMS = async (message: string) => {
    if (!selectedLead) return;
    
    const success = await sendSMS(message, selectedLead.id);
    if (success) {
      toast.success('SMS sent successfully');
    }
  };

  const handleEndCall = async () => {
    if (activeCallSession) {
      await endCall(activeCallSession);
      setActiveCallSession(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-screen overflow-hidden">
      {/* Left Panel - Leads List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Leads Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[calc(100vh-120px)]">
            <div className="space-y-2">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedLead?.id === lead.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onLeadSelect(lead)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.phone}</p>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInitiateCall(lead);
                        }}
                        disabled={!!activeCallSession}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeadSelect(lead);
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Call Control */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5" />
              Call Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Call Status */}
            <div className="text-center">
              {session ? (
                <div className="space-y-2">
                  <Badge variant={session.status === 'answered' ? 'default' : 'secondary'}>
                    {session.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {session.from_number} → {session.to_number}
                  </p>
                  {session.duration > 0 && (
                    <p className="text-sm text-gray-600">
                      Duration: {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">
                  <PhoneCall className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active call</p>
                </div>
              )}
            </div>

            {/* Call Actions */}
            <div className="flex justify-center gap-4">
              {session && session.status !== 'completed' ? (
                <Button
                  onClick={handleEndCall}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  End Call
                </Button>
              ) : (
                selectedLead && (
                  <Button
                    onClick={() => handleInitiateCall(selectedLead)}
                    disabled={callLoading || !!activeCallSession}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call {selectedLead.name}
                  </Button>
                )
              )}
            </div>

            {/* Call Recordings */}
            {recordings.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Recordings</h3>
                <div className="space-y-2">
                  {recordings.map((recording) => (
                    <div key={recording.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm">
                          {recording.duration ? `${recording.duration}s` : 'Processing...'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadRecording(recording.recording_url)}
                        >
                          Download
                        </Button>
                        {!recording.transcription && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => transcribeRecording(recording.id)}
                          >
                            Transcribe
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call Supervision */}
            {canSupervise && session && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Supervision</h3>
                {!activeSupervision ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startSupervision('listen')}
                    >
                      Listen
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startSupervision('whisper')}
                    >
                      Whisper
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startSupervision('barge')}
                    >
                      Barge
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="default">
                      {activeSupervision.supervision_type.toUpperCase()}
                    </Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={endSupervision}
                    >
                      End Supervision
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - SMS & Details */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100vh-120px)] overflow-hidden">
            <Tabs defaultValue="sms" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sms" className="h-full space-y-4">
                {selectedLead ? (
                  <>
                    <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-2">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2 rounded-lg max-w-[80%] ${
                            msg.direction === 'outbound'
                              ? 'bg-blue-100 text-blue-900 ml-auto'
                              : 'bg-gray-100 text-gray-900 mr-auto'
                          }`}
                        >
                          <p className="text-sm">{msg.body}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendSMS(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = e.currentTarget.parentElement?.querySelector('input');
                          if (input?.value) {
                            handleSendSMS(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        Send
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a lead to start messaging</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="notes" className="h-full space-y-4">
                {selectedLead ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Lead Information</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {selectedLead.name}</p>
                        <p><strong>Company:</strong> {selectedLead.company}</p>
                        <p><strong>Phone:</strong> {selectedLead.phone}</p>
                        <p><strong>Email:</strong> {selectedLead.email}</p>
                        <p><strong>Status:</strong> {selectedLead.status}</p>
                      </div>
                    </div>
                    
                    {session && (
                      <div>
                        <h4 className="font-medium mb-2">Call Notes</h4>
                        <textarea
                          className="w-full p-2 border rounded-md"
                          placeholder="Add call notes..."
                          rows={4}
                          defaultValue={session.notes || ''}
                          onBlur={(e) => updateNotes(session.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a lead to view details</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDialerInterface;
