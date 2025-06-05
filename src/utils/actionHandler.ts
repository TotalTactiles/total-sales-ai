import { logger } from '@/utils/logger';

import { ActionType, ActionTypes, ActionPayload, validateStringParam, validateAction, createSafeAction } from '@/types/actions';
import { toast } from 'sonner';

export class SafeActionHandler {
  private static instance: SafeActionHandler;

  static getInstance(): SafeActionHandler {
    if (!SafeActionHandler.instance) {
      SafeActionHandler.instance = new SafeActionHandler();
    }
    return SafeActionHandler.instance;
  }

  executeAction(action: any, data?: any, context?: string): Promise<any> {
    try {
      const safeAction = createSafeAction(action, data, context);
      logger.info('Executing safe action:', safeAction);

      switch (safeAction.type) {
        case ActionTypes.AI_COMMAND:
          return this.handleAICommand(safeAction);
        case ActionTypes.VOICE_COMMAND:
          return this.handleVoiceCommand(safeAction);
        case ActionTypes.SEND_EMAIL:
          return this.handleSendEmail(safeAction);
        case ActionTypes.SEND_SMS:
          return this.handleSendSMS(safeAction);
        case ActionTypes.NAVIGATE_TO:
          return this.handleNavigation(safeAction);
        case ActionTypes.CREATE_LEAD:
          return this.handleCreateLead(safeAction);
        case ActionTypes.UPDATE_LEAD:
          return this.handleUpdateLead(safeAction);
        default:
          return this.handleDefaultAction(safeAction);
      }
    } catch (error) {
      logger.error('Action execution failed:', error);
      toast.error('Action failed. Please try again.');
      return Promise.resolve({ success: false, error: error.message });
    }
  }

  private async handleAICommand(action: ActionPayload): Promise<any> {
    const command = validateStringParam(action.data?.command, 'help');
    const context = validateStringParam(action.context, 'general');
    
    logger.info('Processing AI command:', command);
    
    // Implementation would go here
    return { success: true, command, context };
  }

  private async handleVoiceCommand(action: ActionPayload): Promise<any> {
    const command = validateStringParam(action.data?.command, 'voice_help');
    const context = validateStringParam(action.context, 'voice');
    
    logger.info('Processing voice command:', command);
    
    // Implementation would go here
    return { success: true, command, context };
  }

  private async handleSendEmail(action: ActionPayload): Promise<any> {
    const to = validateStringParam(action.data?.to, 'user@example.com');
    const subject = validateStringParam(action.data?.subject, 'No Subject');
    const body = validateStringParam(action.data?.body, 'No Content');
    
    logger.info('Sending email:', { to, subject, body });
    
    // Implementation would go here
    return { success: true, to, subject, body };
  }

  private async handleSendSMS(action: ActionPayload): Promise<any> {
    const phoneNumber = validateStringParam(action.data?.phoneNumber, '+1234567890');
    const message = validateStringParam(action.data?.message, 'Hello');
    
    logger.info('Sending SMS:', { phoneNumber, message });
    
    // Implementation would go here
    return { success: true, phoneNumber, message };
  }

  private async handleNavigation(action: ActionPayload): Promise<any> {
    const path = validateStringParam(action.data?.path, '/dashboard');
    
    logger.info('Navigating to:', path);
    
    // Implementation would go here
    return { success: true, path };
  }

  private async handleCreateLead(action: ActionPayload): Promise<any> {
    const name = validateStringParam(action.data?.name, 'New Lead');
    const email = validateStringParam(action.data?.email, 'lead@example.com');
    
    logger.info('Creating lead:', { name, email });
    
    // Implementation would go here
    return { success: true, name, email };
  }

  private async handleUpdateLead(action: ActionPayload): Promise<any> {
    const leadId = validateStringParam(action.data?.leadId, 'default-lead-id');
    const updates = action.data?.updates || {};
    
    logger.info('Updating lead:', { leadId, updates });
    
    // Implementation would go here
    return { success: true, leadId, updates };
  }

  private async handleDefaultAction(action: ActionPayload): Promise<any> {
    logger.info('Executing default action:', action);
    toast.info('Action completed successfully');
    return { success: true, action: action.type };
  }
}

export const safeActionHandler = SafeActionHandler.getInstance();
