
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Activity, Settings } from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

interface AgentTriggerProps {
  agentType: 'salesAgent_v1' | 'managerAgent_v1' | 'automationAgent_v1' | 'developerAgent_v1';
  taskType: string;
  context?: any;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  className?: string;
}

const AgentTrigger: React.FC<AgentTriggerProps> = ({
  agentType,
  taskType,
  context,
  variant = 'default',
  size = 'default',
  children,
  className
}) => {
  const { executeAgentTask, isExecuting } = useAgentIntegration();

  const getAgentIcon = () => {
    switch (agentType) {
      case 'salesAgent_v1':
        return <Brain className="h-4 w-4" />;
      case 'managerAgent_v1':
        return <Activity className="h-4 w-4" />;
      case 'automationAgent_v1':
        return <Zap className="h-4 w-4" />;
      case 'developerAgent_v1':
        return <Settings className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getAgentColor = () => {
    switch (agentType) {
      case 'salesAgent_v1':
        return 'text-blue-600';
      case 'managerAgent_v1':
        return 'text-green-600';
      case 'automationAgent_v1':
        return 'text-purple-600';
      case 'developerAgent_v1':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  const handleTrigger = async () => {
    await executeAgentTask(agentType, taskType, context);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleTrigger}
      disabled={isExecuting}
      className={`relative ${className}`}
    >
      <div className={`flex items-center gap-2 ${getAgentColor()}`}>
        {getAgentIcon()}
        {children || taskType}
      </div>
      
      {isExecuting && (
        <Badge variant="secondary" className="absolute -top-2 -right-2 animate-pulse">
          AI
        </Badge>
      )}
    </Button>
  );
};

export default AgentTrigger;
