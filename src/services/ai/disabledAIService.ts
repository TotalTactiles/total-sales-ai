
import { logger } from '@/utils/logger';

// AI_INTEGRATION_DISABLED - Service that handles all AI requests in disabled state
export const disabledAIService = {
  generateResponse: async (prompt: string, context?: any): Promise<string> => {
    logger.info('AI request blocked - all AI integrations disabled', { prompt, context }, 'disabled_ai');
    return 'AI features are currently disabled. All AI integrations have been turned off.';
  },

  generateSalesResponse: async (prompt: string, context?: any): Promise<string> => {
    logger.info('Sales AI request blocked - all AI integrations disabled', { prompt, context }, 'disabled_ai');
    return 'Sales AI features are currently disabled. All AI integrations have been turned off.';
  },

  generateManagerResponse: async (prompt: string, context?: any): Promise<string> => {
    logger.info('Manager AI request blocked - all AI integrations disabled', { prompt, context }, 'disabled_ai');
    return 'Management AI features are currently disabled. All AI integrations have been turned off.';
  },

  generateVoiceResponse: async (audioData: any): Promise<string> => {
    logger.info('Voice AI request blocked - all AI integrations disabled', { audioData }, 'disabled_ai');
    return 'Voice AI features are currently disabled. All AI integrations have been turned off.';
  },

  processAutomation: async (workflowId: string, data: any): Promise<any> => {
    logger.info('Automation request blocked - all AI integrations disabled', { workflowId, data }, 'disabled_ai');
    return {
      status: 'disabled',
      message: 'Automation features are currently disabled. All AI integrations have been turned off.'
    };
  }
};
