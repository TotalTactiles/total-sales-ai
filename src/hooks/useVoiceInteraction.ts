
import { useState, useEffect, useCallback } from 'react';
import { voiceAssistantService } from '@/ai/functions/voiceAssistant';
import { isAIEnabled } from '@/ai/config/AIConfig';
import { logger } from '@/utils/logger';

interface UseVoiceInteractionOptions {
  context: string;
  workspaceData?: any;
  wakeWords?: string[];
}

interface UseVoiceInteractionReturn {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isWakeWordActive: boolean;
  isDetecting: boolean;
  transcript: string;
  response: string;
  error: string | null;
  permissionState: PermissionState | null;
  microphoneSupported: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleWakeWord: () => void;
  clearError: () => void;
  requestMicrophonePermission: () => Promise<void>;
}

export const useVoiceInteraction = (options: UseVoiceInteractionOptions): UseVoiceInteractionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
  const [microphoneSupported, setMicrophoneSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setMicrophoneSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      // Check if maxAlternatives property exists
      if ('maxAlternatives' in recognitionInstance) {
        recognitionInstance.maxAlternatives = 1;
      }

      setRecognition(recognitionInstance);
    }

    // Check microphone permission
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionState(result.state);
      
      result.addEventListener('change', () => {
        setPermissionState(result.state);
      });
    } catch (error) {
      logger.warn('Could not check microphone permission:', error);
    }
  }, []);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await checkMicrophonePermission();
    } catch (error) {
      setError('Microphone permission denied');
      logger.error('Microphone permission request failed:', error);
    }
  }, [checkMicrophonePermission]);

  const startListening = useCallback(async () => {
    if (!isAIEnabled('VOICE_ASSISTANT')) {
      setError('Voice assistant temporarily disabled');
      return;
    }

    if (!recognition || !microphoneSupported) {
      setError('Speech recognition not supported');
      return;
    }

    if (permissionState === 'denied') {
      setError('Microphone permission required');
      return;
    }

    try {
      setIsListening(true);
      setError(null);
      setTranscript('');
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          setTranscript(transcript);
          handleVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      logger.info('Voice recognition started');
      
    } catch (error) {
      setError('Failed to start listening');
      setIsListening(false);
      logger.error('Voice recognition start failed:', error);
    }
  }, [recognition, microphoneSupported, permissionState]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      logger.info('Voice recognition stopped');
    }
  }, [recognition, isListening]);

  const handleVoiceCommand = useCallback(async (transcript: string) => {
    if (!isAIEnabled('VOICE_ASSISTANT')) {
      setResponse('Voice assistant temporarily disabled');
      return;
    }

    setIsProcessing(true);
    
    try {
      const voiceResponse = await voiceAssistantService.processVoiceCommand(
        {
          transcript,
          confidence: 0.9,
          intent: 'general_query',
          parameters: {}
        },
        {
          workspace: options.context,
          userId: 'current-user',
          companyId: 'current-company'
        }
      );
      
      setResponse(voiceResponse.text);
      
      // Handle any actions
      if (voiceResponse.action) {
        logger.info('Voice command action:', voiceResponse.action);
      }
      
    } catch (error) {
      setError('Failed to process voice command');
      logger.error('Voice command processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [options.context]);

  const toggleWakeWord = useCallback(() => {
    setIsWakeWordActive(!isWakeWordActive);
    logger.info('Wake word detection toggled:', !isWakeWordActive);
  }, [isWakeWordActive]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    isProcessing,
    isSpeaking,
    isWakeWordActive,
    isDetecting,
    transcript,
    response,
    error,
    permissionState,
    microphoneSupported,
    startListening,
    stopListening,
    toggleWakeWord,
    clearError,
    requestMicrophonePermission
  };
};
