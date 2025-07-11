
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Clock
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface PulseCheckItem {
  id: string;
  type: 'metric' | 'alert' | 'insight';
  title: string;
  value?: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
  timestamp: string;
}

interface WhisperCard {
  id: string;
  from: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  actionRequired: boolean;
}

const CEOEAAssistant: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [pulseItems, setPulseItems] = useState<PulseCheckItem[]>([]);
  const [whispers, setWhispers] = useState<WhisperCard[]>([]);
  const [dashboardChart, setDashboardChart] = useState<any>(null);

  useEffect(() => {
    // Load initial pulse check data
    setPulseItems([
      {
        id: '1',
        type: 'metric',
        title: 'Revenue Performance',
        value: '+18%',
        status: 'good',
        description: 'Monthly ARR increased by 18% compared to last month',
        timestamp: '2 minutes ago'
      },
      {
        id: '2',
        type: 'alert',
        title: 'Team Performance Alert',
        status: 'warning',
        description: '2 sales reps are underperforming quota by >20%',
        timestamp: '15 minutes ago'
      },
      {
        id: '3',
        type: 'insight',
        title: 'Lead Source Optimization',
        status: 'good',
        description: 'Email campaigns outperforming cold calls by 34%',
        timestamp: '1 hour ago'
      }
    ]);

    // Load whisper messages
    setWhispers([
      {
        id: '1',
        from: 'Team AI',
        message: 'Sarah Johnson exceeded quota by 15% for 3rd consecutive month. Consider recognition program.',
        priority: 'medium',
        timestamp: '5 minutes ago',
        actionRequired: true
      },
      {
        id: '2',
        from: 'Leads AI',
        message: '3 high-value leads have been stalled for 5+ days. Reassignment recommended.',
        priority: 'high',
        timestamp: '10 minutes ago',
        actionRequired: true
      },
      {
        id: '3',
        from: 'Business Ops AI',
        message: 'Meta ads ROAS dropped 23% this week. Budget reallocation suggested.',
        priority: 'critical',
        timestamp: '30 minutes ago',
        actionRequired: true
      }
    ]);

    // Set initial dashboard chart
    setDashboardChart({
      type: 'line' as const,
      data: [
        { month: 'Jan', revenue: 65000, deals: 12 },
        { month: 'Feb', revenue: 72000, deals: 15 },
        { month: 'Mar', revenue: 68000, deals: 13 },
        { month: 'Apr', revenue: 85000, deals: 18 },
        { month: 'May', revenue: 92000, deals: 22 },
        { month: 'Jun', revenue: 98000, deals: 25 }
      ]
    });
  }, []);

  const generatePulseCheck = async () => {
    try {
      const response = await askJarvis('Generate comprehensive pulse check for executive summary', {
        includeChart: true,
        includeAlerts: true,
        timeframe: 'daily'
      });

      // Handle pulse check response
      console.log('Pulse check generated:', response);
    } catch (error) {
      console.error('Pulse check generation failed:', error);
    }
  };

  const handleWhisperAction = async (whisperId: string, action: string) => {
    try {
      const whisper = whispers.find(w => w.id === whisperId);
      if (whisper) {
        await askJarvis(`Handle whisper action: ${action} for message: ${whisper.message}`, {
          context: 'whisper_action',
          whisperId: whisperId,
          action: action
        });
        
        // Remove whisper from list after handling
        setWhispers(prev => prev.filter(w => w.id !== whisperId));
      }
    } catch (error) {
      console.error('Whisper action failed:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Pulse Check */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Executive Pulse Check
            </CardTitle>
            <Button 
              onClick={generatePulseCheck}
              disabled={isGenerating}
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Generate Pulse
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pulseItems.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    {item.value && (
                      <div className="text-lg font-bold mt-1">{item.value}</div>
                    )}
                    <p className="text-sm mt-1">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {item.timestamp}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Chart */}
      {dashboardChart && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Deal Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AIChartRenderer 
              chartData={dashboardChart.data}
              chartType={dashboardChart.type}
              config={{ title: 'Revenue & Deal Trends - Last 6 Months' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Whisper Cards - AI-to-AI Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            AI Assistant Alerts ({whispers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {whispers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active alerts from AI assistants</p>
            </div>
          ) : (
            whispers.map((whisper) => (
              <div key={whisper.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {whisper.from}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(whisper.priority)}`}>
                      {whisper.priority} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {whisper.timestamp}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{whisper.message}</p>
                
                {whisper.actionRequired && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleWhisperAction(whisper.id, 'approve')}
                      disabled={isGenerating}
                    >
                      Take Action
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleWhisperAction(whisper.id, 'dismiss')}
                      disabled={isGenerating}
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* CEO EA AI Chat Bubble */}
      <ChatBubble 
        assistantType="dashboard"
        enabled={true}
        className="ceo-ea-chat"
      />
    </div>
  );
};

export default CEOEAAssistant;
