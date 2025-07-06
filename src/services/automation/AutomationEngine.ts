
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { aiOrchestrator } from '@/services/ai/AIOrchestrator';

export interface AutomationWorkflow {
  id: string;
  name: string;
  workspaceType: 'sales' | 'manager' | 'developer';
  triggerType: 'email' | 'form_submit' | 'schedule' | 'button_click' | 'system_event';
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  requiresApproval: boolean;
  isActive: boolean;
  userId: string;
  companyId: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
}

export interface AutomationAction {
  type: 'ai_generate_email' | 'send_email' | 'create_task' | 'update_record' | 'notify_user' | 'trigger_agent';
  parameters: Record<string, any>;
  requiresApproval?: boolean;
}

export interface AutomationExecution {
  id: string;
  workflowId: string;
  triggerData: any;
  status: 'pending' | 'processing' | 'awaiting_approval' | 'completed' | 'failed';
  steps: AutomationStep[];
  userId: string;
  companyId: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface AutomationStep {
  action: AutomationAction;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'awaiting_approval';
  result?: any;
  error?: string;
  timestamp: Date;
}

class AutomationEngine {
  private static instance: AutomationEngine;
  private workflows: Map<string, AutomationWorkflow> = new Map();
  private executions: Map<string, AutomationExecution> = new Map();
  private isActive: boolean = false;

  static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  constructor() {
    this.initializeDefaultWorkflows();
  }

  private initializeDefaultWorkflows() {
    // Email Analysis & Response Workflow
    this.registerWorkflow({
      id: 'email-ai-response',
      name: 'AI Email Analysis & Response Generation',
      workspaceType: 'sales',
      triggerType: 'email',
      conditions: [
        { field: 'from', operator: 'exists', value: true },
        { field: 'body', operator: 'exists', value: true }
      ],
      actions: [
        {
          type: 'ai_generate_email',
          parameters: {
            agentType: 'sales',
            analysisType: 'email_response',
            includeContext: true
          },
          requiresApproval: true
        },
        {
          type: 'notify_user',
          parameters: {
            message: 'AI has generated an email response for your review',
            actionRequired: 'review_and_approve'
          }
        }
      ],
      requiresApproval: true,
      isActive: false,
      userId: '',
      companyId: ''
    });

    // Lead Scoring Automation
    this.registerWorkflow({
      id: 'lead-scoring-automation',
      name: 'Automated Lead Scoring & Prioritization',
      workspaceType: 'sales',
      triggerType: 'form_submit',
      conditions: [
        { field: 'lead_source', operator: 'exists', value: true }
      ],
      actions: [
        {
          type: 'trigger_agent',
          parameters: {
            agentType: 'sales',
            taskType: 'lead_analysis',
            includeScoring: true
          }
        },
        {
          type: 'update_record',
          parameters: {
            table: 'leads',
            updateFields: ['score', 'priority', 'tags']
          }
        },
        {
          type: 'notify_user',
          parameters: {
            message: 'New lead scored and prioritized',
            includeRecommendations: true
          }
        }
      ],
      requiresApproval: false,
      isActive: false,
      userId: '',
      companyId: ''
    });

    // Performance Report Generation
    this.registerWorkflow({
      id: 'performance-report-automation',
      name: 'Automated Performance Report Generation',
      workspaceType: 'manager',
      triggerType: 'schedule',
      conditions: [
        { field: 'report_type', operator: 'equals', value: 'weekly' }
      ],
      actions: [
        {
          type: 'trigger_agent',
          parameters: {
            agentType: 'manager',
            taskType: 'generate_report',
            reportType: 'performance',
            includeTrends: true
          }
        },
        {
          type: 'notify_user',
          parameters: {
            message: 'Weekly performance report generated',
            includeInsights: true
          },
          requiresApproval: true
        }
      ],
      requiresApproval: true,
      isActive: false,
      userId: '',
      companyId: ''
    });

    // System Error Detection & Resolution
    this.registerWorkflow({
      id: 'error-detection-automation',
      name: 'Automated Error Detection & Resolution',
      workspaceType: 'developer',
      triggerType: 'system_event',
      conditions: [
        { field: 'error_level', operator: 'equals', value: 'critical' }
      ],
      actions: [
        {
          type: 'trigger_agent',
          parameters: {
            agentType: 'developer',
            taskType: 'error_analysis',
            includeFix: true
          }
        },
        {
          type: 'create_task',
          parameters: {
            title: 'Critical Error Detected',
            priority: 'high',
            assignToRole: 'developer'
          }
        },
        {
          type: 'notify_user',
          parameters: {
            message: 'Critical error detected and analyzed',
            includeResolution: true
          }
        }
      ],
      requiresApproval: false,
      isActive: false,
      userId: '',
      companyId: ''
    });
  }

  registerWorkflow(workflow: AutomationWorkflow) {
    this.workflows.set(workflow.id, workflow);
    logger.info('Automation workflow registered:', { 
      id: workflow.id, 
      name: workflow.name, 
      workspace: workflow.workspaceType 
    });
  }

  async triggerWorkflow(workflowId: string, triggerData: any, userId: string, companyId: string): Promise<string> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (!this.isActive) {
      // Log trigger for when system goes live
      await this.logWorkflowTrigger(workflowId, triggerData, userId, companyId);
      return `Workflow ${workflow.name} queued for activation`;
    }

    // Check conditions
    if (!this.evaluateConditions(workflow.conditions, triggerData)) {
      logger.info('Workflow conditions not met:', { workflowId, triggerData });
      return 'Workflow conditions not met';
    }

    // Create execution
    const execution: AutomationExecution = {
      id: crypto.randomUUID(),
      workflowId,
      triggerData,
      status: 'pending',
      steps: [],
      userId,
      companyId,
      createdAt: new Date()
    };

    this.executions.set(execution.id, execution);
    
    // Start execution
    this.executeWorkflow(execution);

    return execution.id;
  }

  private async executeWorkflow(execution: AutomationExecution): Promise<void> {
    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return;

    try {
      execution.status = 'processing';
      await this.updateExecutionStatus(execution);

      for (const action of workflow.actions) {
        const step: AutomationStep = {
          action,
          status: 'pending',
          timestamp: new Date()
        };

        execution.steps.push(step);

        try {
          step.status = 'processing';
          
          if (action.requiresApproval) {
            step.status = 'awaiting_approval';
            execution.status = 'awaiting_approval';
            await this.requestApproval(execution, step);
            return; // Wait for approval
          }

          const result = await this.executeAction(action, execution.triggerData, execution.userId, execution.companyId);
          step.result = result;
          step.status = 'completed';

        } catch (error) {
          step.error = (error as Error).message;
          step.status = 'failed';
          execution.status = 'failed';
          await this.updateExecutionStatus(execution);
          return;
        }
      }

      execution.status = 'completed';
      execution.completedAt = new Date();
      await this.updateExecutionStatus(execution);

    } catch (error) {
      execution.status = 'failed';
      await this.updateExecutionStatus(execution);
      logger.error('Workflow execution failed:', error);
    }
  }

  private async executeAction(action: AutomationAction, triggerData: any, userId: string, companyId: string): Promise<any> {
    switch (action.type) {
      case 'ai_generate_email':
        return await this.generateAIEmail(action.parameters, triggerData, userId, companyId);
      
      case 'send_email':
        return await this.sendEmail(action.parameters, triggerData, userId, companyId);
      
      case 'create_task':
        return await this.createTask(action.parameters, triggerData, userId, companyId);
      
      case 'update_record':
        return await this.updateRecord(action.parameters, triggerData, userId, companyId);
      
      case 'notify_user':
        return await this.notifyUser(action.parameters, triggerData, userId, companyId);
      
      case 'trigger_agent':
        return await this.triggerAgent(action.parameters, triggerData, userId, companyId);
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async generateAIEmail(parameters: any, triggerData: any, userId: string, companyId: string): Promise<any> {
    const prompt = `Analyze the following email and generate an appropriate response:
    
From: ${triggerData.from}
Subject: ${triggerData.subject}
Body: ${triggerData.body}

Generate a professional, contextual response.`;

    const response = await aiOrchestrator.processRequest({
      userId,
      companyId,
      workspace: 'sales',
      agentType: 'chat',
      inputType: 'automation',
      prompt,
      context: { originalEmail: triggerData }
    });

    return {
      generatedResponse: response.response,
      aiModel: response.model,
      confidence: response.confidence,
      suggestedActions: response.suggestedActions
    };
  }

  private async sendEmail(parameters: any, triggerData: any, userId: string, companyId: string): Promise<any> {
    // This will integrate with email service when live
    logger.info('Email sending queued:', { to: parameters.to, subject: parameters.subject });
    return { status: 'queued', messageId: crypto.randomUUID() };
  }

  private async createTask(parameters: any, triggerData: any, userId: string, companyId: string): Promise<any> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        company_id: companyId,
        type: 'task',
        title: parameters.title,
        message: parameters.description || 'Automated task created',
        metadata: {
          priority: parameters.priority,
          automationTriggered: true,
          triggerData: triggerData
        }
      });

    if (error) throw error;
    return { status: 'created', type: 'task' };
  }

  private async updateRecord(parameters: any, triggerData: any, userId: string, companyId: string): Promise<any> {
    // Implementation depends on the table and fields to update
    logger.info('Record update queued:', { table: parameters.table, fields: parameters.updateFields });
    return { status: 'queued', table: parameters.table };
  }

  private async notifyUser(parameters: any, triggerData: any, userId: string, companyId: string): Promise<any> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        company_id: companyId,
        type: 'automation_notification',
        title: 'Automation Alert',
        message: parameters.message,
        metadata: {
          automationTriggered: true,
          actionRequired: parameters.actionRequired,
          triggerData: triggerData
        }
      });

    if (error) throw error;
    return { status: 'sent', type: 'notification' };
  }

  private async triggerAgent(parameters: any, triggerData: any, userId: string, companyId: string): Promise<any> {
    const agentResponse = await aiOrchestrator.processRequest({
      userId,
      companyId,
      workspace: parameters.workspace || 'sales',
      agentType: parameters.agentType,
      inputType: 'automation',
      prompt: `Task: ${parameters.taskType}\nData: ${JSON.stringify(triggerData)}`,
      context: parameters
    });

    return {
      agentResponse: agentResponse.response,
      agentType: parameters.agentType,
      taskType: parameters.taskType,
      confidence: agentResponse.confidence
    };
  }

  private evaluateConditions(conditions: AutomationCondition[], data: any): boolean {
    return conditions.every(condition => {
      const value = data[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return typeof value === 'string' && value.includes(condition.value);
        case 'greater_than':
          return Number(value) > Number(condition.value);
        case 'less_than':
          return Number(value) < Number(condition.value);
        case 'exists':
          return value !== undefined && value !== null;
        default:
          return false;
      }
    });
  }

  private async requestApproval(execution: AutomationExecution, step: AutomationStep): Promise<void> {
    await supabase
      .from('notifications')
      .insert({
        user_id: execution.userId,
        company_id: execution.companyId,
        type: 'approval_required',
        title: 'Automation Approval Required',
        message: `Action "${step.action.type}" requires your approval`,
        metadata: {
          executionId: execution.id,
          stepIndex: execution.steps.length - 1,
          action: step.action,
          triggerData: execution.triggerData
        }
      });
  }

  private async updateExecutionStatus(execution: AutomationExecution): Promise<void> {
    // Log execution status
    await supabase
      .from('automation_trigger_events')
      .upsert({
        trigger_id: execution.id,
        event_type: 'workflow_execution',
        status: execution.status,
        user_id: execution.userId,
        company_id: execution.companyId,
        metadata: {
          workflowId: execution.workflowId,
          steps: execution.steps.map(s => ({
            action: s.action.type,
            status: s.status,
            timestamp: s.timestamp
          }))
        }
      });
  }

  private async logWorkflowTrigger(workflowId: string, triggerData: any, userId: string, companyId: string): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    await supabase
      .from('automation_trigger_events')
      .insert({
        trigger_id: crypto.randomUUID(),
        event_type: 'workflow_triggered',
        source_data: triggerData,
        target_agent: workflow?.workspaceType || 'unknown',
        status: 'queued',
        user_id: userId,
        company_id: companyId,
        metadata: {
          workflowId,
          workflowName: workflow?.name,
          triggerType: workflow?.triggerType
        }
      });
  }

  // Public API methods
  async approveStep(executionId: string, stepIndex: number, userId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.userId !== userId) {
      throw new Error('Execution not found or unauthorized');
    }

    const step = execution.steps[stepIndex];
    if (!step || step.status !== 'awaiting_approval') {
      throw new Error('Step not found or not awaiting approval');
    }

    // Continue execution from this step
    step.status = 'processing';
    execution.status = 'processing';

    try {
      const result = await this.executeAction(step.action, execution.triggerData, execution.userId, execution.companyId);
      step.result = result;
      step.status = 'completed';

      // Continue with remaining steps
      await this.executeWorkflow(execution);
    } catch (error) {
      step.error = (error as Error).message;
      step.status = 'failed';
      execution.status = 'failed';
      await this.updateExecutionStatus(execution);
    }
  }

  async activateAutomation(): Promise<void> {
    this.isActive = true;
    
    // Activate all workflows
    for (const [id, workflow] of this.workflows) {
      workflow.isActive = true;
    }

    logger.info('🚀 AUTOMATION ENGINE ACTIVATED - All workflows ready');
  }

  getSystemStatus() {
    const totalWorkflows = this.workflows.size;
    const activeWorkflows = Array.from(this.workflows.values()).filter(w => w.isActive).length;
    const pendingExecutions = Array.from(this.executions.values()).filter(e => e.status === 'pending' || e.status === 'processing').length;
    const awaitingApproval = Array.from(this.executions.values()).filter(e => e.status === 'awaiting_approval').length;

    return {
      isActive: this.isActive,
      totalWorkflows,
      activeWorkflows,
      pendingExecutions,
      awaitingApproval,
      workflows: Array.from(this.workflows.values()).map(w => ({
        id: w.id,
        name: w.name,
        workspaceType: w.workspaceType,
        triggerType: w.triggerType,
        isActive: w.isActive,
        requiresApproval: w.requiresApproval
      }))
    };
  }
}

export const automationEngine = AutomationEngine.getInstance();
