
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
  MicOff
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Mock AI suggestions based on call context
  useEffect(() => {
    if (currentLead && isCallActive) {
      const contextSuggestions = [
        `${currentLead.company} is in ${currentLead.source} industry - emphasize industry-specific ROI`,
        `Lead score ${currentLead.score}% suggests strong interest - be confident in closing`,
        `Priority ${currentLead.priority} lead - focus on urgency and timeline`,
        `Best talk track: Problem → Solution → ROI → Next Steps`
      ];
      setSuggestions(contextSuggestions);
    } else if (currentLead) {
      const preSuggestions = [
        `Call at ${new Date().toLocaleTimeString()} has 78% connect rate for this industry`,
        `Lead is ${currentLead.speedToLead || 60}min old - mention freshness of inquiry`,
        `${currentLead.conversionLikelihood}% conversion likelihood - tailor approach accordingly`,
        `Research shows ${currentLead.company} size responds well to efficiency messaging`
      ];
      setSuggestions(preSuggestions);
    }
  }, [currentLead, isCallActive]);

  const handleAIQuery = () => {
    if (!aiQuery.trim()) return;
    
    // Mock AI response
    const responses = [
      "Based on their company size, focus on time savings rather than cost savings.",
      "This industry typically has budget approval processes - ask about decision timeline.",
      "Their recent website activity suggests interest in integration capabilities.",
      "Similar companies in your CRM closed 34% faster with demo-first approach."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    onSuggestion(randomResponse);
    setAiQuery('');
    toast.success('AI suggestion generated');
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

  const aiInsights = currentLead ? [
    {
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      title: "Conversion Probability",
      value: `${currentLead.conversionLikelihood}%`,
      description: "Based on similar profiles"
    },
    {
      icon: <Clock className="h-4 w-4 text-orange-600" />,
      title: "Optimal Call Time",
      value: "Now",
      description: "78% connect rate for this hour"
    },
    {
      icon: <Target className="h-4 w-4 text-blue-600" />,
      title: "Focus Area",
      value: "ROI & Efficiency",
      description: "Most effective for this industry"
    }
  ] : [];

  return (
    <div className="space-y-4">
      {/* AI Status */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
        <Brain className="h-5 w-5 text-blue-600" />
        <div>
          <div className="font-medium text-blue-800">AI Assistant Active</div>
          <div className="text-xs text-blue-600">
            {isCallActive ? 'Listening & ready to assist' : 'Analyzing lead data'}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800">AI Insights</h3>
          {aiInsights.map((insight, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                {insight.icon}
                <span className="text-sm font-medium">{insight.title}</span>
              </div>
              <div className="font-semibold">{insight.value}</div>
              <div className="text-xs text-gray-600">{insight.description}</div>
            </div>
          ))}
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
                <p className="text-sm text-yellow-800">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Query Interface */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Ask AI Assistant</h3>
        <div className="space-y-2">
          <Textarea
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask AI about this lead, industry insights, or talk tracks..."
            className="min-h-[80px] text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAIQuery}
              disabled={!aiQuery.trim()}
              size="sm"
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-1" />
              Ask AI
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

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Quick AI Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSuggestion("Generate objection handling script")}
            className="justify-start text-xs"
          >
            <MessageSquare className="h-3 w-3 mr-2" />
            Objection Scripts
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSuggestion("Show industry benchmarks")}
            className="justify-start text-xs"
          >
            <TrendingUp className="h-3 w-3 mr-2" />
            Industry Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSuggestion("Suggest next best action")}
            className="justify-start text-xs"
          >
            <Target className="h-3 w-3 mr-2" />
            Next Best Action
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
