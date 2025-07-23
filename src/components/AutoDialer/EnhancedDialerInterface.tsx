import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Mail, CheckCircle, XCircle, AlertTriangle, MoreVertical, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCallSession } from '@/hooks/telephony/useCallSession';
import { useCallRecording } from '@/hooks/telephony/useCallRecording';
import { useSMSConversation } from '@/hooks/telephony/useSMSConversation';
import { Lead } from '@/types/lead';
import { CallSession, CallEvent } from '@/services/telephony/callSessionService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';

interface EnhancedDialerInterfaceProps {
  currentLead: Lead | null;
  onNextLead: () => void;
  onPrevLead: () => void;
}

const EnhancedDialerInterface: React.FC<EnhancedDialerInterfaceProps> = ({ currentLead, onNextLead, onPrevLead }) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);
  const [callNotes, setCallNotes] = useState<string>('');

  const {
    callSession,
    callEvents,
    isLoading,
    error,
    updateCallSession,
    createCallEvent,
    initiateCall,
    endCall,
    updateNotes
  } = useCallSession(currentSessionId);

  const { recordings, transcribeRecording, analyzeRecording } = useCallRecording(currentSessionId);
  const { messages, sendSMS } = useSMSConversation(currentLead?.phone);

  const handleInitiateCall = async (phoneNumber: string) => {
    const sessionId = await initiateCall(phoneNumber, currentLead?.id);
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  };

  const handleSendSMS = async (message: string) => {
    if (currentLead?.phone) {
      await sendSMS(message, currentLead.id);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (!currentSessionId) return;

    switch (action) {
      case 'transcribe':
        if (recordings.length > 0) {
          await transcribeRecording(recordings[0].id);
        }
        break;
      case 'analyze':
        if (recordings.length > 0) {
          await analyzeRecording(recordings[0].id);
        }
        break;
      case 'follow-up':
        await handleSendSMS('Thank you for your time. We will follow up with more information shortly.');
        break;
    }
  };

  useEffect(() => {
    if (callSession?.notes) {
      setCallNotes(callSession.notes);
    }
  }, [callSession?.notes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCallNotes(e.target.value);
  };

  const handleSaveNotes = async () => {
    await updateNotes(callNotes);
    toast.success('Call notes saved');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Lead Info */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Lead Information</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${currentLead?.email}.png`} />
            <AvatarFallback>{currentLead?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{currentLead?.name}</p>
            <p className="text-sm text-gray-500">{currentLead?.company}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dialer and Actions */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Dialer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                defaultValue={currentLead?.phone}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-end justify-end">
              <Button
                onClick={() => handleInitiateCall(currentLead?.phone || '')}
                disabled={isLoading}
              >
                <Phone className="mr-2 h-4 w-4" />
                {isLoading ? 'Calling...' : 'Call'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Session Details */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Call Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Status:</strong> {callSession?.status || 'Idle'}
            </p>
            <p>
              <strong>Start Time:</strong> {callSession?.start_time || 'N/A'}
            </p>
            <p>
              <strong>End Time:</strong> {callSession?.end_time || 'N/A'}
            </p>
            <p>
              <strong>Events:</strong> {callEvents?.length || 0}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="mb-4 flex-grow">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <Textarea
            placeholder="Add call notes here..."
            value={callNotes}
            onChange={handleNotesChange}
            className="flex-grow"
          />
          <Button onClick={handleSaveNotes} className="mt-4">
            Save Notes
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button onClick={() => handleQuickAction('transcribe')}>Transcribe</Button>
            <Button onClick={() => handleQuickAction('analyze')}>Analyze</Button>
            <Button onClick={() => handleQuickAction('follow-up')}>Follow-up SMS</Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button onClick={onPrevLead} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onNextLead} variant="outline">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedDialerInterface;
