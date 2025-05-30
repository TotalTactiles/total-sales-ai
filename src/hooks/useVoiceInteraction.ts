
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './voice/useSpeechRecognition';
import { useAudioProcessing } from './voice/useAudioProcessing';
import { VoiceInteractionState, VoiceInteractionOptions } from './voice/types';
import { toast } from 'sonner';

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isWakeWordActive: false,
    transcript: '',
    response: '',
    error: null,
    permissionState: 'unknown',
    microphoneSupported: false
  });

  const { recognitionRef, createRecognition, setupRecognitionHandlers, startRecognition, stopRecognition } = useSpeechRecognition();
  const { startRecording, stopRecording, processAudioCommand, generateVoiceResponse, cleanup } = useAudioProcessing();
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout>();

  // Check microphone support and permissions
  useEffect(() => {
    const checkMicrophoneSupport = async () => {
      const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setState(prev => ({ ...prev, microphoneSupported: supported }));

      if (supported) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setState(prev => ({ ...prev, permissionState: permission.state }));
          
          permission.onchange = () => {
            setState(prev => ({ ...prev, permissionState: permission.state }));
          };
        } catch (error) {
          console.log('Permissions API not supported, will check on first use');
        }
      }
    };

    checkMicrophoneSupport();
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setState(prev => ({ ...prev, permissionState: 'granted' }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, permissionState: 'denied' }));
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (!state.microphoneSupported) {
      setState(prev => ({ ...prev, error: 'Microphone not supported' }));
      return false;
    }

    if (state.permissionState !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) return false;
    }

    try {
      if (!recognitionRef.current) {
        recognitionRef.current = createRecognition();
        setupRecognitionHandlers(recognitionRef.current, {
          onResult: (transcript) => setState(prev => ({ ...prev, transcript })),
          onError: (error) => setState(prev => ({ ...prev, error })),
          onEnd: () => setState(prev => ({ ...prev, isListening: false })),
          onStart: () => setState(prev => ({ ...prev, isListening: true, error: null }))
        });
      }

      const started = startRecognition();
      if (started) {
        setState(prev => ({ ...prev, isListening: true, transcript: '', error: null }));
      }
      return started;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Speech recognition failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [state.microphoneSupported, state.permissionState, requestMicrophonePermission, recognitionRef, createRecognition, setupRecognitionHandlers, startRecognition]);

  const stopListening = useCallback(() => {
    stopRecognition();
    setState(prev => ({ ...prev, isListening: false }));
  }, [stopRecognition]);

  const toggleWakeWord = useCallback(() => {
    setState(prev => ({ ...prev, isWakeWordActive: !prev.isWakeWordActive }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current);
      }
    };
  }, [cleanup]);

  return {
    ...state,
    startListening,
    stopListening,
    toggleWakeWord,
    clearError,
    requestMicrophonePermission
  };
};
