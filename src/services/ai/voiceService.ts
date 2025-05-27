
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class VoiceService {
  private static instance: VoiceService;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

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
      
      // Stop the stream immediately, we just wanted to check permissions
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

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        console.warn('audio/webm;codecs=opus not supported, trying audio/webm');
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          throw new Error('WebM audio recording not supported');
        }
      }

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });

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

      this.mediaRecorder.start(250); // Collect data every 250ms
      console.log('Voice recording started');
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
      console.log('Processing audio command, blob size:', audioBlob.size);
      
      if (audioBlob.size === 0) {
        throw new Error('No audio data to process');
      }

      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      console.log('Sending audio to voice-to-text function...');

      // Transcribe audio using Whisper API
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptionError) {
        console.error('Transcription error:', transcriptionError);
        
        // Check for specific API quota error
        if (transcriptionError.message?.includes('quota') || transcriptionError.message?.includes('insufficient_quota')) {
          throw new Error('Voice transcription service is temporarily unavailable. Please try typing your message instead.');
        }
        
        throw new Error('Failed to transcribe audio: ' + transcriptionError.message);
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
      console.log('Generating voice response for text:', text.substring(0, 50) + '...');
      
      // Use browser's speech synthesis as primary method
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Natural') || 
          voice.name.includes('Neural') ||
          voice.name.includes('Premium') ||
          voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        return new Promise((resolve, reject) => {
          utterance.onend = () => {
            console.log('Voice response completed');
            resolve();
          };
          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            reject(new Error('Speech synthesis failed'));
          };
          
          speechSynthesis.speak(utterance);
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
    
    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    this.mediaRecorder = null;
    this.audioContext = null;
    this.audioChunks = [];
    this.isRecording = false;
  }
}

export const voiceService = VoiceService.getInstance();
