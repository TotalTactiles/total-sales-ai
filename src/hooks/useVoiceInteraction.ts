
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface VoiceInteractionState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
}

export const useVoiceInteraction = () => {
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    error: null
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const startListening = useCallback(async () => {
    try {
      // Check for speech recognition support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null }));
        logger.info('Voice recognition started');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setState(prev => ({ ...prev, transcript }));
      };

      recognition.onerror = (event) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        setState(prev => ({ ...prev, error: errorMessage, isListening: false }));
        logger.error(errorMessage);
        toast.error(errorMessage);
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      recognition.start();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start voice recognition';
      setState(prev => ({ ...prev, error: errorMessage }));
      logger.error('Failed to start voice recognition:', error);
      toast.error(errorMessage);
    }
  }, []);

  const processVoiceCommand = useCallback(async (command: string) => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // Process the voice command here
      logger.info('Processing voice command:', command);
      
      // Add your voice command processing logic here
      
      setState(prev => ({ ...prev, isProcessing: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process voice command';
      setState(prev => ({ ...prev, error: errorMessage, isProcessing: false }));
      logger.error('Failed to process voice command:', error);
      toast.error(errorMessage);
    }
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    processVoiceCommand
  };
};
