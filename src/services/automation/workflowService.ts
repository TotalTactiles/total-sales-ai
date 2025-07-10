import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'ai_action';
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
      
      // Enhanced execution with AI and OS integration
      const executionContext = {
        workflowId,
        triggerData,
        startTime: new Date().toISOString(),
        userId: await this.getCurrentUserId(),
        companyId: await this.getCurrentCompanyId()
      };

      // Create execution log
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'workflow_execution',
          event_summary: `Executing workflow: ${workflow.name}`,
          payload: {
            ...executionContext,
            status: 'started'
          },
          company_id: executionContext.companyId,
          visibility: 'admin_only'
        });

      // Execute workflow steps with enhanced logic
      await this.executeWorkflowSteps(workflow, executionContext);

      toast.success('Workflow executed successfully');
    } catch (error) {
      logger.error('Workflow execution failed', error);
      toast.error('Workflow execution failed');
      throw error;
    }
  }

  private async executeWorkflowSteps(workflow: Workflow, context: any): Promise<void> {
    const executionOrder = this.getStepExecutionOrder(workflow.steps, workflow.connections);
    
    for (const step of executionOrder) {
      try {
        const result = await this.executeStep(step, context);
        
        // Log step execution
        await supabase
          .from('ai_brain_logs')
          .insert({
            type: 'workflow_step_execution',
            event_summary: `Step executed: ${step.name}`,
            payload: {
              workflowId: workflow.id,
              stepId: step.id,
              stepType: step.type,
              result,
              context
            },
            company_id: context.companyId,
            visibility: 'admin_only'
          });

        // Handle conditional branching
        if (step.type === 'condition' && !result.success) {
          // Follow the "NO" branch
          const noBranchSteps = this.getConditionalBranchSteps(step.id, workflow.connections, 'no');
          for (const branchStep of noBranchSteps) {
            await this.executeStep(branchStep, context);
          }
          break; // Exit main flow
        }

      } catch (error) {
        logger.error('Step execution failed', { stepId: step.id, error });
        
        // Log error
        await supabase
          .from('ai_brain_logs')
          .insert({
            type: 'workflow_error',
            event_summary: `Step failed: ${step.name}`,
            payload: {
              workflowId: workflow.id,
              stepId: step.id,
              error: error.message,
              context
            },
            company_id: context.companyId,
            visibility: 'admin_only'
          });

        // Stop execution on critical errors
        if (step.type === 'trigger') {
          throw error;
        }
      }
    }
  }

  private async executeStep(step: WorkflowStep, context: any): Promise<any> {
    switch (step.type) {
      case 'trigger':
        return await this.executeTrigger(step, context);
      case 'condition':
        return await this.executeCondition(step, context);
      case 'action':
        return await this.executeAction(step, context);
      case 'ai_action':
        return await this.executeAIAction(step, context);
      case 'delay':
        return await this.executeDelay(step, context);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeTrigger(step: WorkflowStep, context: any): Promise<any> {
    logger.info('Executing trigger step', { step: step.name, config: step.config });
    
    const triggerType = step.config.triggerType;
    
    switch (triggerType) {
      case 'form_submitted':
        return { success: true, message: 'Form submission detected' };
      
      case 'button_clicked':
        // Check if specific button was clicked
        const buttonId = step.config.osElement || step.config.buttonId;
        return { success: true, message: `Button ${buttonId} clicked` };
      
      case 'new_lead_added':
        return { success: !!context.triggerData.leadId, message: 'New lead trigger' };
      
      case 'tag_applied':
        const requiredTag = step.config.tagName;
        const leadTags = context.triggerData.tags || [];
        return { 
          success: leadTags.includes(requiredTag), 
          message: `Tag ${requiredTag} check` 
        };
      
      case 'ai_assistant_triggered':
        return { success: true, message: 'AI Assistant activated' };
      
      default:
        return { success: true, message: `Trigger ${triggerType} activated` };
    }
  }

  private async executeCondition(step: WorkflowStep, context: any): Promise<any> {
    logger.info('Executing condition step', { step: step.name, config: step.config });
    
    const conditionType = step.config.conditionType;
    const data = context.triggerData;
    
    switch (conditionType) {
      case 'has_tag':
        const requiredTag = step.config.conditionValue;
        const tags = data.tags || [];
        return { success: tags.includes(requiredTag), message: `Tag check: ${requiredTag}` };
      
      case 'field_equals':
        const fieldName = step.config.fieldName || 'status';
        const expectedValue = step.config.conditionValue;
        return { 
          success: data[fieldName] === expectedValue, 
          message: `Field check: ${fieldName} = ${expectedValue}` 
        };
      
      case 'lead_score_above':
        const threshold = parseInt(step.config.conditionValue) || 50;
        const score = data.score || 0;
        return { 
          success: score > threshold, 
          message: `Score check: ${score} > ${threshold}` 
        };
      
      case 'ai_sentiment':
        // This would integrate with AI sentiment analysis
        const expectedSentiment = step.config.conditionValue;
        const actualSentiment = await this.analyzeAISentiment(data);
        return { 
          success: actualSentiment === expectedSentiment, 
          message: `Sentiment: ${actualSentiment}` 
        };
      
      case 'message_contains':
        const searchTerm = step.config.conditionValue;
        const message = data.messageContent || '';
        return { 
          success: message.toLowerCase().includes(searchTerm.toLowerCase()), 
          message: `Message contains: ${searchTerm}` 
        };
      
      default:
        return { success: true, message: `Condition ${conditionType} evaluated` };
    }
  }

  private async executeAction(step: WorkflowStep, context: any): Promise<any> {
    logger.info('Executing action step', { step: step.name, config: step.config });
    
    const actionType = step.config.actionType;
    const data = context.triggerData;
    
    switch (actionType) {
      case 'send_email':
        return await this.sendEmail(step, data);
      
      case 'assign_user':
        return await this.assignUser(step, data);
      
      case 'change_stage':
        return await this.changeLeadStage(step, data);
      
      case 'apply_tag':
        return await this.applyTag(step, data);
      
      case 'create_task':
        return await this.createTask(step, data);
      
      case 'trigger_notification':
        return await this.sendNotification(step, data, context.userId);
      
      case 'ai_auto_reply':
        return await this.generateAIDraftReply(data);
      
      case 'schedule_call':
        return await this.scheduleCall(step, data);
      
      case 'send_sms':
        return await this.sendSMS(step, data);
      
      case 'webhook':
        return await this.callWebhook(step, data);
      
      case 'crm_sync':
        return await this.syncToCRM(step, data);
      
      default:
        return { success: false, message: `Unknown action: ${actionType}` };
    }
  }

  private async executeAIAction(step: WorkflowStep, context: any): Promise<any> {
    logger.info('Executing AI action step', { step: step.name, config: step.config });
    
    const actionType = step.config.actionType;
    const data = context.triggerData;
    
    switch (actionType) {
      case 'ai_draft_reply':
        return await this.generateAIDraftReply(data);
      
      case 'ai_call_summary':
        return await this.generateCallSummary(data);
      
      case 'ai_objection_handler':
        return await this.handleObjectionWithAI(data);
      
      case 'ai_lead_insights':
        return await this.generateLeadInsights(data);
      
      case 'ai_next_best_action':
        return await this.suggestNextBestAction(data);
      
      case 'ai_lead_scoring':
        return await this.updateAILeadScore(data);
      
      default:
        return { success: false, message: `Unknown AI action: ${actionType}` };
    }
  }

  private async executeDelay(step: WorkflowStep, context: any): Promise<any> {
    const delayAmount = parseInt(step.config.delayAmount) || 1;
    const delayUnit = step.config.delayUnit || 'minutes';
    
    logger.info('Executing delay step', { 
      step: step.name, 
      delayAmount, 
      delayUnit
    });
    
    // In production, this would schedule the next step
    // For now, we'll just log the delay
    return { 
      success: true, 
      message: `Delay scheduled: ${delayAmount} ${delayUnit}`,
      scheduledFor: this.calculateScheduledTime(delayAmount, delayUnit)
    };
  }

  // AI Integration Methods
  private async analyzeAISentiment(data: any): Promise<string> {
    // This would integrate with the AI service
    // For now, return mock sentiment based on message content
    const message = data.messageContent || '';
    
    if (message.includes('love') || message.includes('great') || message.includes('perfect')) {
      return 'very_positive';
    } else if (message.includes('interested') || message.includes('good')) {
      return 'positive';
    } else if (message.includes('not') || message.includes('no') || message.includes('cancel')) {
      return 'negative';
    }
    
    return 'neutral';
  }

  private async generateAIDraftReply(data: any): Promise<any> {
    // This would integrate with OpenAI or another AI service
    const prompt = `Generate a professional reply to this message from ${data.name}: "${data.messageContent}"`;
    
    // Mock AI response
    const aiReply = `Hi ${data.name},\n\nThank you for your message. I'd be happy to help you with that. Let me know if you'd like to schedule a quick call to discuss this further.\n\nBest regards`;
    
    return {
      success: true,
      message: 'AI reply generated',
      aiReply,
      prompt
    };
  }

  private async generateCallSummary(data: any): Promise<any> {
    // Mock call summary generation
    return {
      success: true,
      message: 'Call summary generated',
      summary: `Call with ${data.name} - Discussed pricing and timeline. Next steps: Send proposal by Friday.`
    };
  }

  private async generateLeadInsights(data: any): Promise<any> {
    // Mock lead insights
    const insights = [
      `${data.name} has shown high engagement with pricing content`,
      `Company size suggests enterprise-level needs`,
      `Timeline appears urgent based on communication tone`
    ];
    
    return {
      success: true,
      message: 'Lead insights generated',
      insights
    };
  }

  private async updateAILeadScore(data: any): Promise<any> {
    // Mock AI lead scoring
    const currentScore = data.score || 50;
    const factors = {
      engagement: data.emailOpened ? 10 : 0,
      company_size: data.company?.includes('Corp') ? 15 : 5,
      urgency: data.messageContent?.includes('urgent') ? 20 : 0
    };
    
    const newScore = Math.min(100, currentScore + Object.values(factors).reduce((a, b) => a + b, 0));
    
    return {
      success: true,
      message: `Lead score updated: ${currentScore} → ${newScore}`,
      oldScore: currentScore,
      newScore,
      factors
    };
  }

  private async handleObjectionWithAI(data: any): Promise<any> {
    // Mock AI objection handling
    const objection = data.messageContent || 'Price is too high';
    const response = `Here's how to handle the objection "${objection}": Acknowledge their concern, provide value justification, and offer alternatives.`;
    
    return {
      success: true,
      message: 'AI objection handling complete',
      response,
      objection
    };
  }

  private async suggestNextBestAction(data: any): Promise<any> {
    // Mock next best action suggestion
    const suggestions = [
      'Send follow-up email with case study',
      'Schedule demo call',
      'Provide pricing breakdown',
      'Connect with decision maker'
    ];
    
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    return {
      success: true,
      message: 'Next best action suggested',
      suggestion,
      confidence: 85
    };
  }

  // OS Integration Methods
  private async sendEmail(step: WorkflowStep, data: any): Promise<any> {
    if (!data.email) {
      return { success: false, message: 'No email address provided' };
    }
    
    // This would integrate with the email service
    logger.info('Sending email', { to: data.email, template: step.config.emailTemplate });
    
    return {
      success: true,
      message: `Email sent to ${data.email}`,
      emailId: `email-${Date.now()}`
    };
  }

  private async assignUser(step: WorkflowStep, data: any): Promise<any> {
    const assigneeId = step.config.assigneeId || step.config.userId;
    
    // This would update the lead assignment in the database
    return {
      success: true,
      message: `Lead assigned to user ${assigneeId}`,
      assigneeId
    };
  }

  private async changeLeadStage(step: WorkflowStep, data: any): Promise<any> {
    const newStage = step.config.newStage || 'qualified';
    
    // This would update the lead stage in the database
    return {
      success: true,
      message: `Lead stage changed to ${newStage}`,
      oldStage: data.status,
      newStage
    };
  }

  private async applyTag(step: WorkflowStep, data: any): Promise<any> {
    const tagName = step.config.tagName;
    
    // This would add the tag to the lead
    return {
      success: true,
      message: `Tag "${tagName}" applied`,
      tagName
    };
  }

  private async createTask(step: WorkflowStep, data: any): Promise<any> {
    const taskDescription = step.config.taskDescription || 'Follow up with lead';
    
    // This would create a task in the system
    return {
      success: true,
      message: `Task created: ${taskDescription}`,
      taskId: `task-${Date.now()}`,
      description: taskDescription
    };
  }

  private async sendNotification(step: WorkflowStep, data: any, userId: string): Promise<any> {
    const notificationText = step.config.notificationText || `New activity for lead ${data.name}`;
    
    // This would send a notification to the user
    return {
      success: true,
      message: 'Notification sent',
      notificationId: `notif-${Date.now()}`,
      text: notificationText
    };
  }

  private async scheduleCall(step: WorkflowStep, data: any): Promise<any> {
    const scheduledTime = step.config.scheduledTime || 'Tomorrow 2:00 PM';
    
    // This would integrate with calendar system
    return {
      success: true,
      message: `Call scheduled for ${scheduledTime}`,
      scheduledTime,
      callId: `call-${Date.now()}`
    };
  }

  private async sendSMS(step: WorkflowStep, data: any): Promise<any> {
    if (!data.phone) {
      return { success: false, message: 'No phone number provided' };
    }
    
    const message = step.config.smsMessage || 'Thank you for your interest!';
    
    // This would integrate with SMS service
    return {
      success: true,
      message: `SMS sent to ${data.phone}`,
      smsId: `sms-${Date.now()}`,
      content: message
    };
  }

  private async callWebhook(step: WorkflowStep, data: any): Promise<any> {
    const webhookUrl = step.config.webhookUrl;
    
    if (!webhookUrl) {
      return { success: false, message: 'No webhook URL configured' };
    }
    
    // This would make actual webhook call
    return {
      success: true,
      message: `Webhook called: ${webhookUrl}`,
      webhookId: `webhook-${Date.now()}`
    };
  }

  private async syncToCRM(step: WorkflowStep, data: any): Promise<any> {
    const crmType = step.config.crmType || 'Salesforce';
    
    // This would sync with actual CRM
    return {
      success: true,
      message: `Data synced to ${crmType}`,
      syncId: `sync-${Date.now()}`,
      recordId: data.id
    };
  }

  // Helper methods
  private getStepExecutionOrder(steps: WorkflowStep[], connections: WorkflowConnection[]): WorkflowStep[] {
    // Find trigger steps (starting points)
    const triggerSteps = steps.filter(s => s.type === 'trigger');
    const executionOrder: WorkflowStep[] = [];
    const visited = new Set<string>();

    for (const trigger of triggerSteps) {
      this.traverseSteps(trigger, steps, connections, executionOrder, visited);
    }

    return executionOrder;
  }

  private traverseSteps(
    currentStep: WorkflowStep, 
    allSteps: WorkflowStep[], 
    connections: WorkflowConnection[], 
    executionOrder: WorkflowStep[], 
    visited: Set<string>
  ) {
    if (visited.has(currentStep.id)) return;
    
    visited.add(currentStep.id);
    executionOrder.push(currentStep);

    // Find connected steps
    const outgoingConnections = connections.filter(c => c.fromNode === currentStep.id);
    
    for (const connection of outgoingConnections) {
      const nextStep = allSteps.find(s => s.id === connection.toNode);
      if (nextStep) {
        this.traverseSteps(nextStep, allSteps, connections, executionOrder, visited);
      }
    }
  }

  private getConditionalBranchSteps(stepId: string, connections: WorkflowConnection[], branchType: string): WorkflowStep[] {
    // Implementation for getting steps in specific conditional branch
    return connections
      .filter(c => c.fromNode === stepId && c.targetHandle === branchType)
      .map(c => c.toNode)
      .map(nodeId => ({ id: nodeId } as WorkflowStep)); // Simplified for now
  }

  private calculateScheduledTime(amount: number, unit: string): string {
    const now = new Date();
    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000
    };
    
    const delay = amount * (multipliers[unit as keyof typeof multipliers] || multipliers.minutes);
    return new Date(now.getTime() + delay).toISOString();
  }

  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
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
