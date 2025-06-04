
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Mail,
  Brain,
  User,
  Building,
  Star,
  Clock,
  Send,
  Save,
  PhoneForwarded,
  Grid3X3,
  Users,
  Pause,
  Play,
  Hash,
  X
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface MockCallInterfaceProps {
  lead: Lead;
  onEndCall: () => void;
}

const MockCallInterface: React.FC<MockCallInterfaceProps> = ({
  lead,
  onEndCall
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [showNumberpad, setShowNumberpad] = useState(false);

  // Mock call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    toast.success('Call ended');
    onEndCall();
  };

  const handleTransfer = () => {
    toast.info('Call transfer initiated');
  };

  const handleAITransfer = () => {
    toast.info('AI assistant taking over call');
  };

  const handleConferenceCall = () => {
    toast.info('Conference call initiated');
  };

  const handleNumberpadClick = (number: string) => {
    toast.info(`DTMF tone: ${number}`);
  };

  const handleAIDraft = (type: 'sms' | 'email' | 'notes') => {
    switch (type) {
      case 'sms':
        setSmsMessage(`Hi ${lead.name.split(' ')[0]}, thanks for the great conversation! I'll send you the information we discussed. Let me know if you have any questions.`);
        break;
      case 'email':
        setEmailDraft(`Hi ${lead.name.split(' ')[0]},\n\nThank you for taking the time to speak with me today about ${lead.company}'s needs.\n\nAs discussed, I'll follow up with:\n• Product information\n• Pricing details\n• Next steps\n\nI'll be in touch within 24 hours.\n\nBest regards`);
        break;
      case 'notes':
        setCallNotes(`Call with ${lead.name} - ${new Date().toLocaleDateString()}\n\nDuration: ${formatTime(callDuration)}\nCompany: ${lead.company}\n\nKey Points:\n• [Add discussion points]\n• [Add pain points]\n• [Add requirements]\n\nNext Steps:\n• [Add follow-up actions]\n• [Add timeline]\n\nDecision Timeline: \nBudget: \nStakeholders: `);
        break;
    }
    toast.success(`AI ${type} draft generated`);
  };

  const NumberpadDialog = () => (
    <div className="absolute top-4 right-4 bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Dial Pad</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNumberpad(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="sm"
            className="h-12 w-12"
            onClick={() => handleNumberpadClick(num)}
          >
            {num}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 relative">
      {/* Call Status Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">LIVE CALL</span>
            </div>
            <div className="text-2xl font-mono font-bold">
              {formatTime(callDuration)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-90">Connected to {lead.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-160px)]">
        {/* Left Panel - Lead Profile (matching LeadWorkspaceLeft) */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Lead Details</h2>

            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{lead.name}</h3>
                <p className="text-slate-600">{lead.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${lead.status === 'qualified' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {lead.status}
                  </Badge>
                  <Badge variant="outline" className={`${lead.priority === 'high' ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-50'}`}>
                    {lead.priority}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>Last contact: {new Date(lead.lastContact).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Score and Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {lead.score}%
                </div>
                <div className="text-xs text-slate-500">Lead Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {lead.conversionLikelihood}%
                </div>
                <div className="text-xs text-slate-500">Conversion</div>
              </div>
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium">AI Assistant</h4>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Talk Track:</strong> Focus on ROI and time savings for {lead.company}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Objection Ready:</strong> "Budget concerns" - emphasize payment flexibility
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Next Step:</strong> Schedule demo within 48 hours for best conversion
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Notes & Communication */}
        <div className="flex-1 bg-white">
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'notes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </Button>
              <Button
                variant={activeTab === 'sms' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('sms')}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                SMS
              </Button>
              <Button
                variant={activeTab === 'email' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('email')}
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
            </div>
          </div>

          <div className="p-4 h-[calc(100%-80px)]">
            {activeTab === 'notes' && (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Call Notes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIDraft('notes')}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    AI Template
                  </Button>
                </div>
                <Textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Take notes during your call..."
                  className="h-[calc(100%-100px)] resize-none"
                />
                <Button className="mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </div>
            )}

            {activeTab === 'sms' && (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Send SMS to {lead.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIDraft('sms')}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    AI Draft
                  </Button>
                </div>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your SMS message..."
                  className="h-40 resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {smsMessage.length}/160 characters
                  </span>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Send Email to {lead.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIDraft('email')}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    AI Draft
                  </Button>
                </div>
                <Textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="Compose your follow-up email..."
                  className="h-60 resize-none"
                />
                <Button className="mt-4">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Call Controls */}
        <div className="w-80 bg-white border-l p-4 relative">
          <h3 className="font-medium mb-4">Call Controls</h3>
          
          {/* Primary Call Controls */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>

              <Button
                variant={isOnHold ? "destructive" : "outline"}
                onClick={() => setIsOnHold(!isOnHold)}
                className="flex items-center gap-2"
              >
                {isOnHold ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isOnHold ? 'Resume' : 'Hold'}
              </Button>
            </div>

            {/* Dialer Controls */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleTransfer}
                className="flex items-center gap-2"
              >
                <PhoneForwarded className="h-4 w-4" />
                Transfer
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowNumberpad(true)}
                className="flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Keypad
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleAITransfer}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                AI Transfer
              </Button>

              <Button
                variant="outline"
                onClick={handleConferenceCall}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Conference
              </Button>
            </div>

            <Button
              onClick={handleEndCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <PhoneOff className="h-5 w-5 mr-2" />
              End Call
            </Button>
          </div>

          {/* Call Outcome Quick Actions */}
          <div className="space-y-2 mb-6">
            <h4 className="text-sm font-medium text-gray-700">Quick Outcomes</h4>
            <Button variant="outline" size="sm" className="w-full">
              Interested - Schedule Demo
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Need More Info
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Not Interested
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Call Back Later
            </Button>
          </div>

          {/* AI Suggestions */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">AI Suggestions</h4>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded text-xs">
                💡 Ask about their current solution timeline
              </div>
              <div className="p-2 bg-green-50 rounded text-xs">
                🎯 Mention the 30% time savings metric
              </div>
              <div className="p-2 bg-yellow-50 rounded text-xs">
                📅 Offer demo slots for this week
              </div>
            </div>
          </div>

          {/* Numberpad Dialog */}
          {showNumberpad && <NumberpadDialog />}
        </div>
      </div>
    </div>
  );
};

export default MockCallInterface;
