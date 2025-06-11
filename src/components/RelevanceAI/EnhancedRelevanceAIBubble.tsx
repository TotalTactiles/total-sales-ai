
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Minimize2, 
  Zap, 
  MessageSquare,
  Lightbulb,
  Target,
  FileText,
  Phone,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';
import { useRelevanceAITriggers } from '@/hooks/useRelevanceAITriggers';
import { relevanceAIAgent } from '@/services/relevance/RelevanceAIAgentService';
import { toast } from 'sonner';

interface EnhancedRelevanceAIBubbleProps {
  context?: {
    workspace: string;
    currentLead?: any;
    isCallActive?: boolean;
    callDuration?: number;
  };
  className?: string;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskId?: string;
  taskStatus?: 'pending' | 'completed' | 'failed';
}

const EnhancedRelevanceAIBubble: React.FC<EnhancedRelevanceAIBubbleProps> = ({ 
  context, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { usageStats } = useRelevanceAI();
  const {
    triggerLeadAnalysis,
    triggerFollowUpGeneration,
    triggerObjectionHandling,
    triggerEmailDraft
  } = useRelevanceAITriggers();

  const quickActions = [
    { 
      label: 'Analyze this lead', 
      icon: <Target className="h-3 w-3" />,
      action: 'lead_analysis',
      disabled: !context?.currentLead
    },
    { 
      label: 'Draft follow-up email', 
      icon: <FileText className="h-3 w-3" />,
      action: 'email_draft',
      disabled: !context?.currentLead
    },
    { 
      label: 'Handle objection', 
      icon: <Lightbulb className="h-3 w-3" />,
      action: 'objection_handling',
      disabled: false
    },
    { 
      label: 'Summarize call', 
      icon: <Phone className="h-3 w-3" />,
      action: 'call_summary',
      disabled: !context?.isCallActive
    }
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!message.trim() || isProcessing) return;

    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);

    try {
      // Determine if this is a specific task request
      const taskType = detectTaskType(message);
      let response: string;
      let taskId: string | undefined;

      if (taskType) {
        // Execute specific agent task
        const task = await executeAgentTask(taskType, message);
        taskId = task?.id;
        response = task?.output_payload?.response || task?.error_message || 'Task completed';
      } else {
        // General AI response
        response = await relevanceAIAgent.executeAgentTask(
          'salesAgent_v1',
          'text_generation',
          {
            prompt: message,
            context: {
              ...context,
              conversationHistory: conversation.slice(-5)
            }
          },
          'current_user_id', // This would come from auth context
          'current_company_id' // This would come from profile
        ).then(task => task.output_payload?.response || 'I apologize, but I encountered an issue processing your request.');
      }

      const assistantMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        taskId,
        taskStatus: taskId ? 'completed' : undefined
      };
      
      setConversation(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const errorMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        taskStatus: 'failed'
      };
      
      setConversation(prev => [...prev, errorMessage]);
      toast.error('AI request failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = async (action: string, label: string) => {
    if (isProcessing) return;

    setIsExpanded(true);
    setIsProcessing(true);

    try {
      const task = await executeAgentTask(action, label);
      
      const actionMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: label,
        timestamp: new Date()
      };

      const responseMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: task?.output_payload?.response || 'Task completed successfully',
        timestamp: new Date(),
        taskId: task?.id,
        taskStatus: task?.status === 'completed' ? 'completed' : task?.status === 'failed' ? 'failed' : 'pending'
      };

      setConversation(prev => [...prev, actionMessage, responseMessage]);

    } catch (error) {
      toast.error(`Failed to execute: ${label}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAgentTask = async (taskType: string, content: string) => {
    switch (taskType) {
      case 'lead_analysis':
        return await triggerLeadAnalysis(context?.currentLead?.id, context?.currentLead);
      
      case 'email_draft':
        return await triggerEmailDraft(context?.currentLead?.email, {
          lead: context?.currentLead,
          workspace: context?.workspace
        });
      
      case 'objection_handling':
        return await triggerObjectionHandling(content, {
          lead: context?.currentLead,
          workspace: context?.workspace
        });
      
      case 'call_summary':
        return await relevanceAIAgent.executeAgentTask(
          'salesAgent_v1',
          'call_summary',
          {
            callDuration: context?.callDuration,
            leadId: context?.currentLead?.id,
            timestamp: new Date().toISOString()
          },
          'current_user_id',
          'current_company_id'
        );
      
      default:
        throw new Error('Unknown task type');
    }
  };

  const detectTaskType = (message: string): string | null => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
      return 'lead_analysis';
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('draft')) {
      return 'email_draft';
    }
    if (lowerMessage.includes('objection') || lowerMessage.includes('handle')) {
      return 'objection_handling';
    }
    if (lowerMessage.includes('call') || lowerMessage.includes('summary')) {
      return 'call_summary';
    }
    
    return null;
  };

  const getTaskStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'failed': return <XCircle className="h-3 w-3 text-red-600" />;
      case 'pending': return <Clock className="h-3 w-3 text-yellow-600" />;
      default: return null;
    }
  };

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          {/* Usage indicator */}
          {usageStats && (
            <div className="absolute -top-8 right-0 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs border">
              {usageStats.requestsUsed}/{usageStats.requestsLimit}
            </div>
          )}
          
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>

          {/* Quick actions */}
          <div className="absolute bottom-16 right-0 space-y-2 opacity-0 hover:opacity-100 transition-opacity">
            {quickActions.filter(action => !action.disabled).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action, action.label)}
                disabled={isProcessing}
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
              <CardTitle className="text-sm">Relevance AI Agent</CardTitle>
              {usageStats && (
                <Badge variant="outline" className="text-xs">
                  {usageStats.currentTier}
                </Badge>
              )}
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
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {conversation.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <Bot className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Hello! I'm your Relevance AI agent.</p>
                <p className="text-xs mt-1">I can help with lead analysis, drafting emails, handling objections, and more.</p>
              </div>
            )}
            
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-1">{msg.content}</span>
                    {msg.taskStatus && getTaskStatusIcon(msg.taskStatus)}
                  </div>
                  {msg.taskId && (
                    <div className="text-xs opacity-70 mt-1">
                      Task ID: {msg.taskId.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-lg text-sm flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                  <span>Processing your request...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
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
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Usage warning */}
          {usageStats && usageStats.percentageUsed >= 90 && (
            <div className="text-xs text-orange-600 mt-1">
              ⚠️ {usageStats.requestsLimit - usageStats.requestsUsed} requests remaining
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRelevanceAIBubble;
