import { logger } from '@/utils/logger';

import { toast } from 'sonner';

class ElevenLabsService {
  private serviceReady = false;
  private apiKey: string | null = null;

  async initialize(apiKey?: string): Promise<boolean> {
    try {
      this.apiKey = apiKey || process.env.VITE_ELEVENLABS_API_KEY || null;
      
      if (!this.apiKey) {
        logger.warn('ElevenLabs API key not provided');
        this.serviceReady = false;
        return false;
      }

      // Test API connection
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      this.serviceReady = response.ok;
      
      if (this.serviceReady) {
        logger.info('ElevenLabs service initialized successfully');
      } else {
        logger.error('ElevenLabs API key invalid');
      }
      
      return this.serviceReady;
    } catch (error) {
      logger.error('Failed to initialize ElevenLabs service:', error);
      this.serviceReady = false;
      return false;
    }
  }

  async generateSpeech(text: string, voiceId: string = '9BWtsMINqrJLrRacOk9x'): Promise<string | null> {
    if (!this.serviceReady || !this.apiKey) {
      toast.error('ElevenLabs service not available');
      return null;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
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
