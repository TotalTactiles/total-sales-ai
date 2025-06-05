
import { toast } from 'sonner';
import { encodeBase64 } from '@/services/security/base64Service';

class VoiceService {
  private mediaRecorderRef: MediaRecorder | null = null;
  private streamRef: MediaStream | null = null;
  private audioChunksRef: Blob[] = [];

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
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast.error('Microphone access denied. Please allow microphone access.');
      return false;
    }
  }

  async startRecording(): Promise<boolean> {
    try {
      this.streamRef = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.mediaRecorderRef = new MediaRecorder(this.streamRef);
      this.audioChunksRef = [];

      this.mediaRecorderRef.ondataavailable = (event) => {
        this.audioChunksRef.push(event.data);
      };

      this.mediaRecorderRef.start();
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start voice recording');
      return false;
    }
  }

  async stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (this.mediaRecorderRef && this.mediaRecorderRef.state === 'recording') {
        this.mediaRecorderRef.onstop = () => {
          const audioBlob = new Blob(this.audioChunksRef, { type: 'audio/webm' });
          this.cleanup();
          resolve(audioBlob);
        };
        
        this.mediaRecorderRef.stop();
      } else {
        resolve(null);
      }
    });
  }

  async processAudioCommand(audioBlob: Blob, userId: string): Promise<string> {
    try {
      // Convert audio to base64 for API
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = encodeBase64(new Uint8Array(arrayBuffer));

      // Mock transcription for now - in production this would call Whisper API
      console.log('Processing audio command...');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock transcription
      return "Generate a follow-up email for this lead";
    } catch (error) {
      console.error('Error processing audio command:', error);
      throw new Error('Failed to process voice command');
    }
  }

  async generateVoiceResponse(text: string): Promise<void> {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        window.speechSynthesis.speak(utterance);
        
        return new Promise<void>((resolve) => {
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
        });
      }
    } catch (error) {
      console.error('Error generating voice response:', error);
    }
  }

  cleanup(): void {
    if (this.streamRef) {
      this.streamRef.getTracks().forEach(track => track.stop());
      this.streamRef = null;
    }
    
    this.mediaRecorderRef = null;
    this.audioChunksRef = [];
  }
}

export const voiceService = new VoiceService();
