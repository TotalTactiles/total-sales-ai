
import { useState, useCallback } from 'react';
import { VoiceInteractionState, VoiceInteractionOptions } from './voice/types';
import { voiceService } from '@/services/ai/voiceService';

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
