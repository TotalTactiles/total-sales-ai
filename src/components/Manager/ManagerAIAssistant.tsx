import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';
import { toast } from 'sonner';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

interface ManagerAIAssistantProps {
  teamData: any[];
}

interface Insight {
  id: string;
  type: 'performance_summary' | 'risk_assessment' | 'opportunity_detection';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: Date;
  taskId?: string;
}

const ManagerAIAssistant: React.FC<ManagerAIAssistantProps> = ({ teamData }) => {
  const { executeWorkflow, isLoading } = useRelevanceAI();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    generateInsights();
  }, [teamData]);

  const generateInsights = async () => {
    if (!teamData) return;

    try {
      const result = await executeWorkflow('manager-agent-v1', {
        type: 'team_performance_analysis',
        teamData,
        context: 'manager_assistant'
      });

      if (result.success) {
        const newInsight: Insight = {
          id: crypto.randomUUID(),
          type: 'performance_summary',
          title: 'Team Performance Summary',
          description: result.output.response || 'Generated team performance summary',
          priority: 'high',
          actionable: true,
          timestamp: new Date(),
          taskId: result.output.taskId || crypto.randomUUID()
        };
        setInsights(prev => [newInsight, ...prev]);
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
      toast.error('Failed to generate team performance insights');
    }
  };

  const handleGetRecommendation = async (type: string) => {
    try {
      const result = await executeWorkflow('manager-agent-v1', {
        type: `recommendation_${type}`,
        teamData,
        context: 'manager_assistant'
      });

      if (result.success) {
        const newInsight: Insight = {
          id: crypto.randomUUID(),
          type: type as any,
          title: `${type.replace('_', ' ')} Recommendation`,
          description: result.output.response || `Generated recommendation for ${type}`,
          priority: 'medium',
          actionable: true,
          timestamp: new Date(),
          taskId: result.output.taskId || crypto.randomUUID()
        };
        setInsights(prev => [newInsight, ...prev]);
      }
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      toast.error('Failed to generate recommendation');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <TabsList>
          <TabsTrigger value="overview" onClick={() => setActiveTab('overview')}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="recommendations" onClick={() => setActiveTab('recommendations')}>
            Recommendations
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      
      <CardContent className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Team Performance Insights</h3>
            {insights.length === 0 ? (
              <p className="text-muted-foreground">No insights generated yet.</p>
            ) : (
              insights.map((insight) => (
                <div key={insight.id} className="border-b pb-4 mb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Generated on {insight.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                      {insight.priority}
                    </Badge>
                  </div>
                  
                  <div className="mt-3">
                    {insight.actionable && (
                      <Button size="sm">Take Action</Button>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <AgentFeedbackButton 
                      taskId={insight.taskId!}
                      variant="outline"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Get Recommendations</h3>
            <p className="text-muted-foreground">
              Generate AI-driven recommendations to improve team performance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-lg font-medium mb-2">Improve Sales Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    Get recommendations on how to improve your team's sales strategy.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => handleGetRecommendation('sales_strategy')}
                    disabled={isLoading}
                  >
                    Generate Recommendation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="text-lg font-medium mb-2">Enhance Customer Engagement</h4>
                  <p className="text-sm text-muted-foreground">
                    Discover new ways to engage with your customers more effectively.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => handleGetRecommendation('customer_engagement')}
                    disabled={isLoading}
                  >
                    Generate Recommendation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="text-lg font-medium mb-2">Optimize Lead Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    Find opportunities to optimize your lead generation process.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => handleGetRecommendation('lead_generation')}
                    disabled={isLoading}
                  >
                    Generate Recommendation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManagerAIAssistant;
