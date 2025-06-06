import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useCallStatus = (callSid?: string) => {
  const [status, setStatus] = useState<string>();
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!callSid) return;

    const channel = supabase
      .channel(`call-status-${callSid}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'call_logs',
          filter: `call_sid=eq.${callSid}`
        },
        payload => {
          setStatus(payload.new.status);
          setDuration(payload.new.duration);
          logger.info('Call status update:', payload.new.status);
          if (payload.new.status === 'completed') {
            toast.success('Call completed');
          } else if (payload.new.status === 'failed') {
            toast.error('Call failed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callSid]);

  return { status, duration };
};
