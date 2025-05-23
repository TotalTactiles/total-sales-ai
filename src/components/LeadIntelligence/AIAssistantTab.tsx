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
import { Lead } from '@/types/lead';

interface AIAssistantTabProps {
  lead: Lead;
  voiceEnabled: boolean;
  rationaleMode: boolean;
  onRationaleModeChange: (enabled: boolean) => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  message: string;
  timestamp: string;
}

const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  lead,
  voiceEnabled,
  rationaleMode,
  onRationaleModeChange
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: `Hi! I'm your AI assistant for ${lead.name} from ${lead.company}. I've analyzed their behavior and can help with strategy, content, or answer questions about this lead.`,
      timestamp: '2 minutes ago'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const { trackEvent, trackClick } = useUsageTracking();

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatMessage,
      timestamp: 'now'
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsTyping(true);

    trackEvent({
      feature: 'ai_assistant_chat',
      action: 'message_sent',
      context: 'lead_intelligence',
      metadata: { 
        leadId: lead.id, 
        messageLength: chatMessage.length,
        voiceEnabled
      }
    });

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateAIResponse(chatMessage),
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
      title: 'Analyze Lead Behavior',
      description: 'Get insights into engagement patterns',
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
      title: 'Draft Follow-up',
      description: 'Create personalized outreach message',
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
      title: 'Conversion Strategy',
      description: 'Get closing recommendations',
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
    <div className="p-6 h-full flex flex-col">
      {/* Header with Settings */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">AI Assistant</h3>
            <p className="text-sm text-slate-600">Specialized for {lead.name}</p>
          </div>
        </div>
        
        <Card className="p-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Voice Mode</label>
              <div className="flex items-center gap-1">
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4 text-blue-600" />
                ) : (
                  <VolumeX className="h-4 w-4 text-slate-400" />
                )}
                <Switch checked={voiceEnabled} disabled />
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-2">
              <label className="text-sm">Show Reasoning</label>
              <Switch 
                checked={rationaleMode} 
                onCheckedChange={onRationaleModeChange}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <UsageTracker
            key={index}
            feature="ai_quick_action"
            context={action.title.toLowerCase().replace(' ', '_')}
          >
            <Card className="cursor-pointer hover:shadow-sm transition-shadow" onClick={action.action}>
              <CardContent className="p-4 text-center">
                <action.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                <p className="text-xs text-slate-600">{action.description}</p>
              </CardContent>
            </Card>
          </UsageTracker>
        ))}
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Conversation
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.message}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-200' : 'text-slate-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Ask me anything about ${lead.name}...`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Stats */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-slate-600">AI Confidence:</span>
              <span className="font-medium ml-2">94%</span>
            </div>
            <div className="text-sm">
              <span className="text-slate-600">Suggestions Used:</span>
              <span className="font-medium ml-2">8/12</span>
            </div>
            <div className="text-sm">
              <span className="text-slate-600">Success Rate:</span>
              <span className="font-medium ml-2">87%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantTab;
