
import { useState, useEffect } from 'react';
import { relevanceAI, AgentWorkflow, WorkflowExecution, USAGE_TIERS } from '@/services/relevance/RelevanceAIService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface UsageStats {
  currentTier: string;
  requestsUsed: number;
  requestsLimit: number;
  percentageUsed: number;
  canUpgrade: boolean;
}

export const useRelevanceAI = () => {
  const { user, profile } = useAuth();
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);

  useEffect(() => {
    if (user && profile) {
      loadWorkflows();
      loadUsageStats();
    }
  }, [user, profile]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const workflowList = await relevanceAI.listWorkflows();
      setWorkflows(workflowList);
    } catch (error) {
      logger.error('Failed to load workflows', error);
      toast.error('Failed to load AI workflows');
    } finally {
      setLoading(false);
    }
  };

  const loadUsageStats = async () => {
    if (!profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('relevance_usage')
        .select('*')
        .eq('company_id', profile.company_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const currentTier = data?.tier || 'Basic';
      const requestsUsed = data?.requests_used || 0;
      const tier = USAGE_TIERS.find(t => t.name === currentTier);
      const requestsLimit = tier?.monthlyRequests || 100;

      setUsageStats({
        currentTier,
        requestsUsed,
        requestsLimit,
        percentageUsed: Math.round((requestsUsed / requestsLimit) * 100),
        canUpgrade: currentTier !== 'Elite'
      });
    } catch (error) {
      logger.error('Failed to load usage stats', error);
    }
  };

  const executeWorkflow = async (workflowId: string, input: any): Promise<WorkflowExecution | null> => {
    if (!user?.id || !usageStats) return null;

    // Check usage limits
    if (usageStats.requestsUsed >= usageStats.requestsLimit) {
      toast.error('Usage limit exceeded. Please upgrade your plan.');
      return null;
    }

    try {
      setLoading(true);
      
      const execution = await relevanceAI.executeWorkflow(workflowId, input, user.id);
      setExecutions(prev => [execution, ...prev]);

      // Update usage stats
      await incrementUsage();

      toast.success('Workflow executed successfully');
      return execution;
    } catch (error) {
      logger.error('Failed to execute workflow', error);
      toast.error('Failed to execute workflow');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateResponse = async (prompt: string, context?: any): Promise<string | null> => {
    if (!user?.id || !usageStats) return null;

    if (usageStats.requestsUsed >= usageStats.requestsLimit) {
      toast.error('Usage limit exceeded. Please upgrade your plan.');
      return null;
    }

    try {
      const response = await relevanceAI.generateResponse(prompt, context);
      await incrementUsage();
      return response;
    } catch (error) {
      logger.error('Failed to generate AI response', error);
      toast.error('Failed to generate AI response');
      return null;
    }
  };

  const incrementUsage = async () => {
    if (!profile?.company_id) return;

    try {
      const { error } = await supabase
        .from('relevance_usage')
        .upsert({
          company_id: profile.company_id,
          requests_used: (usageStats?.requestsUsed || 0) + 1,
          tier: usageStats?.currentTier || 'Basic',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setUsageStats(prev => prev ? {
        ...prev,
        requestsUsed: prev.requestsUsed + 1,
        percentageUsed: Math.round(((prev.requestsUsed + 1) / prev.requestsLimit) * 100)
      } : null);

      // Show upgrade prompt at 90% usage
      const newPercentage = Math.round(((usageStats?.requestsUsed || 0) + 1) / (usageStats?.requestsLimit || 100) * 100);
      if (newPercentage >= 90 && usageStats?.canUpgrade) {
        toast.warning('Approaching usage limit. Consider upgrading your plan.');
      }
    } catch (error) {
      logger.error('Failed to update usage stats', error);
    }
  };

  const upgradeTier = async (newTier: string) => {
    if (!profile?.company_id) return;

    try {
      const { error } = await supabase
        .from('relevance_usage')
        .upsert({
          company_id: profile.company_id,
          tier: newTier,
          requests_used: 0, // Reset usage on upgrade
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await loadUsageStats();
      toast.success(`Upgraded to ${newTier} tier successfully!`);
    } catch (error) {
      logger.error('Failed to upgrade tier', error);
      toast.error('Failed to upgrade tier');
    }
  };

  return {
    workflows,
    executions,
    loading,
    usageStats,
    executeWorkflow,
    generateResponse,
    loadWorkflows,
    upgradeTier
  };
};
