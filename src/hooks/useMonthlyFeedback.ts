import { logger } from '@/utils/logger';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FeedbackItem {
  id: string;
  report_summary: string;
  metrics: any;
  suggestions: any;
  sentiment: string; // Changed from union type to string to match database
  created_at: string;
}

interface MonthlyGoalComparison {
  goalsMet: number;
  totalGoals: number;
  progress: number;
  suggestions: string[];
}

export const useMonthlyFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackReady, setFeedbackReady] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<FeedbackItem | null>(null);
  const [goalComparison, setGoalComparison] = useState<MonthlyGoalComparison | null>(null);
  const { user, profile } = useAuth();

  // Check if it's time for monthly feedback
  const checkFeedbackSchedule = async () => {
    if (!profile?.company_id) return;
    
    try {
      setIsLoading(true);
      
      // Get company settings to check last feedback date
      const { data: settings, error: settingsError } = await supabase
        .from('company_settings')
        .select('last_feedback_check, original_goal')
        .eq('company_id', profile.company_id)
        .single();
        
      if (settingsError) throw settingsError;
      
      const lastCheck = settings?.last_feedback_check ? new Date(settings.last_feedback_check) : null;
      const now = new Date();
      
      // If no previous check or it's been 30+ days
      const shouldCheck = !lastCheck || 
        (now.getTime() - lastCheck.getTime()) >= (30 * 24 * 60 * 60 * 1000);
        
      if (shouldCheck && profile.role === 'manager') {
        // If we're a manager, check for new feedback
        await generateMonthlyFeedback(settings.original_goal);
      }
    } catch (error) {
      logger.error('Error checking feedback schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new monthly feedback
  const generateMonthlyFeedback = async (originalGoal: string) => {
    if (!profile?.company_id) return;
    
    try {
      setIsLoading(true);
      
      // Simulate generating feedback (in a real app, you'd analyze real usage data)
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      
      // Get usage analytics for the past month
      const { data: usage, error: usageError } = await supabase
        .from('usage_analytics')
        .select('*')
        .eq('company_id', profile.company_id)
        .gte('created_at', startDate.toISOString());
        
      if (usageError) throw usageError;
      
      // Analyze the data (simplified for demo)
      const metrics = {
        usageCount: usage?.length || 0,
        activeUsers: usage ? new Set(usage.map(u => u.user_id)).size : 0,
        topFeatures: ['dialer', 'analytics', 'brain'],
        completedGoals: Math.floor(Math.random() * 5)
      };
      
      // Determine sentiment based on usage
      const sentiment = metrics.usageCount > 20 ? 'positive' : metrics.usageCount > 10 ? 'neutral' : 'negative';
      
      // Generate summary based on sentiment and metrics
      let summary = '';
      let suggestions = [];
      
      if (sentiment === 'positive') {
        summary = `Great progress this month! Your team is actively using the platform with ${metrics.activeUsers} engaged users.`;
        suggestions = [
          "Consider expanding usage to more team members",
          "Explore the AI Agent's advanced capabilities",
          "Try using the objection handling features more often"
        ];
      } else if (sentiment === 'neutral') {
        summary = `Your team is making steady progress with the platform. There's room to increase engagement.`;
        suggestions = [
          "Schedule a team training session",
          "Set up regular check-ins using the analytics dashboard",
          "Try the guided coaching features"
        ];
      } else {
        summary = `We notice your platform usage is limited. Let's explore ways to help your team get more value.`;
        suggestions = [
          "Start with the guided tour",
          "Focus on one key feature at a time",
          "Schedule a consultation with our success team"
        ];
      }
      
      // Create comparison to original goal
      const goalComparison = {
        goalsMet: metrics.completedGoals,
        totalGoals: 5,
        progress: (metrics.completedGoals / 5) * 100,
        suggestions: suggestions
      };
      
      setGoalComparison(goalComparison);
      
      // Save the feedback to database
      const { data: feedback, error: feedbackError } = await supabase
        .from('manager_feedback')
        .insert({
          company_id: profile.company_id,
          feedback_period_start: startDate.toISOString(),
          feedback_period_end: new Date().toISOString(),
          report_summary: summary,
          sentiment: sentiment,
          metrics: metrics,
          suggestions: suggestions,
          goals_alignment_score: Math.floor(goalComparison.progress),
          recommended_actions: suggestions,
          user_accepted_suggestions: false
        })
        .select()
        .single();
        
      if (feedbackError) throw feedbackError;
      
      // Update company settings with latest check
      await supabase
        .from('company_settings')
        .update({ last_feedback_check: new Date().toISOString() })
        .eq('company_id', profile.company_id);
      
      // Set feedback as ready to show
      setLatestFeedback(feedback);
      setFeedbackReady(true);
      
      // Notify user
      toast.info("Monthly feedback report is ready to view", {
        duration: 5000,
        action: {
          label: "View Report",
          onClick: () => {
            // Handle opening the report
            document.dispatchEvent(new CustomEvent('show-monthly-feedback'));
          }
        }
      });
      
    } catch (error) {
      logger.error('Error generating monthly feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Accept suggestions from feedback
  const acceptSuggestions = async (feedbackId: string) => {
    if (!profile?.company_id) return;
    
    try {
      setIsLoading(true);
      
      // Mark suggestions as accepted
      await supabase
        .from('manager_feedback')
        .update({ user_accepted_suggestions: true })
        .eq('id', feedbackId)
        .eq('company_id', profile.company_id);
      
      // Create feature requests from suggestions
      if (latestFeedback?.suggestions) {
        const suggestions = latestFeedback.suggestions as string[];
        
        for (const suggestion of suggestions) {
          await supabase
            .from('feature_requests')
            .insert({
              company_id: profile.company_id,
              industry: '', // Would need to get from company settings
              feature_name: suggestion,
              context: `Monthly feedback suggestion: ${suggestion}`,
              validated: true,
              votes: 1
            });
        }
      }
      
      toast.success('Suggestions added to your improvement plan');
      setFeedbackReady(false);
      
    } catch (error) {
      logger.error('Error accepting suggestions:', error);
      toast.error('Failed to process feedback suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  // Dismiss feedback without accepting suggestions
  const dismissFeedback = async () => {
    setFeedbackReady(false);
  };

  // Check for feedback on component mount
  useEffect(() => {
    if (profile?.role === 'manager') {
      checkFeedbackSchedule();
    }
  }, [profile?.company_id]);

  return {
    isLoading,
    feedbackReady,
    latestFeedback,
    goalComparison,
    acceptSuggestions,
    dismissFeedback
  };
};

export default useMonthlyFeedback;
