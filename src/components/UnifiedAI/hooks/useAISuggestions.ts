
import { useState, useEffect } from 'react';
import { Lead } from '@/types/lead';
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

export interface AISuggestion {
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

export const useAISuggestions = (context: AIContext) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const { profile } = useAuth();

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
          }
          break;
      }
      
      setSuggestions(newSuggestions);
    };

    generateSuggestions();
  }, [context, profile]);

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  return {
    suggestions,
    dismissSuggestion
  };
};
