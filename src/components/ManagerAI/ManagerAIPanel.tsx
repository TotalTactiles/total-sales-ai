
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Mic, 
  MicOff, 
  FileText, 
  Zap, 
  BarChart3,
  Users,
  Calendar,
  Settings,
  Lightbulb
} from 'lucide-react';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { toast } from 'sonner';

interface ManagerAIPanelProps {
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  isListening: boolean;
  onGenerateReport: () => Promise<string | null>;
  onAskJarvis: (question: string) => Promise<string | null>;
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
  const [responses, setResponses] = useState<Array<{id: string, question: string, answer: string, timestamp: Date}>>([]);
  const { logAIInteraction } = useUnifiedAI();

  const handleAskJarvis = async () => {
    if (!question.trim() || isProcessing) return;

    setIsProcessing(true);
    const currentQuestion = question;
    setQuestion('');

    try {
      const response = await onAskJarvis(currentQuestion);
      
      if (response) {
        const newResponse = {
          id: crypto.randomUUID(),
          question: currentQuestion,
          answer: response,
          timestamp: new Date()
        };
        
        setResponses(prev => [newResponse, ...prev]);
        
        // Log the interaction
        await logAIInteraction('jarvis_interaction', {
          question: currentQuestion,
          response_length: response.length,
          success: true
        });
        
        toast.success('Jarvis response generated');
      }
    } catch (error) {
      console.error('Error asking Jarvis:', error);
      toast.error('Failed to get response from Jarvis');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsProcessing(true);
    
    try {
      const report = await onGenerateReport();
      
      if (report) {
        const reportResponse = {
          id: crypto.randomUUID(),
          question: 'Generate Executive Report',
          answer: report,
          timestamp: new Date()
        };
        
        setResponses(prev => [reportResponse, ...prev]);
        
        await logAIInteraction('executive_report', {
          report_length: report.length,
          success: true
        });
        
        toast.success('Executive report generated');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions = [
    {
      id: 'team-performance',
      label: 'Team Performance',
      icon: Users,
      question: 'Analyze current team performance and identify top performers and areas for improvement'
    },
    {
      id: 'lead-optimization',
      label: 'Lead Optimization',
      icon: BarChart3,
      question: 'Review lead distribution and suggest optimization strategies for better conversion'
    },
    {
      id: 'automation-opportunities',
      label: 'Automation Ideas',
      icon: Zap,
      question: 'Identify processes that can be automated to improve efficiency'
    },
    {
      id: 'strategic-insights',
      label: 'Strategic Insights',
      icon: Lightbulb,
      question: 'Provide strategic insights based on current metrics and market trends'
    }
  ];

  const handleQuickAction = async (action: typeof quickActions[0]) => {
    setQuestion(action.question);
    await handleAskJarvis();
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="flex items-center gap-2 h-auto p-3 text-left"
                onClick={() => handleQuickAction(action)}
                disabled={isProcessing}
              >
                <action.icon className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={handleGenerateReport}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isProcessing ? 'Generating...' : 'Generate Executive Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-5 w-5 text-purple-600" />
            Ask Jarvis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask Jarvis anything about your business, team, or strategy..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskJarvis();
                  }
                }}
                className="flex-1 min-h-[80px]"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAskJarvis}
                disabled={!question.trim() || isProcessing}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Ask Jarvis'}
              </Button>
              
              <Button
                variant="outline"
                onClick={onVoiceToggle}
                className={`${voiceEnabled ? 'bg-red-50 border-red-200' : ''}`}
              >
                {voiceEnabled ? (
                  <MicOff className="h-4 w-4 text-red-600" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {isListening && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                Listening...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Responses */}
      {responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {responses.map((response) => (
                <div key={response.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {response.timestamp.toLocaleTimeString()}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Q: {response.question}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {response.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManagerAIPanel;
