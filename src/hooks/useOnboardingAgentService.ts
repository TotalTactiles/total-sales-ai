
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userOnboardingAgentService, UserOnboardingData } from '@/services/agents/UserOnboardingAgentService';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useOnboardingAgentService = () => {
  const { user, profile } = useAuth();
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [lastCreationResult, setLastCreationResult] = useState<any>(null);

  const createPersonalizedAgent = useCallback(async (additionalData?: Partial<UserOnboardingData>) => {
    if (!user?.id || !profile) {
      toast.error('Authentication required for agent creation');
      return null;
    }

    setIsCreatingAgent(true);

    try {
      const userData: UserOnboardingData = {
        userId: user.id,
        userRole: profile.role as 'sales_rep' | 'manager',
        firstName: profile.full_name?.split(' ')[0] || 'User',
        lastName: profile.full_name?.split(' ')[1] || '',
        email: profile.email || user.email || '',
        companyId: profile.company_id,
        salesRegion: (profile as any).sales_region,
        teamId: (profile as any).team_id,
        assignedTeam: (profile as any).assigned_team,
        ...additionalData
      };

      const result = await userOnboardingAgentService.duplicateAgentsForUser(userData);
      setLastCreationResult(result);

      if (result.success) {
        const agentType = userData.userRole === 'sales_rep' ? 'Sales Agent' : 'Manager Agent';
        toast.success(`Personalized ${agentType} created successfully!`);
        logger.info('Personalized agent created', { userId: user.id, userRole: userData.userRole }, 'agent_creation');
      } else {
        toast.error(`Failed to create personalized agent: ${result.error}`);
        logger.error('Agent creation failed', { userId: user.id, error: result.error }, 'agent_creation');
      }

      return result;

    } catch (error) {
      logger.error('Agent creation hook error:', error);
      toast.error('Agent creation failed');
      return null;
    } finally {
      setIsCreatingAgent(false);
    }
  }, [user, profile]);

  const recreateAgent = useCallback(async () => {
    if (!user?.id) {
      toast.error('Authentication required');
      return null;
    }

    return await userOnboardingAgentService.recreateAgentForUser(user.id);
  }, [user]);

  return {
    createPersonalizedAgent,
    recreateAgent,
    isCreatingAgent,
    lastCreationResult
  };
};
