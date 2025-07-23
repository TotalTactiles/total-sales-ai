
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  Download, 
  FileText, 
  Brain, 
  Volume2, 
  Eye,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useCallRecording } from '@/hooks/telephony/useCallRecording';
import { useCallSupervision } from '@/hooks/telephony/useCallSupervision';
import { CallSession } from '@/services/telephony/callSessionService';

interface CallRecordingPanelProps {
  callSession: CallSession;
}

const CallRecordingPanel: React.FC<CallRecordingPanelProps> = ({ callSession }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [supervisionNotes, setSupervisionNotes] = useState('');

  const {
    recordings,
    isLoading: recordingsLoading,
    isTranscribing,
    isAnalyzing,
    transcribeRecording,
    analyzeRecording,
    downloadRecording,
    playRecording
  } = useCallRecording(callSession.id);

  const {
    supervisions,
    activeSupervision,
    isLoading: supervisionLoading,
    canSupervise,
    startSupervision,
    endSupervision,
    updateNotes
  } = useCallSupervision(callSession.id);

  const handlePlay = async (recordingUrl: string) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }

    if (!isPlaying) {
      try {
        const audio = new Audio(recordingUrl);
        audio.play();
        setCurrentAudio(audio);
        setIsPlaying(true);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
        };
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const handlePause = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Call Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Call Session Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={getStatusColor(callSession.status)}>
                {callSession.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">{formatDuration(callSession.duration)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-medium">{callSession.from_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-medium">{callSession.to_number}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Recordings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Call Recordings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recordingsLoading ? (
            <div className="text-center py-4">Loading recordings...</div>
          ) : recordings.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No recordings available
            </div>
          ) : (
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div key={recording.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(recording.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlay(recording.recording_url)}
                        disabled={isPlaying}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadRecording(recording.recording_url, `recording-${recording.id}.wav`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{formatDuration(recording.duration || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">File Size</p>
                      <p className="font-medium">
                        {recording.file_size ? `${(recording.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => transcribeRecording(recording.id)}
                      disabled={isTranscribing || !!recording.transcription}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {recording.transcription ? 'Transcribed' : 'Transcribe'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => analyzeRecording(recording.id)}
                      disabled={isAnalyzing || !recording.transcription}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      {recording.sentiment_analysis ? 'Analyzed' : 'Analyze'}
                    </Button>
                  </div>

                  {recording.transcription && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium mb-1">Transcription</p>
                      <p className="text-sm text-gray-700">{recording.transcription}</p>
                    </div>
                  )}

                  {recording.sentiment_analysis && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Analysis</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Sentiment</p>
                          <Badge className={
                            recording.sentiment_analysis.overall === 'positive' ? 'bg-green-100 text-green-800' :
                            recording.sentiment_analysis.overall === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {recording.sentiment_analysis.overall}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Score</p>
                          <p className="text-sm font-medium">{recording.sentiment_analysis.score}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call Supervision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Call Supervision
          </CardTitle>
        </CardHeader>
        <CardContent>
          {canSupervise ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Start supervising this call to listen in, whisper coaching, or join the conversation.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => startSupervision('listen')}
                  disabled={supervisionLoading}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Listen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => startSupervision('whisper')}
                  disabled={supervisionLoading}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Whisper
                </Button>
                <Button
                  variant="outline"
                  onClick={() => startSupervision('barge')}
                  disabled={supervisionLoading}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Barge In
                </Button>
              </div>
            </div>
          ) : activeSupervision ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Active Supervision</p>
                  <p className="text-sm text-gray-600">
                    Mode: {activeSupervision.supervision_type}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={endSupervision}
                  disabled={supervisionLoading}
                >
                  End Supervision
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium">Supervision Notes</label>
                <Textarea
                  value={supervisionNotes}
                  onChange={(e) => setSupervisionNotes(e.target.value)}
                  placeholder="Add notes about the call..."
                  className="mt-1"
                />
                <Button
                  size="sm"
                  onClick={() => updateNotes(supervisionNotes)}
                  className="mt-2"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No active supervision. Call must be in progress to start supervision.
            </p>
          )}

          {supervisions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Supervision History</p>
              <div className="space-y-2">
                {supervisions.map((supervision) => (
                  <div key={supervision.id} className="text-sm border rounded p-2">
                    <div className="flex justify-between">
                      <span>{supervision.supervision_type}</span>
                      <span className="text-gray-500">
                        {new Date(supervision.started_at).toLocaleString()}
                      </span>
                    </div>
                    {supervision.notes && (
                      <p className="text-gray-700 mt-1">{supervision.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CallRecordingPanel;
