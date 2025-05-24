
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  X, 
  Minimize2, 
  Maximize2,
  MessageSquare,
  Lightbulb,
  Phone,
  Send,
  Mic,
  MicOff,
  Volume2,
  Settings,
  BookOpen,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';
import { useEnhancedUsageTracking } from '@/hooks/useEnhancedUsageTracking';
import { useAuth } from '@/contexts/AuthContext';

interface AIContext {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions' | 'leads';
  currentLead?: Lead;
  isCallActive?: boolean;
  callDuration?: number;
  callSentiment?: 'positive' | 'neutral' | 'negative';
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

interface AISuggestion {
  id: string;
  type: 'tip' | 'script' | 'question' | 'warning' | 'opportunity' | 'learning' | 'coaching';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action?: string;
  context: string;
  timestamp: Date;
  autoHide?: boolean;
}

interface ContextAwareAIBubbleProps {
  context: AIContext;
  className?: string;
}

const ContextAwareAIBubble: React.FC<ContextAwareAIBubbleProps> = ({
  context,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const { trackEvent, trackAIQuestion, trackCallActivity } = useEnhancedUsageTracking();
  const { profile } = useAuth();

  // Position bubble based on workspace and screen size
  const getBubblePosition = () => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      return 'bottom-4 right-4';
    }
    
    switch (context.workspace) {
      case 'dialer':
        return context.isCallActive ? 'bottom-4 left-4' : 'bottom-4 right-4';
      case 'lead_details':
        return 'bottom-4 right-80';
      case 'email':
      case 'sms':
        return 'bottom-4 right-6';
      case 'company_brain':
        return 'bottom-4 right-6';
      default:
        return 'bottom-4 right-4';
    }
  };

  // Generate context-aware suggestions
  useEffect(() => {
    const generateSuggestions = () => {
      const newSuggestions: AISuggestion[] = [];
      
      switch (context.workspace) {
        case 'company_brain':
          if (profile?.role === 'sales_rep') {
            newSuggestions.push({
              id: 'learning-streak',
              type: 'coaching',
              priority: 'medium',
              title: 'Keep Your Streak!',
              message: 'You\'re on a 7-day learning streak! Complete 1 more lesson today to maintain momentum.',
              context: 'learning-motivation',
              timestamp: new Date()
            });
            
            newSuggestions.push({
              id: 'objection-focus',
              type: 'learning',
              priority: 'high',
              title: 'Recommended Learning',
              message: 'Your objection handling could improve. I\'ve found 3 Alex Hormozi videos that match your style.',
              action: 'show_objection_content',
              context: 'skill-improvement',
              timestamp: new Date()
            });
            
            newSuggestions.push({
              id: 'trending-content',
              type: 'tip',
              priority: 'low',
              title: 'Trending Content',
              message: 'New enterprise discovery guide just added - already helping reps close 23% more deals.',
              context: 'content-discovery',
              timestamp: new Date(),
              autoHide: true
            });
          }
          break;
          
        case 'dialer':
          if (context.isCallActive && context.currentLead) {
            if (context.callDuration && context.callDuration > 300) {
              newSuggestions.push({
                id: 'call-progress',
                type: 'tip',
                priority: 'medium',
                title: 'Call Going Well',
                message: `${context.currentLead.name} is engaged. Consider asking about their decision timeline.`,
                context: 'call-progress',
                timestamp: new Date()
              });
            }
            
            if (context.callSentiment === 'negative') {
              newSuggestions.push({
                id: 'negative-sentiment',
                type: 'warning',
                priority: 'high',
                title: 'Tone Shift Detected',
                message: 'Consider acknowledging their concern and asking clarifying questions.',
                action: 'show_objection_scripts',
                context: 'sentiment-analysis',
                timestamp: new Date()
              });
            }
            
            newSuggestions.push({
              id: 'product-mention',
              type: 'opportunity',
              priority: 'medium',
              title: 'Product Opportunity',
              message: 'Mention integration capabilities - fits their tech stack.',
              context: 'product-fit',
              timestamp: new Date(),
              autoHide: true
            });
          }
          break;
          
        case 'lead_details':
          if (context.currentLead) {
            if (context.currentLead.speedToLead && context.currentLead.speedToLead < 5) {
              newSuggestions.push({
                id: 'speed-to-lead',
                type: 'opportunity',
                priority: 'critical',
                title: 'Fresh Lead!',
                message: 'Call within 5 minutes for 21x better connect rate.',
                action: 'initiate_call',
                context: 'speed-to-lead',
                timestamp: new Date()
              });
            }
          }
          break;
      }
      
      setSuggestions(newSuggestions);
    };

    generateSuggestions();
  }, [context, profile]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    
    // Track AI interaction
    trackAIQuestion(chatInput, context.workspace);
    
    // Simulate AI response based on context
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateContextualResponse(chatInput),
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
    
    setChatInput('');
  };

  const generateContextualResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (context.workspace === 'company_brain' && profile?.role === 'sales_rep') {
      if (lowerInput.includes('recommend') || lowerInput.includes('learn')) {
        return 'Based on your performance data, I recommend focusing on objection handling next. You\'ve completed 80% of discovery content but only 45% of objection content. The "Alex Hormozi Value Stacking" video would be perfect for your style.';
      }
      if (lowerInput.includes('progress') || lowerInput.includes('streak')) {
        return 'You\'re doing great! 7-day learning streak, 57% overall completion. Your strongest area is cold calling (92% success rate). Focus on price objections next - complete 2 more lessons to reach your weekly goal.';
      }
      if (lowerInput.includes('objection') || lowerInput.includes('price')) {
        return 'I\'ve identified your objection handling pattern. You\'re strong with technical questions but struggle with price objections. Try the "Turning Price Into Value" framework - it matches your consultative style and increases close rates by 34%.';
      }
    }
    
    if (context.workspace === 'dialer' && context.currentLead) {
      if (lowerInput.includes('objection') || lowerInput.includes('price')) {
        return `For ${context.currentLead.name}, try: "I understand budget is a concern. Let me show you the ROI calculation that companies your size typically see - would that be helpful?"`;
      }
      if (lowerInput.includes('close') || lowerInput.includes('next steps')) {
        return `Based on the call progress, ask: "What would need to happen for you to move forward with this solution by [specific date]?"`;
      }
    }
    
    return `I'm here to help with your ${context.workspace.replace('_', ' ')} workflow. What specific assistance do you need?`;
  };

  const handleSuggestionAction = (suggestion: AISuggestion) => {
    trackEvent({
      feature: 'ai_suggestion',
      action: 'accept',
      context: suggestion.context,
      metadata: { suggestionType: suggestion.type, priority: suggestion.priority }
    });
    
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    if (suggestion.action) {
      toast.success(`Executing: ${suggestion.action}`);
    }
  };

  const getSuggestionColor = (type: string, priority: string) => {
    if (priority === 'critical') return 'border-red-500 bg-red-50';
    if (priority === 'high') return 'border-orange-500 bg-orange-50';
    if (type === 'opportunity') return 'border-green-500 bg-green-50';
    if (type === 'learning') return 'border-purple-500 bg-purple-50';
    if (type === 'coaching') return 'border-blue-500 bg-blue-50';
    if (type === 'tip') return 'border-cyan-500 bg-cyan-50';
    return 'border-slate-300 bg-slate-50';
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'learning': return <BookOpen className="h-4 w-4 text-purple-600" />;
      case 'coaching': return <Target className="h-4 w-4 text-blue-600" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-orange-600" />;
      default: return <Lightbulb className="h-4 w-4 text-orange-600" />;
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${getBubblePosition()} z-50 ${className}`}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white relative"
          >
            <Brain className="h-7 w-7 text-white" />
            {suggestions.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs p-0 text-white">
                {suggestions.length}
              </Badge>
            )}
            {context.isCallActive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`fixed ${getBubblePosition()} z-50 ${className}`}>
      {/* Floating Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 space-y-2 max-w-sm"
          >
            {suggestions.slice(0, 2).map((suggestion) => (
              <Card key={suggestion.id} className={`${getSuggestionColor(suggestion.type, suggestion.priority)} border-l-4 shadow-lg`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="text-sm font-medium">{suggestion.title}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{suggestion.message}</p>
                  {suggestion.action && (
                    <Button 
                      size="sm" 
                      onClick={() => handleSuggestionAction(suggestion)}
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
          isExpanded ? 'w-96 h-[600px]' : 'w-80 h-[400px]'
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
                  {context.workspace === 'company_brain' ? 'Academy' : context.workspace.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-1">
                {voiceEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="text-white p-1 h-auto hover:bg-white/10"
                  >
                    {isListening ? <Volume2 className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
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
            
            {context.workspace === 'company_brain' && profile?.role === 'sales_rep' && (
              <div className="text-xs text-blue-100 mt-1">
                Learning: 57% complete • 7-day streak • Focus: Objection handling
              </div>
            )}
            
            {context.currentLead && (
              <div className="text-xs text-blue-100 mt-1">
                Context: {context.currentLead.name} • {context.currentLead.conversionLikelihood}% likely
                {context.isCallActive && ` • Call: ${Math.floor((context.callDuration || 0) / 60)}m`}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-8">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  {context.workspace === 'company_brain' 
                    ? "I'm your learning companion! Ask about content, progress, or get personalized recommendations."
                    : `I'm here to help! Ask me anything about ${context.workspace === 'dialer' && context.currentLead ? context.currentLead.name : 'your current workflow'}.`
                  }
                </div>
              )}
              
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder={context.workspace === 'company_brain' 
                  ? "Ask about learning progress, content, or get recommendations..."
                  : `Ask about ${context.workspace === 'dialer' && context.currentLead ? context.currentLead.name : 'anything'}...`
                }
                className="flex-1"
              />
              <Button onClick={handleChatSubmit} size="sm">
                <Send className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant={voiceEnabled ? "destructive" : "outline"}
                size="sm"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContextAwareAIBubble;
