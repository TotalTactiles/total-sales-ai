import { logger } from '@/utils/logger';

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
      // Request microphone permission first
      const hasPermission = await voiceService.requestMicrophonePermission();
      if (!hasPermission) {
        options.onError?.('Microphone permission denied');
        return false;
      }

      setIsListening(true);
      const started = await voiceService.startRecording();
      
      if (!started) {
        setIsListening(false);
        const error = 'Failed to start voice recording';
        options.onError?.(error);
        return false;
      }

      logger.info('Voice recording started successfully');
      return true;
    } catch (error) {
      logger.error('Error starting voice commands:', error);
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

      logger.info('Stopping voice recording...');
      const audioBlob = await voiceService.stopRecording();
      
      if (!audioBlob || audioBlob.size === 0) {
        const error = 'No audio recorded';
        options.onError?.(error);
        setIsProcessing(false);
        return null;
      }

      logger.info('Processing voice command...');
      const transcription = await voiceService.processAudioCommand(audioBlob, 'current-user');
      
      if (transcription && transcription.trim()) {
        logger.info('Voice command transcribed:', transcription);
        setLastTranscription(transcription);
        options.onCommand?.(transcription);
        toast.success('Voice command processed successfully');
        return transcription;
      } else {
        const error = 'Could not understand the voice command';
        options.onError?.(error);
        return null;
      }

    } catch (error) {
      logger.error('Error processing voice command:', error);
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
      // Ensure text is a string and not empty
      if (!text || typeof text !== 'string') {
        logger.error('Invalid text provided to speakResponse:', text);
        throw new Error('Invalid text provided for speech');
      }

      logger.info('Speaking response:', text.substring(0, 50) + '...');
      await voiceService.generateVoiceResponse(text);
    } catch (error) {
      logger.error('Error speaking response:', error);
      // Fallback to toast notification with safe string handling
      const fallbackText = typeof text === 'string' ? text : 'AI response generated';
      const truncatedText = fallbackText.substring(0, 100);
      toast.info(truncatedText + (fallbackText.length > 100 ? '...' : ''));
      throw error;
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
