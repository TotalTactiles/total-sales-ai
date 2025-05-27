
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
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
      recognition.start();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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

      // Log interaction
      await logAIInteraction(transcript, aiResponse);

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

      const { data, error } = await supabase.functions.invoke('ai-voice', {
        body: {
          text,
          voiceId: 'pNInz6obpgDQGcFmaJgB', // Professional voice
          model: 'eleven_multilingual_v2'
        }
      });

      if (error) throw error;

      // Play audio response
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();

        audioRef.current.onended = () => {
          setState(prev => ({ ...prev, isSpeaking: false }));
          URL.revokeObjectURL(audioUrl);
        };
      }

    } catch (error) {
      console.error('Error generating voice response:', error);
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const logAIInteraction = async (query: string, response: string) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      await supabase.from('ai_interactions').insert({
        user_id: user.id,
        company_id: profile.company_id,
        workspace: options.context || 'general',
        query,
        response,
        interaction_type: 'voice',
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      console.error('Error logging AI interaction:', error);
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
