
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { unifiedAIService } from './unifiedAIService';

export class VoiceService {
  private static instance: VoiceService;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private retryCount = 0;
  private maxRetries = 3;
  private speechSynthesis: SpeechSynthesis | null = null;

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  constructor() {
    // Initialize speech synthesis if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  async initializeAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({
        sampleRate: 24000
      });
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast.error('Microphone permission is required for voice commands');
      return false;
    }
  }

  async startRecording(): Promise<boolean> {
    if (this.isRecording) {
      console.log('Already recording');
      return true;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';

      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        this.isRecording = false;
        toast.error('Recording error occurred');
      };

      this.mediaRecorder.start(250);
      console.log('Voice recording started');
      this.retryCount = 0; // Reset retry count on successful start
      return true;

    } catch (error) {
      console.error('Failed to start recording:', error);
      this.isRecording = false;
      
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone permission denied. Please allow microphone access.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone.');
      } else {
        toast.error('Failed to start voice recording. Please try again.');
      }
      
      return false;
    }
  }

  async stopRecording(): Promise<Blob | null> {
    if (!this.isRecording || !this.mediaRecorder) {
      console.log('Not currently recording');
      return null;
    }

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        
        if (this.audioChunks.length === 0) {
          console.warn('No audio data recorded');
          resolve(null);
          return;
        }

        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log('Voice recording stopped, blob size:', audioBlob.size);
        
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  async processAudioCommand(audioBlob: Blob, userId: string): Promise<string> {
    try {
      console.log('Processing audio command, blob size:', audioBlob.size);
      
      if (audioBlob.size === 0) {
        throw new Error('No audio data to process');
      }

      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      console.log('Sending audio to voice-to-text function...');

      // Try OpenAI Whisper first with retry logic
      let transcriptionData;
      try {
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio, provider: 'openai' }
        });

        if (error) {
          // Check if it's a quota error
          if (error.message?.includes('quota') || error.message?.includes('limit')) {
            throw new Error('QUOTA_EXCEEDED');
          }
          throw error;
        }
        
        transcriptionData = data;
        this.retryCount = 0; // Reset on success
        
      } catch (openaiError) {
        console.warn('OpenAI transcription failed:', openaiError);
        
        // If quota exceeded or after retries, try Claude fallback
        if (openaiError.message === 'QUOTA_EXCEEDED' || this.retryCount >= this.maxRetries) {
          console.log('Attempting Claude fallback for transcription...');
          
          try {
            // Use Claude for audio transcription (if available via edge function)
            const { data, error } = await supabase.functions.invoke('voice-to-text', {
              body: { audio: base64Audio, provider: 'anthropic' }
            });

            if (error) throw error;
            transcriptionData = data;
            
          } catch (claudeError) {
            console.error('Claude transcription also failed:', claudeError);
            throw new Error('All voice transcription services are temporarily unavailable. Please try typing your message instead.');
          }
        } else {
          // Retry with OpenAI
          this.retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount)); // Exponential backoff
          return this.processAudioCommand(audioBlob, userId);
        }
      }

      if (!transcriptionData?.text) {
        throw new Error('No transcription received from audio');
      }

      console.log('Transcription successful:', transcriptionData.text);
      return transcriptionData.text;
      
    } catch (error) {
      console.error('Error processing audio command:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('quota')) {
        throw new Error('Voice transcription service is temporarily unavailable. Please try typing your message instead.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('No audio')) {
        throw new Error('No audio was recorded. Please try speaking again.');
      } else {
        throw new Error('Failed to process voice command. Please try again or type your message.');
      }
    }
  }

  async generateVoiceResponse(text: string): Promise<void> {
    try {
      // Validate input
      if (!text || typeof text !== 'string') {
        console.error('Invalid text provided to generateVoiceResponse:', text);
        throw new Error('Invalid text provided for speech generation');
      }

      console.log('Generating voice response for text:', text.substring(0, 50) + '...');
      
      // First try ElevenLabs via edge function
      try {
        const { data, error } = await supabase.functions.invoke('ai-voice', {
          body: { 
            text: text,
            voiceId: '9BWtsMINqrJLrRacOk9x' // Aria voice
          }
        });

        if (!error && data) {
          // Play the audio from ElevenLabs
          const audioBlob = new Blob([data], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          return new Promise((resolve, reject) => {
            audio.onended = () => {
              URL.revokeObjectURL(audioUrl);
              console.log('ElevenLabs voice response completed');
              resolve();
            };
            
            audio.onerror = (error) => {
              console.error('Audio playback error:', error);
              URL.revokeObjectURL(audioUrl);
              reject(error);
            };
            
            audio.play().catch(reject);
          });
        }
      } catch (elevenLabsError) {
        console.warn('ElevenLabs TTS failed, falling back to browser synthesis:', elevenLabsError);
      }
      
      // Fallback to browser's speech synthesis
      if (this.speechSynthesis) {
        // Cancel any ongoing speech
        this.speechSynthesis.cancel();
        
        // Optimize text for voice if it's too long
        let optimizedText = text;
        if (text.length > 200) {
          try {
            const aiResponse = await unifiedAIService.generateResponse(
              `Make this response concise and natural for voice output while keeping key information: "${text}"`,
              'You are a voice optimization expert. Make responses sound natural when spoken aloud.',
              undefined,
              'claude'
            );
            
            if (aiResponse.response && aiResponse.response.length < text.length) {
              optimizedText = aiResponse.response;
            }
          } catch (aiError) {
            console.warn('AI optimization failed, using original text:', aiError);
          }
        }
        
        const utterance = new SpeechSynthesisUtterance(optimizedText);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice
        const voices = this.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Natural') || 
          voice.name.includes('Neural') ||
          voice.name.includes('Premium') ||
          (voice.lang.startsWith('en') && voice.localService)
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            this.speechSynthesis?.cancel();
            reject(new Error('Speech synthesis timeout'));
          }, 30000); // 30 second timeout

          utterance.onend = () => {
            clearTimeout(timeout);
            console.log('Browser voice response completed');
            resolve();
          };
          
          utterance.onerror = (event) => {
            clearTimeout(timeout);
            console.error('Speech synthesis error:', event);
            reject(new Error('Speech synthesis failed'));
          };
          
          this.speechSynthesis!.speak(utterance);
        });
      } else {
        throw new Error('Speech synthesis not supported');
      }
    } catch (error) {
      console.error('Error generating voice response:', error);
      // Final fallback: show text response as toast
      const safeText = typeof text === 'string' ? text : 'AI response generated';
      toast.info(safeText.substring(0, 100) + (safeText.length > 100 ? '...' : ''));
      throw error;
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  cleanup(): void {
    console.log('Cleaning up voice service');
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    
    this.mediaRecorder = null;
    this.audioContext = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.retryCount = 0;
  }
}

export const voiceService = VoiceService.getInstance();
