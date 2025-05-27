
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
    isWakeWordActive: true,
    transcript: '',
    response: '',
    error: null
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const wakeWord = options.wakeWord || 'Hey Jarvis';

  // Initialize wake word detection
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
      setState(prev => ({ ...prev, error: `Recognition error: ${event.error}` }));
    };

    recognitionRef.current = recognition;

    if (state.isWakeWordActive) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
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
  }, [wakeWord, state.isWakeWordActive, state.isListening]);

  const handleWakeWordDetected = useCallback(() => {
    setState(prev => ({ ...prev, isListening: true, transcript: '', error: null }));
    toast.info('Listening... Say your command');

    // Auto-stop listening after 10 seconds
    timeoutRef.current = setTimeout(() => {
      stopListening();
    }, 10000);
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioCommand(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setState(prev => ({ ...prev, isListening: true, error: null }));
      mediaRecorder.start();

      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);

    } catch (error) {
      console.error('Error starting voice recording:', error);
      setState(prev => ({ ...prev, error: 'Failed to access microphone' }));
    }
  }, []);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
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

      // Log interaction (simplified - no database call since table doesn't exist)
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

      // For now, use browser's speech synthesis as fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
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

  const toggleWakeWord = useCallback(() => {
    setState(prev => ({ ...prev, isWakeWordActive: !prev.isWakeWordActive }));
  }, []);

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
    };
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    toggleWakeWord,
    clearError,
    wakeWord
  };
};
