
import { toast } from 'sonner';

class ElevenLabsService {
  private isServiceReady = false;
  private apiKey: string | null = null;

  async initialize(apiKey?: string): Promise<boolean> {
    try {
      this.apiKey = apiKey || process.env.VITE_ELEVENLABS_API_KEY || null;
      
      if (!this.apiKey) {
        console.warn('ElevenLabs API key not provided');
        this.isServiceReady = false;
        return false;
      }

      // Test API connection
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      this.isServiceReady = response.ok;
      
      if (this.isServiceReady) {
        console.log('ElevenLabs service initialized successfully');
      } else {
        console.error('ElevenLabs API key invalid');
      }
      
      return this.isServiceReady;
    } catch (error) {
      console.error('Failed to initialize ElevenLabs service:', error);
      this.isServiceReady = false;
      return false;
    }
  }

  async generateSpeech(text: string, voiceId: string = '9BWtsMINqrJLrRacOk9x'): Promise<ArrayBuffer | null> {
    if (!this.isServiceReady || !this.apiKey) {
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

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      toast.error('Failed to generate voice response');
      return null;
    }
  }

  isServiceReady(): boolean {
    return this.isServiceReady;
  }
}

export const elevenLabsService = new ElevenLabsService();
