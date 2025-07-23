
import { useState, useEffect } from 'react';
import { CallSessionService, CallSession, CallEvent } from '@/services/telephony/callSessionService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCallSession = (sessionId?: string) => {
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [callEvents, setCallEvents] = useState<CallEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!sessionId) return;

    const fetchCallSession = async () => {
      setIsLoading(true);
      try {
        const session = await CallSessionService.getCallSession(sessionId);
        const events = await CallSessionService.getCallEvents(sessionId);
        
        setCallSession(session);
        setCallEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch call session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallSession();

    // Subscribe to real-time updates
    const sessionChannel = CallSessionService.subscribeToCallSession(sessionId, (session) => {
      setCallSession(session);
    });

    const eventsChannel = CallSessionService.subscribeToCallEvents(sessionId, (event) => {
      setCallEvents(prev => [...prev, event]);
    });

    return () => {
      sessionChannel.unsubscribe();
      eventsChannel.unsubscribe();
    };
  }, [sessionId]);

  const updateCallSession = async (updates: Partial<CallSession>) => {
    if (!sessionId) return;

    try {
      const updated = await CallSessionService.updateCallSession(sessionId, updates);
      if (updated) {
        setCallSession(updated);
        toast.success('Call session updated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update call session');
      toast.error('Failed to update call session');
    }
  };

  const createCallEvent = async (eventType: CallEvent['event_type'], eventData: Record<string, any> = {}) => {
    if (!sessionId || !user?.id) return;

    try {
      const event = await CallSessionService.createCallEvent({
        call_session_id: sessionId,
        event_type: eventType,
        event_data: eventData,
        user_id: user.id
      });

      if (event) {
        setCallEvents(prev => [...prev, event]);
      }
    } catch (err) {
      console.error('Failed to create call event:', err);
    }
  };

  const initiateCall = async (
    phoneNumber: string,
    leadId?: string,
    direction: 'inbound' | 'outbound' = 'outbound'
  ) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/supabase/functions/v1/initiate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: phoneNumber,
          userId: user.id,
          companyId: profile.company_id,
          leadId,
          direction,
          metadata: { timestamp: new Date().toISOString() }
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initiate call');
      }

      toast.success('Call initiated successfully');
      return data.sessionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate call';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callSession,
    callEvents,
    isLoading,
    error,
    updateCallSession,
    createCallEvent,
    initiateCall
  };
};
