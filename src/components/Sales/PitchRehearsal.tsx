
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Play, Pause, RotateCcw } from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

const PitchRehearsal: React.FC = () => {
  const { executeSalesAgent, isExecuting } = useAgentIntegration();
  const [pitchText, setPitchText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [userResponse, setUserResponse] = useState('');

  const handleAnalyzePitch = async () => {
    const result = await executeSalesAgent('pitch_analysis', {
      pitchText,
      scenario: 'cold_call'
    });

    if (result?.output_payload) {
      setFeedback(result.output_payload);
    }
  };

  const handleObjectionResponse = async () => {
    const result = await executeSalesAgent('objection_handling', {
      userResponse,
      workspace: 'pitch_rehearsal'
    });

    if (result?.output_payload) {
      setFeedback(result.output_payload);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-blue-600" />
          AI Pitch Rehearsal
          <Badge variant="outline">salesAgent_v1</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Your Sales Pitch</label>
          <Textarea
            placeholder="Practice your pitch here..."
            value={pitchText}
            onChange={(e) => setPitchText(e.target.value)}
            className="min-h-24"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAnalyzePitch}
            disabled={!pitchText.trim() || isExecuting}
            className="flex-1"
          >
            {isExecuting ? 'Analyzing...' : 'Get AI Feedback'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsRecording(!isRecording)}
            className={isRecording ? 'bg-red-50 text-red-600' : ''}
          >
            {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        {feedback && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-blue-900">AI Feedback</div>
              <AgentFeedbackButton taskId={feedback.taskId} />
            </div>
            
            {feedback.strengths && (
              <div>
                <div className="text-sm font-medium text-green-700 mb-1">Strengths:</div>
                <ul className="text-sm text-green-600 space-y-1">
                  {feedback.strengths.map((strength: string, i: number) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements && (
              <div>
                <div className="text-sm font-medium text-orange-700 mb-1">Areas for Improvement:</div>
                <ul className="text-sm text-orange-600 space-y-1">
                  {feedback.improvements.map((improvement: string, i: number) => (
                    <li key={i}>• {improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.suggestedResponse && (
              <div>
                <div className="text-sm font-medium text-blue-700 mb-1">AI Suggested Response:</div>
                <div className="text-sm text-blue-600 italic">"{feedback.suggestedResponse}"</div>
              </div>
            )}
          </div>
        )}

        <div className="border-t pt-4">
          <label className="text-sm font-medium mb-2 block">Practice Objection Handling</label>
          <Textarea
            placeholder="Customer says: 'This is too expensive...'"
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            className="min-h-16"
          />
          <Button
            onClick={handleObjectionResponse}
            disabled={!userResponse.trim() || isExecuting}
            size="sm"
            className="mt-2"
          >
            Get AI Response
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchRehearsal;
