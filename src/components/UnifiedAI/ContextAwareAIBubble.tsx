
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  Minimize2, 
  X, 
  Lightbulb,
  Target,
  Phone,
  BarChart3,
  GraduationCap,
  Settings as SettingsIcon,
  MessageSquare
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AIContext {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions' | 'leads' | 'academy' | 'analytics' | 'settings';
  currentLead?: any;
  isCallActive?: boolean;
  callDuration?: number;
}

interface ContextAwareAIBubbleProps {
  context: AIContext;
  className?: string;
}

interface WorkspaceConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  greeting: string;
  quickActions: string[];
  color: string;
}

const ContextAwareAIBubble: React.FC<ContextAwareAIBubbleProps> = ({ context, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();

  // Context-aware configurations
  const workspaceConfigs: Record<string, WorkspaceConfig> = {
    dashboard: {
      name: 'Dashboard AI',
      icon: BarChart3,
      greeting: "Hi! I'm here to help with your sales overview and quick insights.",
      quickActions: ['Summarize pipeline', 'Next best actions', 'Performance tips'],
      color: 'from-blue-600 to-purple-600'
    },
    leads: {
      name: 'Lead Management AI',
      icon: Target,
      greeting: "Ready to help optimize your lead management and scoring.",
      quickActions: ['Score this lead', 'Suggest next steps', 'Draft outreach'],
      color: 'from-green-600 to-blue-600'
    },
    dialer: {
      name: 'Dialer AI',
      icon: Phone,
      greeting: "Your calling co-pilot is ready. Let's close some deals!",
      quickActions: ['Handle objection', 'Script suggestions', 'Call feedback'],
      color: 'from-orange-600 to-red-600'
    },
    'ai-agent': {
      name: 'AI Agent Coach',
      icon: Bot,
      greeting: "Optimizing your AI agent performance and automation strategies.",
      quickActions: ['Improve scripts', 'Analyze performance', 'Queue optimization'],
      color: 'from-purple-600 to-pink-600'
    },
    analytics: {
      name: 'Analytics AI',
      icon: BarChart3,
      greeting: "Let's dive into your data and uncover performance insights.",
      quickActions: ['Conversion patterns', 'Performance gaps', 'Trend analysis'],
      color: 'from-indigo-600 to-purple-600'
    },
    academy: {
      name: 'Learning Coach',
      icon: GraduationCap,
      greeting: "Your personal sales learning companion. What would you like to master today?",
      quickActions: ['Study recommendations', 'Progress check', 'Learning streak'],
      color: 'from-emerald-600 to-teal-600'
    },
    settings: {
      name: 'Settings Assistant',
      icon: SettingsIcon,
      greeting: "I'll help you configure your sales tools and preferences.",
      quickActions: ['Explain setting', 'Best practices', 'Integration help'],
      color: 'from-gray-600 to-slate-600'
    }
  };

  // Determine current workspace from path
  const getCurrentWorkspace = () => {
    const path = location.pathname;
    if (path.includes('/lead-management') || path.includes('/leads')) return 'leads';
    if (path.includes('/ai-agent')) return 'ai-agent';
    if (path.includes('/dialer')) return 'dialer';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/academy')) return 'academy';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const currentWorkspace = getCurrentWorkspace();
  const config = workspaceConfigs[currentWorkspace] || workspaceConfigs.dashboard;

  // Generate contextual response based on workspace
  const generateContextualResponse = async (userMessage: string): Promise<string> => {
    const workspace = currentWorkspace;
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = {
      dashboard: [
        "Based on your pipeline, I recommend focusing on the 3 leads with highest scores - they're 78% likely to convert.",
        "Your call-to-meeting rate is up 15% this week! The key seems to be your new opening script.",
        "I notice you have 5 leads that haven't been contacted in 48+ hours. Speed-to-lead is critical - want me to prioritize them?"
      ],
      leads: [
        "This lead shows strong buying signals - high email engagement and website visits. I'd recommend a direct call approach.",
        "Based on similar companies, mentioning ROI within the first 3 minutes increases close rate by 34%.",
        "Their LinkedIn activity suggests they're researching solutions right now. Perfect timing for your outreach."
      ],
      dialer: [
        "For price objections, try: 'I understand cost is important. Let me show you how this pays for itself in 90 days.' - 67% success rate.",
        "Your connection rate improves by 23% when you call between 10-11 AM. Want me to optimize your queue timing?",
        "I've analyzed your best calls - you close 40% more when you ask discovery questions first, then present value."
      ],
      'ai-agent': [
        "Your AI agent's connect rate is 34% above industry average. The key is your personalized opening scripts.",
        "I recommend testing a warmer tone for enterprise leads - it's showing 28% better engagement in A/B tests.",
        "Your automation saved 12 hours this week. Ready to optimize the next level of your workflows?"
      ],
      analytics: [
        "Your conversion rate drops 45% after Tuesday - consider front-loading your week with high-priority calls.",
        "Leads from webinars convert 3x better than cold outreach. Want me to analyze why?",
        "Your pipeline velocity increased 23% since implementing AI scoring. Here's what's driving the improvement..."
      ],
      academy: [
        "You're on a 7-day learning streak! Your objection handling course is 67% complete - want to finish it today?",
        "Based on your recent calls, I recommend the 'Enterprise Discovery Questions' module - it addresses a gap I noticed.",
        "Great progress! Your course completion rate puts you in the top 15% of sales reps. Keep it up!"
      ],
      settings: [
        "For optimal performance, I recommend enabling auto-sync with your CRM and setting call reminders to 5 minutes.",
        "Your current email template has a 12% response rate. Want me to suggest improvements based on top performers?",
        "Your integration with the dialer is working perfectly - all call logs are syncing automatically."
      ]
    };

    const workspaceResponses = responses[workspace as keyof typeof responses] || responses.dashboard;
    return workspaceResponses[Math.floor(Math.random() * workspaceResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await generateContextualResponse(message);
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: response,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      const errorMessage = {
        role: 'assistant' as const,
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setMessage(action);
    await handleSendMessage();
  };

  // Reset conversation when workspace changes
  useEffect(() => {
    setConversation([]);
  }, [currentWorkspace]);

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(true)}
            className={`h-14 w-14 rounded-full bg-gradient-to-r ${config.color} hover:scale-110 transition-transform shadow-lg`}
          >
            <config.icon className="h-6 w-6 text-white" />
          </Button>

          {/* Context indicator */}
          <div className="absolute -top-2 -left-2">
            <Badge className="bg-white text-gray-700 text-xs shadow-sm">
              {config.name.split(' ')[0]}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-96 h-[500px] shadow-2xl border-0">
        <CardHeader className={`pb-3 bg-gradient-to-r ${config.color} text-white rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <config.icon className="h-5 w-5" />
              <CardTitle className="text-sm font-medium">{config.name}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-white/90 mt-1">{config.greeting}</p>
        </CardHeader>

        <CardContent className="flex flex-col h-[420px] p-0">
          {/* Quick Actions */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex gap-2 flex-wrap">
              {config.quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="text-xs h-7"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {conversation.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <config.icon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">{config.name} Ready</p>
                <p className="text-xs mt-1">Try the quick actions above or ask me anything!</p>
              </div>
            )}
            
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Ask ${config.name.split(' ')[0]} AI...`}
                className="flex-1 min-h-[40px] max-h-[80px] resize-none text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                size="sm"
                className={`bg-gradient-to-r ${config.color}`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextAwareAIBubble;
