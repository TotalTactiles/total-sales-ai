
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { aiActivationService, AIActivationResult } from '@/services/ai/AIActivationService';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useAIActivation = () => {
  const { user, profile } = useAuth();
  const [isActivating, setIsActivating] = useState(false);
  const [activationResult, setActivationResult] = useState<AIActivationResult | null>(null);
  const [activationStatus, setActivationStatus] = useState({
    isActive: false,
    agentCount: 0,
    activeUsers: 0,
    lastActivation: null as string | null
  });

  const activateAISystem = async () => {
    if (!user?.id || profile?.role !== 'admin') {
      toast.error('Admin access required for AI system activation');
      return;
    }

    setIsActivating(true);

    try {
      const result = await aiActivationService.activateFullAISystem();
      setActivationResult(result);

      if (result.success) {
        toast.success(`AI System activated! ${result.activatedAgents.length} agents ready`);
        await refreshActivationStatus();
      } else {
        toast.error(`Activation completed with ${result.errors.length} errors`);
      }

      return result;

    } catch (error) {
      logger.error('AI activation hook error:', error);
      toast.error('AI activation failed');
      return null;
    } finally {
      setIsActivating(false);
    }
  };

  const refreshActivationStatus = async () => {
    try {
      const status = await aiActivationService.getActivationStatus();
      setActivationStatus(status);
      return status;
    } catch (error) {
      logger.error('Error refreshing activation status:', error);
      return null;
    }
  };

  const validateSystemHealth = async () => {
    try {
      // This would trigger a health check across all agents
      const result = await aiActivationService.activateFullAISystem();
      return result.success && result.errors.length === 0;
    } catch (error) {
      logger.error('System health validation error:', error);
      return false;
    }
  };

  return {
    activateAISystem,
    refreshActivationStatus,
    validateSystemHealth,
    isActivating,
    activationResult,
    activationStatus
  };
};
