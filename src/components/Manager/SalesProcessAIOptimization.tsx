
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Users,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface OptimizationSuggestion {
  id: string;
  title: string;
  type: 'bottleneck' | 'opportunity' | 'training' | 'process';
  impact: 'high' | 'medium' | 'low';
  description: string;
  reasoning: string;
  dataInsights: string[];
  expectedOutcome: string;
  accepted?: boolean;
}

const SalesProcessAIOptimization: React.FC = () => {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: '1',
      title: 'Qualification Stage Bottleneck Resolution',
      type: 'bottleneck',
      impact: 'high',
      description: 'Implement automated qualification scoring to reduce time spent in qualification stage by 40%',
      reasoning: 'Analysis shows qualification stage takes 4.7 days average vs industry standard of 2.1 days. Manual processes are causing delays.',
      dataInsights: [
        'Qualification stage has 23% lower conversion than optimal',
        'Top performers complete qualification 60% faster',
        '67% of delayed deals get stuck in qualification'
      ],
      expectedOutcome: 'Reduce qualification time to 2.8 days, increase conversion by 15%'
    },
    {
      id: '2',
      title: 'Cross-Training Opportunity',
      type: 'training',
      impact: 'medium',
      description: 'Share Sarah Johnson\'s lead generation techniques across the team',
      reasoning: 'Sarah\'s lead generation conversion rate is 34% higher than team average. Her methods are transferable.',
      dataInsights: [
        'Sarah converts 94% of qualified leads vs team average of 72%',
        'Her follow-up cadence shows 2.3x response rate',
        'Uses personalized video messages in 89% of outreach'
      ],
      expectedOutcome: 'Team-wide lead generation improvement of 20-25%'
    },
    {
      id: '3',
      title: 'Proposal Template Standardization',
      type: 'process',
      impact: 'medium',
      description: 'Create dynamic proposal templates based on successful patterns',
      reasoning: 'Top-performing proposals share common elements and structure that can be systematized.',
      dataInsights: [
        'Proposals with executive summary have 45% higher acceptance',
        'ROI calculations increase close rate by 32%',
        'Customized case studies improve conversion by 28%'
      ],
      expectedOutcome: 'Increase proposal acceptance rate from 68% to 85%'
    }
  ]);

  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSuggestionClick = (suggestion: OptimizationSuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowDetails(true);
  };

  const handleAcceptSuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.map(s => 
      s.id === suggestionId ? { ...s, accepted: true } : s
    ));
    setShowDetails(false);
    toast.success('Optimization accepted. AI will monitor implementation progress.');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bottleneck': return <AlertCircle className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      case 'process': return <Target className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const activeSuggestions = suggestions.filter(s => !s.accepted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Optimization Suggestions
          </h3>
          <p className="text-sm text-gray-600">Weekly AI analysis and process improvements</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last updated: 2 hours ago
        </Badge>
      </div>

      {/* Optimization Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">2 optimizations implemented this week</p>
              <p className="text-sm text-green-700">AI is monitoring progress and will suggest new improvements weekly</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Suggestions */}
      {activeSuggestions.length > 0 ? (
        <div className="grid gap-4">
          {activeSuggestions.map((suggestion) => (
            <Card 
              key={suggestion.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(suggestion.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    </div>
                  </div>
                  <Badge className={getImpactColor(suggestion.impact)}>
                    {suggestion.impact.toUpperCase()} IMPACT
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {suggestion.dataInsights.length} data insights
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Expected: {suggestion.expectedOutcome.split(',')[0]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">All Current Processes Optimized</h4>
            <p className="text-gray-600">AI will continue monitoring and provide new suggestions next week</p>
          </CardContent>
        </Card>
      )}

      {/* Suggestion Details Modal */}
      {showDetails && selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{selectedSuggestion.title}</h2>
                <Button variant="ghost" onClick={() => setShowDetails(false)}>
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* AI Explanation */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  AI Reasoning
                </h3>
                <p className="text-gray-700">{selectedSuggestion.reasoning}</p>
              </div>

              {/* Data Insights */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  Supporting Data
                </h3>
                <ul className="space-y-2">
                  {selectedSuggestion.dataInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Outcome */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Expected Outcome
                </h3>
                <p className="text-gray-700">{selectedSuggestion.expectedOutcome}</p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAcceptSuggestion(selectedSuggestion.id)}>
                OK - Accept Optimization
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesProcessAIOptimization;
