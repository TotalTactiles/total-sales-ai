
import { logger } from '@/utils/logger';

import { useRef, useCallback } from 'react';
import { SpeechRecognitionType } from './types';

export const useSpeechRecognition = () => {
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  const createRecognition = useCallback(() => {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      throw new Error('Speech recognition not supported');
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    return recognition;
  }, []);

  const setupRecognitionHandlers = useCallback((
    recognition: SpeechRecognitionType,
    handlers: {
      onResult: (transcript: string) => void;
      onError: (error: string) => void;
      onEnd: () => void;
      onStart: () => void;
    }
  ) => {
    recognition.onstart = () => {
      logger.info('Speech recognition started');
      handlers.onStart();
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .toLowerCase();
      handlers.onResult(transcript);
    };

    recognition.onerror = (event) => {
      logger.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Speech recognition error: ';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking closer to your microphone.';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed. Please check your microphone connection.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your internet connection.';
          break;
        default:
          errorMessage += event.error;
      }
      
      handlers.onError(errorMessage);
    };

    recognition.onend = () => {
      logger.info('Speech recognition ended');
      handlers.onEnd();
    };
  }, []);

  const startRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        return true;
      } catch (error) {
        logger.error('Failed to start speech recognition:', error);
        return false;
      }
    }
    return false;
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        logger.error('Error stopping recognition:', error);
      }
    }
  }, []);

  return {
    recognitionRef,
    createRecognition,
    setupRecognitionHandlers,
    startRecognition,
    stopRecognition
  };
};
