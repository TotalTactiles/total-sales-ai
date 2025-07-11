
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Target,
  MessageSquare,
  Zap,
  Eye,
  Bell
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface PulseCheck {
  id: string;
  type: 'team_alert' | 'business_ops' | 'leads_alert' | 'system_check';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  actionRequired: boolean;
  sourceAI: string;
}

interface WhisperCard {
  id: string;
  repId: string;
  repName: string;
  message: string;
  sourceAI: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  sent: boolean;
}

const CEOEAAssistant: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [pulseChecks, setPulseChecks] = useState<PulseCheck[]>([]);
  const [whisperCards, setWhisperCards] = useState<WhisperCard[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Simulate pulse checks from other AIs
    setPulseChecks([
      {
        id: '1',
        type: 'team_alert',
        title: 'Rep Performance Alert',
        description: '2 team members are below 70% quota achievement',
        priority: 'high',
        timestamp: new Date().toLocaleTimeString(),
        actionRequired: true,
        sourceAI: 'Team AI'
      },
      {
        id: '2',
        type: 'leads_alert',
        title: 'Stalled Leads Batch',
        description: '12 high-value leads stalled for 7+ days',
        priority: 'critical',
        timestamp: new Date().toLocaleTimeString(),
        actionRequired: true,
        sourceAI: 'Leads AI'
      }
    ]);

    // Simulate whisper cards
    setWhisperCards([
      {
        id: '1',
        repId: 'rep1',
        repName: 'Sarah Johnson',
        message: 'Consider shifting ad spend to high-performing channels',
        sourceAI: 'Business Ops AI',
        priority: 'medium',
        timestamp: new Date().toLocaleTimeString(),
        sent: false
      }
    ]);
  }, []);

  const handlePulseCheck = async () => {
    try {
      const response = await askJarvis('Perform comprehensive pulse check across all departments', {
        includeMetrics: true,
        includeAlerts: true,
        includeRecommendations: true
      });

      if (response.chartData) {
        setChartData(response.chartData);
      }
    } catch (error) {
      console.error('Pulse check failed:', error);
    }
  };

  const sendWhisper = async (whisperCard: WhisperCard) => {
    try {
      // In a real implementation, this would call the whisper API
      setWhisperCards(prev => 
        prev.map(w => w.id === whisperCard.id ? { ...w, sent: true } : w)
      );
    } catch (error) {
      console.error('Failed to send whisper:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Pulse Check */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Executive Pulse Check
            </CardTitle>
            <Button 
              onClick={handlePulseCheck}
              disabled={isGenerating}
              size="sm"
            >
              <Zap className="h-4 w-4 mr-1" />
              {isGenerating ? 'Checking...' : 'Pulse Check'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {chartData && (
            <AIChartRenderer 
              data={chartData.data} 
              type={chartData.type}
              title={chartData.config?.title}
            />
          )}
        </CardContent>
      </Card>

      {/* Alert Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pulseChecks.map((check) => (
            <div 
              key={check.id}
              className={`p-3 rounded-lg border ${getPriorityColor(check.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">{check.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {check.sourceAI}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{check.description}</p>
                  <div className="text-xs opacity-70 mt-1">{check.timestamp}</div>
                </div>
                {check.actionRequired && (
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Whisper to Rep Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            Whisper to Reps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {whisperCards.map((whisper) => (
            <div 
              key={whisper.id}
              className="p-3 bg-purple-50 rounded-lg border border-purple-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{whisper.repName}</span>
                    <Badge variant="outline" className="text-xs">
                      {whisper.sourceAI}
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-800">{whisper.message}</p>
                  <div className="text-xs text-purple-600 mt-1">{whisper.timestamp}</div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => sendWhisper(whisper)}
                  disabled={whisper.sent}
                  variant={whisper.sent ? "outline" : "default"}
                >
                  {whisper.sent ? 'Sent' : 'Send Whisper'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CEO EA AI Chat Bubble */}
      <ChatBubble 
        assistantType="dashboard"
        enabled={true}
        position="bottom-right"
      />
    </div>
  );
};

export default CEOEAAssistant;
