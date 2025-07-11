
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  enabled,
  onToggle,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      toast.success('Listening... Speak now!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Send to Supabase edge function for transcription
      const response = await fetch('/functions/v1/transcribe-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio: base64Audio }),
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const { text } = await response.json();
      
      if (text && text.trim()) {
        onTranscript(text.trim());
        toast.success('Voice message transcribed!');
      } else {
        toast.warning('No speech detected. Please try again.');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process voice input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = () => {
    if (enabled) {
      if (isListening) {
        stopRecording();
      } else {
        startRecording();
      }
    } else {
      onToggle(true);
    }
  };

  const handleDisable = () => {
    if (isListening) {
      stopRecording();
    }
    onToggle(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isListening ? "destructive" : enabled ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        disabled={isProcessing}
        className="h-8 px-2"
      >
        {isProcessing ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-3 w-3" />
        ) : (
          <Mic className="h-3 w-3" />
        )}
        <span className="ml-1 text-xs">
          {isProcessing ? 'Processing' : isListening ? 'Stop' : 'Voice'}
        </span>
      </Button>
      
      {enabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisable}
          className="h-8 px-2 text-xs"
        >
          Disable
        </Button>
      )}
      
      {isListening && (
        <Badge variant="outline" className="text-xs animate-pulse">
          Listening...
        </Badge>
      )}
      
      {isProcessing && (
        <Badge variant="secondary" className="text-xs">
          Processing...
        </Badge>
      )}
    </div>
  );
};

export default VoiceInput;
