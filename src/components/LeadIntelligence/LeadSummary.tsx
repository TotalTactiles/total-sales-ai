
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare,
  Target,
  Lightbulb,
  Volume2
} from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import UsageTracker from '@/components/AIBrain/UsageTracker';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
  lastContact: string;
  score: number;
  conversionLikelihood: number;
}

interface LeadSummaryProps {
  lead: Lead;
  rationaleMode: boolean;
  aiDelegationMode: boolean;
  isSensitive: boolean;
}

const LeadSummary: React.FC<LeadSummaryProps> = ({
  lead,
  rationaleMode,
  aiDelegationMode,
  isSensitive
}) => {
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const { trackEvent } = useUsageTracking();
  const { logGhostIntent } = useAIBrainInsights();

  useEffect(() => {
    generateAISummary();
  }, [lead]);

  const generateAISummary = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI summary generation
      setTimeout(() => {
        const summary = `${lead.name} from ${lead.company} was last contacted ${lead.lastContact}. They showed strong interest in our pricing but haven't responded to the last two follow-ups. Their engagement score is ${lead.score}% with a ${lead.conversionLikelihood}% conversion likelihood. Recommend: Send value-focused follow-up highlighting ROI calculator.`;
        setAiSummary(summary);
        setIsGenerating(false);
        
        trackEvent({
          feature: 'ai_summary_generation',
          action: 'complete',
          context: 'lead_summary',
          metadata: { leadId: lead.id, summaryLength: summary.length }
        });
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating AI summary:', error);
    }
  };

  const handleVoiceSummary = () => {
    setVoiceActive(true);
    trackEvent({
      feature: 'voice_summary',
      action: 'trigger',
      context: 'lead_summary'
    });
    
    // Simulate voice synthesis
    setTimeout(() => {
      setVoiceActive(false);
    }, 5000);
  };

  const aiInsights = [
    {
      type: 'opportunity',
      icon: Target,
      title: 'High Intent Signal',
      description: 'Downloaded pricing guide 3x in past week',
      confidence: 89,
      reasoning: 'Multiple price page visits indicate buying intent'
    },
    {
      type: 'timing',
      icon: Clock,
      title: 'Optimal Contact Window',
      description: 'Best response rate: 2-4 PM EST',
      confidence: 76,
      reasoning: 'Based on previous engagement patterns'
    },
    {
      type: 'strategy',
      icon: Lightbulb,
      title: 'Recommended Approach',
      description: 'Focus on ROI and quick implementation',
      confidence: 82,
      reasoning: 'Similar companies in construction prioritize fast deployment'
    }
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* AI Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Lead Summary
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceSummary}
              disabled={voiceActive}
              className="ml-auto"
            >
              <Volume2 className={`h-4 w-4 ${voiceActive ? 'animate-pulse text-blue-600' : ''}`} />
              {voiceActive ? 'Speaking...' : 'Listen'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
              <span className="text-slate-600">Generating AI summary...</span>
            </div>
          ) : (
            <p className="text-slate-700 leading-relaxed">{aiSummary}</p>
          )}
          
          {aiDelegationMode && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Brain className="h-4 w-4" />
                <span className="font-medium">AI is actively managing this lead</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Next action scheduled: Follow-up email in 2 hours
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight, index) => (
            <UsageTracker 
              key={index}
              feature="ai_insight"
              context={`lead_summary_${insight.type}`}
            >
              <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <div className="p-2 rounded-full bg-slate-100">
                  <insight.icon className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confident
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                  {rationaleMode && (
                    <p className="text-xs text-slate-500 mt-2 italic">
                      💡 {insight.reasoning}
                    </p>
                  )}
                </div>
              </div>
            </UsageTracker>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions Based on AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <UsageTracker feature="recommended_action" context="send_roi_email">
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send ROI Calculator Email
                {rationaleMode && (
                  <span className="ml-auto text-xs text-slate-500">85% likely to engage</span>
                )}
              </Button>
            </UsageTracker>
            
            <UsageTracker feature="recommended_action" context="schedule_demo">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Demo Call
                {rationaleMode && (
                  <span className="ml-auto text-xs text-slate-500">Best time: 2-4 PM</span>
                )}
              </Button>
            </UsageTracker>
            
            <UsageTracker feature="recommended_action" context="linkedin_connect">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                LinkedIn Follow-up
                {rationaleMode && (
                  <span className="ml-auto text-xs text-slate-500">Personal approach works</span>
                )}
              </Button>
            </UsageTracker>
          </div>
        </CardContent>
      </Card>

      {/* Sensitivity Notice */}
      {isSensitive && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <Target className="h-4 w-4" />
              <span className="font-medium">Sensitive Lead - Approval Required</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              AI will request your approval before taking any actions with this lead.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadSummary;
