
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

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
  private apiKey: string | null = null;
  private isInitialized = false;

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if we have API key in localStorage for fallback
      this.apiKey = localStorage.getItem('elevenlabs_api_key');
      
      if (!this.apiKey) {
        logger.warn('ElevenLabs API key not found', {}, 'elevenlabs');
        return false;
      }

      // Test API connection
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Invalid API key or service unavailable');
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
          // Fallback to browser speech synthesis
          return this.fallbackToNativeSpeech(options.text);
        }
      }

      const voiceId = options.voiceId || '9BWtsMINqrJLrRacOk9x'; // Aria voice
      const model = options.model || 'eleven_multilingual_v2';

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!
        },
        body: JSON.stringify({
          text: options.text,
          model_id: model,
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarityBoost || 0.75,
            style: options.style || 0,
            use_speaker_boost: options.useSpeakerBoost || true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      
      logger.info('Speech generated successfully', { 
        textLength: options.text.length,
        voiceId 
      }, 'elevenlabs');

      return `data:audio/mpeg;base64,${base64Audio}`;
    } catch (error) {
      logger.error('Failed to generate speech with ElevenLabs', error, 'elevenlabs');
      // Fallback to native speech synthesis
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

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('elevenlabs_api_key', apiKey);
    this.isInitialized = false; // Force re-initialization
  }

  isServiceReady(): boolean {
    return this.isInitialized;
  }
}

export const elevenLabsService = ElevenLabsService.getInstance();
