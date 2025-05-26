
import { supabase } from '@/integrations/supabase/client';
import { AIIngestionEvent } from './types';
import { safeJsonToObject } from './utils';

export class AutomationEngine {
  async checkAutomationTriggers(event: AIIngestionEvent): Promise<void> {
    // Check if event triggers any automated actions
    const triggers = await this.getAutomationTriggers(event.company_id);
    
    for (const trigger of triggers) {
      if (this.eventMatchesTrigger(event, trigger)) {
        await this.executeAutomation(trigger, event);
      }
    }
  }

  private async getAutomationTriggers(companyId: string): Promise<any[]> {
    // Fetch automation triggers for the company
    try {
      const { data } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('company_id', companyId)
        .eq('type', 'automation_trigger')
        .order('timestamp', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error fetching automation triggers:', error);
      return [];
    }
  }

  private eventMatchesTrigger(event: AIIngestionEvent, trigger: any): boolean {
    // Simple trigger matching logic - can be enhanced
    const triggerPayload = safeJsonToObject(trigger.payload);
    return triggerPayload?.event_type === event.event_type;
  }

  private async executeAutomation(trigger: any, event: AIIngestionEvent): Promise<void> {
    console.log('Executing automation:', trigger.id, 'for event:', event.id);
    
    // Log automation execution
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: event.company_id,
          type: 'automation_executed',
          event_summary: `Automation executed: ${trigger.id}`,
          payload: {
            trigger_id: trigger.id,
            event_id: event.id,
            timestamp: new Date().toISOString()
          },
          visibility: 'admin_only'
        });
    } catch (error) {
      console.error('Error logging automation execution:', error);
    }
  }
}
