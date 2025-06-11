
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Brain,
  MessageSquare,
  Target
} from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

const PitchRehearsal: React.FC = () => {
  const { executeAgentTask, isExecuting } = useAgentIntegration();
  const [scenario, setScenario] = useState('cold_call');
  const [pitchText, setPitchText] = useState('');
  const [rehearsalResults, setRehearsalResults] = useState<any>(null);
  const [currentObjection, setCurrentObjection] = useState<any>(null);
  const [userResponse, setUserResponse] = useState('');

  const scenarios = [
    { id: 'cold_call', label: 'Cold Call Opening', difficulty: 'medium' },
    { id: 'price_objection', label: 'Price Objection', difficulty: 'hard' },
    { id: 'competitor_comparison', label: 'Competitor Comparison', difficulty: 'hard' },
    { id: 'demo_request', label: 'Demo Request', difficulty: 'easy' },
    { id: 'decision_maker', label: 'Finding Decision Maker', difficulty: 'medium' }
  ];

  const startRehearsal = async () => {
    const result = await executeAgentTask(
      'salesAgent_v1',
      'pitch_rehearsal',
      {
        scenario,
        pitchText,
        workspace: 'sales_training'
      }
    );

    if (result?.output_payload) {
      setRehearsalResults(result.output_payload);
      if (result.output_payload.firstObjection) {
        setCurrentObjection(result.output_payload.firstObjection);
      }
    }
  };

  const handleObjection = async () => {
    const result = await executeAgentTask(
      'salesAgent_v1',
      'objection_response_analysis',
      {
        objection: currentObjection.text,
        userResponse,
        scenario,
        workspace: 'sales_training'
      }
    );

    if (result?.output_payload?.nextObjection) {
      setCurrentObjection(result.output_payload.nextObjection);
      setUserResponse('');
    } else {
      // Rehearsal complete
      setCurrentObjection(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Rehearse Your Pitch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scenario Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Scenario:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {scenarios.map((s) => (
              <Button
                key={s.id}
                variant={scenario === s.id ? "default" : "outline"}
                className="justify-between"
                onClick={() => setScenario(s.id)}
              >
                <span>{s.label}</span>
                <Badge className={getDifficultyColor(s.difficulty)}>
                  {s.difficulty}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Pitch Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Pitch:</label>
          <Textarea
            value={pitchText}
            onChange={(e) => setPitchText(e.target.value)}
            placeholder="Enter your opening pitch or talking points..."
            rows={4}
          />
        </div>

        {/* Start Rehearsal */}
        <Button 
          onClick={startRehearsal} 
          disabled={!pitchText.trim() || isExecuting}
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          {isExecuting ? 'Starting Rehearsal...' : 'Start AI Rehearsal'}
        </Button>

        {/* Active Objection */}
        {currentObjection && (
          <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-800">Buyer Objection:</span>
            </div>
            <div className="text-orange-700 mb-3 italic">
              "{currentObjection.text}"
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Response:</label>
              <Textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="How would you handle this objection?"
                rows={3}
              />
              <Button 
                onClick={handleObjection}
                disabled={!userResponse.trim() || isExecuting}
                size="sm"
              >
                Submit Response
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {rehearsalResults && !currentObjection && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Rehearsal Complete!</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Overall Score:</div>
                  <Badge className="bg-green-600 text-white">
                    {rehearsalResults.overallScore}/100
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Key Strengths:</div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {rehearsalResults.strengths?.map((strength: string, i: number) => (
                      <li key={i}>• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Areas for Improvement:</div>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {rehearsalResults.improvements?.map((improvement: string, i: number) => (
                      <li key={i}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <AgentFeedbackButton taskId={rehearsalResults.taskId} />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setRehearsalResults(null);
                    setCurrentObjection(null);
                    setUserResponse('');
                  }}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PitchRehearsal;
