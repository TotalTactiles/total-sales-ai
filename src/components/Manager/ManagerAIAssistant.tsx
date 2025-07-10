
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import AIDisabledState from '@/components/ai/AIDisabledState';
import { 
  Brain, 
  Send, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  BarChart3,
  FileText
} from 'lucide-react';

interface ManagerAIAssistantProps {
  mockFunctions?: {
    generateTeamSummary: () => Promise<string>;
    analyzeTeamRisks: () => Promise<any>;
    getOptimizationSuggestions: () => Promise<string[]>;
    generateReport: (type: string) => Promise<any>;
  };
}

const ManagerAIAssistant: React.FC<ManagerAIAssistantProps> = ({ mockFunctions }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
  }>>([
    {
      role: 'ai',
      content: 'Hello! I\'m your AI Manager Assistant. I can help you analyze team performance, predict risks, optimize workflows, and provide strategic insights. Try one of the quick actions below or ask me anything about your team.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const quickActions = [
    {
      label: 'Team Performance Summary',
      action: 'team_summary',
      icon: <Users className="h-4 w-4" />,
      description: 'Get overview of team metrics'
    },
    {
      label: 'Risk Analysis',
      action: 'risk_analysis', 
      icon: <Target className="h-4 w-4" />,
      description: 'Identify potential issues'
    },
    {
      label: 'Optimization Tips',
      action: 'optimization',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Improve team performance'
    },
    {
      label: 'Generate Report',
      action: 'generate_report',
      icon: <FileText className="h-4 w-4" />,
      description: 'Create detailed analytics'
    }
  ];

  const handleQuickAction = async (action: string) => {
    if (!mockFunctions) {
      // Show disabled state
      const aiMessage = {
        role: 'ai' as const,
        content: 'AI functionality is temporarily paused for system optimization. Please try again later.',
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation(prev => [...prev, aiMessage]);
      return;
    }

    setIsLoading(true);
    
    const userMessage = {
      role: 'user' as const,
      content: `Execute: ${action.replace('_', ' ')}`,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);

    try {
      let response = '';
      
      switch (action) {
        case 'team_summary':
          response = await mockFunctions.generateTeamSummary();
          break;
        case 'risk_analysis':
          const riskData = await mockFunctions.analyzeTeamRisks();
          response = `Risk Analysis Complete:\n\nHigh Risk: ${riskData.highRisk.join(', ')}\nMedium Risk: ${riskData.mediumRisk.join(', ')}\n\nRecommendations:\n${riskData.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}`;
          break;
        case 'optimization':
          const suggestions = await mockFunctions.getOptimizationSuggestions();
          response = `Optimization Suggestions:\n\n${suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}`;
          break;
        case 'generate_report':
          const report = await mockFunctions.generateReport('Team Performance');
          response = `Report Generated Successfully!\n\nType: ${report.type}\nGenerated: ${new Date(report.generatedAt).toLocaleString()}\n\n${report.summary}`;
          break;
        default:
          response = 'Action completed successfully.';
      }

      const aiMessage = {
        role: 'ai' as const,
        content: response,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'ai' as const,
        content: 'I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);

    // Mock AI response for demo
    setTimeout(() => {
      const responses = [
        "Based on your team's current performance metrics, I recommend focusing on lead nurturing and follow-up processes.",
        "Your team is performing well overall. Consider implementing additional training for the reps showing higher burnout risk.",
        "I've analyzed the data and suggest adjusting territory assignments to optimize workload distribution.",
        "The conversion rates are trending positively. Would you like me to generate a detailed performance report?"
      ];
      
      const aiMessage = {
        role: 'ai' as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  // Show disabled state if no mock functions
  if (!mockFunctions) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Manager AI Assistant
            <Badge variant="outline" className="ml-auto">
              v2.0
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <AIDisabledState message="AI Manager Assistant is temporarily paused for system optimization." />
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
          <Badge variant="outline" className="ml-auto bg-green-50 text-green-700">
            Active
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
              onClick={() => handleQuickAction(action.action)}
              disabled={isLoading}
              className="justify-start text-xs h-auto p-2 flex-col items-start"
            >
              <div className="flex items-center gap-1 w-full">
                {action.icon}
                <span className="truncate">{action.label}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {action.description}
              </span>
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
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-2">{message.timestamp}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Analyzing...</span>
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
            disabled={!query.trim() || isLoading}
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
