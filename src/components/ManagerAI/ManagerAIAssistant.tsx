
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
  BarChart3
} from 'lucide-react';
import { isAIEnabled } from '@/ai/config/AIConfig';
import AIDisabledState from '@/components/ai/AIDisabledState';
import { contentGenerationService } from '@/ai/functions/contentGeneration';
import { performanceInsightsService } from '@/ai/functions/performanceInsights';

const ManagerAIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    taskId?: string;
  }>>([
    {
      role: 'ai',
      content: 'Hello! I\'m your AI Manager Assistant. I can help you analyze team performance, predict risks, optimize workflows, and provide strategic insights.',
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
    if (!isAIEnabled('PERFORMANCE_INSIGHTS')) {
      return;
    }

    const userMessage = {
      role: 'user' as const,
      content: `Execute: ${taskType.replace('_', ' ')}`,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const result = await performanceInsightsService.generateInsights({
        userId: 'current-user',
        companyId: 'current-company',
        timeframe: 'week',
        metrics: { taskType }
      });

      const aiMessage = {
        role: 'ai' as const,
        content: result.insights[0] || 'Analysis complete - ready for AI activation',
        timestamp: new Date().toLocaleTimeString(),
        taskId: `task_${Date.now()}`
      };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Quick action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim() || !isAIEnabled('PERFORMANCE_INSIGHTS')) return;

    const userMessage = {
      role: 'user' as const,
      content: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuery('');
    setIsProcessing(true);

    try {
      const result = await contentGenerationService.generateSummary({
        type: 'summary',
        context: { query, workspace: 'manager' },
        parameters: {}
      });

      const aiMessage = {
        role: 'ai' as const,
        content: result.content,
        timestamp: new Date().toLocaleTimeString(),
        taskId: `task_${Date.now()}`
      };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Message processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAIEnabled()) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600 opacity-50" />
            Manager AI Assistant
            <Badge variant="outline" className="ml-auto opacity-50">
              Temporarily Paused
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <AIDisabledState 
            feature="Manager AI Assistant" 
            message="AI system temporarily paused"
            size="lg"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Manager AI Assistant
          <Badge variant="outline" className="ml-auto">
            Ready for Activation
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
              disabled={isProcessing || !isAIEnabled('PERFORMANCE_INSIGHTS')}
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
                <div className="text-xs opacity-70 mt-2">{message.timestamp}</div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAIEnabled('PERFORMANCE_INSIGHTS') 
              ? "Ask about team performance, strategy, or management insights..."
              : "AI temporarily paused - ready for activation"
            }
            className="min-h-10 resize-none"
            disabled={!isAIEnabled('PERFORMANCE_INSIGHTS')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!query.trim() || isProcessing || !isAIEnabled('PERFORMANCE_INSIGHTS')}
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
