
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Bot, Zap, Mail, MessageSquare, Phone, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

const AgentTriggerButton = ({ 
  leadId, 
  leadData, 
  position = 'bottom-right', 
  variant = 'floating',
  onActionComplete 
}) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);

  const agentActions = [
    {
      id: 'personalized_email',
      name: 'AI Personalized Email',
      icon: Mail,
      color: 'blue',
      description: 'Generate and send personalized email based on lead profile'
    },
    {
      id: 'optimal_call_timing',
      name: 'Optimize Call Timing',
      icon: Phone,
      color: 'green',
      description: 'AI determines best time to call this lead'
    },
    {
      id: 'behavior_analysis',
      name: 'Analyze Lead Behavior',
      icon: TrendingUp,
      color: 'purple',
      description: 'Deep analysis of lead engagement patterns'
    },
    {
      id: 'smart_follow_up',
      name: 'Smart Follow-up',
      icon: MessageSquare,
      color: 'orange',
      description: 'AI-driven follow-up strategy and execution'
    },
    {
      id: 'conversion_prediction',
      name: 'Predict Conversion',
      icon: Zap,
      color: 'yellow',
      description: 'Predict likelihood and timeline for conversion'
    },
    {
      id: 'cross_channel_sequence',
      name: 'Cross-Channel Sequence',
      icon: Settings,
      color: 'gray',
      description: 'Coordinate email, SMS, and social outreach'
    }
  ];

  const executeAgentAction = async (action) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Please ensure you are logged in');
      return;
    }

    setLoading(true);
    setActiveAgent(action.id);

    try {
      const { salesAgentConfig } = await import('@/ai-agents/salesAgentConfig.js');
      let result;

      switch (action.id) {
        case 'personalized_email':
          result = await salesAgentConfig.generatePersonalizedEmail({
            leadId,
            context: {
              leadData,
              emailType: 'follow_up',
              brandVoice: 'professional',
              callToAction: 'schedule_call'
            },
            emailType: 'follow_up',
            userId: user.id,
            companyId: profile.company_id
          });
          break;

        case 'optimal_call_timing':
          result = await salesAgentConfig.optimizeCallTiming({
            leadId,
            leadData,
            userId: user.id,
            companyId: profile.company_id
          });
          break;

        case 'behavior_analysis':
          result = await salesAgentConfig.analyzeLeadBehavior({
            leadId,
            interactionHistory: leadData.interactions || [],
            userId: user.id,
            companyId: profile.company_id
          });
          break;

        case 'smart_follow_up':
          result = await salesAgentConfig.triggerLeadAutomation({
            leadId,
            automationType: 'follow_up',
            context: {
              leadData,
              lastInteraction: leadData.last_interaction,
              aiDriven: true
            },
            userId: user.id,
            companyId: profile.company_id
          });
          break;

        case 'conversion_prediction':
          result = await salesAgentConfig.predictLeadConversion({
            leadId,
            leadData,
            userId: user.id,
            companyId: profile.company_id
          });
          break;

        case 'cross_channel_sequence':
          const { automationAgentConfig } = await import('@/ai-agents/automationAgentConfig.js');
          result = await automationAgentConfig.manageCrossChannelSequences({
            leadId,
            channels: ['email', 'sms', 'social'],
            context: { leadData },
            userId: user.id,
            companyId: profile.company_id
          });
          break;

        default:
          throw new Error(`Unknown agent action: ${action.id}`);
      }

      if (result.success) {
        toast.success(`${action.name} completed successfully`);
        if (onActionComplete) onActionComplete(action, result);
      } else {
        toast.error(`${action.name} failed: ${result.error}`);
      }
    } catch (error) {
      logger.error('Agent action failed', error, 'ai_agent');
      toast.error(`Failed to execute ${action.name}`);
    } finally {
      setLoading(false);
      setActiveAgent(null);
    }
  };

  const getButtonClassName = () => {
    const baseClasses = "relative";
    
    if (variant === 'floating') {
      return `${baseClasses} fixed z-50 shadow-lg`;
    } else if (variant === 'inline') {
      return `${baseClasses} inline-flex`;
    }
    
    return baseClasses;
  };

  const getPositionClasses = () => {
    if (variant !== 'floating') return '';
    
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className={`${getButtonClassName()} ${getPositionClasses()}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant === 'floating' ? 'default' : 'outline'}
            size={variant === 'floating' ? 'lg' : 'default'}
            className={`${variant === 'floating' ? 'rounded-full h-12 w-12 p-0' : 'gap-2'} ${
              loading ? 'animate-pulse' : ''
            }`}
            disabled={loading}
          >
            <Bot className={`${variant === 'floating' ? 'h-6 w-6' : 'h-4 w-4'}`} />
            {variant !== 'floating' && (
              <span>{loading ? 'AI Working...' : 'AI Agent'}</span>
            )}
            {loading && variant === 'floating' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Agent Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {agentActions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={() => executeAgentAction(action)}
              disabled={loading}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                <action.icon className={`h-4 w-4 text-${action.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{action.name}</span>
                  {activeAgent === action.id && (
                    <Badge variant="secondary" className="text-xs">
                      Processing...
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="text-xs text-gray-500 justify-center">
            Powered by TSAM AI Brain
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AgentTriggerButton;
