import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { SimpleAutomationFlow, FlowExecutionContext } from './types/automationFlowTypes';

export class AutomationFlowService {
  async evaluateFlowTriggers(
    trigger: string,
    eventData: FlowExecutionContext
  ): Promise<void> {
    try {
      const { data: flows, error } = await supabase
        .from('ai_brain_logs')
        .select('id, payload')
        .eq('type', 'automation_flow');

      if (error) throw error;

      for (const flowLog of flows || []) {
        const flowData = this.extractSimpleFlowData(flowLog.payload);
        
        if (flowData && flowData.trigger.type === trigger && flowData.isActive) {
          const conditionsMatch = this.evaluateSimpleConditions(
            flowData.trigger.conditions, 
            eventData
          );
          
          if (conditionsMatch) {
            await this.logFlowExecution(flowLog.id, eventData);
          }
        }
      }
    } catch (error) {
      logger.error('Error evaluating flow triggers:', error);
    }
  }

  private extractSimpleFlowData(payload: any): SimpleAutomationFlow | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return {
      id: String(payload.id || ''),
      name: String(payload.name || ''),
      trigger: {
        type: String(payload.trigger?.type || 'custom'),
        conditions: Array.isArray(payload.trigger?.conditions) 
          ? payload.trigger.conditions 
          : [],
        delay: payload.trigger?.delay
      },
      actions: Array.isArray(payload.actions) ? payload.actions : [],
      isActive: Boolean(payload.isActive),
      companyId: String(payload.companyId || ''),
      createdBy: String(payload.createdBy || '')
    };
  }

  private evaluateSimpleConditions(
    conditions: any[], 
    eventData: FlowExecutionContext
  ): boolean {
    if (!Array.isArray(conditions)) return true;
    
    return conditions.every(condition => {
      if (!condition || typeof condition !== 'object') return false;
      
      const { field, operator, value } = condition;
      const eventValue = eventData[field];

      switch (operator) {
        case 'equals':
          return eventValue === value;
        case 'contains':
          return String(eventValue).includes(String(value));
        case 'greater_than':
          return Number(eventValue) > Number(value);
        case 'less_than':
          return Number(eventValue) < Number(value);
        case 'exists':
          return eventValue !== undefined && eventValue !== null;
        default:
          return false;
      }
    });
  }

  private async logFlowExecution(flowId: string, eventData: FlowExecutionContext): Promise<void> {
    try {
      // Convert eventData to simple Json-compatible object
      const jsonEventData: Record<string, string> = {};
      Object.keys(eventData).forEach(key => {
        jsonEventData[key] = String(eventData[key] || '');
      });

      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'flow_execution',
          event_summary: `Flow ${flowId} triggered`,
          payload: {
            flowId,
            eventData: jsonEventData,
            timestamp: new Date().toISOString()
          },
          company_id: eventData.companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Error logging flow execution:', error);
    }
  }
}

export const automationFlowService = new AutomationFlowService();
