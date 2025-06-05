import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { AIIngestionEvent } from './types';

export class LearningEngine {
  async updateLearningModels(event: AIIngestionEvent): Promise<void> {
    // Update AI learning models based on event data
    try {
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: event.company_id,
          type: 'learning_update',
          event_summary: 'Model learning update',
          payload: {
            event_type: event.event_type,
            learning_data: event.data,
            timestamp: new Date().toISOString()
          },
          visibility: 'admin_only'
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Error updating learning models:', error);
    }
  }
}
