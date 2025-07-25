import { logger } from '@/utils/logger';

import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { withRetry } from '@/utils/withRetry';

class ElevenLabsService {
  private serviceReady = false;

  async initialize(): Promise<boolean> {
    try {
      const { error } = await withRetry(
        () =>
          supabase.functions.invoke('elevenlabs-speech', {
            body: { test: true }
          }),
        'elevenlabs-speech'
      );

      this.serviceReady = !error;

      if (this.serviceReady) {
        logger.info('ElevenLabs service initialized successfully');
      } else {
        logger.error('ElevenLabs service initialization failed');
      }

      return this.serviceReady;
    } catch (error) {
      logger.error('Failed to initialize ElevenLabs service:', error);
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
      const { data, error } = await withRetry(
        () =>
          supabase.functions.invoke('elevenlabs-speech', {
            body: { text, voiceId }
          }),
        'elevenlabs-speech'
      );

      if (error) {
        throw error;
      }

      return data.url as string;
    } catch (error) {
      logger.error('Error generating speech:', error);
      toast.error('Failed to generate voice response');
      return null;
    }
  }

  isServiceReady(): boolean {
    return this.serviceReady;
  }
}

export const elevenLabsService = new ElevenLabsService();
