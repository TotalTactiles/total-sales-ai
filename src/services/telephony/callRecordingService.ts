
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CallRecording {
  id: string;
  call_session_id: string;
  recording_sid: string;
  recording_url: string;
  duration?: number;
  file_size?: number;
  transcription?: string;
  transcription_confidence?: number;
  sentiment_analysis?: Record<string, any>;
  keywords?: string[];
  created_at: string;
}

export class CallRecordingService {
  static async createRecording(recordingData: Omit<CallRecording, 'id' | 'created_at'>): Promise<CallRecording | null> {
    const { data, error } = await supabase
      .from('call_recordings')
      .insert(recordingData)
      .select()
      .single();

    if (error) {
      console.error('Error creating call recording:', error);
      return null;
    }

    return data;
  }

  static async getRecording(recordingId: string): Promise<CallRecording | null> {
    const { data, error } = await supabase
      .from('call_recordings')
      .select('*')
      .eq('id', recordingId)
      .single();

    if (error) {
      console.error('Error fetching call recording:', error);
      return null;
    }

    return data;
  }

  static async getSessionRecordings(sessionId: string): Promise<CallRecording[]> {
    const { data, error } = await supabase
      .from('call_recordings')
      .select('*')
      .eq('call_session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching session recordings:', error);
      return [];
    }

    return data || [];
  }

  static async updateRecording(recordingId: string, updates: Partial<CallRecording>): Promise<CallRecording | null> {
    const { data, error } = await supabase
      .from('call_recordings')
      .update(updates)
      .eq('id', recordingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating call recording:', error);
      return null;
    }

    return data;
  }

  static async transcribeRecording(recordingId: string): Promise<{ success: boolean; transcription?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('transcribe-recording', {
        body: { recordingId }
      });

      if (error) throw error;

      return { success: true, transcription: data.transcription };
    } catch (error) {
      console.error('Error transcribing recording:', error);
      return { success: false };
    }
  }

  static async analyzeRecording(recordingId: string): Promise<{ success: boolean; analysis?: Record<string, any> }> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-recording', {
        body: { recordingId }
      });

      if (error) throw error;

      return { success: true, analysis: data.analysis };
    } catch (error) {
      console.error('Error analyzing recording:', error);
      return { success: false };
    }
  }

  static async downloadRecording(recordingUrl: string): Promise<Blob | null> {
    try {
      const response = await fetch(recordingUrl);
      if (!response.ok) throw new Error('Failed to download recording');
      
      return await response.blob();
    } catch (error) {
      console.error('Error downloading recording:', error);
      toast.error('Failed to download recording');
      return null;
    }
  }
}
