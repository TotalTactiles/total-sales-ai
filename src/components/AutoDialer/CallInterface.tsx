
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Mail,
  Calendar,
  Phone,
  PhoneOff,
  Save,
  Send,
  Brain
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useIntegrations } from '@/hooks/useIntegrations';
import { toast } from 'sonner';

interface CallInterfaceProps {
  lead: Lead;
  callDuration: number;
  isMuted: boolean;
  onMuteToggle: () => void;
  onCallOutcome: (outcome: string) => void;
  aiAssistantActive: boolean;
}

const CallInterface: React.FC<CallInterfaceProps> = ({
  lead,
  callDuration,
  isMuted,
  onMuteToggle,
  onCallOutcome,
  aiAssistantActive
}) => {
  const [callNotes, setCallNotes] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [isHolding, setIsHolding] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');

  const { sendSMS, sendEmail } = useIntegrations();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendSMS = async () => {
    if (!smsMessage.trim()) return;
    
    const result = await sendSMS(lead.phone, smsMessage, lead.id, lead.name);
    if (result.success) {
      setSmsMessage('');
      toast.success('SMS sent successfully');
    }
  };

  const handleSendEmail = async () => {
    if (!emailDraft.trim()) return;
    
    const result = await sendEmail(
      lead.email, 
      `Follow-up from our call`, 
      emailDraft, 
      lead.id, 
      lead.name
    );
    if (result.success) {
      setEmailDraft('');
      toast.success('Email sent successfully');
    }
  };

  const handleAIAssist = (type: 'sms' | 'email' | 'notes') => {
    switch (type) {
      case 'sms':
        setSmsMessage(`Hi ${lead.name.split(' ')[0]}, thanks for the great conversation! As discussed, I'm sending you the information about our solution. Let me know if you have any questions. Best regards!`);
        break;
      case 'email':
        setEmailDraft(`Hi ${lead.name.split(' ')[0]},\n\nThank you for taking the time to speak with me today. I really enjoyed learning more about ${lead.company} and your current challenges.\n\nAs promised, I'm following up with the information we discussed. Based on your specific needs, I believe our solution can help you achieve significant time savings and ROI.\n\nNext steps:\n• Review the attached materials\n• Schedule a demo for your team\n• Discuss implementation timeline\n\nI'll follow up with you early next week, but please don't hesitate to reach out if you have any immediate questions.\n\nBest regards`);
        break;
      case 'notes':
        setCallNotes(`Call with ${lead.name} - ${new Date().toLocaleDateString()}\n\n• Duration: ${formatTime(callDuration)}\n• Company: ${lead.company}\n• Discussion points:\n  - \n  - \n  - \n\n• Next steps:\n  - \n  - \n\n• Follow-up required: \n• Decision timeline: \n• Budget confirmed: \n• Stakeholders involved: `);
        break;
    }
    toast.success(`AI ${type} draft generated`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column - Call Controls */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-green-600 mb-2">
                {formatTime(callDuration)}
              </div>
              <div className="text-sm text-gray-600">Call Duration</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                onClick={onMuteToggle}
                className="flex items-center gap-2"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>

              <Button
                variant={isHolding ? "destructive" : "outline"}
                onClick={() => setIsHolding(!isHolding)}
                className="flex items-center gap-2"
              >
                {isHolding ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {isHolding ? 'Resume' : 'Hold'}
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => onCallOutcome('connected')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Mark as Connected
              </Button>
              
              <Button
                onClick={() => onCallOutcome('voicemail')}
                variant="outline"
                className="w-full"
              >
                Left Voicemail
              </Button>
              
              <Button
                onClick={() => onCallOutcome('no_answer')}
                variant="outline"
                className="w-full"
              >
                No Answer
              </Button>
              
              <Button
                onClick={() => onCallOutcome('busy')}
                variant="outline"
                className="w-full"
              >
                Line Busy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Panel */}
        {aiAssistantActive && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                    <strong>Next Step:</strong> Schedule demo within 48 hours for best results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Center Column - Communication Tools */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Communication Tools</CardTitle>
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
          </CardHeader>
          <CardContent className="flex-1">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Call Notes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist('notes')}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    AI Template
                  </Button>
                </div>
                <Textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Take notes during your call..."
                  className="min-h-[300px] resize-none"
                />
                <Button onClick={() => toast.success('Notes saved')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </div>
            )}

            {activeTab === 'sms' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Send SMS to {lead.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist('sms')}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    AI Draft
                  </Button>
                </div>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your SMS message..."
                  className="min-h-[150px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {smsMessage.length}/160 characters
                  </span>
                  <Button onClick={handleSendSMS} disabled={!smsMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  * Includes auto opt-out compliance for Australia
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Send Email to {lead.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist('email')}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    AI Draft
                  </Button>
                </div>
                <Textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="Compose your follow-up email..."
                  className="min-h-[250px] resize-none"
                />
                <Button onClick={handleSendEmail} disabled={!emailDraft.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallInterface;
