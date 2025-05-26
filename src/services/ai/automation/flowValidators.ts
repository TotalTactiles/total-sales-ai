
import { AutomationFlow, AutomationResult, AutomationLimits } from '../types/automationTypes';
import { supabase } from '@/integrations/supabase/client';

export class FlowValidators {
  constructor(private limits: AutomationLimits) {}

  async checkUserLimits(userId: string, companyId: string): Promise<AutomationResult> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('id')
        .eq('type', 'automation_flow')
        .eq('company_id', companyId);

      if (error) throw error;

      const flowCount = data?.length || 0;
      if (flowCount >= this.limits.maxFlowsPerUser) {
        return {
          success: false,
          message: `Flow limit exceeded. Maximum ${this.limits.maxFlowsPerUser} flows allowed per user.`
        };
      }

      return { success: true, message: 'Limits check passed' };

    } catch (error) {
      return { success: false, message: 'Failed to check user limits' };
    }
  }

  validateFlow(flow: Omit<AutomationFlow, 'id'>): AutomationResult {
    if (flow.actions.length > this.limits.maxActionsPerFlow) {
      return {
        success: false,
        message: `Too many actions. Maximum ${this.limits.maxActionsPerFlow} actions allowed per flow.`
      };
    }

    if (!flow.name || flow.name.trim().length === 0) {
      return { success: false, message: 'Flow name is required' };
    }

    if (!flow.trigger.type) {
      return { success: false, message: 'Flow trigger type is required' };
    }

    return { success: true, message: 'Flow validation passed' };
  }

  async checkExecutionLimits(userId: string, companyId: string): Promise<AutomationResult> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('id')
        .eq('type', 'automation_execution')
        .eq('company_id', companyId)
        .gte('timestamp', oneHourAgo.toISOString());

      if (error) throw error;

      const executionCount = data?.length || 0;
      if (executionCount >= this.limits.maxExecutionsPerHour) {
        return {
          success: false,
          message: `Execution limit exceeded. Maximum ${this.limits.maxExecutionsPerHour} executions per hour.`
        };
      }

      return { success: true, message: 'Execution limits check passed' };

    } catch (error) {
      return { success: false, message: 'Failed to check execution limits' };
    }
  }
}
