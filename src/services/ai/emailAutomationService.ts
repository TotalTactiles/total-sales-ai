import { logger } from '@/utils/logger';

import { automationFlowService } from './automationFlowService';
import { emailTemplateService, EmailTemplate } from './email/emailTemplateService';
import { emailSchedulingService } from './email/emailSchedulingService';

export interface AutomationResult {
  success: boolean;
  message: string;
  data?: any;
  warnings?: string[];
}

export class EmailAutomationService {
  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    return emailTemplateService.createEmailTemplate(template);
  }

  async generateEmailFromTemplate(
    templateId: string, 
    variables: Record<string, string>
  ): Promise<{ subject: string; body: string }> {
    return emailTemplateService.generateEmailFromTemplate(templateId, variables);
  }

  async scheduleEmail(
    to: string,
    subject: string,
    body: string,
    sendAt: Date,
    metadata: Record<string, any> = {}
  ): Promise<string> {
    return emailSchedulingService.scheduleEmail(to, subject, body, sendAt, metadata);
  }

  async processScheduledEmails(): Promise<void> {
    return emailSchedulingService.processScheduledEmails();
  }

  async evaluateAutomationTriggers(
    trigger: string,
    eventData: Record<string, any>
  ): Promise<void> {
    try {
      const flowContext = {
        userId: String(eventData.userId || 'system'),
        companyId: String(eventData.companyId || 'system'),
        timestamp: new Date().toISOString(),
        leadId: String(eventData.leadId || ''),
        email: String(eventData.email || ''),
        phone: String(eventData.phone || ''),
        name: String(eventData.name || '')
      };

      await automationFlowService.evaluateFlowTriggers(trigger, flowContext);
    } catch (error) {
      logger.error('Error evaluating automation triggers:', error);
    }
  }
}

export const emailAutomationService = new EmailAutomationService();
