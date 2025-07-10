
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  isConfigured: boolean;
}

export interface WorkflowConnection {
  id: string;
  fromNode: string;
  toNode: string;
  fromHandle: string;
  targetHandle: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  steps: WorkflowStep[];
  connections: WorkflowConnection[];
  createdAt: Date;
  updatedAt: Date;
  isValid?: boolean;
  testResults?: any[];
}

class WorkflowService {
  async createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'automation_workflow',
          event_summary: `Created workflow: ${workflow.name}`,
          payload: {
            name: workflow.name,
            description: workflow.description,
            isActive: workflow.isActive,
            steps: workflow.steps,
            connections: workflow.connections,
            isValid: workflow.isValid || false,
            testResults: workflow.testResults || []
          },
          company_id: await this.getCurrentCompanyId(),
          visibility: 'admin_only'
        })
        .select()
        .single();

      if (error) throw error;

      const savedWorkflow: Workflow = {
        id: data.id,
        name: workflow.name,
        description: workflow.description,
        isActive: workflow.isActive,
        steps: workflow.steps,
        connections: workflow.connections,
        createdAt: new Date(data.timestamp),
        updatedAt: new Date(data.timestamp),
        isValid: workflow.isValid,
        testResults: workflow.testResults
      };

      toast.success('Workflow created successfully');
      return savedWorkflow;
    } catch (error) {
      logger.error('Failed to create workflow', error);
      toast.error('Failed to create workflow');
      throw error;
    }
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .update({
          payload: {
            ...updates,
            updatedAt: new Date().toISOString()
          }
        })
        .eq('id', id)
        .eq('type', 'automation_workflow')
        .select()
        .single();

      if (error) throw error;

      toast.success('Workflow updated successfully');
      return this.mapPayloadToWorkflow(data);
    } catch (error) {
      logger.error('Failed to update workflow', error);
      toast.error('Failed to update workflow');
      throw error;
    }
  }

  async getWorkflows(): Promise<Workflow[]> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'automation_workflow')
        .eq('company_id', await this.getCurrentCompanyId())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return data.map(this.mapPayloadToWorkflow);
    } catch (error) {
      logger.error('Failed to get workflows', error);
      return [];
    }
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('id', id)
        .eq('type', 'automation_workflow')
        .single();

      if (error) throw error;

      return this.mapPayloadToWorkflow(data);
    } catch (error) {
      logger.error('Failed to get workflow', error);
      return null;
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_brain_logs')
        .delete()
        .eq('id', id)
        .eq('type', 'automation_workflow');

      if (error) throw error;

      toast.success('Workflow deleted successfully');
    } catch (error) {
      logger.error('Failed to delete workflow', error);
      toast.error('Failed to delete workflow');
      throw error;
    }
  }

  async executeWorkflow(workflowId: string, triggerData: any): Promise<void> {
    try {
      const workflow = await this.getWorkflow(workflowId);
      if (!workflow || !workflow.isActive) {
        throw new Error('Workflow not found or inactive');
      }

      logger.info('Executing workflow', { workflowId, triggerData });
      
      // Create execution log
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'workflow_execution',
          event_summary: `Executing workflow: ${workflow.name}`,
          payload: {
            workflowId,
            workflowName: workflow.name,
            triggerData,
            startedAt: new Date().toISOString(),
            status: 'started'
          },
          company_id: await this.getCurrentCompanyId(),
          visibility: 'admin_only'
        });

      // Execute workflow steps in sequence based on connections
      for (const step of workflow.steps) {
        await this.executeStep(step, triggerData);
      }

      toast.success('Workflow executed successfully');
    } catch (error) {
      logger.error('Workflow execution failed', error);
      toast.error('Workflow execution failed');
      throw error;
    }
  }

  async cloneWorkflow(id: string, newName: string): Promise<Workflow> {
    try {
      const originalWorkflow = await this.getWorkflow(id);
      if (!originalWorkflow) {
        throw new Error('Original workflow not found');
      }

      const clonedWorkflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
        name: newName,
        description: `Cloned from ${originalWorkflow.name}`,
        isActive: false, // Start cloned workflows as inactive
        steps: originalWorkflow.steps.map(step => ({
          ...step,
          id: `${step.id}-clone-${Date.now()}`
        })),
        connections: originalWorkflow.connections.map(conn => ({
          ...conn,
          id: `${conn.id}-clone-${Date.now()}`,
          fromNode: `${conn.fromNode}-clone-${Date.now()}`,
          toNode: `${conn.toNode}-clone-${Date.now()}`
        })),
        isValid: originalWorkflow.isValid,
        testResults: []
      };

      return await this.createWorkflow(clonedWorkflow);
    } catch (error) {
      logger.error('Failed to clone workflow', error);
      toast.error('Failed to clone workflow');
      throw error;
    }
  }

  private async executeStep(step: WorkflowStep, data: any): Promise<void> {
    switch (step.type) {
      case 'trigger':
        // Trigger steps are entry points, no execution needed
        logger.info('Trigger step activated', { step: step.name, data });
        break;
      case 'action':
        await this.executeAction(step, data);
        break;
      case 'condition':
        await this.evaluateCondition(step, data);
        break;
      case 'delay':
        await this.executeDelay(step, data);
        break;
    }
  }

  private async executeAction(step: WorkflowStep, data: any): Promise<void> {
    logger.info('Executing action step', { step: step.name, config: step.config, data });
    
    switch (step.config.actionType) {
      case 'send_email':
        // Implement email sending logic
        break;
      case 'apply_tag':
        // Implement tag application logic
        break;
      case 'change_stage':
        // Implement stage change logic
        break;
      case 'assign_user':
        // Implement user assignment logic
        break;
      case 'trigger_notification':
        // Implement notification logic
        break;
    }
  }

  private async evaluateCondition(step: WorkflowStep, data: any): Promise<boolean> {
    logger.info('Evaluating condition step', { step: step.name, config: step.config, data });
    
    switch (step.config.conditionType) {
      case 'has_tag':
        return data.tags?.includes(step.config.conditionValue) || false;
      case 'field_equals':
        return data[step.config.fieldName] === step.config.conditionValue;
      case 'lead_score_above':
        return (data.score || 0) > parseInt(step.config.conditionValue);
      case 'lead_score_below':
        return (data.score || 0) < parseInt(step.config.conditionValue);
      default:
        return true;
    }
  }

  private async executeDelay(step: WorkflowStep, data: any): Promise<void> {
    const delayAmount = parseInt(step.config.delayAmount) || 1;
    const delayUnit = step.config.delayUnit || 'minutes';
    
    logger.info('Executing delay step', { 
      step: step.name, 
      delayAmount, 
      delayUnit, 
      data 
    });
    
    // In a real implementation, this would schedule the next step
    // For now, we'll just log it
  }

  private mapPayloadToWorkflow(data: any): Workflow {
    const payload = data.payload || {};
    return {
      id: data.id,
      name: payload.name || 'Untitled Workflow',
      description: payload.description || '',
      isActive: payload.isActive || false,
      steps: payload.steps || [],
      connections: payload.connections || [],
      createdAt: new Date(data.timestamp),
      updatedAt: new Date(payload.updatedAt || data.timestamp),
      isValid: payload.isValid,
      testResults: payload.testResults
    };
  }

  private async getCurrentCompanyId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    
    return profile?.company_id || user.id;
  }
}

export const workflowService = new WorkflowService();
