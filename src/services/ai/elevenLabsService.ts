
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

class ElevenLabsService {
  private serviceReady = false;

  async initialize(): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('elevenlabs-speech', {
        body: { test: true }
      });

      this.serviceReady = !error;

      if (this.serviceReady) {
        console.log('ElevenLabs service initialized successfully');
      } else {
        console.error('ElevenLabs service initialization failed');
      }

      return this.serviceReady;
    } catch (error) {
      console.error('Failed to initialize ElevenLabs service:', error);
      this.serviceReady = false;
      return false;
    }
  }

  async generateSpeech(text: string, voiceId: string = '9BWtsMINqrJLrRacOk9x'): Promise<string | null> {
    if (!this.serviceReady) {
      toast.error('ElevenLabs service not available');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-speech', {
        body: { text, voiceId }
      });

      if (error) {
        throw error;
      }

      return data.url as string;
    } catch (error) {
      console.error('Error generating speech:', error);
      toast.error('Failed to generate voice response');
      return null;
    }
  }

  isServiceReady(): boolean {
    return this.serviceReady;
  }
}

export const elevenLabsService = new ElevenLabsService();
