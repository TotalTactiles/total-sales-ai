
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Simple logger for client-side
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

export interface UsageEvent {
  feature: string;
  action: string;
  context?: string;
  outcome?: string;
  metadata?: Record<string, any>;
}

export const useUsageTracking = () => {
  const [isLogging, setIsLogging] = useState(false);
  const { user, profile } = useAuth();

  const trackEvent = async (event: UsageEvent) => {
    if (!user?.id || !profile?.company_id) return;
    
    try {
      setIsLogging(true);
      
      const { error } = await supabase
        .from('usage_events')
        .insert({
          user_id: user.id,
          company_id: profile.company_id,
          role: profile.role,
          feature: event.feature,
          action: event.action,
          context: event.context,
          outcome: event.outcome,
          metadata: event.metadata
        });
        
      if (error) throw error;
      
    } catch (error) {
      logger.error('Error tracking usage event:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const trackClick = (feature: string, context?: string) => 
    trackEvent({ feature, action: 'click', context });
    
  const trackHover = (feature: string, context?: string) => 
    trackEvent({ feature, action: 'hover', context });
    
  const trackTabOpen = (feature: string, context?: string) => 
    trackEvent({ feature, action: 'open_tab', context });
    
  const trackOutcome = (feature: string, outcome: string, metadata?: Record<string, any>) => 
    trackEvent({ feature, action: 'outcome', outcome, metadata });

  return {
    trackEvent,
    trackClick,
    trackHover,
    trackTabOpen,
    trackOutcome,
    isLogging
  };
};
