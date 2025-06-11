
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  Brain,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

const AgentRiskPrediction: React.FC = () => {
  const { executeAgentTask, isExecuting } = useAgentIntegration();
  const [riskPredictions, setRiskPredictions] = useState<any[]>([]);

  const analyzeTeamRisk = async () => {
    const result = await executeAgentTask(
      'managerAgent_v1',
      'agent_risk_prediction',
      { workspace: 'manager_dashboard' }
    );

    if (result?.output_payload?.predictions) {
      setRiskPredictions(result.output_payload.predictions);
    }
  };

  useEffect(() => {
    analyzeTeamRisk();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (factor: string) => {
    switch (factor) {
      case 'burnout': return <AlertTriangle className="h-4 w-4" />;
      case 'performance_decline': return <TrendingDown className="h-4 w-4" />;
      case 'engagement_drop': return <Clock className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-orange-600" />
            Agent Risk Prediction
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={analyzeTeamRisk}
            disabled={isExecuting}
          >
            {isExecuting ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskPredictions.length === 0 ? (
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              AI is analyzing team performance patterns to predict potential risks...
            </AlertDescription>
          </Alert>
        ) : (
          riskPredictions.map((prediction, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{prediction.agentName}</span>
                  <Badge variant={getRiskColor(prediction.riskLevel)}>
                    {prediction.riskLevel} risk
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {prediction.confidence}% confidence
                </span>
              </div>

              <div className="space-y-2">
                {prediction.riskFactors.map((factor: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {getRiskIcon(factor.type)}
                    <span>{factor.description}</span>
                    <Badge variant="outline" className="ml-auto">
                      {factor.impact}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="bg-muted p-3 rounded">
                <div className="text-sm font-medium mb-1">AI Recommendation:</div>
                <div className="text-sm">{prediction.recommendation}</div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule 1-on-1
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Send Check-in
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AgentRiskPrediction;
