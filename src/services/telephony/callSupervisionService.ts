
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CallSupervision {
  id: string;
  call_session_id: string;
  supervisor_id: string;
  supervision_type: 'listen' | 'whisper' | 'barge';
  started_at: string;
  ended_at?: string;
  notes?: string;
}

export class CallSupervisionService {
  static async startSupervision(
    sessionId: string,
    supervisorId: string,
    type: 'listen' | 'whisper' | 'barge'
  ): Promise<CallSupervision | null> {
    const { data, error } = await supabase
      .from('call_supervision')
      .insert({
        call_session_id: sessionId,
        supervisor_id: supervisorId,
        supervision_type: type
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting supervision:', error);
      return null;
    }

    // Start Twilio conference supervision
    const { error: twilioError } = await supabase.functions.invoke('start-supervision', {
      body: { sessionId, supervisorId, type, supervisionId: data.id }
    });

    if (twilioError) {
      console.error('Error starting Twilio supervision:', twilioError);
      toast.error('Failed to start call supervision');
      return null;
    }

    return data;
  }

  static async endSupervision(supervisionId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('call_supervision')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', supervisionId)
      .select()
      .single();

    if (error) {
      console.error('Error ending supervision:', error);
      return false;
    }

    // End Twilio conference supervision
    const { error: twilioError } = await supabase.functions.invoke('end-supervision', {
      body: { supervisionId }
    });

    if (twilioError) {
      console.error('Error ending Twilio supervision:', twilioError);
    }

    return true;
  }

  static async getActiveSupervisions(sessionId: string): Promise<CallSupervision[]> {
    const { data, error } = await supabase
      .from('call_supervision')
      .select('*')
      .eq('call_session_id', sessionId)
      .is('ended_at', null)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching active supervisions:', error);
      return [];
    }

    return data || [];
  }

  static async updateSupervisionNotes(supervisionId: string, notes: string): Promise<boolean> {
    const { error } = await supabase
      .from('call_supervision')
      .update({ notes })
      .eq('id', supervisionId);

    if (error) {
      console.error('Error updating supervision notes:', error);
      return false;
    }

    return true;
  }

  static subscribeToSupervision(sessionId: string, callback: (supervision: CallSupervision) => void) {
    return supabase
      .channel(`supervision_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_supervision',
          filter: `call_session_id=eq.${sessionId}`
        },
        (payload) => callback(payload.new as CallSupervision)
      )
      .subscribe();
  }
}
