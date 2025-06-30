
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Clock,
  User,
  Building
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface LiveCallPanelProps {
  currentLead: Lead | null;
  isCallActive: boolean;
  callDuration: number;
  onCallAnswered: () => void;
  onCallMissed: () => void;
  onEndCall: () => void;
}

const LiveCallPanel: React.FC<LiveCallPanelProps> = ({
  currentLead,
  isCallActive,
  callDuration,
  onCallAnswered,
  onCallMissed,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [callNotes, setCallNotes] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentLead) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Phone className="h-16 w-16 text-gray-300 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-600">No Active Call</h3>
              <p className="text-sm text-gray-500">Select a lead to start dialing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6 space-y-6">
        {/* Call Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">
              {isCallActive ? 'Active Call' : 'Dialing...'}
            </h3>
            {isCallActive && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(callDuration)}
              </Badge>
            )}
          </div>
        </div>

        {/* Lead Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">{currentLead.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-3 w-3" />
                <span>{currentLead.company}</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <div>📞 {currentLead.phone}</div>
            <div>📧 {currentLead.email}</div>
          </div>
        </div>

        {/* Call Controls */}
        {!isCallActive ? (
          <div className="flex gap-3 justify-center">
            <Button onClick={onCallAnswered} className="bg-green-600 hover:bg-green-700">
              <PhoneCall className="h-4 w-4 mr-2" />
              Answered
            </Button>
            <Button onClick={onCallMissed} variant="outline">
              <PhoneOff className="h-4 w-4 mr-2" />
              No Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button variant="destructive" onClick={onEndCall}>
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Call Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Call Notes</label>
          <Textarea
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            placeholder="Enter notes during the call..."
            className="min-h-[100px] text-sm"
          />
          <div className="text-xs text-gray-500">Auto-saves to lead profile</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCallPanel;
