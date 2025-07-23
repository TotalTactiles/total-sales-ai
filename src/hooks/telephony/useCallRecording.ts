
import { useState, useEffect } from 'react';
import { CallRecordingService, CallRecording } from '@/services/telephony/callRecordingService';
import { toast } from 'sonner';

export const useCallRecording = (sessionId?: string) => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<CallRecording | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (sessionId) {
      fetchRecordings();
    }
  }, [sessionId]);

  const fetchRecordings = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const data = await CallRecordingService.getSessionRecordings(sessionId);
      setRecordings(data);
    } catch (error) {
      toast.error('Failed to fetch recordings');
    } finally {
      setIsLoading(false);
    }
  };

  const transcribeRecording = async (recordingId: string) => {
    setIsTranscribing(true);
    try {
      const result = await CallRecordingService.transcribeRecording(recordingId);
      if (result.success) {
        toast.success('Recording transcribed successfully');
        fetchRecordings(); // Refresh to get updated transcription
      } else {
        toast.error('Failed to transcribe recording');
      }
    } catch (error) {
      toast.error('Error transcribing recording');
    } finally {
      setIsTranscribing(false);
    }
  };

  const analyzeRecording = async (recordingId: string) => {
    setIsAnalyzing(true);
    try {
      const result = await CallRecordingService.analyzeRecording(recordingId);
      if (result.success) {
        toast.success('Recording analyzed successfully');
        fetchRecordings(); // Refresh to get updated analysis
      } else {
        toast.error('Failed to analyze recording');
      }
    } catch (error) {
      toast.error('Error analyzing recording');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadRecording = async (recordingUrl: string, filename: string) => {
    try {
      const blob = await CallRecordingService.downloadRecording(recordingUrl);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Recording downloaded');
      }
    } catch (error) {
      toast.error('Failed to download recording');
    }
  };

  const playRecording = async (recordingUrl: string) => {
    try {
      const audio = new Audio(recordingUrl);
      audio.play();
      setCurrentRecording(recordings.find(r => r.recording_url === recordingUrl) || null);
    } catch (error) {
      toast.error('Failed to play recording');
    }
  };

  return {
    recordings,
    currentRecording,
    isLoading,
    isTranscribing,
    isAnalyzing,
    transcribeRecording,
    analyzeRecording,
    downloadRecording,
    playRecording,
    refetch: fetchRecordings
  };
};
