import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Mail,
  User,
  Building,
  Clock,
  Send,
  Save,
  Brain,
  X,
  Minimize2,
  Star,
  ThumbsUp,
  ThumbsDown,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import UnifiedAIAssistant from '../UnifiedAI/UnifiedAIAssistant';

interface DialerOverlayProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onEndCall: () => void;
}

const DialerOverlay: React.FC<DialerOverlayProps> = ({
  lead,
  isOpen,
  onClose,
  onEndCall
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [sentimentPulse, setSentimentPulse] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [showAiFeedback, setShowAiFeedback] = useState(false);

  // Call timer
  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  // Mock sentiment detection
  useEffect(() => {
    const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
    const interval = setInterval(() => {
      setSentimentPulse(sentiments[Math.floor(Math.random() * sentiments.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setShowAiFeedback(true);
    setTimeout(() => {
      onEndCall();
      onClose();
    }, 3000);
  };

  const handleAIAction = (action: string, data?: any) => {
    switch (action) {
      case 'ai_response':
        if (data?.response) {
          // Handle AI response during call
          toast.success(`AI: ${data.response}`);
        }
        break;
      case 'suggest_close':
        toast.info('🎯 AI suggests moving to close now - perfect timing!');
        break;
      case 'show_objection_scripts':
        // Could open a modal with objection handling scripts
        toast.info('📋 Opening objection handling scripts...');
        break;
      default:
        logger.info('Dialer AI Action:', action, data);
    }
  };

  const getSentimentColor = () => {
    switch (sentimentPulse) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-[90%] h-[90%] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Call Status Header */}
        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-medium">LIVE CALL</span>
            </div>
            <div className="text-2xl font-mono font-bold">
              {formatTime(callDuration)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">with {lead.name}</span>
              <Badge variant="outline" className="bg-white text-green-600">
                {lead.priority} priority
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sentiment Pulse */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Sentiment:</span>
              <div className={`w-3 h-3 rounded-full ${getSentimentColor()}`}></div>
              <span className="text-sm capitalize">{sentimentPulse}</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* AI Nudge Line */}
        <div className="bg-blue-50 border-b p-2 text-center">
          <p className="text-sm text-blue-800">
            💡 AI Insight: {lead.conversionLikelihood}% conversion probability - Focus on timeline and ROI
          </p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Lead Details */}
          <div className="w-80 bg-white border-r overflow-y-auto">
            {/* Lead Info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{lead.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Building className="h-3 w-3" />
                    {lead.company}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{lead.score}%</div>
                  <div className="text-xs text-gray-500">Lead Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{lead.conversionLikelihood}%</div>
                  <div className="text-xs text-gray-500">Conversion</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant={lead.priority === 'high' ? 'destructive' : 'secondary'}>
                  {lead.priority}
                </Badge>
                <Badge variant="outline">{lead.status}</Badge>
                {lead.speedToLead !== undefined && lead.speedToLead < 15 && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Fresh {lead.speedToLead}min
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Center Panel - Tabbed Interface */}
          <div className="flex-1 bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 m-4 mb-0">
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 p-4 overflow-y-auto">
                <TabsContent value="notes" className="h-full m-0">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Call Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)]">
                      <Textarea
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                        placeholder="AI will auto-generate call summary with timestamps and next steps..."
                        className="h-[calc(100%-60px)] resize-none"
                      />
                      <Button className="mt-4">
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sms" className="h-full m-0">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Send SMS (Twilio AU)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="Type your SMS message..."
                        className="h-40 resize-none mb-4"
                      />
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                          {smsMessage.length}/140 chars
                        </span>
                        <span className="text-xs text-green-600">
                          Auto-adds: "Reply STOP to unsubscribe"
                        </span>
                      </div>
                      <Button className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send SMS
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="email" className="h-full m-0">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Send Email (Gmail/Outlook)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        placeholder="Compose your follow-up email..."
                        className="h-60 resize-none mb-4"
                      />
                      <Button className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - Call Controls */}
          <div className="w-80 bg-white border-l p-4">
            <h3 className="font-medium mb-4">Call Controls</h3>
            
            {/* Primary Controls */}
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
                  {isOnHold ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {isOnHold ? 'Resume' : 'Hold'}
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

            {/* Quick Outcomes */}
            <div className="space-y-2 mb-6">
              <h4 className="text-sm font-medium text-gray-700">Quick Outcomes</h4>
              <Button variant="outline" size="sm" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Interested - Schedule Demo
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Follow Up Next Week
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <X className="h-4 w-4 mr-2" />
                Not Interested
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Information
              </Button>
            </div>
          </div>
        </div>

        {/* AI Feedback Modal */}
        {showAiFeedback && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Rate AI Assistance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">How helpful was the AI during this call?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button key={rating} variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="Optional feedback (e.g., 'Too aggressive', 'Perfect timing')"
                  className="h-20"
                />
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setShowAiFeedback(false);
                      toast.success('Thank you for your feedback!');
                    }}
                  >
                    Submit Feedback
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAiFeedback(false)}
                  >
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Unified AI Assistant - Positioned for call context */}
      <UnifiedAIAssistant
        context={{
          workspace: 'dialer',
          currentLead: lead,
          isCallActive: true,
          callDuration,
          currentSentiment: sentimentPulse
        }}
        onAction={handleAIAction}
        className="!fixed !bottom-6 !right-6 !z-60"
      />
    </div>
  );
};

export default DialerOverlay;
