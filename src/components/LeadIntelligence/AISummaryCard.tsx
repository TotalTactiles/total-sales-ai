
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Volume2 } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Lead } from '@/types/lead';

interface AISummaryCardProps {
  lead: Lead;
  aiDelegationMode: boolean;
}

const AISummaryCard: React.FC<AISummaryCardProps> = ({ lead, aiDelegationMode }) => {
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const { trackEvent } = useUsageTracking();

  useEffect(() => {
    generateAISummary();
  }, [lead]);

  const generateAISummary = async () => {
    setIsGenerating(true);
    
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
  };

  const handleVoiceSummary = () => {
    setVoiceActive(true);
    trackEvent({
      feature: 'voice_summary',
      action: 'trigger',
      context: 'lead_summary'
    });
    
    setTimeout(() => {
      setVoiceActive(false);
    }, 5000);
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-blue-600" />
          AI Lead Summary
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceSummary}
            disabled={voiceActive}
            className="ml-auto h-7 px-2"
          >
            <Volume2 className={`h-3 w-3 ${voiceActive ? 'animate-pulse text-blue-600' : ''}`} />
            <span className="text-xs ml-1">{voiceActive ? 'Speaking...' : 'Listen'}</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
            <span className="text-slate-600 text-sm">Generating AI summary...</span>
          </div>
        ) : (
          <p className="text-slate-700 leading-relaxed text-sm">{aiSummary}</p>
        )}
        
        {aiDelegationMode && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Brain className="h-3 w-3" />
              <span className="font-medium text-xs">AI is actively managing this lead</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Next action scheduled: Follow-up email in 2 hours
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISummaryCard;
