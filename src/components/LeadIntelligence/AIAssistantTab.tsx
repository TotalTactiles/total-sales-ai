
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Volume2, 
  VolumeX, 
  Settings, 
  MessageSquare,
  Send,
  Lightbulb,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import UsageTracker from '@/components/AIBrain/UsageTracker';
import VoiceAssistant from './VoiceAssistant';
import { Lead } from '@/types/lead';

interface AIAssistantTabProps {
  lead: Lead;
  voiceEnabled: boolean;
  rationaleMode: boolean;
  onRationaleModeChange: (enabled: boolean) => void;
  onLeadUpdate?: (field: string, value: any) => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'voice';
  message: string;
  timestamp: string;
  action?: string;
}

const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  lead,
  voiceEnabled,
  rationaleMode,
  onRationaleModeChange,
  onLeadUpdate
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: `Hi! I'm your AI assistant for ${lead.name} from ${lead.company}. I've analyzed their behavior and can help with strategy, content, or answer questions about this lead. You can also use voice commands!`,
      timestamp: '2 minutes ago'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(voiceEnabled);

  const { trackEvent, trackClick } = useUsageTracking();

  const handleVoiceToggle = () => {
    setVoiceModeEnabled(!voiceModeEnabled);
    trackClick('voice_controls', voiceModeEnabled ? 'disable' : 'enable');
  };

  const handleVoiceCommand = (command: string) => {
    // Add voice command to chat history
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'voice',
      message: command,
      timestamp: 'now'
    };

    setChatHistory(prev => [...prev, voiceMessage]);
    
    // Process as regular chat message
    handleSendMessage(command, true);
  };

  const handleVoiceActionExecute = (action: { type: string; data: any }) => {
    switch (action.type) {
      case 'update_lead_field':
        if (onLeadUpdate) {
          onLeadUpdate(action.data.field, action.data.value);
          toast.success(`Updated ${action.data.field} successfully`);
        }
        break;
      case 'add_note':
        // This would integrate with the Notes tab
        toast.success('Note added successfully');
        break;
      case 'initiate_call':
        toast.info('Opening dialer...');
        break;
      case 'compose_email':
        toast.info('Opening email composer...');
        break;
      case 'create_reminder':
        toast.success('Reminder created successfully');
        break;
      case 'schedule_meeting':
        toast.info('Opening calendar...');
        break;
      case 'analyze_lead':
        // Trigger lead analysis
        const analysisMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          message: `Analyzing ${lead.name}'s behavior and engagement patterns. Based on their ${lead.score}% score and recent interactions, I recommend focusing on ROI-driven messaging and scheduling a demo call within the next 48 hours.`,
          timestamp: 'now'
        };
        setChatHistory(prev => [...prev, analysisMessage]);
        break;
    }
  };

  const handleSendMessage = async (messageText?: string, isVoiceCommand = false) => {
    const textToSend = messageText || chatMessage;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: isVoiceCommand ? 'voice' : 'user',
      message: textToSend,
      timestamp: 'now'
    };

    if (!isVoiceCommand) {
      setChatHistory(prev => [...prev, userMessage]);
      setChatMessage('');
    }
    
    setIsTyping(true);

    trackEvent({
      feature: 'ai_assistant_chat',
      action: isVoiceCommand ? 'voice_message_sent' : 'message_sent',
      context: 'lead_intelligence',
      metadata: { 
        leadId: lead.id, 
        messageLength: textToSend.length,
        voiceEnabled: voiceModeEnabled
      }
    });

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateAIResponse(textToSend),
        timestamp: 'now'
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('strategy') || message.includes('approach')) {
      return `Based on ${lead.name}'s behavior, I recommend a value-focused approach. They've downloaded pricing info 3x, suggesting budget approval. Focus on ROI and quick implementation timeline. Their industry (construction) typically responds well to concrete numbers and fast deployment stories.`;
    }
    
    if (message.includes('email') || message.includes('message')) {
      return `For ${lead.name}, I suggest a direct approach with specific ROI figures. Construction companies appreciate concrete data. Include a case study from a similar-sized company and offer a brief call to discuss implementation. Avoid generic language - be specific about their potential savings.`;
    }
    
    if (message.includes('next') || message.includes('follow')) {
      return `Next steps for ${lead.company}: 1) Send ROI calculator with their specific numbers, 2) Share construction industry case study, 3) Propose 15-min call this week to discuss Q1 implementation. Their engagement pattern shows they're in active buying mode.`;
    }
    
    return `I understand you're asking about ${lead.name}. They're showing strong buying signals with a ${lead.name.includes('Michael') ? '87' : '74'}% engagement score. Their last interaction was positive, and I recommend maintaining momentum with personalized, value-focused outreach. What specific aspect would you like me to help with?`;
  };

  const quickActions = [
    {
      icon: Target,
      title: 'Analyze',
      description: 'Behavior insights',
      action: () => {
        trackClick('ai_quick_action', 'analyze_behavior');
        const analysis: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          message: `${lead.name} shows high intent signals: 3x pricing page visits, 2x case study downloads, and 45-minute discovery call completion. Engagement score: 87%. Recommended action: Send ROI calculator and schedule follow-up call within 48 hours for optimal conversion likelihood.`,
          timestamp: 'now'
        };
        setChatHistory(prev => [...prev, analysis]);
      }
    },
    {
      icon: MessageSquare,
      title: 'Draft',
      description: 'Follow-up message',
      action: () => {
        trackClick('ai_quick_action', 'draft_followup');
        const draft: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          message: `Here's a personalized follow-up for ${lead.name}:\n\n"Hi ${lead.name.split(' ')[0]}, I ran the numbers for ${lead.company} based on our conversation. You could save approximately $45,000 annually with our solution. I've prepared a 15-minute overview showing exactly how this works for construction companies your size. Are you available Thursday at 2 PM for a quick call?"\n\nThis approach works because it's specific, time-bound, and addresses their main concern (ROI).`,
          timestamp: 'now'
        };
        setChatHistory(prev => [...prev, draft]);
      }
    },
    {
      icon: TrendingUp,
      title: 'Strategy',
      description: 'Next steps',
      action: () => {
        trackClick('ai_quick_action', 'conversion_strategy');
        const strategy: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          message: `Conversion strategy for ${lead.company}:\n\n1. **Timing**: Strike while hot - they're in active research mode\n2. **Approach**: Lead with ROI data and implementation speed\n3. **Social Proof**: Share ABC Construction case study (similar size/industry)\n4. **Close**: Offer pilot program to reduce risk\n5. **Timeline**: Aim for decision within 2 weeks while interest is high\n\nSuccess probability: 78% based on current engagement patterns.`,
          timestamp: 'now'
        };
        setChatHistory(prev => [...prev, strategy]);
      }
    }
  ];

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header with Controls */}
      <div className="mb-3 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold">AI Assistant</h3>
            <p className="text-xs text-slate-600">Specialized for {lead.name}</p>
          </div>
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded mb-2">
          <div className="flex items-center gap-1">
            <label>Reasoning</label>
            <Switch 
              checked={rationaleMode} 
              onCheckedChange={onRationaleModeChange}
            />
          </div>
        </div>

        {/* Voice Assistant Integration */}
        <VoiceAssistant
          lead={lead}
          voiceEnabled={voiceModeEnabled}
          onVoiceToggle={handleVoiceToggle}
          onVoiceCommand={handleVoiceCommand}
          onActionExecute={handleVoiceActionExecute}
        />
      </div>

      {/* Quick Actions - Compact Grid */}
      <div className="grid grid-cols-1 gap-2 mb-3 shrink-0">
        {quickActions.map((action, index) => (
          <UsageTracker
            key={index}
            feature="ai_quick_action"
            context={action.title.toLowerCase().replace(' ', '_')}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={action.action}
              className="h-10 text-xs justify-start px-3"
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon className="h-3 w-3 shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="font-medium text-xs">{action.title}</span>
                  <span className="text-slate-500 text-xs leading-none">{action.description}</span>
                </div>
              </div>
            </Button>
          </UsageTracker>
        ))}
      </div>

      {/* Chat Area - Takes remaining space */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1 text-sm">
            <MessageSquare className="h-4 w-4" />
            AI Conversation
            {voiceModeEnabled && (
              <Badge variant="outline" className="ml-auto text-xs">
                Voice Enabled
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-2 min-h-0">
          {/* Chat History - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-2">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' || message.type === 'voice' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2 rounded text-xs ${
                    message.type === 'user' ? 'bg-blue-600 text-white' :
                    message.type === 'voice' ? 'bg-purple-600 text-white' :
                    'bg-slate-100 text-slate-800'
                  }`}
                >
                  {message.type === 'voice' && (
                    <div className="flex items-center gap-1 mb-1">
                      <Volume2 className="h-2 w-2" />
                      <span className="text-xs opacity-75">Voice Command</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' || message.type === 'voice' ? 
                    (message.type === 'voice' ? 'text-purple-200' : 'text-blue-200') : 
                    'text-slate-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 p-2 rounded">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input - Fixed at bottom */}
          <div className="flex gap-1 shrink-0">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={voiceModeEnabled ? `Ask about ${lead.name} or use voice...` : `Ask about ${lead.name}...`}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="text-xs h-8"
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={!chatMessage.trim()}
              size="sm"
              className="h-8 px-2"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Stats - Fixed at bottom */}
      <Card className="mt-2 shrink-0">
        <CardContent className="p-2">
          <div className="flex justify-between text-xs">
            <div>
              <span className="text-slate-600">Confidence:</span>
              <span className="font-medium ml-1">94%</span>
            </div>
            <div>
              <span className="text-slate-600">Used:</span>
              <span className="font-medium ml-1">8/12</span>
            </div>
            <div>
              <span className="text-slate-600">Success:</span>
              <span className="font-medium ml-1">87%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantTab;
