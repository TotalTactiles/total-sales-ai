
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingAgentService } from '@/hooks/useOnboardingAgentService';
import { toast } from 'sonner';

const PersonalizedAgentSettings: React.FC = () => {
  const { profile } = useAuth();
  const { recreateAgent, isCreatingAgent } = useOnboardingAgentService();
  const [recreationResult, setRecreationResult] = useState<any>(null);

  const handleRecreateAgent = async () => {
    const result = await recreateAgent();
    setRecreationResult(result);
  };

  const getAgentStatus = () => {
    const extendedProfile = profile as any;
    if (extendedProfile?.personalized_agent_id) {
      return {
        status: 'active',
        name: extendedProfile.personalized_agent_name || 'Personalized AI Agent',
        created: extendedProfile.agent_created_at,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        status: 'inactive',
        name: 'No Agent Created',
        created: null,
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const agentStatus = getAgentStatus();
  const StatusIcon = agentStatus.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Personalized AI Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className={`p-4 rounded-lg border ${agentStatus.bgColor} ${agentStatus.borderColor}`}>
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-5 w-5 ${agentStatus.color}`} />
            <div className="flex-1">
              <div className="font-medium">{agentStatus.name}</div>
              {agentStatus.created && (
                <div className="text-sm text-gray-600">
                  Created: {new Date(agentStatus.created).toLocaleDateString()}
                </div>
              )}
            </div>
            <Badge variant={agentStatus.status === 'active' ? 'default' : 'destructive'}>
              {agentStatus.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Agent Type Info */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Agent Type</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {profile?.role === 'sales_rep' ? 'Sales Agent (SAM)' : 'Manager Agent (MIRA)'}
            </Badge>
            <div className="text-sm text-gray-600">
              Personalized for {profile?.role === 'sales_rep' ? 'sales activities' : 'team management'}
            </div>
          </div>
        </div>

        {/* Recreate Agent */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Agent Management</div>
          <Button
            onClick={handleRecreateAgent}
            disabled={isCreatingAgent}
            variant="outline"
            className="w-full"
          >
            {isCreatingAgent ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating Agent...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recreate AI Agent
              </>
            )}
          </Button>
          <div className="text-xs text-gray-500">
            This will create a new personalized AI agent based on your current profile and preferences.
          </div>
        </div>

        {/* Recreation Result */}
        {recreationResult && (
          <div className={`p-3 rounded-lg border ${
            recreationResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {recreationResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <div className="text-sm font-medium">
                {recreationResult.success ? 'Agent Created Successfully' : 'Agent Creation Failed'}
              </div>
            </div>
            {recreationResult.error && (
              <div className="text-xs text-red-600 mt-1">
                Error: {recreationResult.error}
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Agent Features</div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Personalized responses based on your profile
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Context-aware assistance for your role
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Memory of your preferences and history
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Integration with your workflows
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedAgentSettings;
