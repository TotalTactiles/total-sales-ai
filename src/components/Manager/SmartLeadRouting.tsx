
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowRight,
  Brain
} from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

interface LeadRouting {
  leadId: string;
  leadName: string;
  company: string;
  recommendedAgent: {
    id: string;
    name: string;
    avatar?: string;
    matchScore: number;
    reasoning: string[];
  };
  alternativeAgents: Array<{
    id: string;
    name: string;
    matchScore: number;
  }>;
}

const SmartLeadRouting: React.FC = () => {
  const { executeManagerAgent, isExecuting } = useAgentIntegration();
  const [routingRecommendations, setRoutingRecommendations] = useState<LeadRouting[]>([]);

  const generateRoutingRecommendations = async () => {
    const result = await executeManagerAgent('smart_lead_routing', {
      workspace: 'lead_management'
    });

    if (result?.output_payload?.recommendations) {
      setRoutingRecommendations(result.output_payload.recommendations);
    }
  };

  const assignLead = async (leadId: string, agentId: string) => {
    // Execute assignment logic
    await executeManagerAgent('assign_lead', { 
      leadId, 
      agentId,
      workspace: 'lead_assignment'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            AI Smart Lead Routing
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateRoutingRecommendations}
            disabled={isExecuting}
          >
            {isExecuting ? 'Analyzing...' : 'Generate Recommendations'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {routingRecommendations.map((routing) => (
          <div key={routing.leadId} className="border rounded-lg p-4 space-y-4">
            {/* Lead Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{routing.leadName}</div>
                <div className="text-sm text-muted-foreground">{routing.company}</div>
              </div>
              <Badge variant="outline">New Lead</Badge>
            </div>

            {/* Recommended Agent */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={routing.recommendedAgent.avatar} />
                    <AvatarFallback>
                      {routing.recommendedAgent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{routing.recommendedAgent.name}</div>
                    <div className="text-sm text-muted-foreground">Recommended</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">
                    {routing.recommendedAgent.matchScore}% match
                  </Badge>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {routing.recommendedAgent.reasoning.map((reason, i) => (
                  <div key={i} className="text-sm flex items-center gap-2">
                    <Brain className="h-3 w-3 text-blue-600" />
                    {reason}
                  </div>
                ))}
              </div>

              <Button 
                size="sm" 
                className="w-full"
                onClick={() => assignLead(routing.leadId, routing.recommendedAgent.id)}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Assign to {routing.recommendedAgent.name}
              </Button>
            </div>

            {/* Alternative Options */}
            {routing.alternativeAgents.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Alternative Options:</div>
                {routing.alternativeAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{agent.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{agent.matchScore}% match</Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => assignLead(routing.leadId, agent.id)}
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {routingRecommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <div>No new leads to route</div>
            <div className="text-sm">AI will analyze incoming leads automatically</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartLeadRouting;
