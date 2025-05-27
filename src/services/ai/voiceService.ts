
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class VoiceService {
  private static instance: VoiceService;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
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

  async startRecording(): Promise<MediaRecorder> {
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

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250); // Collect data every 250ms
      return this.mediaRecorder;

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Stop all tracks
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
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Transcribe audio using Whisper API
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptionError) throw transcriptionError;

      return transcriptionData.text;
    } catch (error) {
      console.error('Error processing audio command:', error);
      throw new Error('Failed to process voice command');
    }
  }

  async generateVoiceResponse(text: string): Promise<void> {
    try {
      // Use browser's speech synthesis as primary method
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice if available
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
        
        return new Promise((resolve, reject) => {
          utterance.onend = () => resolve();
          utterance.onerror = () => reject(new Error('Speech synthesis failed'));
        });
      } else {
        throw new Error('Speech synthesis not supported');
      }
    } catch (error) {
      console.error('Error generating voice response:', error);
      // Fallback: just show text response
      toast.info(text);
    }
  }

  cleanup(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    this.mediaRecorder = null;
    this.audioContext = null;
    this.audioChunks = [];
  }
}

export const voiceService = VoiceService.getInstance();
