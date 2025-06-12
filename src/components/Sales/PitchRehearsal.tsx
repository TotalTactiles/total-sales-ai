
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  Brain,
  MessageSquare
} from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

interface PitchRehearsalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: any;
}

const PitchRehearsal: React.FC<PitchRehearsalProps> = ({
  isOpen,
  onClose,
  leadData
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPitch, setCurrentPitch] = useState('');
  const [objections, setObjections] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  
  const { executeTask, isLoading } = useAgentIntegration('pitch_rehearsal');

  const startRehearsal = async () => {
    if (!currentPitch.trim()) return;

    try {
      setIsActive(true);
      const result = await executeTask('generate_objections', 'salesAgent_v1', {
        pitch: currentPitch,
        leadProfile: leadData,
        scenario: 'rehearsal'
      });

      if (result.objections) {
        setObjections(result.objections);
        setCurrentTaskId(result.taskId || '');
      }
    } catch (error) {
      setIsActive(false);
    }
  };

  const handleObjection = async (objection: string) => {
    try {
      const result = await executeTask('handle_objection', 'salesAgent_v1', {
        objection,
        pitch: currentPitch,
        leadProfile: leadData,
        context: 'rehearsal'
      });

      setResponses(prev => [...prev, {
        objection,
        response: result.response,
        confidence: result.confidence,
        taskId: result.taskId
      }]);
    } catch (error) {
      // Error handled in hook
    }
  };

  const resetRehearsal = () => {
    setIsActive(false);
    setObjections([]);
    setResponses([]);
    setCurrentPitch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Pitch Rehearsal
            <Badge variant="outline">Practice Mode</Badge>
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Pitch Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Your Pitch:</label>
            <Textarea
              value={currentPitch}
              onChange={(e) => setCurrentPitch(e.target.value)}
              placeholder="Enter your sales pitch here. The AI will generate realistic objections for you to practice handling..."
              className="min-h-[100px]"
              disabled={isActive}
            />
            
            <div className="flex gap-2">
              {!isActive ? (
                <Button
                  onClick={startRehearsal}
                  disabled={!currentPitch.trim() || isLoading}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Rehearsal
                </Button>
              ) : (
                <Button
                  onClick={() => setIsActive(false)}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Stop
                </Button>
              )}
              
              <Button
                onClick={resetRehearsal}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Generated Objections */}
          {objections.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Practice Objections:</h3>
              <div className="grid gap-3">
                {objections.map((objection, index) => (
                  <Card key={index} className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-600">
                              Buyer Objection #{index + 1}
                            </span>
                          </div>
                          <p className="text-gray-800">{objection.text || objection}</p>
                          {objection.difficulty && (
                            <Badge variant="outline" className="mt-2">
                              {objection.difficulty} difficulty
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => handleObjection(objection.text || objection)}
                          size="sm"
                          disabled={isLoading}
                          className="ml-4"
                        >
                          Get Response
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* AI Responses */}
          {responses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI-Generated Responses:</h3>
              <div className="space-y-4">
                {responses.map((item, index) => (
                  <Card key={index} className="border-green-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 font-medium">
                          Objection: "{item.objection}"
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              Suggested Response
                            </span>
                            {item.confidence && (
                              <Badge variant="outline">
                                {Math.round(item.confidence * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-800">{item.response}</p>
                        </div>
                        
                        {item.taskId && (
                          <AgentFeedbackButton 
                            taskId={item.taskId} 
                            initialResponse={item.response}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {!isActive && objections.length === 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Mic className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">How Pitch Rehearsal Works:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Enter your sales pitch above</li>
                      <li>• AI will generate realistic buyer objections</li>
                      <li>• Practice your responses with AI-suggested improvements</li>
                      <li>• Get instant feedback and alternative approaches</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PitchRehearsal;
