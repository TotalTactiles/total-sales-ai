
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface VoiceInteractionConfig {
  context: string;
  workspaceData?: any;
  wakeWords?: string[];
  autoListen?: boolean;
  onCommand?: (command: string) => void;
}

interface VoiceInteractionState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isWakeWordActive: boolean;
  isDetecting: boolean;
  transcript: string | null;
  response: string | null;
  error: string | null;
  permissionState: PermissionState | null;
  microphoneSupported: boolean;
}

export const useVoiceInteraction = (config: VoiceInteractionConfig) => {
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isWakeWordActive: false,
    isDetecting: false,
    transcript: null,
    response: null,
    error: null,
    permissionState: null,
    microphoneSupported: false
  });

  const recognitionRef = useRef<any>(null);
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const continuousListeningRef = useRef<boolean>(false);

  const wakeWords = config.wakeWords || ['hey tsam', 'hey assistant', 'tsam'];

  // Check microphone support
  useEffect(() => {
    const checkSupport = () => {
      const supported = !!(
        navigator.mediaDevices?.getUserMedia &&
        (window.webkitSpeechRecognition || window.SpeechRecognition)
      );
      
      setState(prev => ({ ...prev, microphoneSupported: supported }));
      
      if (!supported) {
        logger.warn('Voice features not supported in this browser');
      }
    };

    checkSupport();
  }, []);

  // Request microphone permission
  const requestMicrophonePermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setState(prev => ({ ...prev, permissionState: 'granted' }));
      return true;
    } catch (error) {
      logger.error('Microphone permission denied:', error);
      setState(prev => ({ ...prev, permissionState: 'denied' }));
      return false;
    }
  }, []);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!state.microphoneSupported) return null;

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      logger.info('Speech recognition started');
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onend = () => {
      logger.info('Speech recognition ended');
      setState(prev => ({ ...prev, isListening: false }));
      
      // Restart if in continuous mode
      if (continuousListeningRef.current && state.isWakeWordActive) {
        setTimeout(() => {
          if (continuousListeningRef.current) {
            recognition.start();
          }
        }, 100);
      }
    };

    recognition.onerror = (event: any) => {
      logger.error('Speech recognition error:', event.error);
      setState(prev => ({ 
        ...prev, 
        error: `Speech recognition error: ${event.error}`,
        isListening: false 
      }));
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      logger.info('Speech recognition result:', transcript);

      setState(prev => ({ ...prev, transcript }));

      // Check for wake words
      const hasWakeWord = wakeWords.some(wake => transcript.includes(wake));
      
      if (hasWakeWord) {
        logger.info('Wake word detected:', transcript);
        setState(prev => ({ ...prev, isDetecting: true }));
        
        // Extract command after wake word
        let command = transcript;
        for (const wake of wakeWords) {
          if (transcript.includes(wake)) {
            command = transcript.replace(wake, '').trim();
            break;
          }
        }

        if (command && command.length > 0) {
          await processVoiceCommand(command);
        } else {
          // Just wake word, wait for actual command
          toast.info('I\'m listening. What can I help you with?');
          setState(prev => ({ ...prev, isDetecting: false }));
        }
      } else if (!state.isWakeWordActive) {
        // Direct command mode
        await processVoiceCommand(transcript);
      }
    };

    return recognition;
  }, [state.microphoneSupported, state.isWakeWordActive, wakeWords]);

  // Process voice command
  const processVoiceCommand = useCallback(async (command: string) => {
    setState(prev => ({ ...prev, isProcessing: true, isDetecting: false }));
    
    try {
      logger.info('Processing voice command:', command);
      
      // Call the onCommand callback if provided
      if (config.onCommand) {
        config.onCommand(command);
      }

      // Mock AI response for now - replace with actual AI service
      const response = `Processing command: "${command}" in ${config.context} context`;
      
      setState(prev => ({ 
        ...prev, 
        response,
        isProcessing: false 
      }));

      // Generate voice response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.onstart = () => setState(prev => ({ ...prev, isSpeaking: true }));
        utterance.onend = () => setState(prev => ({ ...prev, isSpeaking: false }));
        window.speechSynthesis.speak(utterance);
      }

      toast.success('Voice command processed');
      
    } catch (error) {
      logger.error('Error processing voice command:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to process voice command',
        isProcessing: false 
      }));
      toast.error('Failed to process voice command');
    }
  }, [config]);

  // Start listening
  const startListening = useCallback(async () => {
    if (!state.microphoneSupported) {
      toast.error('Voice features not supported in this browser');
      return false;
    }

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      toast.error('Microphone permission required');
      return false;
    }

    try {
      if (!recognitionRef.current) {
        recognitionRef.current = initializeSpeechRecognition();
      }

      if (recognitionRef.current) {
        recognitionRef.current.start();
        return true;
      }
    } catch (error) {
      logger.error('Failed to start voice recognition:', error);
      setState(prev => ({ ...prev, error: 'Failed to start voice recognition' }));
      return false;
    }

    return false;
  }, [state.microphoneSupported, requestMicrophonePermission, initializeSpeechRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      continuousListeningRef.current = false;
      recognitionRef.current.stop();
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  // Toggle wake word mode
  const toggleWakeWord = useCallback(async () => {
    const newState = !state.isWakeWordActive;
    setState(prev => ({ ...prev, isWakeWordActive: newState }));
    
    if (newState) {
      continuousListeningRef.current = true;
      await startListening();
      toast.info('Wake word detection active. Say "Hey TSAM" to give commands.');
    } else {
      continuousListeningRef.current = false;
      stopListening();
      toast.info('Wake word detection disabled.');
    }
  }, [state.isWakeWordActive, startListening, stopListening]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-start if configured
  useEffect(() => {
    if (config.autoListen && state.microphoneSupported && !state.isWakeWordActive) {
      toggleWakeWord();
    }
  }, [config.autoListen, state.microphoneSupported, state.isWakeWordActive, toggleWakeWord]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (wakeWordTimeoutRef.current) {
        clearTimeout(wakeWordTimeoutRef.current);
      }
      continuousListeningRef.current = false;
    };
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
