
import { supabase } from '@/integrations/supabase/client';
import { UsageEvent } from './types';

export class UsageTracker {
  private static instance: UsageTracker;

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  async trackUsageEvent(event: UsageEvent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, role')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      await supabase.from('usage_events').insert({
        user_id: user.id,
        company_id: profile.company_id,
        role: profile.role,
        feature: event.feature,
        action: event.action,
        context: event.context,
        metadata: event.metadata,
        outcome: event.outcome
      });

      console.log('Usage event tracked:', event.feature, event.action);
    } catch (error) {
      console.error('Failed to track usage event:', error);
    }
  }
}

export const usageTracker = UsageTracker.getInstance();
