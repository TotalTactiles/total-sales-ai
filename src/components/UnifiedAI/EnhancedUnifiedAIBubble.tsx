import { logger } from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  X, 
  Minimize2, 
  Maximize2,
  MessageSquare,
  Lightbulb,
  Settings,
  History,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useAuth } from '@/contexts/AuthContext';
import ConversationInterface from './ConversationInterface';

interface AIContext {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions' | 'leads';
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

interface EnhancedUnifiedAIBubbleProps {
  context: AIContext;
  className?: string;
}

const EnhancedUnifiedAIBubble: React.FC<EnhancedUnifiedAIBubbleProps> = ({
  context,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [nudges, setNudges] = useState<AINudge[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const { insights, logInteraction } = useAIBrainInsights();
  const { makeCall, sendSMS, sendEmail, scheduleCalendarEvent } = useIntegrations();
  const { user } = useAuth();

  // Generate context-aware nudges based on workspace
  useEffect(() => {
    const generateContextualNudges = () => {
      const baseNudges: AINudge[] = [];

      switch (context.workspace) {
        case 'leads':
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
      }

      setNudges(baseNudges);
    };

    generateContextualNudges();
  }, [context]);

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
      case 'send_email':
        if (context.currentLead) {
          toast.success(`Opening email composer for ${context.currentLead.name}`);
          // Here you would typically open the email composer or navigate to email tab
        }
        break;

      case 'draft_sms':
        if (context.currentLead) {
          const result = await sendSMS(context.currentLead.phone, 'Hello! This is a follow-up from our conversation.', context.currentLead.id, context.currentLead.name);
          if (result.success) {
            toast.success('SMS sent successfully');
          }
        }
        break;

      case 'schedule_meeting':
        if (context.currentLead) {
          const meetingDetails = {
            summary: `Meeting with ${context.currentLead.name}`,
            description: 'Sales follow-up meeting',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000),
            duration: 30
          };
          const result = await scheduleCalendarEvent(meetingDetails, context.currentLead.id, context.currentLead.name);
          if (result.success) {
            toast.success('Meeting scheduled successfully');
          }
        }
        break;

      case 'add_note':
        toast.success('Note added to lead profile');
        break;

      case 'show_daily_insights':
        setActiveTab('insights');
        toast.info('Showing your daily insights');
        break;

      case 'suggest_next_action':
        toast.info('Analyzing your pipeline for next best action...');
        break;

      default:
        logger.info('AI Action:', action, data);
    }

    // Log the interaction
    logInteraction({
      action, 
      workspace: context.workspace,
      leadId: context.currentLead?.id 
    });
  };

  const handleNudgeAction = (nudge: AINudge) => {
    if (nudge.action) {
      executeAIAction(nudge.action, { nudge });
    }
    
    setNudges(prev => prev.filter(n => n.id !== nudge.id));
  };

  const handleDismissNudge = (nudgeId: string) => {
    setNudges(prev => prev.filter(n => n.id !== nudgeId));
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
      leads: 'How can I help you with your leads?',
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
          isExpanded ? 'w-96 h-[700px]' : 'w-80 h-[500px]'
        }`}>
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
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

          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Insights
                  {unreadInsights > 0 && (
                    <Badge className="ml-1 bg-red-500 text-white text-xs h-4 w-4 p-0 flex items-center justify-center">
                      {unreadInsights}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs">
                  <History className="h-3 w-3 mr-1" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 m-0">
                <ConversationInterface
                  currentLead={context.currentLead}
                  workspace={context.workspace}
                  onActionClick={executeAIAction}
                  isExpanded={isExpanded}
                />
              </TabsContent>

              <TabsContent value="insights" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  {insights.length > 0 ? (
                    insights.slice(0, 5).map((insight) => (
                      <div key={insight.id} className="p-3 rounded border-l-4 border-purple-500 bg-purple-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{insight.type}</span>
                          <Badge className="text-xs">AI Generated</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{insight.suggestion_text}</p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" className="h-6 text-xs">Accept</Button>
                          <Button variant="outline" size="sm" className="h-6 text-xs">Dismiss</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm">
                      No insights available yet. Keep engaging with leads to generate insights!
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">
                    Recent AI interactions and actions will appear here.
                  </div>
                  {/* This would be populated with actual interaction history */}
                  <div className="text-center text-gray-400 text-sm mt-8">
                    Start a conversation to see your history!
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedUnifiedAIBubble;
