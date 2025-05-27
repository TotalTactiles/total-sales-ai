import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceInteractionState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isWakeWordActive: boolean;
  transcript: string;
  response: string;
  error: string | null;
  permissionState: 'granted' | 'denied' | 'prompt' | 'unknown';
  microphoneSupported: boolean;
}

interface VoiceInteractionOptions {
  wakeWord?: string;
  context?: string;
  workspaceData?: any;
}

export const useVoiceInteraction = (options: VoiceInteractionOptions = {}) => {
  const { user, profile } = useAuth();
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const wakeWord = options.wakeWord || 'Hey Jarvis';

  // Check microphone and speech recognition support
  useEffect(() => {
    const checkSupport = async () => {
      // Check speech recognition support
      const speechSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
      
      // Check microphone support
      const micSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      
      setState(prev => ({ 
        ...prev, 
        microphoneSupported: !!(speechSupported && micSupported),
        error: !speechSupported ? 'Speech recognition not supported in this browser' : 
               !micSupported ? 'Microphone access not supported' : null
      }));

      if (speechSupported && micSupported) {
        await checkMicrophonePermission();
      }
    };

    checkSupport();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      // Check current permission state
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setState(prev => ({ ...prev, permissionState: permission.state }));
        
        // Listen for permission changes
        permission.onchange = () => {
          setState(prev => ({ ...prev, permissionState: permission.state }));
        };
      }
    } catch (error) {
      console.warn('Could not check microphone permission:', error);
      setState(prev => ({ ...prev, permissionState: 'unknown' }));
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Store stream reference
      streamRef.current = stream;
      
      setState(prev => ({ ...prev, permissionState: 'granted' }));
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      toast.success('Microphone access granted! Voice features are now available.');
      return true;
      
    } catch (error: any) {
      console.error('Microphone permission denied:', error);
      
      let errorMessage = 'Microphone access denied. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone access in your browser settings and reload the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Microphone is being used by another application.';
      } else {
        errorMessage += 'Please check your microphone settings.';
      }
      
      setState(prev => ({ 
        ...prev, 
        permissionState: 'denied',
        error: errorMessage,
        isWakeWordActive: false
      }));
      
      toast.error(errorMessage);
      return false;
    }
  };

  // Initialize speech recognition only after permission is granted
  useEffect(() => {
    if (!state.microphoneSupported || state.permissionState !== 'granted') {
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .toLowerCase();

      if (transcript.includes(wakeWord.toLowerCase()) && state.isWakeWordActive) {
        handleWakeWordDetected();
      } else if (state.isListening) {
        setState(prev => ({ ...prev, transcript }));
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Speech recognition error: ';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
          setState(prev => ({ ...prev, permissionState: 'denied' }));
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
      
      setState(prev => ({ ...prev, error: errorMessage }));
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      // Restart recognition if wake word is still active and permission is granted
      if (state.isWakeWordActive && state.permissionState === 'granted') {
        try {
          recognition.start();
        } catch (error) {
          console.warn('Could not restart speech recognition:', error);
        }
      }
    };

    recognitionRef.current = recognition;

    if (state.isWakeWordActive) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setState(prev => ({ ...prev, error: 'Failed to start voice recognition' }));
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, [wakeWord, state.isWakeWordActive, state.isListening, state.microphoneSupported, state.permissionState]);

  const handleWakeWordDetected = useCallback(() => {
    setState(prev => ({ ...prev, isListening: true, transcript: '', error: null }));
    toast.info('Listening... Say your command');

    // Auto-stop listening after 10 seconds
    timeoutRef.current = setTimeout(() => {
      stopListening();
    }, 10000);
  }, []);

  const startListening = useCallback(async () => {
    // Check permissions first
    if (state.permissionState !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioCommand(audioBlob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      setState(prev => ({ ...prev, isListening: true, error: null }));
      mediaRecorder.start();

      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);

    } catch (error: any) {
      console.error('Error starting voice recording:', error);
      
      if (error.name === 'NotAllowedError') {
        await requestMicrophonePermission();
      } else {
        setState(prev => ({ ...prev, error: 'Failed to access microphone. Please check your settings.' }));
      }
    }
  }, [state.permissionState]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const processAudioCommand = async (audioBlob: Blob) => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Convert audio to base64 for API
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Transcribe audio using Whisper API
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptionError) throw transcriptionError;

      const transcript = transcriptionData.text;
      setState(prev => ({ ...prev, transcript }));

      // Process command with AI
      const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-brain-query', {
        body: {
          query: transcript,
          context: {
            workspace: options.context || 'general',
            userId: user.id,
            userRole: profile?.role,
            workspaceData: options.workspaceData
          }
        }
      });

      if (aiError) throw aiError;

      const aiResponse = aiData.response;
      setState(prev => ({ ...prev, response: aiResponse }));

      // Generate voice response
      await generateVoiceResponse(aiResponse);

      // Log interaction
      console.log('AI Interaction:', { transcript, response: aiResponse });

    } catch (error) {
      console.error('Error processing voice command:', error);
      setState(prev => ({ ...prev, error: 'Failed to process voice command' }));
      toast.error('Failed to process voice command');
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const generateVoiceResponse = async (text: string) => {
    try {
      setState(prev => ({ ...prev, isSpeaking: true }));

      // Use browser's speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setState(prev => ({ ...prev, isSpeaking: false }));
        };
        utterance.onerror = () => {
          setState(prev => ({ ...prev, isSpeaking: false }));
        };
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback: just show text response
        setState(prev => ({ ...prev, isSpeaking: false }));
      }

    } catch (error) {
      console.error('Error generating voice response:', error);
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const toggleWakeWord = useCallback(async () => {
    if (!state.isWakeWordActive) {
      // Enable wake word - check permissions first
      if (state.permissionState !== 'granted') {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      }
      setState(prev => ({ ...prev, isWakeWordActive: true, error: null }));
    } else {
      // Disable wake word
      setState(prev => ({ ...prev, isWakeWordActive: false }));
    }
  }, [state.permissionState, state.isWakeWordActive]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Clean up any active streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    toggleWakeWord,
    clearError,
    requestMicrophonePermission,
    wakeWord
  };
};
