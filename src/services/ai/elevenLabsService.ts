
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export interface ElevenLabsVoiceOptions {
  text: string;
  voiceId?: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export class ElevenLabsService {
  private static instance: ElevenLabsService;
  private isInitialized = false;

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Test connection using the edge function
      const { error } = await supabase.functions.invoke('ai-voice', {
        body: { 
          text: 'test', 
          voiceId: '9BWtsMINqrJLrRacOk9x' // Aria voice
        }
      });

      if (error) {
        logger.warn('ElevenLabs service not available', error, 'elevenlabs');
        return false;
      }

      this.isInitialized = true;
      logger.info('ElevenLabs service initialized successfully', {}, 'elevenlabs');
      return true;
    } catch (error) {
      logger.error('Failed to initialize ElevenLabs service', error, 'elevenlabs');
      this.isInitialized = false;
      return false;
    }
  }

  async generateSpeech(options: ElevenLabsVoiceOptions): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return this.fallbackToNativeSpeech(options.text);
        }
      }

      const { data, error } = await supabase.functions.invoke('ai-voice', {
        body: {
          text: options.text,
          voiceId: options.voiceId || '9BWtsMINqrJLrRacOk9x', // Aria voice
          model: options.model || 'eleven_multilingual_v2'
        }
      });

      if (error) throw error;

      // The edge function returns raw audio data
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      logger.info('Speech generated successfully', { 
        textLength: options.text.length,
        voiceId: options.voiceId 
      }, 'elevenlabs');

      return audioUrl;
    } catch (error) {
      logger.error('Failed to generate speech with ElevenLabs', error, 'elevenlabs');
      return this.fallbackToNativeSpeech(options.text);
    }
  }

  private async fallbackToNativeSpeech(text: string): Promise<string | null> {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Natural') || 
          voice.name.includes('Neural') ||
          voice.name.includes('Premium')
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        speechSynthesis.speak(utterance);
        
        logger.info('Fallback to native speech synthesis', { textLength: text.length }, 'speech_synthesis');
        return 'native_speech_used';
      }
      
      throw new Error('No speech synthesis available');
    } catch (error) {
      logger.error('Native speech synthesis failed', error, 'speech_synthesis');
      toast.info(text); // Final fallback - show as text
      return null;
    }
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }
}

export const elevenLabsService = ElevenLabsService.getInstance();
