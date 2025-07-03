
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
  Brain,
  Pause,
  Play,
  MoreHorizontal,
  Users,
  Settings
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

  const quickOutcomes = [
    { label: 'Interested - Schedule Demo', value: 'interested_demo', color: 'bg-green-600' },
    { label: 'Need More Info', value: 'need_info', color: 'bg-yellow-600' },
    { label: 'Not Interested', value: 'not_interested', color: 'bg-red-600' },
    { label: 'Call Back Later', value: 'callback', color: 'bg-blue-600' }
  ];

  const aiSuggestions = [
    { icon: '💰', text: 'Ask about budget timeline' },
    { icon: '📅', text: 'Offer demo slots for this week' },
    { icon: '🎯', text: 'Mention 30% time savings metric' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column - Lead Info & AI Assistant */}
      <div className="space-y-4">
        {/* Lead Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {lead.name.charAt(0)}
              </div>
              Lead Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-semibold text-lg">{lead.name}</div>
              <div className="text-gray-600">{lead.company}</div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{lead.phone}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {lead.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600">Last Contact:</div>
              <div className="text-sm">{lead.lastActivity}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{lead.score}%</div>
                <div className="text-xs text-gray-500">Lead Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lead.conversionLikelihood}%</div>
                <div className="text-xs text-gray-500">Conversion</div>
              </div>
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
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Talk Track:</div>
                <div className="text-sm text-blue-700">
                  Focus on ROI and time savings for {lead.company}
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-1">Objection Ready:</div>
                <div className="text-sm text-green-700">
                  "Budget concerns" - emphasize payment flexibility
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-800 mb-1">Next Step:</div>
                <div className="text-sm text-yellow-700">
                  Schedule demo within 48 hours for best results
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Center Column - Communication Tools */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Call Interface</CardTitle>
              <div className="text-3xl font-mono font-bold text-green-600">
                {formatTime(callDuration)}
              </div>
            </div>
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
                  className="min-h-[200px] resize-none"
                />
                <Button onClick={() => toast.success('Notes saved')} className="w-full">
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
                  className="min-h-[120px] resize-none"
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
                  className="min-h-[180px] resize-none"
                />
                <Button onClick={handleSendEmail} disabled={!emailDraft.trim()} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Call Controls & Outcomes */}
      <div className="space-y-4">
        {/* Call Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                {isHolding ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isHolding ? 'Resume' : 'Hold'}
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Keypad
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Transfer
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Conference
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Transfer
              </Button>
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onCallOutcome('ended')}
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Call
            </Button>
          </CardContent>
        </Card>

        {/* Quick Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickOutcomes.map((outcome) => (
              <Button
                key={outcome.value}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onCallOutcome(outcome.value)}
              >
                {outcome.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                <span className="text-lg">{suggestion.icon}</span>
                <span className="text-sm text-purple-800">{suggestion.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallInterface;
