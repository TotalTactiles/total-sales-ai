
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { agentInitializationService, RepProfile, AgentCreationResult } from '@/services/agents/AgentInitializationService';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useAgentInitialization = () => {
  const { user, profile } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  const [lastResult, setLastResult] = useState<AgentCreationResult | null>(null);

  const initializeAgentsForRep = useCallback(async (repData: Partial<RepProfile>) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required for agent initialization');
      return null;
    }

    setIsInitializing(true);

    try {
      const repProfile: RepProfile = {
        repName: repData.repName || profile.full_name || 'Unknown Rep',
        crmRepID: repData.crmRepID || `crm_${user.id}`,
        repCalendar: repData.repCalendar || profile.email || '',
        repMemorySpace: repData.repMemorySpace || `memory_${user.id}`,
        repTone: repData.repTone || profile.sales_personality || 'professional',
        email: profile.email || '',
        userId: user.id,
        companyId: profile.company_id
      };

      const result = await agentInitializationService.initializeAgentsForNewRep(repProfile);
      setLastResult(result);

      if (result.status.includes('✅')) {
        toast.success(`AI Agents successfully initialized for ${repProfile.repName}`);
        logger.info('Agent initialization completed successfully', { repName: repProfile.repName }, 'agent_init');
      } else {
        toast.error(`Agent initialization failed: ${result.error}`);
        logger.error('Agent initialization failed', { repName: repProfile.repName, error: result.error }, 'agent_init');
      }

      return result;

    } catch (error) {
      logger.error('Agent initialization hook error:', error);
      toast.error('Agent initialization failed');
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [user, profile]);

  const checkAgentStatus = useCallback(async (repName: string) => {
    if (!user?.id || !profile?.company_id) {
      return null;
    }

    try {
      // This would check the status of existing agents
      // Implementation depends on your agent monitoring system
      const statusCheck = {
        salesAgent: `Sam | Sales Rep Agent ${repName}`,
        automationAgent: 'Atlas | Automation Agent',
        developerAgent: 'Nova | Developer Agent',
        status: 'Active' // This would be determined by actual health checks
      };

      return statusCheck;
    } catch (error) {
      logger.error('Agent status check failed:', error);
      return null;
    }
  }, [user, profile]);

  return {
    initializeAgentsForRep,
    checkAgentStatus,
    isInitializing,
    lastResult
  };
};
