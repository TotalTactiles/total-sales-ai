import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Stop, RefreshCcw } from 'lucide-react';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';
import { toast } from 'sonner';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

interface RehearsalSession {
  id: string;
  startTime: Date;
  transcript: string;
  feedback: string[];
  score: number;
  taskId?: string;
}

const PitchRehearsal: React.FC = () => {
  const { executeWorkflow, isLoading } = useRelevanceAI();
  const [isRecording, setIsRecording] = useState(false);
  const [rehearsalData, setRehearsalData] = useState<RehearsalSession | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const handleStartRehearsal = async () => {
    setIsRecording(true);
    try {
      const result = await executeWorkflow('sales-agent-v1', {
        type: 'pitch_rehearsal_start',
        context: 'practice_session'
      });

      if (result.success) {
        const session: RehearsalSession = {
          id: crypto.randomUUID(),
          startTime: new Date(),
          transcript: '',
          feedback: [],
          score: 0,
          taskId: result.output.taskId || crypto.randomUUID()
        };
        setRehearsalData(session);
      }
    } catch (error) {
      console.error('Failed to start rehearsal:', error);
      setIsRecording(false);
    }
  };

  const handleStopRehearsal = async () => {
    setIsRecording(false);
    if (!rehearsalData) return;

    try {
      const result = await executeWorkflow('sales-agent-v1', {
        type: 'pitch_rehearsal_end',
        sessionId: rehearsalData.id,
        transcript: rehearsalData.transcript,
        context: 'practice_session'
      });

      if (result.success) {
        setFeedback(result.output.feedback || 'No feedback available.');
      }
    } catch (error) {
      console.error('Failed to stop rehearsal:', error);
      toast.error('Failed to process rehearsal data.');
    }
  };

  const handleResetRehearsal = () => {
    setIsRecording(false);
    setRehearsalData(null);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-around">
        {!isRecording ? (
          <Button
            onClick={handleStartRehearsal}
            disabled={isLoading}
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Rehearsal
          </Button>
        ) : (
          <Button
            onClick={handleStopRehearsal}
            variant="destructive"
            disabled={isLoading}
          >
            <Stop className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )}

        <Button
          onClick={handleResetRehearsal}
          variant="secondary"
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      
      {rehearsalData && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Rehearsal Session</h3>
            <p>
              <strong>Start Time:</strong> {rehearsalData.startTime.toLocaleTimeString()}
            </p>
            <p className="mt-2">
              <strong>Transcript:</strong> {rehearsalData.transcript || 'No transcript available.'}
            </p>
            {feedback && (
              <div className="mt-4">
                <h4 className="text-md font-semibold">Feedback:</h4>
                <p>{feedback}</p>
              </div>
            )}
            
            <div className="mt-4">
              <AgentFeedbackButton 
                taskId={rehearsalData.taskId!}
                variant="outline"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PitchRehearsal;
