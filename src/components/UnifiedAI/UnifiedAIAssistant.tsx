
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  Lightbulb, 
  Star, 
  X, 
  Minimize2, 
  Maximize2,
  Volume2,
  MessageSquare,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface AIContext {
  workspace: 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'dashboard';
  currentLead?: Lead;
  isCallActive?: boolean;
  callDuration?: number;
  currentSentiment?: 'positive' | 'neutral' | 'negative';
}

interface AINudge {
  id: string;
  type: 'objection' | 'closing' | 'next_action' | 'insight' | 'coaching';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action?: string;
  reasoning?: string;
  timestamp: Date;
  autoHide?: boolean;
}

interface UnifiedAIAssistantProps {
  context: AIContext;
  onAction?: (action: string, data?: any) => void;
  className?: string;
}

const UnifiedAIAssistant: React.FC<UnifiedAIAssistantProps> = ({
  context,
  onAction,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [nudges, setNudges] = useState<AINudge[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [autopilotMode, setAutopilotMode] = useState(false);
  const [sentimentPulse, setSentimentPulse] = useState<'positive' | 'neutral' | 'negative'>('neutral');

  const { callAIAgent, isLoading } = useAIAgent();
  const { trackEvent } = useUsageTracking();

  // Auto-generate contextual nudges based on workspace
  useEffect(() => {
    const generateContextualNudges = () => {
      const baseNudges: AINudge[] = [];

      switch (context.workspace) {
        case 'dialer':
          if (context.isCallActive && context.currentLead) {
            baseNudges.push({
              id: 'call-momentum',
              type: 'coaching',
              priority: 'medium',
              title: 'Call Momentum',
              message: `${context.currentLead.name} responds well to confidence. Keep energy high.`,
              reasoning: 'Based on 78% success rate with similar lead profiles',
              timestamp: new Date(),
              autoHide: true
            });

            if (context.callDuration && context.callDuration > 900) { // 15+ minutes
              baseNudges.push({
                id: 'call-length',
                type: 'next_action',
                priority: 'high',
                title: 'Close Opportunity',
                message: 'Perfect time to ask for commitment. Strike while engaged.',
                action: 'suggest_close',
                reasoning: '84% of deals close when ask happens after 15+ min engagement',
                timestamp: new Date()
              });
            }
          }
          break;

        case 'lead_details':
          if (context.currentLead?.speedToLead && context.currentLead.speedToLead < 5) {
            baseNudges.push({
              id: 'speed-to-lead',
              type: 'next_action',
              priority: 'critical',
              title: 'Fresh Lead Alert',
              message: 'Call NOW! Fresh leads have 21x higher connect rates in first 5 minutes.',
              action: 'initiate_call',
              reasoning: 'MIT study: speed-to-lead under 5min = 21x better results',
              timestamp: new Date()
            });
          }
          break;

        case 'email':
          baseNudges.push({
            id: 'email-timing',
            type: 'insight',
            priority: 'low',
            title: 'Optimal Send Time',
            message: 'Tuesday 10-11 AM has 34% higher open rates for this industry.',
            reasoning: 'Based on 2,847 emails sent to similar companies',
            timestamp: new Date(),
            autoHide: true
          });
          break;

        case 'sms':
          baseNudges.push({
            id: 'sms-compliance',
            type: 'insight',
            priority: 'medium',
            title: 'SMS Best Practice',
            message: 'Keep under 160 chars. Include clear opt-out. Professional tone works best.',
            reasoning: 'AU compliance + 67% better response rates',
            timestamp: new Date(),
            autoHide: true
          });
          break;
      }

      setNudges(baseNudges);
    };

    generateContextualNudges();
  }, [context]);

  // Mock sentiment analysis
  useEffect(() => {
    if (context.isCallActive) {
      const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
      const interval = setInterval(() => {
        const newSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        setSentimentPulse(newSentiment);
        
        // Generate sentiment-based nudges
        if (newSentiment === 'negative') {
          setNudges(prev => [...prev, {
            id: `sentiment-${Date.now()}`,
            type: 'objection',
            priority: 'high',
            title: 'Tone Shift Detected',
            message: 'Consider acknowledging their concern and redirecting to value.',
            action: 'show_objection_scripts',
            reasoning: 'Negative sentiment often indicates unaddressed objections',
            timestamp: new Date()
          }]);
        }
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [context.isCallActive]);

  const handleAICommand = async (command: string) => {
    trackEvent({
      feature: 'unified_ai_assistant',
      action: 'command',
      context: context.workspace,
      metadata: { command, leadId: context.currentLead?.id }
    });

    if (!command.trim()) return;

    try {
      const response = await callAIAgent({
        prompt: `Context: ${context.workspace}. Lead: ${context.currentLead?.name || 'None'}. Command: ${command}`
      });

      if (response) {
        // Execute the AI's suggestion
        onAction?.(response.suggestedAction?.type || 'ai_response', {
          response: response.response,
          action: response.suggestedAction
        });
        
        toast.success('AI command executed successfully');
      }
    } catch (error) {
      toast.error('Failed to process AI command');
    }
    
    setInputMessage('');
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      // Start voice recognition
      setIsListening(true);
      toast.info('Voice mode activated. Say "Hey AI" to start');
    } else {
      setIsListening(false);
      toast.info('Voice mode deactivated');
    }
  };

  const handleNudgeAction = (nudge: AINudge) => {
    if (nudge.action) {
      onAction?.(nudge.action, { nudge });
    }
    
    // Remove nudge after action
    setNudges(prev => prev.filter(n => n.id !== nudge.id));
    
    trackEvent({
      feature: 'ai_nudge',
      action: 'accept',
      context: context.workspace,
      metadata: { nudgeType: nudge.type, nudgeId: nudge.id }
    });
  };

  const handleDismissNudge = (nudgeId: string) => {
    setNudges(prev => prev.filter(n => n.id !== nudgeId));
    
    trackEvent({
      feature: 'ai_nudge',
      action: 'dismiss',
      context: context.workspace,
      metadata: { nudgeId }
    });
  };

  const handleAutopilotToggle = () => {
    setAutopilotMode(!autopilotMode);
    
    if (!autopilotMode && context.currentLead) {
      toast.success(`AI Autopilot activated for ${context.currentLead.name}. You'll be notified of major updates.`);
    } else {
      toast.info('AI Autopilot deactivated. You have full control.');
    }
    
    trackEvent({
      feature: 'ai_autopilot',
      action: autopilotMode ? 'disable' : 'enable',
      context: context.workspace,
      metadata: { leadId: context.currentLead?.id }
    });
  };

  const submitFeedback = () => {
    trackEvent({
      feature: 'ai_feedback',
      action: 'submit',
      context: context.workspace,
      metadata: { rating: feedbackRating, feedback: feedbackText }
    });
    
    setShowFeedback(false);
    setFeedbackRating(0);
    setFeedbackText('');
    toast.success('Feedback submitted. AI will improve based on your input.');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getPositionClass = () => {
    switch (context.workspace) {
      case 'dialer': return 'bottom-24 right-6';
      case 'lead_details': return 'bottom-6 right-6';
      case 'email': return 'bottom-6 right-80';
      case 'sms': return 'bottom-6 right-80';
      default: return 'bottom-6 right-6';
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${getPositionClass()} z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Brain className="h-6 w-6" />
          {nudges.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs p-0">
              {nudges.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClass()} z-50 ${className}`}>
      {/* AI Nudges - Floating above assistant */}
      {nudges.length > 0 && !isExpanded && (
        <div className="mb-4 space-y-2 max-w-sm">
          {nudges.slice(0, 2).map((nudge) => (
            <Card key={nudge.id} className={`${getPriorityColor(nudge.priority)} border-l-4 shadow-lg animate-slide-in`}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">{nudge.title}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDismissNudge(nudge.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-700 mb-2">{nudge.message}</p>
                {nudge.reasoning && (
                  <p className="text-xs text-gray-500 mb-2 italic">💡 {nudge.reasoning}</p>
                )}
                {nudge.action && (
                  <Button 
                    size="sm" 
                    onClick={() => handleNudgeAction(nudge)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main AI Assistant */}
      <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
        isExpanded ? 'w-96 h-[500px]' : 'w-80 h-auto'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="relative">
                <Brain className="h-5 w-5" />
                <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 animate-pulse"></div>
              </div>
              AI Assistant
              {autopilotMode && context.currentLead && (
                <Badge className="bg-purple-500 text-white text-xs">
                  Autopilot: {context.currentLead.name}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              {context.isCallActive && (
                <div className={`w-3 h-3 rounded-full ${
                  sentimentPulse === 'positive' ? 'bg-green-400' : 
                  sentimentPulse === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                }`} title={`Sentiment: ${sentimentPulse}`}></div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white p-1 h-auto hover:bg-white/10"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMinimized(true)}
                className="text-white p-1 h-auto hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {context.currentLead && (
            <div className="text-xs text-blue-100 mt-1">
              Context: {context.workspace} • {context.currentLead.name} • {context.currentLead.conversionLikelihood}% likely
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAICommand('Draft follow-up email')}
              disabled={isLoading}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Draft Email
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAICommand('Summarize last interaction')}
              disabled={isLoading}
            >
              <Target className="h-3 w-3 mr-1" />
              Summarize
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAICommand('Suggest next best action')}
              disabled={isLoading}
            >
              <Zap className="h-3 w-3 mr-1" />
              Next Action
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAutopilotToggle}
              className={autopilotMode ? 'bg-purple-100 border-purple-300' : ''}
            >
              <Brain className="h-3 w-3 mr-1" />
              {autopilotMode ? 'Exit Auto' : 'Autopilot'}
            </Button>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <>
              {/* All Nudges */}
              {nudges.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {nudges.map((nudge) => (
                    <div key={nudge.id} className={`p-2 rounded border-l-4 ${getPriorityColor(nudge.priority)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{nudge.title}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDismissNudge(nudge.id)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">{nudge.message}</p>
                      {nudge.action && (
                        <Button 
                          size="sm" 
                          onClick={() => handleNudgeAction(nudge)}
                          className="mt-1 h-6 text-xs"
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Command Input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask AI anything... (e.g., 'Draft SMS', 'Schedule meeting', 'Show objection scripts')"
                    className="text-sm resize-none"
                    rows={2}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() => handleAICommand(inputMessage)}
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={handleVoiceToggle}
                      variant={voiceEnabled ? "destructive" : "outline"}
                      size="sm"
                    >
                      {isListening ? <Volume2 className="h-3 w-3" /> : 
                       voiceEnabled ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                
                {voiceEnabled && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {isListening && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                    Say "Hey AI" to give voice commands
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFeedback(true)}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Feedback
            </Button>
            <div className="text-xs text-gray-500">
              Context: {context.workspace}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="text-sm">Rate AI Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={feedbackRating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackRating(rating)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                ))}
              </div>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Optional: Tell us how AI can improve..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={submitFeedback} className="flex-1">
                  Submit
                </Button>
                <Button variant="outline" onClick={() => setShowFeedback(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UnifiedAIAssistant;
