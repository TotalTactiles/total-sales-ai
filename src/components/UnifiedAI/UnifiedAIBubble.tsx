
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Phone,
  Mail,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useAuth } from '@/contexts/AuthContext';

interface AIContext {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions';
  currentLead?: Lead;
  isCallActive?: boolean;
  callDuration?: number;
  emailContext?: {
    to?: string;
    subject?: string;
    thread?: any[];
  };
  smsContext?: {
    phoneNumber?: string;
    conversation?: any[];
  };
}

interface AINudge {
  id: string;
  type: 'objection' | 'closing' | 'next_action' | 'insight' | 'coaching' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action?: string;
  reasoning?: string;
  timestamp: Date;
  autoHide?: boolean;
}

interface UnifiedAIBubbleProps {
  context: AIContext;
  className?: string;
}

const UnifiedAIBubble: React.FC<UnifiedAIBubbleProps> = ({
  context,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [nudges, setNudges] = useState<AINudge[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const { callAIAgent, isLoading } = useAIAgent();
  const { insights, logInteraction, logGhostIntent } = useAIBrainInsights();
  const { makeCall, sendSMS, sendEmail, scheduleCalendarEvent } = useIntegrations();
  const { user } = useAuth();

  // Generate context-aware nudges based on workspace
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

            if (context.callDuration && context.callDuration > 900) {
              baseNudges.push({
                id: 'call-close',
                type: 'closing',
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

  // Get workspace-specific quick actions
  const getQuickActions = () => {
    const actions = [];

    switch (context.workspace) {
      case 'dialer':
        if (context.currentLead) {
          actions.push(
            { icon: Phone, label: 'Call Lead', action: 'initiate_call' },
            { icon: MessageSquare, label: 'Send SMS', action: 'draft_sms' },
            { icon: FileText, label: 'Log Outcome', action: 'log_call_outcome' }
          );
        }
        break;

      case 'lead_details':
        actions.push(
          { icon: Mail, label: 'Draft Email', action: 'draft_email' },
          { icon: MessageSquare, label: 'Send SMS', action: 'draft_sms' },
          { icon: Calendar, label: 'Schedule Meeting', action: 'schedule_meeting' },
          { icon: FileText, label: 'Add Note', action: 'add_note' }
        );
        break;

      case 'email':
        actions.push(
          { icon: Zap, label: 'Smart Reply', action: 'generate_reply' },
          { icon: Target, label: 'Follow-up', action: 'draft_followup' },
          { icon: Calendar, label: 'Schedule Meeting', action: 'schedule_meeting' }
        );
        break;

      case 'sms':
        actions.push(
          { icon: Zap, label: 'Quick Reply', action: 'generate_sms_reply' },
          { icon: Phone, label: 'Convert to Call', action: 'initiate_call' },
          { icon: Mail, label: 'Send Email', action: 'draft_email' }
        );
        break;

      default:
        actions.push(
          { icon: TrendingUp, label: 'Daily Insights', action: 'show_insights' },
          { icon: Target, label: 'Next Best Action', action: 'suggest_action' },
          { icon: Lightbulb, label: 'Micro-Coaching', action: 'show_coaching' }
        );
    }

    return actions;
  };

  const handleAICommand = async (command: string) => {
    if (!command.trim()) return;

    logInteraction('ai_assistant', 'command', 'initiated', { 
      command, 
      workspace: context.workspace,
      leadId: context.currentLead?.id 
    });

    try {
      const response = await callAIAgent({
        prompt: `Context: ${context.workspace}. Lead: ${context.currentLead?.name || 'None'}. Command: ${command}`
      });

      if (response) {
        // Execute the AI's suggestion
        await executeAIAction(response.suggestedAction?.type || 'ai_response', {
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

  const executeAIAction = async (action: string, data?: any) => {
    switch (action) {
      case 'initiate_call':
        if (context.currentLead) {
          const result = await makeCall(context.currentLead.phone, context.currentLead.id, context.currentLead.name);
          if (result.success) {
            toast.success(`Calling ${context.currentLead.name}...`);
          }
        }
        break;

      case 'draft_email':
        if (context.currentLead) {
          const emailDraft = await callAIAgent({
            prompt: `Draft a professional follow-up email for ${context.currentLead.name} from ${context.currentLead.company}`
          });
          if (emailDraft) {
            toast.success('Email draft generated');
            // Here you would typically open the email composer with the draft
          }
        }
        break;

      case 'draft_sms':
        if (context.currentLead) {
          const smsDraft = await callAIAgent({
            prompt: `Draft a concise, professional SMS for ${context.currentLead.name}. Include compliance opt-out.`
          });
          if (smsDraft) {
            toast.success('SMS draft generated');
          }
        }
        break;

      case 'schedule_meeting':
        if (context.currentLead) {
          const meetingDetails = {
            summary: `Meeting with ${context.currentLead.name}`,
            description: 'Sales follow-up meeting',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            duration: 30
          };
          const result = await scheduleCalendarEvent(meetingDetails, context.currentLead.id, context.currentLead.name);
          if (result.success) {
            toast.success('Meeting scheduled successfully');
          }
        }
        break;

      case 'ai_response':
        if (data?.response) {
          toast.success(`AI: ${data.response}`);
        }
        break;

      default:
        console.log('AI Action:', action, data);
    }
  };

  const handleQuickAction = async (actionType: string) => {
    await executeAIAction(actionType);
    logInteraction('ai_assistant', 'quick_action', 'executed', { actionType, workspace: context.workspace });
  };

  const handleNudgeAction = (nudge: AINudge) => {
    if (nudge.action) {
      executeAIAction(nudge.action, { nudge });
    }
    
    setNudges(prev => prev.filter(n => n.id !== nudge.id));
    logInteraction('ai_nudge', 'accept', 'completed', { nudgeType: nudge.type, nudgeId: nudge.id });
  };

  const handleDismissNudge = (nudgeId: string) => {
    setNudges(prev => prev.filter(n => n.id !== nudgeId));
    logInteraction('ai_nudge', 'dismiss', 'completed', { nudgeId });
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      setIsListening(true);
      toast.info('Voice mode activated. Say "Hey AI" to start');
    } else {
      setIsListening(false);
      toast.info('Voice mode deactivated');
    }
  };

  const submitFeedback = () => {
    logInteraction('ai_feedback', 'submit', 'completed', { 
      rating: feedbackRating, 
      feedback: feedbackText,
      workspace: context.workspace
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

  const getContextualGreeting = () => {
    const greetings = {
      dashboard: 'Ready to boost your sales today?',
      dialer: 'Let\'s make some calls and close deals!',
      lead_details: 'How can I help you with this lead?',
      email: 'Need help crafting the perfect email?',
      sms: 'Let\'s send some engaging messages!',
      notes: 'Ready to capture important insights?',
      meetings: 'Let\'s schedule some productive meetings!',
      company_brain: 'Analyzing company performance data...',
      agent_missions: 'Time to level up your sales skills!'
    };
    
    return greetings[context.workspace] || 'How can I assist you today?';
  };

  const quickActions = getQuickActions();
  const unreadInsights = insights.filter(i => i.accepted === null).length;
  const totalNotifications = nudges.length + unreadInsights;

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white"
          >
            <Brain className="h-7 w-7 text-white" />
            {totalNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs p-0 text-white">
                {totalNotifications}
              </Badge>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* AI Nudges - Floating above assistant */}
      <AnimatePresence>
        {nudges.length > 0 && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 space-y-2 max-w-sm"
          >
            {nudges.slice(0, 2).map((nudge) => (
              <Card key={nudge.id} className={`${getPriorityColor(nudge.priority)} border-l-4 shadow-lg`}>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AI Assistant */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
          isExpanded ? 'w-96 h-[600px]' : 'w-80 h-auto'
        }`}>
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="relative">
                  <Brain className="h-5 w-5" />
                  <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 animate-pulse"></div>
                </div>
                AI Assistant
                <Badge className="bg-white/20 text-white text-xs">
                  {context.workspace.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-1">
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
            
            <div className="text-xs text-blue-100 mt-1">
              {getContextualGreeting()}
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <>
                {/* All Nudges and Insights */}
                {(nudges.length > 0 || insights.length > 0) && (
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
                    
                    {insights.slice(0, 3).map((insight) => (
                      <div key={insight.id} className="p-2 rounded border-l-4 border-purple-500 bg-purple-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{insight.title}</span>
                          <Badge className="text-xs">{insight.confidence}% confident</Badge>
                        </div>
                        <p className="text-xs text-gray-600">{insight.description}</p>
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
                      placeholder="Ask AI anything... (e.g., 'Draft follow-up email', 'Schedule meeting', 'Show objection scripts')"
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
                {context.currentLead ? `Lead: ${context.currentLead.name}` : 'Ready to assist'}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedAIBubble;
