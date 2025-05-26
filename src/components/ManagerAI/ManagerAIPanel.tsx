
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  FileText, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Calendar,
  MessageSquare,
  Mic,
  BarChart3
} from 'lucide-react';

interface ManagerAIPanelProps {
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  isListening: boolean;
  onGenerateReport: (type: string) => Promise<void>;
  onAskJarvis: (question: string) => Promise<void>;
}

const ManagerAIPanel: React.FC<ManagerAIPanelProps> = ({
  voiceEnabled,
  onVoiceToggle,
  isListening,
  onGenerateReport,
  onAskJarvis
}) => {
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickActions = [
    {
      icon: FileText,
      title: 'Generate Weekly Report',
      description: 'Team performance summary',
      action: () => handleQuickAction('weekly_report'),
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Team Health Check',
      description: 'Burnout risk analysis',
      action: () => handleQuickAction('team_health'),
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Forecast',
      description: 'Pipeline predictions',
      action: () => handleQuickAction('revenue_forecast'),
      color: 'bg-purple-500'
    },
    {
      icon: AlertTriangle,
      title: 'Risk Assessment',
      description: 'Identify potential issues',
      action: () => handleQuickAction('risk_assessment'),
      color: 'bg-orange-500'
    }
  ];

  const commonQuestions = [
    "What's our team's close rate this month?",
    "Which lead sources are performing best?",
    "Who needs coaching attention?",
    "What's our pipeline health?",
    "How can we improve conversion rates?"
  ];

  const handleQuickAction = async (actionType: string) => {
    setIsProcessing(true);
    try {
      await onGenerateReport(actionType);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsProcessing(true);
    try {
      await onAskJarvis(question);
      setQuestion('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-sm"
                onClick={action.action}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ask Jarvis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Ask Jarvis
            {voiceEnabled && (
              <Badge variant="outline" className="ml-auto">
                <Mic className="h-3 w-3 mr-1" />
                Voice Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your team's performance..."
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              disabled={isProcessing}
            />
            <Button 
              onClick={handleAskQuestion} 
              disabled={!question.trim() || isProcessing}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Common Questions */}
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">Common Questions:</p>
            <div className="space-y-2">
              {commonQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-left justify-start h-auto p-2 text-xs"
                  onClick={() => setQuestion(q)}
                  disabled={isProcessing}
                >
                  "{q}"
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Status */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Jarvis is online and monitoring
              </span>
            </div>
            <div className="text-xs text-green-600 dark:text-green-300">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerAIPanel;
