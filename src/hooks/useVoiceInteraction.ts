
import { useState, useCallback, useEffect } from 'react';
import { VoiceInteractionState, VoiceInteractionOptions } from './voice/types';
import { useSpeechRecognition } from './voice/useSpeechRecognition';
import { voiceService } from '@/services/ai/voiceService';

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { wakeWord = 'hey jarvis' } = options;
  const {
    recognitionRef,
    createRecognition,
    setupRecognitionHandlers,
    startRecognition,
    stopRecognition
  } = useSpeechRecognition();
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
    microphoneSupported: false
  });

  // Handle speech recognition results for wake word detection
  const handleRecognitionResult = useCallback(
    async (transcript: string) => {
      if (transcript.includes(wakeWord.toLowerCase()) && !state.isListening) {
        stopRecognition();
        setState(prev => ({ ...prev, isDetecting: false }));
        await startListening();
      }
    },
    [wakeWord, state.isListening, startListening, stopRecognition]
  );

  const handleRecognitionError = useCallback(
    (error: string) => {
      setState(prev => ({ ...prev, error, isDetecting: false }));
    },
    []
  );

  const handleRecognitionEnd = useCallback(() => {
    setState(prev => ({ ...prev, isDetecting: false }));
  }, []);

  const handleRecognitionStart = useCallback(() => {
    setState(prev => ({ ...prev, isDetecting: true }));
  }, []);

  // Setup and manage speech recognition lifecycle
  useEffect(() => {
    if (state.isWakeWordActive && state.permissionState === 'granted' && !state.isListening) {
      if (!recognitionRef.current) {
        try {
          recognitionRef.current = createRecognition();
        } catch (err: any) {
          setState(prev => ({ ...prev, error: err.message || 'Speech recognition not supported' }));
          return;
        }
      }

      setupRecognitionHandlers(recognitionRef.current, {
        onResult: handleRecognitionResult,
        onError: handleRecognitionError,
        onEnd: handleRecognitionEnd,
        onStart: handleRecognitionStart
      });

      startRecognition();

      return () => {
        stopRecognition();
        setState(prev => ({ ...prev, isDetecting: false }));
      };
    } else {
      stopRecognition();
      setState(prev => ({ ...prev, isDetecting: false }));
    }
  }, [state.isWakeWordActive, state.permissionState, state.isListening, createRecognition, setupRecognitionHandlers, startRecognition, stopRecognition, handleRecognitionResult, handleRecognitionError, handleRecognitionEnd, handleRecognitionStart]);

  const startListening = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isListening: true, error: null }));
      const started = await voiceService.startRecording();
      if (!started) {
        setState(prev => ({ ...prev, isListening: false, error: 'Failed to start recording' }));
      }
      return started;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        error: error instanceof Error ? error.message : 'Voice recording failed' 
      }));
      return false;
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isListening: false, isProcessing: true }));
      const audioBlob = await voiceService.stopRecording();
      
      if (audioBlob) {
        const transcript = await voiceService.processAudioCommand(audioBlob, 'current-user');
        setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          transcript,
          error: null
        }));
        return transcript;
      } else {
        setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          error: 'No audio recorded' 
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Processing failed' 
      }));
      return null;
    }
  }, []);

  const toggleWakeWord = useCallback(() => {
    setState(prev => ({ ...prev, isWakeWordActive: !prev.isWakeWordActive }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const granted = await voiceService.requestMicrophonePermission();
      setState(prev => ({ 
        ...prev, 
        permissionState: granted ? 'granted' : 'denied',
        microphoneSupported: true
      }));
      return granted;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        permissionState: 'denied',
        microphoneSupported: false,
        error: 'Microphone permission denied'
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    toggleWakeWord,
    clearError,
    requestMicrophonePermission
  };
};
