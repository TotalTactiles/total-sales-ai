
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EnhancedUsageEvent {
  feature: string;
  action: string;
  context?: string;
  outcome?: string;
  metadata?: Record<string, any>;
  pageUrl?: string;
  sessionId?: string;
  duration?: number;
  aiInteraction?: boolean;
  callContext?: {
    leadId?: string;
    callDuration?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
}

export interface AILearningData {
  userBehavior: {
    frequentlyUsedFeatures: string[];
    strugglingAreas: string[];
    successPatterns: string[];
    timeOfDayPerformance: Record<string, number>;
  };
  industryInsights: {
    commonObjections: string[];
    successfulScripts: string[];
    optimalTiming: string[];
  };
  personalizedRecommendations: string[];
}

export const useEnhancedUsageTracking = () => {
  const [isLogging, setIsLogging] = useState(false);
  const { user, profile } = useAuth();

  const trackEvent = async (event: EnhancedUsageEvent) => {
    if (!user?.id || !profile?.company_id) return;
    
    try {
      setIsLogging(true);
      
      const enhancedEvent = {
        ...event,
        pageUrl: window.location.pathname,
        sessionId: sessionStorage.getItem('session_id') || 'unknown',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        aiInteraction: event.feature.includes('ai') || event.action.includes('ai')
      };

      const { error } = await supabase
        .from('usage_events')
        .insert({
          user_id: user.id,
          company_id: profile.company_id,
          role: profile.role,
          feature: enhancedEvent.feature,
          action: enhancedEvent.action,
          context: enhancedEvent.context,
          outcome: enhancedEvent.outcome,
          metadata: {
            ...enhancedEvent.metadata,
            pageUrl: enhancedEvent.pageUrl,
            sessionId: enhancedEvent.sessionId,
            userAgent: enhancedEvent.userAgent,
            screenResolution: enhancedEvent.screenResolution,
            aiInteraction: enhancedEvent.aiInteraction,
            callContext: event.callContext
          }
        });
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Error tracking enhanced usage event:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const trackPageView = (pageName: string, duration?: number) => 
    trackEvent({ 
      feature: 'page_navigation', 
      action: 'view', 
      context: pageName,
      duration,
      metadata: { timestamp: Date.now() }
    });
    
  const trackTabSwitch = (fromTab: string, toTab: string, workspace: string) => 
    trackEvent({ 
      feature: 'tab_navigation', 
      action: 'switch', 
      context: workspace,
      metadata: { fromTab, toTab }
    });
    
  const trackAIQuestion = (question: string, context: string, response?: string) => 
    trackEvent({ 
      feature: 'ai_assistant', 
      action: 'question', 
      context,
      metadata: { question, response, questionLength: question.length }
    });
    
  const trackScriptUsage = (scriptType: string, outcome?: string) => 
    trackEvent({ 
      feature: 'sales_script', 
      action: 'use', 
      context: scriptType,
      outcome,
      metadata: { scriptType }
    });
    
  const trackCallActivity = (leadId: string, duration: number, outcome: string, sentiment?: string) => 
    trackEvent({ 
      feature: 'call_activity', 
      action: 'complete', 
      context: 'lead_call',
      outcome,
      callContext: {
        leadId,
        callDuration: duration,
        sentiment: sentiment as 'positive' | 'neutral' | 'negative'
      }
    });

  const trackFeatureStruggle = (feature: string, struggleType: string, context?: string) => 
    trackEvent({ 
      feature: 'user_struggle', 
      action: 'detected', 
      context: feature,
      metadata: { struggleType, context }
    });

  const logAILearningData = async (learningData: Partial<AILearningData>) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: profile.company_id,
          type: 'learning_data',
          event_summary: 'AI learning data update',
          payload: {
            userId: user.id,
            role: profile.role,
            learningData,
            timestamp: new Date().toISOString()
          },
          visibility: 'admin_only'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging AI learning data:', error);
    }
  };

  const generatePersonalizedInsights = async (): Promise<string[]> => {
    // This would typically call an AI service to analyze usage patterns
    // For now, return mock insights based on role
    if (profile?.role === 'sales_rep') {
      return [
        'You perform best during 10-11 AM calls - schedule important prospects then',
        'Your close rate improves 34% when you mention ROI within first 3 minutes',
        'Price objection scripts are your strongest area - confidence level: 92%',
        'Consider practicing technical questions - detected hesitation patterns'
      ];
    } else {
      return [
        'Your team shows highest engagement with visual content',
        'Morning training sessions have 67% better retention',
        'Scripts with customer stories perform 45% better',
        'Team productivity peaks on Tuesdays and Wednesdays'
      ];
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackTabSwitch,
    trackAIQuestion,
    trackScriptUsage,
    trackCallActivity,
    trackFeatureStruggle,
    logAILearningData,
    generatePersonalizedInsights,
    isLogging
  };
};
