
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  VolumeX, 
  Volume2,
  MessageSquare,
  Mail,
  User,
  Building,
  Clock,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useCallSession } from '@/hooks/telephony/useCallSession';
import { toast } from 'sonner';

interface PopOutCallWindowProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  callSessionId?: string;
}

const PopOutCallWindow: React.FC<PopOutCallWindowProps> = ({
  lead,
  isOpen,
  onClose,
  callSessionId
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHoldOn, setIsHoldOn] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'dialing' | 'ringing' | 'connected' | 'ended'>('dialing');

  const {
    callSession,
    callEvents,
    isLoading,
    initiateCall,
    endCall,
    updateNotes,
    createCallEvent
  } = useCallSession(callSessionId);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = async () => {
    try {
      setCallStatus('dialing');
      await initiateCall(lead.phone, lead.id);
      setCallStatus('ringing');
      
      // Simulate call progression
      setTimeout(() => {
        setCallStatus('connected');
        toast.success('Call connected');
      }, 3000);
    } catch (error) {
      toast.error('Failed to initiate call');
      setCallStatus('ended');
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      setCallStatus('ended');
      toast.info('Call ended');
    } catch (error) {
      toast.error('Failed to end call');
    }
  };

  const handleMute = async () => {
    setIsMuted(!isMuted);
    await createCallEvent('mute', { muted: !isMuted });
    toast.info(isMuted ? 'Unmuted' : 'Muted');
  };

  const handleHold = async () => {
    setIsHoldOn(!isHoldOn);
    await createCallEvent('hold', { onHold: !isHoldOn });
    toast.info(isHoldOn ? 'Call resumed' : 'Call on hold');
  };

  const handleSaveNotes = async () => {
    try {
      await updateNotes(callNotes);
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const handleQuickSMS = () => {
    // TODO: Implement SMS functionality
    toast.info('SMS feature coming soon');
  };

  const handleQuickEmail = () => {
    // TODO: Implement email functionality
    toast.info('Email feature coming soon');
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 bg-white border border-gray-200 rounded-lg shadow-2xl ${
      isMinimized ? 'bottom-4 right-4 w-80 h-16' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-auto'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-green-600" />
          <span className="font-semibold">
            {callStatus === 'dialing' ? 'Dialing...' : 
             callStatus === 'ringing' ? 'Ringing...' : 
             callStatus === 'connected' ? 'Connected' : 'Call Ended'}
          </span>
          {callStatus === 'connected' && (
            <Badge variant="outline" className="text-green-600">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(callDuration)}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 space-y-4">
          {/* Lead Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://avatar.vercel.sh/${lead.email}.png`} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-3 w-3 mr-1" />
                {lead.company}
              </div>
              <div className="text-sm text-gray-500">{lead.phone}</div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex justify-center space-x-4">
            {callStatus === 'dialing' || callStatus === 'ringing' ? (
              <Button
                onClick={handleCall}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Phone className="h-4 w-4 mr-2" />
                {isLoading ? 'Connecting...' : 'Call'}
              </Button>
            ) : callStatus === 'connected' ? (
              <>
                <Button
                  variant={isMuted ? 'destructive' : 'outline'}
                  onClick={handleMute}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isHoldOn ? 'secondary' : 'outline'}
                  onClick={handleHold}
                >
                  {isHoldOn ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleQuickSMS}>
              <MessageSquare className="h-4 w-4 mr-1" />
              SMS
            </Button>
            <Button variant="outline" size="sm" onClick={handleQuickEmail}>
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Call Notes</label>
            <Textarea
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="Add notes during the call..."
              className="min-h-[80px] text-sm"
            />
            <Button size="sm" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopOutCallWindow;
