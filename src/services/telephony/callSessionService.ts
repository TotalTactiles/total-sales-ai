
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CallSession {
  id: string;
  call_sid: string;
  company_id: string;
  user_id: string;
  lead_id?: string;
  direction: 'inbound' | 'outbound';
  status: 'initiated' | 'ringing' | 'answered' | 'completed' | 'failed' | 'cancelled';
  from_number: string;
  to_number: string;
  duration: number;
  recording_url?: string;
  recording_sid?: string;
  transcription?: string;
  sentiment_score?: number;
  quality_score?: number;
  disposition?: string;
  notes?: string;
  metadata: Record<string, any>;
  started_at: string;
  answered_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CallEvent {
  id: string;
  call_session_id: string;
  event_type: 'dial' | 'ring' | 'answer' | 'hangup' | 'transfer' | 'hold' | 'mute' | 'recording_start' | 'recording_stop';
  event_data: Record<string, any>;
  user_id?: string;
  timestamp: string;
}

export class CallSessionService {
  static async createCallSession(sessionData: Omit<CallSession, 'id' | 'created_at' | 'updated_at'>): Promise<CallSession | null> {
    const { data, error } = await supabase
      .from('call_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating call session:', error);
      return null;
    }

    return data;
  }

  static async updateCallSession(sessionId: string, updates: Partial<CallSession>): Promise<CallSession | null> {
    const { data, error } = await supabase
      .from('call_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating call session:', error);
      return null;
    }

    return data;
  }

  static async getCallSession(sessionId: string): Promise<CallSession | null> {
    const { data, error } = await supabase
      .from('call_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching call session:', error);
      return null;
    }

    return data;
  }

  static async getCallSessionBySid(callSid: string): Promise<CallSession | null> {
    const { data, error } = await supabase
      .from('call_sessions')
      .select('*')
      .eq('call_sid', callSid)
      .single();

    if (error) {
      console.error('Error fetching call session by SID:', error);
      return null;
    }

    return data;
  }

  static async getCompanyCallSessions(companyId: string, limit: number = 50): Promise<CallSession[]> {
    const { data, error } = await supabase
      .from('call_sessions')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching company call sessions:', error);
      return [];
    }

    return data || [];
  }

  static async createCallEvent(eventData: Omit<CallEvent, 'id' | 'timestamp'>): Promise<CallEvent | null> {
    const { data, error } = await supabase
      .from('call_events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Error creating call event:', error);
      return null;
    }

    return data;
  }

  static async getCallEvents(sessionId: string): Promise<CallEvent[]> {
    const { data, error } = await supabase
      .from('call_events')
      .select('*')
      .eq('call_session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching call events:', error);
      return [];
    }

    return data || [];
  }

  static subscribeToCallSession(sessionId: string, callback: (session: CallSession) => void) {
    return supabase
      .channel(`call_session_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'call_sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload) => callback(payload.new as CallSession)
      )
      .subscribe();
  }

  static subscribeToCallEvents(sessionId: string, callback: (event: CallEvent) => void) {
    return supabase
      .channel(`call_events_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_events',
          filter: `call_session_id=eq.${sessionId}`
        },
        (payload) => callback(payload.new as CallEvent)
      )
      .subscribe();
  }
}
