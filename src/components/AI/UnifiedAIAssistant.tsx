
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Minimize2, 
  Target,
  Phone,
  Mail,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { agentConnectionService } from '@/services/ai/AgentConnectionService';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface UnifiedAIAssistantProps {
  context?: {
    workspace: string;
    currentLead?: any;
    isCallActive?: boolean;
    emailContext?: any;
    smsContext?: any;
    userRole?: string;
    userId?: string;
    companyId?: string;
  };
  onAction?: (action: string, data?: any) => void;
  className?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskId?: string;
}

const UnifiedAIAssistant: React.FC<UnifiedAIAssistantProps> = ({ 
  context, 
  onAction,
  className = '' 
}) => {
  const { user, profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickActions = [
    { 
      label: 'Analyze current lead', 
      icon: <Target className="h-3 w-3" />,
      action: 'analyze_lead'
    },
    { 
      label: 'Draft follow-up email', 
      icon: <Mail className="h-3 w-3" />,
      action: 'draft_email'
    },
    { 
      label: 'Summarize last call', 
      icon: <Phone className="h-3 w-3" />,
      action: 'summarize_call'
    },
    { 
      label: 'Get sales insights', 
      icon: <Lightbulb className="h-3 w-3" />,
      action: 'sales_insights'
    }
  ];

  useEffect(() => {
    // Initialize with a welcome message
    if (conversation.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      };
      setConversation([welcomeMessage]);
    }
  }, [context?.workspace, profile?.role, getWelcomeMessage]);

  const getWelcomeMessage = (): string => {
    const workspace = context?.workspace || 'dashboard';
    const role = profile?.role || 'sales_rep';
    
    const messages = {
      dashboard: {
        sales_rep: "Hi! I'm your AI sales assistant. I can help you analyze leads, draft emails, and provide sales insights.",
        manager: "Hello! I'm here to help you manage your team, analyze performance, and provide coaching insights.",
        developer: "Hi! I'm your AI assistant for monitoring agent health, debugging issues, and system analytics."
      },
      lead_details: {
        sales_rep: "I can help you analyze this lead, suggest next steps, and draft personalized outreach.",
        manager: "I can provide insights on this lead's potential and suggest coaching points for your team.",
        developer: "I can show you the AI analysis pipeline for this lead and any processing insights."
      },
      dialer: {
        sales_rep: "Ready to help with call preparation, real-time coaching, and post-call analysis.",
        manager: "I can provide call coaching insights and team performance analytics.",
        developer: "I can monitor call AI processing and troubleshoot any voice AI issues."
      }
    };

    return messages[workspace as keyof typeof messages]?.[role] || 
           "Hi! I'm your AI assistant. How can I help you today?";
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);

    try {
      await processUserMessage(userMessage.content);
    } catch (error) {
      logger.error('Error processing message:', error);
      toast.error('Failed to process your message');
    } finally {
      setIsProcessing(false);
    }
  };

  const processUserMessage = async (userInput: string) => {
    if (!user?.id || !profile?.company_id) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Authentication required. Please log in to use AI assistance.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
      return;
    }

    try {
      // Determine which agent to use based on user role and context
      const agentType = getAgentType();
      const taskType = determineTaskType(userInput);
      
      // Create the AI task
      const task = await agentConnectionService.createTask(
        agentType,
        taskType,
        {
          userInput,
          context: context || {},
          workspace: context?.workspace || 'dashboard',
          leadData: context?.currentLead,
          timestamp: new Date().toISOString()
        },
        user.id,
        profile.company_id
      );

      if (task) {
        const processingMessage: Message = {
          role: 'assistant',
          content: 'Processing your request...',
          timestamp: new Date(),
          taskId: task.id
        };
        setConversation(prev => [...prev, processingMessage]);

        // Poll for task completion
        pollTaskCompletion(task.id);
      } else {
        throw new Error('Failed to create AI task');
      }
    } catch (error) {
      logger.error('Error processing user message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    }
  };

  const getAgentType = (): string => {
    const role = profile?.role || 'sales_rep';
    
    switch (role) {
      case 'manager':
        return 'managerAgent_v1';
      case 'developer':
      case 'admin':
        return 'developerAgent_v1';
      case 'sales_rep':
      default:
        return 'salesAgent_v1';
    }
  };

  const determineTaskType = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('lead') || input.includes('prospect')) {
      return 'lead_analysis';
    } else if (input.includes('email') || input.includes('follow')) {
      return 'follow_up_generation';
    } else if (input.includes('call') || input.includes('conversation')) {
      return 'call_summary';
    } else if (input.includes('insight') || input.includes('analyz')) {
      return 'sales_insights';
    } else {
      return 'general_assistance';
    }
  };

  const pollTaskCompletion = async (taskId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_agent_tasks')
          .select('*')
          .eq('id', taskId)
          .single();

        if (error) throw error;

        if (data.status === 'completed') {
          const responseMessage: Message = {
            role: 'assistant',
            content: formatAIResponse(data.output_payload, data.task_type),
            timestamp: new Date(data.completed_at)
          };
          
          setConversation(prev => 
            prev.map(msg => 
              msg.taskId === taskId ? responseMessage : msg
            )
          );
        } else if (data.status === 'failed') {
          const errorMessage: Message = {
            role: 'assistant',
            content: `Sorry, I couldn't process your request: ${data.error_message || 'Unknown error'}`,
            timestamp: new Date()
          };
          
          setConversation(prev => 
            prev.map(msg => 
              msg.taskId === taskId ? errorMessage : msg
            )
          );
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          const timeoutMessage: Message = {
            role: 'assistant',
            content: 'Request timed out. Please try again.',
            timestamp: new Date()
          };
          
          setConversation(prev => 
            prev.map(msg => 
              msg.taskId === taskId ? timeoutMessage : msg
            )
          );
        }
      } catch (error) {
        logger.error('Error polling task completion:', error);
      }
    };

    poll();
  };

  const formatAIResponse = (outputPayload: any, taskType: string): string => {
    if (!outputPayload) return 'Task completed successfully.';

    switch (taskType) {
      case 'lead_analysis':
        return `**Lead Analysis Complete**\n\n` +
               `**Score:** ${outputPayload.score}/100\n` +
               `**Priority:** ${outputPayload.priority}\n` +
               `**Insights:** ${outputPayload.insights}\n` +
               `**Next Actions:** ${outputPayload.nextActions}`;
      
      case 'call_summary':
        return `**Call Summary**\n\n` +
               `${outputPayload.summary}\n\n` +
               `**Sentiment:** ${outputPayload.sentiment}\n` +
               `**Next Steps:**\n${outputPayload.nextSteps?.map((step: string) => `• ${step}`).join('\n')}`;
      
      case 'follow_up_generation':
        return `**Email Draft Generated**\n\n` +
               `**Subject:** ${outputPayload.subject}\n\n` +
               `**Body:**\n${outputPayload.body}`;
      
      default:
        return outputPayload.message || 'Task completed successfully.';
    }
  };

  const handleQuickAction = async (action: string) => {
    setMessage(getQuickActionMessage(action));
    setIsExpanded(true);
  };

  const getQuickActionMessage = (action: string): string => {
    switch (action) {
      case 'analyze_lead':
        return context?.currentLead 
          ? `Analyze this lead: ${context.currentLead.name}`
          : 'Analyze the current lead';
      case 'draft_email':
        return 'Draft a follow-up email for this prospect';
      case 'summarize_call':
        return 'Summarize the last call with this prospect';
      case 'sales_insights':
        return 'Provide sales insights and recommendations';
      default:
        return action;
    }
  };

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>

          <div className="absolute bottom-16 right-0 space-y-2 opacity-0 hover:opacity-100 transition-opacity">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="bg-white/90 backdrop-blur-sm border-gray-200 text-xs whitespace-nowrap"
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-96 h-96 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm">AI Assistant</CardTitle>
              <Badge variant="outline" className="text-xs">
                {profile?.role?.replace('_', ' ') || 'User'}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-80">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your AI assistant..."
              className="flex-1 min-h-[40px] max-h-[80px] resize-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isProcessing}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedAIAssistant;
