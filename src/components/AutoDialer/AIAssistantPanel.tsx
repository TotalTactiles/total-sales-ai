
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  TrendingUp,
  Clock,
  Target,
  Send,
  Mic,
  MicOff,
  Phone,
  Zap
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useRetellAI } from '@/hooks/useRetellAI';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

interface AIAssistantPanelProps {
  currentLead?: Lead | null;
  isCallActive: boolean;
  onSuggestion: (suggestion: string) => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  currentLead,
  isCallActive,
  onSuggestion
}) => {
  const [aiQuery, setAiQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { makeConversationalCall, isLoading: isCallingAI } = useRetellAI();
  const { executeAgentTask, isExecuting } = useAgentIntegration();

  // Generate AI suggestions based on call context
  useEffect(() => {
    if (currentLead) {
      generateContextualSuggestions();
    }
  }, [currentLead, isCallActive, generateContextualSuggestions]);

  const generateContextualSuggestions = async () => {
    const result = await executeAgentTask(
      'salesAgent_v1',
      'contextual_suggestions',
      {
        currentLead,
        isCallActive,
        workspace: 'auto_dialer'
      }
    );

    if (result?.output_payload?.suggestions) {
      setSuggestions(result.output_payload.suggestions);
    }
  };

  const handleAICall = async () => {
    if (!currentLead) {
      toast.error('No lead selected');
      return;
    }

    const result = await makeConversationalCall(currentLead);
    
    if (result.success) {
      onSuggestion(`AI Assistant is now calling ${currentLead.name}. Call ID: ${result.callId}`);
    }
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    const result = await executeAgentTask(
      'salesAgent_v1',
      'query_response',
      {
        query: aiQuery,
        currentLead,
        isCallActive,
        workspace: 'auto_dialer'
      }
    );

    if (result?.output_payload?.response) {
      onSuggestion(result.output_payload.response);
      setAiQuery('');
      toast.success('AI suggestion generated');
    }
  };

  const handleQuickAction = async (actionType: string) => {
    const result = await executeAgentTask(
      'salesAgent_v1',
      actionType,
      {
        currentLead,
        isCallActive,
        workspace: 'auto_dialer'
      }
    );

    if (result?.output_payload?.response) {
      onSuggestion(result.output_payload.response);
    }
  };

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice listening
      setTimeout(() => {
        setAiQuery("What's the best approach for this lead?");
        setIsListening(false);
        toast.success('Voice command captured');
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Status */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
        <Brain className="h-5 w-5 text-blue-600" />
        <div>
          <div className="font-medium text-blue-800">Sales AI Agent Active</div>
          <div className="text-xs text-blue-600">
            {isCallActive ? 'Real-time call assistance enabled' : 'Ready for conversational calls'}
          </div>
        </div>
        <Badge variant="outline" className="ml-auto">
          salesAgent_v1
        </Badge>
      </div>

      {/* AI Call Button */}
      {currentLead && !isCallActive && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-purple-800">AI Conversation Call</div>
              <div className="text-sm text-purple-600">Let AI have a full conversation with {currentLead.name}</div>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
          <Button
            onClick={handleAICall}
            disabled={isCallingAI}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isCallingAI ? (
              <>
                <Mic className="h-4 w-4 mr-2 animate-pulse" />
                Initiating AI Call...
              </>
            ) : (
              <>
                <Phone className="h-4 w-4 mr-2" />
                Start AI Conversation
              </>
            )}
          </Button>
          <div className="text-xs text-purple-600 mt-2">
            ✨ AI will handle the entire conversation, qualify the lead, and provide analysis
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800">AI Suggestions</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800">{suggestion.text}</p>
                  {suggestion.confidence && (
                    <div className="text-xs text-yellow-600 mt-1">
                      Confidence: {suggestion.confidence}%
                    </div>
                  )}
                </div>
                {suggestion.taskId && (
                  <AgentFeedbackButton taskId={suggestion.taskId} size="sm" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Query Interface */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Ask Sales AI Assistant</h3>
        <div className="space-y-2">
          <Textarea
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask about this lead, industry insights, objection handling, or talk tracks..."
            className="min-h-[80px] text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAIQuery}
              disabled={!aiQuery.trim() || isExecuting}
              size="sm"
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-1" />
              {isExecuting ? 'Processing...' : 'Ask AI'}
            </Button>
            <Button
              onClick={handleVoiceCommand}
              variant={isListening ? "destructive" : "outline"}
              size="sm"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          {isListening && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Listening for voice command...
            </div>
          )}
        </div>
      </div>

      {/* Quick AI Actions */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Quick AI Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('objection_handling')}
            disabled={isExecuting}
            className="justify-start text-xs"
          >
            <MessageSquare className="h-3 w-3 mr-2" />
            Generate Objection Scripts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('industry_insights')}
            disabled={isExecuting}
            className="justify-start text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-2" />
            Industry Insights
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('next_best_action')}
            disabled={isExecuting}
            className="justify-start text-xs"
          >
            <Target className="h-3 w-3 mr-2" />
            Next Best Action
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('call_summary')}
            disabled={isExecuting}
            className="justify-start text-xs"
          >
            <Clock className="h-3 w-3 mr-2" />
            Generate Call Summary
          </Button>
        </div>
      </div>

      {/* Real-time Call Assistance */}
      {isCallActive && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">Live Call Analysis Active</span>
          </div>
          <div className="text-xs text-green-700">
            AI is listening and will provide real-time suggestions based on conversation flow
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2 border-green-300 text-green-800"
            onClick={() => handleQuickAction('real_time_coaching')}
            disabled={isExecuting}
          >
            <Brain className="h-3 w-3 mr-1" />
            Get Real-Time Coaching
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPanel;
