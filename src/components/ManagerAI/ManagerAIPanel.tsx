
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Send, 
  FileText, 
  BarChart3, 
  Users, 
  Target,
  Brain,
  Loader2
} from 'lucide-react';

interface ManagerAIPanelProps {
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  isListening: boolean;
  onGenerateReport: () => Promise<void>;
  onAskJarvis: (question: string, context?: any) => Promise<any>;
}

const ManagerAIPanel: React.FC<ManagerAIPanelProps> = ({
  voiceEnabled,
  onVoiceToggle,
  isListening,
  onGenerateReport,
  onAskJarvis
}) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
  }>>([]);

  const quickActions = [
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: 'Team Performance',
      action: () => askJarvis('Analyze current team performance metrics')
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: 'Resource Planning',
      action: () => askJarvis('Provide resource allocation recommendations')
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: 'Goal Progress',
      action: () => askJarvis('Review progress toward quarterly goals')
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: 'Generate Report',
      action: onGenerateReport
    }
  ];

  const askJarvis = async (question: string) => {
    if (!question.trim()) return;

    setIsProcessing(true);
    
    const userMessage = {
      role: 'user' as const,
      content: question,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);

    try {
      const response = await onAskJarvis(question);
      
      const aiMessage = {
        role: 'ai' as const,
        content: response?.response || 'I understand your request and am processing it.',
        timestamp: new Date().toLocaleTimeString()
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'ai' as const,
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendQuery = async () => {
    if (!query.trim()) return;
    
    await askJarvis(query);
    setQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={action.action}
            disabled={isProcessing}
            className="flex items-center gap-2 h-auto p-3 text-xs"
          >
            {action.icon}
            <span className="truncate">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Voice Controls */}
      <Card className="bg-muted/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={onVoiceToggle}
                className="flex items-center gap-1"
              >
                {voiceEnabled ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                Voice
              </Button>
              {isListening && (
                <Badge variant="outline" className="animate-pulse">
                  Listening...
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation History */}
      {conversation.length > 0 && (
        <Card>
          <CardContent className="p-3 max-h-40 overflow-y-auto">
            <div className="space-y-2">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded text-xs ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-1">
                      {message.role === 'ai' && <Brain className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Query Input */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Jarvis about your business..."
          className="flex-1 text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
          disabled={isProcessing}
        />
        <Button
          onClick={handleSendQuery}
          disabled={!query.trim() || isProcessing}
          size="sm"
        >
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ManagerAIPanel;
