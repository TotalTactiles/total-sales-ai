
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Mail,
  TestTube2,
  Clock,
  User,
  Building,
  TrendingUp,
  Pause,
  Play,
  FileText
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface ActiveCallInterfaceProps {
  currentLead: Lead | null;
  isCallActive: boolean;
  callDuration: number;
  onCallAnswered: () => void;
  onCallMissed: () => void;
  onEndCall: () => void;
}

const ActiveCallInterface: React.FC<ActiveCallInterfaceProps> = ({
  currentLead,
  isCallActive,
  callDuration,
  onCallAnswered,
  onCallMissed,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswered = () => {
    onCallAnswered();
    setIsRecording(true);
    toast.success('Call connected - Recording started');
  };

  const handleMissed = () => {
    onCallMissed();
    toast.info('Call missed - Moving to next lead');
  };

  const handleVoicemail = () => {
    toast.info('Voicemail detected - Options available');
    onCallMissed();
  };

  const handleTransfer = () => {
    toast.info('Transfer options available');
  };

  if (!currentLead) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Phone className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="flat-heading-base text-gray-600">No Active Call</h3>
              <p className="text-sm text-gray-500">Select a lead to start dialing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flat-heading-base">
            {isCallActive ? 'Active Call' : 'Dialing...'}
          </CardTitle>
          {isCallActive && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(callDuration)}
              </Badge>
              {isRecording && (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                  REC
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Lead Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="flat-heading-base">{currentLead.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-3 w-3" />
                  <span>{currentLead.company}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="font-medium">{currentLead.score}%</span>
              </div>
              <Badge className="text-xs">{currentLead.priority}</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>📞 {currentLead.phone}</span>
            <span>📧 {currentLead.email}</span>
          </div>
        </div>

        {/* Call Controls */}
        <div className="space-y-4">
          {!isCallActive ? (
            /* Pre-Call Controls */
            <div className="flex gap-2 justify-center">
              <Button onClick={handleAnswered} className="bg-green-600 hover:bg-green-700">
                <PhoneCall className="h-4 w-4 mr-2" />
                Answered
              </Button>
              <Button onClick={handleMissed} variant="outline">
                <PhoneOff className="h-4 w-4 mr-2" />
                No Answer
              </Button>
              <Button onClick={handleVoicemail} variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Voicemail
              </Button>
            </div>
          ) : (
            /* Active Call Controls */
            <div className="space-y-3">
              <div className="flex gap-2 justify-center">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={isOnHold ? "secondary" : "outline"}
                  onClick={() => setIsOnHold(!isOnHold)}
                >
                  {isOnHold ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                
                <Button variant="outline" onClick={handleTransfer}>
                  <Phone className="h-4 w-4" />
                </Button>
                
                <Button variant="destructive" onClick={onEndCall}>
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline">
                  <TestTube2 className="h-3 w-3 mr-1" />
                  A/B Test
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-3 w-3 mr-1" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  SMS
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Call Notes */}
        <div className="space-y-2">
          <label className="flat-heading-sm text-gray-700">Call Notes</label>
          <Textarea
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            placeholder="Enter notes during the call..."
            className="min-h-[100px] text-sm"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Auto-saves to lead profile</span>
            <Button size="sm" variant="outline">
              <FileText className="h-3 w-3 mr-1" />
              Save Note
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-sm font-bold text-blue-600">3rd</div>
            <div className="text-xs text-blue-600">Attempt</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-sm font-bold text-green-600">78%</div>
            <div className="text-xs text-green-600">Connect Rate</div>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <div className="text-sm font-bold text-purple-600">Hot</div>
            <div className="text-xs text-purple-600">Lead Status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveCallInterface;
