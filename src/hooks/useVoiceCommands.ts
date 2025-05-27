
import { useState, useCallback } from 'react';
import { voiceService } from '@/services/ai/voiceService';
import { toast } from 'sonner';

interface UseVoiceCommandsOptions {
  onCommand?: (command: string) => void;
  onError?: (error: string) => void;
  context?: string;
}

export const useVoiceCommands = (options: UseVoiceCommandsOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscription, setLastTranscription] = useState<string>('');

  const startListening = useCallback(async () => {
    try {
      setIsListening(true);
      const started = await voiceService.startRecording();
      
      if (!started) {
        setIsListening(false);
        const error = 'Failed to start voice recording';
        options.onError?.(error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error starting voice commands:', error);
      setIsListening(false);
      const errorMessage = error instanceof Error ? error.message : 'Voice recording failed';
      options.onError?.(errorMessage);
      return false;
    }
  }, [options]);

  const stopListening = useCallback(async () => {
    try {
      setIsListening(false);
      setIsProcessing(true);

      const audioBlob = await voiceService.stopRecording();
      
      if (!audioBlob || audioBlob.size === 0) {
        const error = 'No audio recorded';
        options.onError?.(error);
        setIsProcessing(false);
        return null;
      }

      const transcription = await voiceService.processAudioCommand(audioBlob, 'current-user');
      
      if (transcription && transcription.trim()) {
        setLastTranscription(transcription);
        options.onCommand?.(transcription);
        return transcription;
      } else {
        const error = 'Could not understand the voice command';
        options.onError?.(error);
        return null;
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      const errorMessage = error instanceof Error ? error.message : 'Voice processing failed';
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      return await stopListening();
    } else {
      return await startListening();
    }
  }, [isListening, startListening, stopListening]);

  const speakResponse = useCallback(async (text: string) => {
    try {
      await voiceService.generateVoiceResponse(text);
    } catch (error) {
      console.error('Error speaking response:', error);
      // Fallback to toast
      toast.info(text);
    }
  }, []);

  return {
    isListening,
    isProcessing,
    lastTranscription,
    startListening,
    stopListening,
    toggleListening,
    speakResponse
  };
};
