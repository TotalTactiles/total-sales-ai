
import { BaseAIModule, ModuleConfig, ProcessingContext, ModuleResponse } from '../core/BaseAIModule';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface LeadContext {
  leadId: string;
  leadData?: any;
  currentPage: string;
}

export class LeadProfileAI extends BaseAIModule {
  private currentLeadId: string | null = null;
  private leadData: any = null;

  constructor(config: ModuleConfig) {
    super(config);
  }

  protected async initializeModule(): Promise<void> {
    logger.info('Initializing Lead Profile AI module');
    
    // Auto-detect lead ID from current URL
    this.detectLeadContext();
    
    logger.info('Lead Profile AI module initialized');
  }

  protected async processRequest(input: any, context: ProcessingContext): Promise<any> {
    try {
      const requestType = this.determineRequestType(input, context);
      
      switch (requestType) {
        case 'get_lead_profile':
          return await this.getLeadProfile(context);
        case 'update_lead':
          return await this.updateLead(input, context);
        case 'add_task':
          return await this.addTask(input, context);
        case 'schedule_appointment':
          return await this.scheduleAppointment(input, context);
        case 'lead_analysis':
          return await this.analyzeLeadProfile(context);
        default:
          return await this.handleGeneralQuery(input, context);
      }
    } catch (error) {
      logger.error('Error processing Lead Profile AI request:', error);
      throw error;
    }
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if we can access lead data
      if (this.currentLeadId) {
        const { data, error } = await supabase
          .from('leads')
          .select('id')
          .eq('id', this.currentLeadId)
          .eq('company_id', this.config.companyId)
          .single();
        
        return !error && !!data;
      }
      return true;
    } catch (error) {
      logger.error('Lead Profile AI health check failed:', error);
      return false;
    }
  }

  protected async cleanupModule(): Promise<void> {
    this.currentLeadId = null;
    this.leadData = null;
    logger.info('Lead Profile AI module cleaned up');
  }

  // Lead Context Detection
  private detectLeadContext(): void {
    if (typeof window !== 'undefined') {
      const urlPath = window.location.pathname;
      const leadIdMatch = urlPath.match(/\/leads\/([a-f0-9-]+)/);
      
      if (leadIdMatch) {
        this.currentLeadId = leadIdMatch[1];
        logger.info(`Detected lead context: ${this.currentLeadId}`);
        this.loadLeadData();
      }
      
      // Listen for URL changes
      window.addEventListener('popstate', () => {
        this.detectLeadContext();
      });
    }
  }

  private async loadLeadData(): Promise<void> {
    if (!this.currentLeadId) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', this.currentLeadId)
        .eq('company_id', this.config.companyId)
        .single();

      if (error) {
        logger.error('Failed to load lead data:', error);
        return;
      }

      this.leadData = data;
      await this.storeSessionMemory('current_lead', data);
    } catch (error) {
      logger.error('Error loading lead data:', error);
    }
  }

  // Request Processing Methods
  private determineRequestType(input: any, context: ProcessingContext): string {
    const inputStr = String(input).toLowerCase();
    
    if (inputStr.includes('update') || inputStr.includes('edit') || inputStr.includes('change')) {
      return 'update_lead';
    }
    if (inputStr.includes('task') || inputStr.includes('todo') || inputStr.includes('action')) {
      return 'add_task';
    }
    if (inputStr.includes('appointment') || inputStr.includes('meeting') || inputStr.includes('schedule')) {
      return 'schedule_appointment';
    }
    if (inputStr.includes('analyze') || inputStr.includes('insight') || inputStr.includes('summary')) {
      return 'lead_analysis';
    }
    if (inputStr.includes('profile') || inputStr.includes('details') || inputStr.includes('info')) {  
      return 'get_lead_profile';
    }
    
    return 'general_query';
  }

  private async getLeadProfile(context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.currentLeadId) {
      return {
        success: false,
        error: 'No lead context detected'
      };
    }

    if (!this.leadData) {
      await this.loadLeadData();
    }

    return {
      success: true,
      data: {
        lead: this.leadData,
        context: 'lead_profile',
        suggestions: [
          'Update lead information',
          'Add follow-up task',
          'Schedule appointment',
          'Analyze lead potential'
        ]
      }
    };
  }

  private async updateLead(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.currentLeadId) {
      return {
        success: false,
        error: 'No lead context for update'
      };
    }

    try {
      // Extract update data from input
      const updateData = this.parseUpdateData(input);
      
      // Validate update data
      const validation = this.validateLeadUpdate(updateData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid update data: ${validation.errors.join(', ')}`
        };
      }

      // Log the interaction for audit
      await this.logLeadInteraction('update', this.leadData, updateData);

      // Perform optimistic update
      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', this.currentLeadId)
        .eq('company_id', this.config.companyId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update lead:', error);
        return {
          success: false,
          error: 'Failed to update lead profile'
        };
      }

      // Update local data
      this.leadData = data;
      await this.storeSessionMemory('current_lead', data);

      return {
        success: true,
        data: {
          message: 'Lead profile updated successfully',
          updatedLead: data
        }
      };

    } catch (error) {
      logger.error('Error updating lead:', error);
      return {
        success: false,
        error: 'Failed to process lead update'
      };
    }
  }

  private async addTask(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.currentLeadId) {
      return {
        success: false,
        error: 'No lead context for task creation'
      };
    }

    try {
      const taskData = this.parseTaskData(input);
      
      // Create task associated with lead
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          lead_id: this.currentLeadId,
          company_id: this.config.companyId,
          user_id: this.config.repId,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          priority: taskData.priority || 'medium',
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create task:', error);
        return {
          success: false,
          error: 'Failed to create task'
        };
      }

      return {
        success: true,
        data: {
          message: 'Task created successfully',
          task: data
        }
      };

    } catch (error) {
      logger.error('Error creating task:', error);
      return {
        success: false,
        error: 'Failed to process task creation'
      };
    }
  }

  private async scheduleAppointment(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.currentLeadId) {
      return {
        success: false,
        error: 'No lead context for appointment scheduling'
      };
    }

    try {
      const appointmentData = this.parseAppointmentData(input);
      
      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          lead_id: this.currentLeadId,
          company_id: this.config.companyId,
          user_id: this.config.repId,
          title: appointmentData.title,
          description: appointmentData.description,
          scheduled_date: appointmentData.scheduledDate,
          duration: appointmentData.duration || 60,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to schedule appointment:', error);
        return {
          success: false,
          error: 'Failed to schedule appointment'
        };
      }

      return {
        success: true,
        data: {
          message: 'Appointment scheduled successfully',
          appointment: data
        }
      };

    } catch (error) {
      logger.error('Error scheduling appointment:', error);
      return {
        success: false,
        error: 'Failed to process appointment scheduling'
      };
    }
  }

  private async analyzeLeadProfile(context: ProcessingContext): Promise<ModuleResponse> {
    if (!this.leadData) {
      return {
        success: false,
        error: 'No lead data available for analysis'
      };
    }

    try {
      // Perform lead analysis
      const analysis = {
        score: this.calculateLeadScore(),
        potential: this.assessLeadPotential(),
        nextActions: this.suggestNextActions(),
        riskFactors: this.identifyRiskFactors(),
        opportunities: this.identifyOpportunities()
      };

      return {
        success: true,
        data: {
          analysis,
          lead: this.leadData
        },
        suggestions: analysis.nextActions
      };

    } catch (error) {
      logger.error('Error analyzing lead:', error);
      return {
        success: false,
        error: 'Failed to analyze lead profile'
      };
    }
  }

  private async handleGeneralQuery(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    return {
      success: true,
      data: {
        message: 'I can help you with lead profile management. What would you like to do?',
        availableActions: [
          'View lead profile details',
          'Update lead information',
          'Add follow-up tasks',
          'Schedule appointments',
          'Analyze lead potential'
        ]
      }
    };
  }

  // Helper Methods
  private parseUpdateData(input: any): any {
    // Extract structured update data from natural language input
    // This would implement NLP parsing in production
    return input.updateData || {};
  }

  private parseTaskData(input: any): any {
    // Extract task information from input
    return {
      title: input.title || 'Follow-up task',
      description: input.description || '',
      dueDate: input.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: input.priority || 'medium'
    };
  }

  private parseAppointmentData(input: any): any {
    // Extract appointment information from input
    return {
      title: input.title || 'Meeting',
      description: input.description || '',
      scheduledDate: input.scheduledDate || new Date().toISOString(),
      duration: input.duration || 60
    };
  }

  private validateLeadUpdate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate required fields and data types
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }
    
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  private async logLeadInteraction(action: string, beforeData: any, afterData: any): Promise<void> {
    try {
      await supabase
        .from('lead_ai_interactions')
        .insert({
          lead_id: this.currentLeadId,
          rep_id: this.config.repId,
          action_type: action,
          data_before: beforeData,
          data_after: afterData
        });
    } catch (error) {
      logger.error('Failed to log lead interaction:', error);
    }
  }

  private calculateLeadScore(): number {
    if (!this.leadData) return 0;
    
    let score = 0;
    
    // Score based on available data completeness
    if (this.leadData.email) score += 20;
    if (this.leadData.phone) score += 20;
    if (this.leadData.company) score += 15;
    if (this.leadData.source) score += 10;
    
    // Score based on engagement
    if (this.leadData.last_contact) {
      const daysSinceContact = (Date.now() - new Date(this.leadData.last_contact).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceContact < 7) score += 20;
      else if (daysSinceContact < 30) score += 10;
    }
    
    // Score based on existing score field
    if (this.leadData.score) {
      score = Math.max(score, this.leadData.score);
    }
    
    return Math.min(100, score);
  }

  private assessLeadPotential(): string {
    const score = this.calculateLeadScore();
    
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'Low';
    return 'Very Low';
  }

  private suggestNextActions(): string[] {
    const actions: string[] = [];
    
    if (!this.leadData?.last_contact) {
      actions.push('Make initial contact');
    } else {
      const daysSinceContact = (Date.now() - new Date(this.leadData.last_contact).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceContact > 7) {
        actions.push('Follow up on previous contact');
      }
    }
    
    if (!this.leadData?.email) {
      actions.push('Collect email address');
    }
    
    if (!this.leadData?.phone) {
      actions.push('Collect phone number');
    }
    
    if (this.leadData?.status === 'new') {
      actions.push('Qualify lead requirements');
    }
    
    return actions;
  }

  private identifyRiskFactors(): string[] {
    const risks: string[] = [];
    
    if (!this.leadData?.last_contact) {
      risks.push('No contact history');
    }
    
    if (!this.leadData?.email && !this.leadData?.phone) {
      risks.push('Limited contact information');
    }
    
    if (this.leadData?.status === 'cold') {
      risks.push('Cold lead - low engagement');
    }
    
    return risks;
  }

  private identifyOpportunities(): string[] {
    const opportunities: string[] = [];
    
    if (this.leadData?.priority === 'high') {
      opportunities.push('High priority lead - immediate attention');
    }
    
    if (this.leadData?.score && this.leadData.score > 70) {
      opportunities.push('High scoring lead - good conversion potential');
    }
    
    if (this.leadData?.source && ['referral', 'warm_lead'].includes(this.leadData.source)) {
      opportunities.push('Warm source - higher conversion likelihood');
    }
    
    return opportunities;
  }
}
