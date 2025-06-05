import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { 
  AutomationFlow, 
  AutomationExecution, 
  AutomationResult,
  AutomationLimits,
  DEFAULT_AUTOMATION_LIMITS
} from './types/automationTypes';
import { FlowValidators } from './automation/flowValidators';
import { TypeConverters } from './automation/typeConverters';
import { ExecutionManager } from './automation/executionManager';

export class NativeAutomationEngine {
  private limits: AutomationLimits = DEFAULT_AUTOMATION_LIMITS;
  private validators: FlowValidators;
  private typeConverters: TypeConverters;
  private executionManager: ExecutionManager;

  constructor() {
    this.validators = new FlowValidators(this.limits);
    this.typeConverters = new TypeConverters();
    this.executionManager = new ExecutionManager();
  }

  async createAutomationFlow(
    flow: Omit<AutomationFlow, 'id'>
  ): Promise<AutomationResult> {
    try {
      const canCreate = await this.validators.checkUserLimits(flow.createdBy, flow.companyId);
      if (!canCreate.success) {
        return canCreate;
      }

      const validation = this.validators.validateFlow(flow);
      if (!validation.success) {
        return validation;
      }

      const flowData = {
        id: crypto.randomUUID(),
        createdBy: flow.createdBy,
        createdAt: new Date().toISOString(),
        name: flow.name,
        trigger: {
          type: flow.trigger.type,
          conditions: flow.trigger.conditions.map(c => ({
            field: c.field,
            operator: c.operator,
            value: c.value
          })),
          delay: flow.trigger.delay
        },
        actions: this.typeConverters.convertActionsToSimpleJson(flow.actions),
        isActive: flow.isActive,
        companyId: flow.companyId,
        industry: flow.industry || '',
        metadata: flow.metadata || {}
      };

      const { data, error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'automation_flow',
          event_summary: `Created automation flow: ${flow.name}`,
          payload: flowData,
          company_id: flow.companyId,
          visibility: 'admin_only'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Automation flow created successfully',
        data: { flowId: data.id }
      };

    } catch (error) {
      logger.error('Error creating automation flow:', error);
      return {
        success: false,
        message: 'Failed to create automation flow'
      };
    }
  }

  async executeFlow(
    flowId: string,
    triggerData: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      const flow = await this.getFlow(flowId);
      if (!flow) {
        return { success: false, message: 'Flow not found' };
      }

      const canExecute = await this.validators.checkExecutionLimits(userId, companyId);
      if (!canExecute.success) {
        return canExecute;
      }

      const execution: Omit<AutomationExecution, 'id'> = {
        flowId,
        leadId: triggerData.leadId,
        userId,
        companyId,
        status: 'pending',
        currentActionIndex: 0,
        startedAt: new Date(),
        logs: []
      };

      const executionId = await this.executionManager.createExecution(execution);

      const result = await this.executionManager.executeActions(
        executionId,
        this.typeConverters.convertSimpleJsonToActions(flow.actions),
        triggerData,
        userId,
        companyId
      );

      return result;

    } catch (error) {
      logger.error('Error executing flow:', error);
      return {
        success: false,
        message: 'Flow execution failed'
      };
    }
  }

  private async getFlow(flowId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('id', flowId)
        .eq('type', 'automation_flow')
        .single();

      if (error || !data) return null;

      const payload = data.payload;
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        return payload;
      }

      return null;

    } catch (error) {
      logger.error('Error getting flow:', error);
      return null;
    }
  }
}

export const nativeAutomationEngine = new NativeAutomationEngine();
