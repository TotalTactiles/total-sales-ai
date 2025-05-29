
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { unifiedAIService } from '../ai/unifiedAIService';

export interface WorkflowTrigger {
  type: 'voice_command' | 'lead_status_change' | 'time_based' | 'email_received' | 'call_completed';
  conditions: Record<string, any>;
}

export interface WorkflowAction {
  type: 'send_email' | 'make_call' | 'update_lead' | 'create_task' | 'send_sms' | 'ai_analysis';
  parameters: Record<string, any>;
  delay?: number; // seconds
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  createdBy: string;
  createdAt: string;
  lastRun?: string;
  runCount: number;
}

export class WorkflowService {
  private static instance: WorkflowService;
  private workflows: Workflow[] = [];
  private maxFlowsPerUser = 10;
  private maxActionsPerFlow = 10;

  static getInstance(): WorkflowService {
    if (!WorkflowService.instance) {
      WorkflowService.instance = new WorkflowService();
    }
    return WorkflowService.instance;
  }

  async getUserWorkflows(): Promise<Workflow[]> {
    try {
      // For now, use mock data since automation_workflows table doesn't exist
      // This will be replaced when the table is created
      const mockWorkflows: Workflow[] = [
        {
          id: 'workflow-1',
          name: 'New Lead Follow-up',
          description: 'Automatically follow up with new leads within 5 minutes',
          isActive: true,
          trigger: {
            type: 'lead_status_change',
            conditions: { status: 'new' }
          },
          actions: [
            {
              type: 'send_email',
              parameters: { template: 'welcome_new_lead' },
              delay: 300
            }
          ],
          createdBy: 'current-user',
          createdAt: '2024-01-10T00:00:00Z',
          runCount: 15,
          lastRun: '2024-01-16T08:30:00Z'
        }
      ];

      this.workflows = mockWorkflows;
      return this.workflows;
    } catch (error) {
      logger.error('Failed to fetch workflows', error, 'automation');
      return [];
    }
  }

  async createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'runCount'>): Promise<string | null> {
    try {
      // Check user limits
      if (this.workflows.length >= this.maxFlowsPerUser) {
        toast.error(`Maximum ${this.maxFlowsPerUser} workflows allowed per user`);
        return null;
      }

      if (workflow.actions.length > this.maxActionsPerFlow) {
        toast.error(`Maximum ${this.maxActionsPerFlow} actions allowed per workflow`);
        return null;
      }

      // For now, simulate creation
      const newWorkflow: Workflow = {
        ...workflow,
        id: `workflow-${Date.now()}`,
        createdAt: new Date().toISOString(),
        runCount: 0
      };

      this.workflows.push(newWorkflow);
      toast.success('Workflow created successfully');
      logger.info('Workflow created', { workflowId: newWorkflow.id, name: workflow.name }, 'automation');
      
      return newWorkflow.id;
    } catch (error) {
      logger.error('Failed to create workflow', error, 'automation');
      toast.error('Failed to create workflow');
      return null;
    }
  }

  async executeWorkflow(workflowId: string, triggerData?: any): Promise<boolean> {
    try {
      const workflow = this.workflows.find(w => w.id === workflowId);
      if (!workflow || !workflow.isActive) {
        throw new Error('Workflow not found or inactive');
      }

      logger.info('Executing workflow', { workflowId, name: workflow.name }, 'automation');

      for (const action of workflow.actions) {
        if (action.delay) {
          await new Promise(resolve => setTimeout(resolve, action.delay * 1000));
        }

        const success = await this.executeAction(action, triggerData);
        if (!success) {
          await this.handleActionFailure(action, workflow, triggerData);
        }
      }

      await this.updateWorkflowRunCount(workflowId);
      
      return true;
    } catch (error) {
      logger.error('Workflow execution failed', error, 'automation');
      return false;
    }
  }

  private async executeAction(action: WorkflowAction, triggerData?: any): Promise<boolean> {
    try {
      switch (action.type) {
        case 'send_email':
          return await this.sendEmail(action.parameters, triggerData);
          
        case 'make_call':
          return await this.makeCall(action.parameters, triggerData);
          
        case 'update_lead':
          return await this.updateLead(action.parameters, triggerData);
          
        case 'create_task':
          return await this.createTask(action.parameters, triggerData);
          
        case 'send_sms':
          return await this.sendSMS(action.parameters, triggerData);
          
        case 'ai_analysis':
          return await this.performAIAnalysis(action.parameters, triggerData);
          
        default:
          logger.warn('Unknown action type', { actionType: action.type }, 'automation');
          return false;
      }
    } catch (error) {
      logger.error('Action execution failed', error, 'automation');
      return false;
    }
  }

  private async sendEmail(parameters: any, triggerData?: any): Promise<boolean> {
    try {
      // Simulate email sending for now
      console.log('Sending email:', { parameters, triggerData });
      return true;
    } catch (error) {
      logger.error('Email sending failed', error, 'automation');
      return false;
    }
  }

  private async makeCall(parameters: any, triggerData?: any): Promise<boolean> {
    try {
      // Simulate call making for now
      console.log('Making call:', { parameters, triggerData });
      return true;
    } catch (error) {
      logger.error('Call initiation failed', error, 'automation');
      return false;
    }
  }

  private async updateLead(parameters: any, triggerData?: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .update(parameters.updates)
        .eq('id', parameters.leadId || triggerData?.leadId);

      return !error;
    } catch (error) {
      logger.error('Lead update failed', error, 'automation');
      return false;
    }
  }

  private async createTask(parameters: any, triggerData?: any): Promise<boolean> {
    try {
      // For now, simulate task creation since tasks table may not exist
      console.log('Creating task:', { parameters, triggerData });
      return true;
    } catch (error) {
      logger.error('Task creation failed', error, 'automation');
      return false;
    }
  }

  private async sendSMS(parameters: any, triggerData?: any): Promise<boolean> {
    try {
      // Simulate SMS sending for now
      console.log('Sending SMS:', { parameters, triggerData });
      return true;
    } catch (error) {
      logger.error('SMS sending failed', error, 'automation');
      return false;
    }
  }

  private async performAIAnalysis(parameters: any, triggerData?: any): Promise<boolean> {
    try {
      const prompt = parameters.prompt || 'Analyze the provided data and generate insights';
      const context = JSON.stringify(triggerData || {});
      
      const response = await unifiedAIService.generateResponse(prompt, undefined, context);
      
      // Log the analysis result instead of storing in non-existent table
      console.log('AI Analysis completed:', response);

      return true;
    } catch (error) {
      logger.error('AI analysis failed', error, 'automation');
      return false;
    }
  }

  private async handleActionFailure(action: WorkflowAction, workflow: Workflow, triggerData?: any): Promise<void> {
    try {
      const missingDataPrompt = `Workflow "${workflow.name}" failed at action "${action.type}". 
        Required data: ${JSON.stringify(action.parameters)}
        Available data: ${JSON.stringify(triggerData || {})}
        Please suggest how to fix this or proceed with an optimized fallback.`;

      const aiResponse = await unifiedAIService.generateResponse(
        missingDataPrompt,
        'You are an automation assistant helping to resolve workflow issues.',
        'automation_error'
      );

      logger.warn('Workflow action failed - AI suggestion provided', {
        workflowId: workflow.id,
        actionType: action.type,
        aiSuggestion: aiResponse.response
      }, 'automation');

      toast.warning(`Workflow "${workflow.name}" needs attention. Check logs for AI suggestions.`);
    } catch (error) {
      logger.error('Failed to handle action failure', error, 'automation');
    }
  }

  async triggerWorkflowsByType(triggerType: string, triggerData: any): Promise<void> {
    const activeWorkflows = this.workflows.filter(w => 
      w.isActive && w.trigger.type === triggerType
    );

    for (const workflow of activeWorkflows) {
      if (this.evaluateTriggerConditions(workflow.trigger, triggerData)) {
        await this.executeWorkflow(workflow.id, triggerData);
      }
    }
  }

  private evaluateTriggerConditions(trigger: WorkflowTrigger, data: any): boolean {
    for (const [key, expectedValue] of Object.entries(trigger.conditions)) {
      if (data[key] !== expectedValue) {
        return false;
      }
    }
    return true;
  }

  private async updateWorkflowRunCount(workflowId: string): Promise<void> {
    // Simulate updating run count
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (workflow) {
      workflow.runCount += 1;
      workflow.lastRun = new Date().toISOString();
    }
  }

  async deleteWorkflow(workflowId: string): Promise<boolean> {
    try {
      this.workflows = this.workflows.filter(w => w.id !== workflowId);
      toast.success('Workflow deleted successfully');
      return true;
    } catch (error) {
      logger.error('Failed to delete workflow', error, 'automation');
      toast.error('Failed to delete workflow');
      return false;
    }
  }

  async toggleWorkflow(workflowId: string, isActive: boolean): Promise<boolean> {
    try {
      const workflow = this.workflows.find(w => w.id === workflowId);
      if (workflow) {
        workflow.isActive = isActive;
      }

      toast.success(`Workflow ${isActive ? 'activated' : 'deactivated'}`);
      return true;
    } catch (error) {
      logger.error('Failed to toggle workflow', error, 'automation');
      toast.error('Failed to toggle workflow');
      return false;
    }
  }
}

export const workflowService = WorkflowService.getInstance();
