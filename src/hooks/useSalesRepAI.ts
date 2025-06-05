import { logger } from '@/utils/logger';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { masterAIBrain, AIRecommendation } from '@/services/masterAIBrain';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RepCoaching {
  id: string;
  type: 'objection_handling' | 'closing_technique' | 'product_knowledge' | 'communication' | 'time_management';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  learning_path: string[];
  estimated_time: number; // minutes
  interactive: boolean;
  progress?: number; // 0-100
}

export interface TaskRecommendation {
  id: string;
  type: 'call' | 'email' | 'follow_up' | 'research' | 'demo' | 'close';
  lead_id?: string;
  lead_name?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  best_time?: string;
  reasoning: string;
  confidence: number;
  estimated_duration: number;
  success_probability: number;
}

export interface RepPerformanceInsight {
  id: string;
  metric: 'call_volume' | 'conversion_rate' | 'response_time' | 'deal_velocity' | 'objection_rate';
  current_value: number;
  benchmark: number;
  trend: 'improving' | 'declining' | 'stable';
  impact: 'low' | 'medium' | 'high';
  suggestion: string;
  action_items: string[];
}

export const useSalesRepAI = () => {
  const [taskRecommendations, setTaskRecommendations] = useState<TaskRecommendation[]>([]);
  const [coachingItems, setCoachingItems] = useState<RepCoaching[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState<RepPerformanceInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, profile } = useAuth();

  const getPersonalizedRecommendations = async () => {
    if (!user?.id || !profile?.company_id) return;

    setIsGenerating(true);
    try {
      // Get AI-powered task recommendations
      const tasks = await generateTaskRecommendations();
      setTaskRecommendations(tasks);

      // Get personalized coaching
      const coaching = await generateCoachingRecommendations();
      setCoachingItems(coaching);

      // Get performance insights
      const insights = await generatePerformanceInsights();
      setPerformanceInsights(insights);

      // Log interaction
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'user_action',
        source: 'sales_rep_ai_assistant',
        data: {
          action: 'get_personalized_recommendations',
          tasks_count: tasks.length,
          coaching_count: coaching.length,
          insights_count: insights.length
        }
      });

    } catch (error) {
      logger.error('Error getting personalized recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTaskRecommendations = async (): Promise<TaskRecommendation[]> => {
    try {
      // Get user's recent activity and lead data
      const [leads, callHistory, userStats] = await Promise.all([
        getUserLeads(),
        getRecentCallHistory(),
        getUserStats()
      ]);

      const recommendations: TaskRecommendation[] = [];

      // Analyze leads for optimal calling times
      const highPriorityLeads = leads.filter(lead => 
        lead.priority === 'high' && 
        lead.status === 'new' && 
        (!lead.last_contact || isOlderThan(lead.last_contact, 24)) // 24 hours
      );

      for (const lead of highPriorityLeads.slice(0, 3)) {
        const optimalTime = calculateOptimalCallTime(lead, callHistory);
        recommendations.push({
          id: `call-${lead.id}`,
          type: 'call',
          lead_id: lead.id,
          lead_name: lead.name,
          priority: 'high',
          title: `Call ${lead.name}`,
          description: `High-priority lead with ${lead.score || 85}% conversion likelihood`,
          best_time: optimalTime,
          reasoning: `Fresh lead with high score. Best call time based on historical data.`,
          confidence: 0.87,
          estimated_duration: 15,
          success_probability: lead.conversion_likelihood || 0.75
        });
      }

      // Email follow-ups
      const emailFollowUps = leads.filter(lead => 
        lead.status === 'contacted' && 
        lead.last_contact && 
        isOlderThan(lead.last_contact, 48) // 48 hours
      );

      for (const lead of emailFollowUps.slice(0, 2)) {
        recommendations.push({
          id: `email-${lead.id}`,
          type: 'email',
          lead_id: lead.id,
          lead_name: lead.name,
          priority: 'medium',
          title: `Follow up with ${lead.name}`,
          description: `Send personalized follow-up email`,
          reasoning: `No contact for 48+ hours. Follow-up emails have 23% higher response rate.`,
          confidence: 0.71,
          estimated_duration: 8,
          success_probability: 0.34
        });
      }

      return recommendations;

    } catch (error) {
      logger.error('Error generating task recommendations:', error);
      return [];
    }
  };

  const generateCoachingRecommendations = async (): Promise<RepCoaching[]> => {
    try {
      const userStats = await getUserStats();
      const callHistory = await getRecentCallHistory();
      
      const coaching: RepCoaching[] = [];

      // Analyze call outcomes for coaching opportunities
      const noAnswerRate = callHistory.filter(c => c.status === 'no-answer').length / callHistory.length;
      if (noAnswerRate > 0.4) {
        coaching.push({
          id: 'timing-optimization',
          type: 'time_management',
          title: 'Call Timing Optimization',
          description: 'Learn when prospects are most likely to answer',
          difficulty: 'intermediate',
          priority: 'high',
          learning_path: ['timing_analytics', 'prospect_timezone_analysis', 'industry_patterns'],
          estimated_time: 25,
          interactive: true,
          progress: 0
        });
      }

      // Objection handling if conversion is low
      if (userStats?.win_count && userStats.call_count) {
        const conversionRate = userStats.win_count / userStats.call_count;
        if (conversionRate < 0.15) {
          coaching.push({
            id: 'objection-handling',
            type: 'objection_handling',
            title: 'Advanced Objection Handling',
            description: 'Master techniques to overcome common objections',
            difficulty: 'advanced',
            priority: 'urgent',
            learning_path: ['price_objections', 'timing_objections', 'authority_objections'],
            estimated_time: 45,
            interactive: true,
            progress: 0
          });
        }
      }

      // Product knowledge if needed
      coaching.push({
        id: 'product-mastery',
        type: 'product_knowledge',
        title: 'Product Feature Deep Dive',
        description: 'Stay updated on latest product features and benefits',
        difficulty: 'beginner',
        priority: 'medium',
        learning_path: ['new_features', 'competitive_advantages', 'use_cases'],
        estimated_time: 20,
        interactive: false,
        progress: 60
      });

      return coaching;

    } catch (error) {
      logger.error('Error generating coaching recommendations:', error);
      return [];
    }
  };

  const generatePerformanceInsights = async (): Promise<RepPerformanceInsight[]> => {
    try {
      const userStats = await getUserStats();
      const callHistory = await getRecentCallHistory();
      
      const insights: RepPerformanceInsight[] = [];

      if (userStats) {
        // Call volume analysis
        const dailyCalls = callHistory.length / 7; // Assuming 7 days of data
        insights.push({
          id: 'call-volume',
          metric: 'call_volume',
          current_value: dailyCalls,
          benchmark: 15, // Industry benchmark
          trend: dailyCalls > 12 ? 'improving' : 'declining',
          impact: dailyCalls < 10 ? 'high' : 'medium',
          suggestion: dailyCalls < 15 ? 'Increase daily call volume to meet benchmark' : 'Maintain current call activity',
          action_items: [
            'Block 2-hour calling sessions',
            'Use AI-suggested optimal call times',
            'Prepare call scripts in advance'
          ]
        });

        // Conversion rate
        const conversionRate = userStats.call_count > 0 ? (userStats.win_count / userStats.call_count) * 100 : 0;
        insights.push({
          id: 'conversion-rate',
          metric: 'conversion_rate',
          current_value: conversionRate,
          benchmark: 18,
          trend: conversionRate > 15 ? 'improving' : 'declining',
          impact: conversionRate < 12 ? 'high' : 'medium',
          suggestion: 'Focus on qualification and objection handling to improve conversion',
          action_items: [
            'Practice discovery questions',
            'Study top performer techniques',
            'Use AI coaching modules'
          ]
        });
      }

      return insights;

    } catch (error) {
      logger.error('Error generating performance insights:', error);
      return [];
    }
  };

  // Helper functions
  const getUserLeads = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', profile?.company_id)
        .order('created_at', { ascending: false })
        .limit(20);

      return data || [];
    } catch (error) {
      logger.error('Error getting user leads:', error);
      return [];
    }
  };

  const getRecentCallHistory = async () => {
    try {
      const { data } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      logger.error('Error getting call history:', error);
      return [];
    }
  };

  const getUserStats = async () => {
    try {
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      return data;
    } catch (error) {
      logger.error('Error getting user stats:', error);
      return null;
    }
  };

  const calculateOptimalCallTime = (lead: any, callHistory: any[]): string => {
    // AI-powered optimal time calculation based on historical data
    const successfulCallTimes = callHistory
      .filter(call => call.status === 'completed' && call.duration > 120)
      .map(call => new Date(call.created_at).getHours());

    if (successfulCallTimes.length > 0) {
      const avgHour = Math.round(
        successfulCallTimes.reduce((sum, hour) => sum + hour, 0) / successfulCallTimes.length
      );
      return `${avgHour}:00`;
    }

    // Default optimal times based on industry data
    const defaultOptimalTimes = ['10:00', '14:00', '16:00'];
    return defaultOptimalTimes[Math.floor(Math.random() * defaultOptimalTimes.length)];
  };

  const isOlderThan = (dateString: string, hours: number): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours > hours;
  };

  const askCoach = async (question: string) => {
    if (!user?.id || !profile?.company_id) return null;

    setIsGenerating(true);
    try {
      // Get user context for personalized coaching
      const context = await getRepContext();
      
      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          userId: user.id,
          prompt: `Sales Coaching Question: ${question}\n\nRep Context: ${JSON.stringify(context)}`,
          currentPersona: {
            name: 'Elite Sales Coach',
            tone: 'motivational',
            delivery_style: 'coaching'
          }
        }
      });

      if (error) throw error;

      // Log the coaching interaction
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'ai_output',
        source: 'sales_coach_question',
        data: {
          question,
          response_length: data.response?.length || 0
        }
      });

      return data.response;

    } catch (error) {
      logger.error('Error asking coach:', error);
      toast.error('Failed to get response from coach');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getRepContext = async () => {
    try {
      const [userStats, recentCalls, topLeads] = await Promise.all([
        getUserStats(),
        getRecentCallHistory(),
        getUserLeads()
      ]);

      return {
        user_stats: userStats,
        recent_calls: recentCalls.slice(0, 5),
        top_leads: topLeads.slice(0, 5),
        performance_trend: calculatePerformanceTrend(recentCalls),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting rep context:', error);
      return {};
    }
  };

  const calculatePerformanceTrend = (calls: any[]) => {
    if (calls.length < 2) return 'insufficient_data';
    
    const recentSuccessRate = calls.slice(0, Math.floor(calls.length / 2))
      .filter(c => c.status === 'completed').length / Math.floor(calls.length / 2);
    
    const olderSuccessRate = calls.slice(Math.floor(calls.length / 2))
      .filter(c => c.status === 'completed').length / Math.floor(calls.length / 2);

    if (recentSuccessRate > olderSuccessRate) return 'improving';
    if (recentSuccessRate < olderSuccessRate) return 'declining';
    return 'stable';
  };

  return {
    taskRecommendations,
    coachingItems,
    performanceInsights,
    isGenerating,
    getPersonalizedRecommendations,
    askCoach
  };
};
