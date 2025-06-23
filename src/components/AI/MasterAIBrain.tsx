import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Users, 
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface AIInsight {
  id: string;
  type: 'optimization' | 'bug_detection' | 'strategy' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  recommendedAction: string;
  timestamp: Date;
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
}

interface BrainMetrics {
  dataPoints: number;
  insights: number;
  automations: number;
  accuracy: number;
  learningRate: number;
  userInteractions: number;
}

const MasterAIBrain: React.FC = () => {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState<BrainMetrics>({
    dataPoints: 0,
    insights: 0,
    automations: 0,
    accuracy: 0,
    learningRate: 0,
    userInteractions: 0
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    initializeMasterBrain();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeMasterBrain = async () => {
    try {
      logger.info('Initializing Master AI Brain', { userId: user?.id }, 'ai_brain');
      
      // Simulate brain activation
      setIsActive(true);
      await updateMetrics();
      await generateInitialInsights();
      
      toast.success('Master AI Brain activated and learning from your data');
    } catch (error) {
      logger.error('Failed to initialize Master AI Brain', error, 'ai_brain');
      toast.error('Failed to activate AI Brain');
    }
  };

  const updateMetrics = async () => {
    try {
      // Simulate real-time metrics (in production, this would fetch from your data sources)
      const mockMetrics: BrainMetrics = {
        dataPoints: Math.floor(Math.random() * 10000) + 50000,
        insights: Math.floor(Math.random() * 50) + 100,
        automations: Math.floor(Math.random() * 20) + 30,
        accuracy: Math.random() * 15 + 85, // 85-100%
        learningRate: Math.random() * 5 + 5, // 5-10%
        userInteractions: Math.floor(Math.random() * 1000) + 5000
      };

      setMetrics(mockMetrics);
      setLastUpdate(new Date());

      logger.debug('AI Brain metrics updated', mockMetrics, 'ai_brain');
    } catch (error) {
      logger.error('Failed to update AI Brain metrics', error, 'ai_brain');
    }
  };

  const generateInitialInsights = async () => {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'optimization',
        priority: 'high',
        title: 'Lead Response Time Optimization',
        description: 'AI detected 23% faster response times when leads are contacted within 5 minutes of inquiry.',
        impact: 'Potential 15% increase in conversion rate',
        recommendedAction: 'Implement automated lead routing and instant notifications',
        timestamp: new Date(),
        status: 'new'
      },
      {
        id: '2',
        type: 'performance',
        priority: 'medium',
        title: 'Call Success Pattern Identified',
        description: 'Sales calls between 2-4 PM on Tuesdays show 34% higher success rates.',
        impact: 'Optimize team scheduling for peak performance windows',
        recommendedAction: 'Adjust call scheduling algorithm to prioritize high-success time slots',
        timestamp: new Date(),
        status: 'new'
      },
      {
        id: '3',
        type: 'strategy',
        priority: 'high',
        title: 'Cross-Sell Opportunity Detection',
        description: 'AI identified 67 existing customers showing behavioral patterns indicating readiness for upsell.',
        impact: 'Estimated $45,000 in additional revenue potential',
        recommendedAction: 'Create targeted upsell campaign for identified customers',
        timestamp: new Date(),
        status: 'new'
      },
      {
        id: '4',
        type: 'bug_detection',
        priority: 'critical',
        title: 'Email Delivery Issue Detected',
        description: 'AI detected 12% drop in email delivery rates over the past 48 hours.',
        impact: 'Missing potential leads and follow-ups',
        recommendedAction: 'Check email service configuration and sender reputation',
        timestamp: new Date(),
        status: 'new'
      }
    ];

    setInsights(mockInsights);
  };

  const handleInsightAction = (insightId: string, action: 'implement' | 'dismiss' | 'review') => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, status: action === 'implement' ? 'implemented' : action === 'dismiss' ? 'dismissed' : 'reviewed' }
        : insight
    ));

    logger.info('AI insight action taken', { insightId, action }, 'ai_brain');
    toast.success(`Insight ${action}d successfully`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'bug_detection': return <AlertCircle className="h-4 w-4" />;
      case 'strategy': return <Lightbulb className="h-4 w-4" />;
      case 'performance': return <Activity className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Brain Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Master AI Brain
            {isActive && (
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                ACTIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{metrics.dataPoints.toLocaleString()}</div>
              <div className="text-xs text-blue-600">Data Points</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Lightbulb className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{metrics.insights}</div>
              <div className="text-xs text-green-600">Insights Generated</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{metrics.automations}</div>
              <div className="text-xs text-purple-600">Automations Active</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{metrics.accuracy.toFixed(1)}%</div>
              <div className="text-xs text-orange-600">Accuracy Rate</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Learning Progress</span>
                <span>{metrics.learningRate.toFixed(1)}% this hour</span>
              </div>
              <Progress value={metrics.learningRate * 10} className="h-2" />
            </div>
            
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI Insights & Recommendations</span>
            <Badge variant="outline">{insights.filter(i => i.status === 'new').length} New</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className={`p-4 border rounded-lg ${insight.status === 'new' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(insight.type)}
                    <span className="font-medium">{insight.title}</span>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {insight.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                
                <div className="text-xs text-green-700 mb-2">
                  <strong>Impact:</strong> {insight.impact}
                </div>
                
                <div className="text-xs text-blue-700 mb-3">
                  <strong>Recommended Action:</strong> {insight.recommendedAction}
                </div>
                
                {insight.status === 'new' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleInsightAction(insight.id, 'implement')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Implement
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInsightAction(insight.id, 'review')}
                    >
                      Review Later
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInsightAction(insight.id, 'dismiss')}
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
                
                {insight.status !== 'new' && (
                  <Badge className="text-xs">
                    {insight.status === 'implemented' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {insight.status.charAt(0).toUpperCase() + insight.status.slice(1)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterAIBrain;
