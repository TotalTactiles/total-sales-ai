
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { VoiceInteractionState, VoiceInteractionOptions } from '@/hooks/voice/types';

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isWakeWordActive: false,
    isDetecting: false,
    transcript: '',
    response: '',
    error: null,
    permissionState: 'unknown',
    microphoneSupported: true
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const checkMicrophoneSupport = useCallback(() => {
    const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) &&
                     (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
    
    setState(prev => ({ ...prev, microphoneSupported: supported }));
    return supported;
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      if (!checkMicrophoneSupport()) {
        setState(prev => ({ ...prev, permissionState: 'denied' }));
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, permissionState: 'granted' }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, permissionState: 'denied' }));
      return false;
    }
  }, [checkMicrophoneSupport]);

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
      if (!checkMicrophoneSupport()) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

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
  }, [checkMicrophoneSupport, requestMicrophonePermission]);

  const processVoiceCommand = useCallback(async (command: string) => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      logger.info('Processing voice command:', command);
      
      // Simulate AI response
      const response = `Processed command: ${command}`;
      setState(prev => ({ ...prev, response, isProcessing: false }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process voice command';
      setState(prev => ({ ...prev, error: errorMessage, isProcessing: false }));
      logger.error('Failed to process voice command:', error);
      toast.error(errorMessage);
    }
  }, []);

  const toggleWakeWord = useCallback(() => {
    setState(prev => ({ ...prev, isWakeWordActive: !prev.isWakeWordActive }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    processVoiceCommand,
    toggleWakeWord,
    clearError,
    requestMicrophonePermission
  };
};
