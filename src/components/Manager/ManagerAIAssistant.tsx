
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Send, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

const ManagerAIAssistant: React.FC = () => {
  const { executeAgentTask, isExecuting } = useAgentIntegration();
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    taskId?: string;
  }>>([
    {
      role: 'ai',
      content: 'Hello! I\'m your AI Manager Assistant powered by managerAgent_v1. I can help you analyze team performance, predict risks, optimize workflows, and provide strategic insights.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const quickActions = [
    {
      label: 'Summarize Team Performance',
      taskType: 'team_summary',
      icon: <Users className="h-4 w-4" />
    },
    {
      label: 'Top 3 Agent Improvements',
      taskType: 'agent_improvements',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      label: 'Risk Prediction Analysis',
      taskType: 'risk_prediction',
      icon: <Target className="h-4 w-4" />
    },
    {
      label: 'Workflow Optimization',
      taskType: 'workflow_optimization',
      icon: <BarChart3 className="h-4 w-4" />
    }
  ];

  const handleQuickAction = async (taskType: string) => {
    const userMessage = {
      role: 'user' as const,
      content: `Execute: ${taskType.replace('_', ' ')}`,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);

    const result = await executeAgentTask(
      'managerAgent_v1',
      taskType,
      { workspace: 'manager_dashboard' }
    );

    if (result?.output_payload?.response) {
      const aiMessage = {
        role: 'ai' as const,
        content: result.output_payload.response,
        timestamp: new Date().toLocaleTimeString(),
        taskId: result.id
      };
      setConversation(prev => [...prev, aiMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuery('');

    const result = await executeAgentTask(
      'managerAgent_v1',
      'general_query',
      { 
        query,
        workspace: 'manager_dashboard'
      }
    );

    if (result?.output_payload?.response) {
      const aiMessage = {
        role: 'ai' as const,
        content: result.output_payload.response,
        timestamp: new Date().toLocaleTimeString(),
        taskId: result.id
      };
      setConversation(prev => [...prev, aiMessage]);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Manager AI Assistant
          <Badge variant="outline" className="ml-auto">
            managerAgent_v1
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.taskType)}
              disabled={isExecuting}
              className="justify-start text-xs h-8"
            >
              {action.icon}
              <span className="ml-1 truncate">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm leading-relaxed">{message.content}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs opacity-70">{message.timestamp}</div>
                  {message.role === 'ai' && message.taskId && (
                    <AgentFeedbackButton taskId={message.taskId} size="sm" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about team performance, strategy, or management insights..."
            className="min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!query.trim() || isExecuting}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerAIAssistant;
