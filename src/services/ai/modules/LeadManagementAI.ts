
import { BaseAIModule, ModuleConfig, ProcessingContext, ModuleResponse } from '../core/BaseAIModule';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface BatchOperation {
  id: string;
  operation: 'add_to_dialer' | 'send_email' | 'create_tasks' | 'update_status' | 'bulk_delete';
  leadIds: string[];
  params: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: any;
  createdAt: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  template: string;
  recipients: string[];
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
}

export class LeadManagementAI extends BaseAIModule {
  private batchOperations = new Map<string, BatchOperation>();
  private chatVisible = false;
  private maxBatchSize = 1000;
  private dailyChatHistory: string[] = [];

  constructor(config: ModuleConfig) {
    super(config);
  }

  protected async initializeModule(): Promise<void> {
    logger.info('Initializing Lead Management AI module');
    
    // Monitor URL parameters for AI Optimized dropdown
    this.monitorDropdownSelection();
    
    // Set up daily cleanup
    this.setupDailyCleanup();
    
    logger.info('Lead Management AI module initialized');
  }

  protected async processRequest(input: any, context: ProcessingContext): Promise<any> {
    try {
      const requestType = this.determineRequestType(input, context);
      
      switch (requestType) {
        case 'batch_operation':
          return await this.processBatchOperation(input, context);
        case 'email_campaign':
          return await this.createEmailCampaign(input, context);
        case 'lead_analysis':
          return await this.analyzeLeadData(input, context);
        case 'bulk_update':
          return await this.bulkUpdateLeads(input, context);
        case 'export_data':
          return await this.exportLeadData(input, context);
        case 'chat_toggle':
          return await this.toggleChatInterface(input, context);
        default:
          return await this.handleGeneralQuery(input, context);
      }
    } catch (error) {
      logger.error('Error processing Lead Management AI request:', error);
      throw error;
    }
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if we can access leads
      const { error } = await supabase
        .from('leads')
        .select('id')
        .eq('company_id', this.config.companyId)
        .limit(1);
      
      return !error;
    } catch (error) {
      logger.error('Lead Management AI health check failed:', error);
      return false;
    }
  }

  protected async cleanupModule(): Promise<void> {
    this.batchOperations.clear();
    this.dailyChatHistory = [];
    this.chatVisible = false;
    
    logger.info('Lead Management AI module cleaned up');
  }

  // UI Monitoring Methods
  private monitorDropdownSelection(): void {
    if (typeof window === 'undefined') return;

    // Monitor URL parameters for dropdown selection
    const checkDropdown = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const viewMode = urlParams.get('view');
      const aiOptimized = urlParams.get('ai_optimized');
      
      const shouldShowChat = viewMode === 'ai_optimized' || aiOptimized === 'true';
      
      if (shouldShowChat !== this.chatVisible) {
        this.chatVisible = shouldShowChat;
        this.updateChatVisibility();
      }
    };

    // Check on load and URL changes
    checkDropdown();
    window.addEventListener('popstate', checkDropdown);
    
    // Also monitor for DOM changes that might indicate dropdown selection
    if (window.MutationObserver) {
      const observer = new MutationObserver(() => {
        checkDropdown();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-*']
      });
    }
  }

  private updateChatVisibility(): void {
    // This would be implemented to show/hide the chat interface
    logger.info(`Chat interface visibility: ${this.chatVisible ? 'visible' : 'hidden'}`);
    
    // In production, this would emit events or update UI state
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('leadManagementChatToggle', {
        detail: { visible: this.chatVisible }
      }));
    }
  }

  private setupDailyCleanup(): void {
    // Clean chat history daily for performance
    const cleanup = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        this.dailyChatHistory = [];
        logger.info('Daily chat history cleanup completed');
      }
    };

    setInterval(cleanup, 60 * 1000); // Check every minute
  }

  // Request Processing Methods
  private determineRequestType(input: any, context: ProcessingContext): string {
    const inputStr = String(input).toLowerCase();
    
    if (inputStr.includes('batch') || inputStr.includes('bulk') || inputStr.includes('multiple leads')) {
      return 'batch_operation';
    }
    if (inputStr.includes('email') || inputStr.includes('campaign') || inputStr.includes('send')) {
      return 'email_campaign';
    }
    if (inputStr.includes('analyze') || inputStr.includes('insights') || inputStr.includes('report')) {
      return 'lead_analysis';
    }
    if (inputStr.includes('update') || inputStr.includes('change status') || inputStr.includes('modify')) {
      return 'bulk_update';
    }
    if (inputStr.includes('export') || inputStr.includes('download') || inputStr.includes('csv')) {
      return 'export_data';
    }
    if (inputStr.includes('show chat') || inputStr.includes('hide chat') || inputStr.includes('toggle')) {
      return 'chat_toggle';
    }
    
    return 'general_query';
  }

  private async processBatchOperation(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { operation, leadIds, params } = input;
      
      if (!leadIds || !Array.isArray(leadIds)) {
        return {
          success: false,
          error: 'Lead IDs required for batch operation'
        };
      }

      if (leadIds.length > this.maxBatchSize) {
        return {
          success: false,
          error: `Batch size limited to ${this.maxBatchSize} operations`
        };
      }

      // Create batch operation
      const batchOp: BatchOperation = {
        id: crypto.randomUUID(),
        operation,
        leadIds,
        params: params || {},
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString()
      };

      this.batchOperations.set(batchOp.id, batchOp);

      // Process asynchronously
      this.executeBatchOperation(batchOp);

      return {
        success: true,
        data: {
          batchId: batchOp.id,
          operation,
          leadCount: leadIds.length,
          status: 'pending',
          estimatedTime: this.estimateBatchTime(leadIds.length, operation)
        },
        suggestions: [
          'Monitor batch progress',
          'View operation details',
          'Cancel if needed',
          'Set up notifications'
        ]
      };

    } catch (error) {
      logger.error('Error processing batch operation:', error);
      return {
        success: false,
        error: 'Failed to process batch operation'
      };
    }
  }

  private async createEmailCampaign(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { campaignName, template, recipientIds, scheduleTime } = input;
      
      if (!recipientIds || !Array.isArray(recipientIds)) {
        return {
          success: false,
          error: 'Recipient IDs required for email campaign'
        };
      }

      // Get recipient lead data
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, name, email')
        .eq('company_id', this.config.companyId)
        .in('id', recipientIds);

      if (error) {
        return {
          success: false,
          error: 'Failed to retrieve recipient data'
        };
      }

      const validRecipients = leads?.filter(lead => lead.email) || [];

      if (validRecipients.length === 0) {
        return {
          success: false,
          error: 'No valid email addresses found for recipients'
        };
      }

      // Create email campaign
      const campaign: EmailCampaign = {
        id: crypto.randomUUID(),
        name: campaignName || 'Bulk Email Campaign',
        template: template || 'default',
        recipients: validRecipients.map(r => r.id),
        scheduledAt: scheduleTime,
        status: scheduleTime ? 'scheduled' : 'draft'
      };

      // Store campaign (in production would use database)
      await this.storeSessionMemory(`email_campaign_${campaign.id}`, campaign);

      return {
        success: true,
        data: {
          campaign,
          recipientCount: validRecipients.length,
          invalidEmails: recipientIds.length - validRecipients.length,
          estimatedDelivery: scheduleTime || 'immediate'
        },
        suggestions: [
          'Preview email template',
          'Test send to yourself',
          'Schedule for optimal time',
          'Track campaign performance'
        ]
      };

    } catch (error) {
      logger.error('Error creating email campaign:', error);
      return {
        success: false,
        error: 'Failed to create email campaign'
      };
    }
  }

  private async analyzeLeadData(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { filters, metrics } = input;
      
      // Get lead data with filters
      let query = supabase
        .from('leads')
        .select('*')
        .eq('company_id', this.config.companyId);

      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.source) {
          query = query.eq('source', filters.source);
        }
        if (filters.priority) {
          query = query.eq('priority', filters.priority);
        }
        if (filters.dateRange) {
          query = query.gte('created_at', filters.dateRange.start)
                      .lte('created_at', filters.dateRange.end);
        }
      }

      const { data: leads, error } = await query;

      if (error) {
        return {
          success: false,
          error: 'Failed to retrieve lead data'
        };
      }

      // Perform analysis
      const analysis = {
        totalLeads: leads?.length || 0,
        byStatus: this.analyzeByStatus(leads || []),
        bySource: this.analyzeBySource(leads || []),
        byPriority: this.analyzeByPriority(leads || []),
        conversionMetrics: this.calculateConversionMetrics(leads || []),
        trends: this.analyzeTrends(leads || []),
        recommendations: this.generateAnalysisRecommendations(leads || [])
      };

      return {
        success: true,
        data: analysis,
        suggestions: [
          'Export analysis report',
          'Create targeted campaigns',
          'Set up automated workflows',
          'Schedule follow-up analysis'
        ]
      };

    } catch (error) {
      logger.error('Error analyzing lead data:', error);
      return {
        success: false,
        error: 'Failed to analyze lead data'
      };
    }
  }

  private async bulkUpdateLeads(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { leadIds, updates } = input;
      
      if (!leadIds || !Array.isArray(leadIds) || !updates) {
        return {
          success: false,
          error: 'Lead IDs and update data required'
        };
      }

      // Validate updates
      const validatedUpdates = this.validateBulkUpdates(updates);
      if (!validatedUpdates.isValid) {
        return {
          success: false,
          error: `Invalid update data: ${validatedUpdates.errors.join(', ')}`
        };
      }

      // Perform bulk update
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('company_id', this.config.companyId)
        .in('id', leadIds)
        .select();

      if (error) {
        return {
          success: false,
          error: 'Failed to update leads'
        };
      }

      // Log bulk update for audit
      await this.logBulkOperation('bulk_update', leadIds, updates);

      return {
        success: true,
        data: {
          updatedCount: data?.length || 0,
          updates,
          affectedLeads: data
        },
        suggestions: [
          'Verify updates were applied',
          'Create follow-up tasks',
          'Notify team of changes',
          'Export updated data'
        ]
      };

    } catch (error) {
      logger.error('Error performing bulk update:', error);
      return {
        success: false,
        error: 'Failed to perform bulk update'
      };
    }
  }

  private async exportLeadData(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { format, filters, fields } = input;
      const exportFormat = format || 'csv';
      
      // Get filtered lead data
      let query = supabase
        .from('leads')
        .select(fields?.join(',') || '*')
        .eq('company_id', this.config.companyId);

      if (filters) {
        // Apply same filters as in analyzeLeadData
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.source) query = query.eq('source', filters.source);
        if (filters.priority) query = query.eq('priority', filters.priority);
      }

      const { data: leads, error } = await query;

      if (error) {
        return {
          success: false,
          error: 'Failed to retrieve lead data for export'
        };
      }

      // Generate export data
      const exportData = this.formatExportData(leads || [], exportFormat);
      const exportId = crypto.randomUUID();
      
      // Store export data temporarily
      await this.storeSessionMemory(`export_${exportId}`, {
        data: exportData,
        format: exportFormat,
        recordCount: leads?.length || 0,
        createdAt: new Date().toISOString()
      });

      return {
        success: true,
        data: {
          exportId,
          format: exportFormat,
          recordCount: leads?.length || 0,
          downloadUrl: `/api/exports/${exportId}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        },
        suggestions: [
          'Download file immediately',
          'Share with team members',
          'Schedule regular exports',
          'Set up automated backups'
        ]
      };

    } catch (error) {
      logger.error('Error exporting lead data:', error);
      return {
        success: false,
        error: 'Failed to export lead data'
      };
    }
  }

  private async toggleChatInterface(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    const { show } = input;
    this.chatVisible = show !== undefined ? show : !this.chatVisible;
    
    this.updateChatVisibility();

    return {
      success: true,
      data: {
        chatVisible: this.chatVisible,
        message: `Chat interface ${this.chatVisible ? 'shown' : 'hidden'}`
      }
    };
  }

  private async handleGeneralQuery(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    // Add to chat history
    this.dailyChatHistory.push(`${new Date().toISOString()}: ${input}`);

    return {
      success: true,
      data: {
        message: 'I can help you manage your leads efficiently. What would you like to do?',
        availableOperations: [
          'Batch operations (add to dialer, send emails, create tasks)',
          'Bulk updates and status changes',
          'Lead data analysis and insights',
          'Email campaign management',
          'Data export and reporting'
        ],
        chatVisible: this.chatVisible
      }
    };
  }

  // Batch Operation Methods
  private async executeBatchOperation(batchOp: BatchOperation): Promise<void> {
    try {
      batchOp.status = 'processing';
      this.batchOperations.set(batchOp.id, batchOp);

      const results: any[] = [];
      const batchSize = 50; // Process in smaller chunks
      
      for (let i = 0; i < batchOp.leadIds.length; i += batchSize) {
        const chunk = batchOp.leadIds.slice(i, i + batchSize);
        const chunkResults = await this.processOperationChunk(batchOp.operation, chunk, batchOp.params);
        
        results.push(...chunkResults);
        
        // Update progress
        batchOp.progress = ((i + chunk.length) / batchOp.leadIds.length) * 100;
        this.batchOperations.set(batchOp.id, batchOp);
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Complete operation
      batchOp.status = 'completed';
      batchOp.progress = 100;
      batchOp.results = results;
      this.batchOperations.set(batchOp.id, batchOp);

      logger.info(`Batch operation ${batchOp.id} completed successfully`);

    } catch (error) {
      logger.error(`Batch operation ${batchOp.id} failed:`, error);
      batchOp.status = 'failed';
      batchOp.results = { error: error.message };
      this.batchOperations.set(batchOp.id, batchOp);
    }
  }

  private async processOperationChunk(operation: string, leadIds: string[], params: any): Promise<any[]> {
    switch (operation) {
      case 'add_to_dialer':
        return await this.addLeadsToDialer(leadIds, params);
      case 'send_email':
        return await this.sendBulkEmails(leadIds, params);
      case 'create_tasks':
        return await this.createBulkTasks(leadIds, params);
      case 'update_status':
        return await this.updateLeadStatuses(leadIds, params);
      case 'bulk_delete':
        return await this.deleteLeads(leadIds);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async addLeadsToDialer(leadIds: string[], params: any): Promise<any[]> {
    // Implementation for adding leads to dialer queue
    // This would integrate with the dialer system
    return leadIds.map(id => ({ leadId: id, status: 'added_to_dialer' }));
  }

  private async sendBulkEmails(leadIds: string[], params: any): Promise<any[]> {
    // Implementation for sending bulk emails
    // This would integrate with email service
    return leadIds.map(id => ({ leadId: id, status: 'email_queued' }));
  }

  private async createBulkTasks(leadIds: string[], params: any): Promise<any[]> {
    const tasks = leadIds.map(leadId => ({
      lead_id: leadId,
      company_id: this.config.companyId,
      user_id: this.config.repId,
      title: params.taskTitle || 'Follow up',
      description: params.taskDescription || '',
      due_date: params.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }));

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasks)
      .select();

    if (error) {
      throw error;
    }

    return data || [];
  }

  private async updateLeadStatuses(leadIds: string[], params: any): Promise<any[]> {
    const { data, error } = await supabase
      .from('leads')
      .update({ status: params.newStatus })
      .eq('company_id', this.config.companyId)
      .in('id', leadIds)
      .select();

    if (error) {
      throw error;
    }

    return data || [];
  }

  private async deleteLeads(leadIds: string[]): Promise<any[]> {
    const { data, error } = await supabase
      .from('leads')
      .delete()
      .eq('company_id', this.config.companyId)
      .in('id', leadIds)
      .select();

    if (error) {
      throw error;
    }

    return data || [];
  }

  private estimateBatchTime(leadCount: number, operation: string): string {
    const baseTimePerLead = {
      'add_to_dialer': 0.1,
      'send_email': 0.5,
      'create_tasks': 0.2,
      'update_status': 0.1,
      'bulk_delete': 0.1
    };

    const timePerLead = baseTimePerLead[operation] || 0.2;
    const totalSeconds = leadCount * timePerLead;
    
    if (totalSeconds < 60) {
      return `${Math.ceil(totalSeconds)} seconds`;
    } else {
      return `${Math.ceil(totalSeconds / 60)} minutes`;
    }
  }

  // Analysis Methods
  private analyzeByStatus(leads: any[]): any {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return statusCounts;
  }

  private analyzeBySource(leads: any[]): any {
    const sourceCounts = leads.reduce((acc, lead) => {
      acc[lead.source || 'unknown'] = (acc[lead.source || 'unknown'] || 0) + 1;
      return acc;
    }, {});

    return sourceCounts;
  }

  private analyzeByPriority(leads: any[]): any {
    const priorityCounts = leads.reduce((acc, lead) => {
      acc[lead.priority || 'medium'] = (acc[lead.priority || 'medium'] || 0) + 1;
      return acc;
    }, {});

    return priorityCounts;
  }

  private calculateConversionMetrics(leads: any[]): any {
    const total = leads.length;
    const qualified = leads.filter(l => l.status === 'qualified').length;
    const converted = leads.filter(l => l.status === 'converted').length;
    const contacted = leads.filter(l => l.last_contact).length;

    return {
      totalLeads: total,
      contactedRate: total > 0 ? (contacted / total) * 100 : 0,
      qualificationRate: total > 0 ? (qualified / total) * 100 : 0,
      conversionRate: total > 0 ? (converted / total) * 100 : 0
    };
  }

  private analyzeTrends(leads: any[]): any {
    // Simple trend analysis based on creation dates
    const last30Days = leads.filter(l => {
      const createdAt = new Date(l.created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return createdAt > thirtyDaysAgo;
    });

    const last7Days = leads.filter(l => {
      const createdAt = new Date(l.created_at);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return createdAt > sevenDaysAgo;
    });

    return {
      last30Days: last30Days.length,
      last7Days: last7Days.length,
      weeklyTrend: last7Days.length > 0 ? 'increasing' : 'stable',
      monthlyTrend: last30Days.length > 0 ? 'increasing' : 'stable'
    };
  }

  private generateAnalysisRecommendations(leads: any[]): string[] {
    const recommendations: string[] = [];
    const metrics = this.calculateConversionMetrics(leads);
    
    if (metrics.contactedRate < 50) {
      recommendations.push('Increase contact rate - many leads not yet contacted');
    }
    
    if (metrics.conversionRate < 5) {
      recommendations.push('Focus on improving conversion rate through better qualification');
    }
    
    const statusDistribution = this.analyzeByStatus(leads);
    const newLeads = statusDistribution.new || 0;
    if (newLeads > leads.length * 0.6) {
      recommendations.push('Large number of new leads - prioritize initial contact');
    }

    return recommendations;
  }

  // Utility Methods
  private validateBulkUpdates(updates: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allowedFields = ['status', 'priority', 'source', 'tags', 'notes'];
    
    Object.keys(updates).forEach(field => {
      if (!allowedFields.includes(field)) {
        errors.push(`Field '${field}' is not allowed for bulk updates`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async logBulkOperation(operation: string, leadIds: string[], params: any): Promise<void> {
    try {
      logger.info(`Bulk operation: ${operation}`, {
        leadCount: leadIds.length,
        operation,
        params,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to log bulk operation:', error);
    }
  }

  private formatExportData(leads: any[], format: string): any {
    if (format === 'csv') {
      // Convert to CSV format
      if (leads.length === 0) return '';
      
      const headers = Object.keys(leads[0]).join(',');
      const rows = leads.map(lead => 
        Object.values(lead).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );
      
      return [headers, ...rows].join('\n');
    } else if (format === 'json') {
      return JSON.stringify(leads, null, 2);
    }
    
    return leads;
  }
}
