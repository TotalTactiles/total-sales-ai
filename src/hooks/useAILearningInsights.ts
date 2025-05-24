
import { useState, useEffect } from 'react';
import { useEnhancedUsageTracking } from './useEnhancedUsageTracking';
import { useAuth } from '@/contexts/AuthContext';

interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'recommendation' | 'trend';
  category: string;
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  contentSuggestions?: string[];
}

interface LearningPattern {
  skillArea: string;
  successRate: number;
  timeSpent: number;
  strugglingTopics: string[];
  preferredContentTypes: string[];
  optimalLearningTimes: string[];
}

export const useAILearningInsights = () => {
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { generatePersonalizedInsights, logAILearningData } = useEnhancedUsageTracking();
  const { profile } = useAuth();

  // Generate AI-powered learning insights
  const analyzeUserLearning = async () => {
    if (!profile) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis of user learning patterns
      const analysisResults = await generateLearningAnalysis();
      setInsights(analysisResults.insights);
      setPatterns(analysisResults.patterns);
      
      // Log the insights for further AI learning
      await logAILearningData({
        userBehavior: {
          frequentlyUsedFeatures: ['objection_scripts', 'product_info', 'call_recordings'],
          strugglingAreas: ['price_objections', 'enterprise_discovery'],
          successPatterns: ['morning_learning', 'video_content_preference'],
          timeOfDayPerformance: { morning: 85, afternoon: 67, evening: 45 }
        },
        industryInsights: {
          commonObjections: ['price', 'timing', 'decision_authority'],
          successfulScripts: ['value_stacking', 'roi_calculator', 'social_proof'],
          optimalTiming: ['10_11_am', 'tuesday_wednesday', 'first_week_month']
        },
        personalizedRecommendations: analysisResults.recommendations
      });
      
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateLearningAnalysis = async () => {
    // Simulate AI analysis - in reality this would process actual usage data
    const mockInsights: LearningInsight[] = [
      {
        id: '1',
        type: 'weakness',
        category: 'objection_handling',
        title: 'Price Objection Opportunity',
        description: 'You struggle with price objections, converting only 45% vs team average of 67%. Focus on value stacking techniques.',
        confidence: 92,
        priority: 'high',
        actionable: true,
        contentSuggestions: ['alex_hormozi_value_stacking', 'roi_calculator_training', 'price_psychology_basics']
      },
      {
        id: '2',
        type: 'strength',
        category: 'prospecting',
        title: 'Cold Calling Excellence',
        description: 'Your cold call connect rate is 23% above average. Your opening scripts are highly effective.',
        confidence: 89,
        priority: 'low',
        actionable: false
      },
      {
        id: '3',
        type: 'recommendation',
        category: 'learning_optimization',
        title: 'Morning Learning Boost',
        description: 'You retain 34% more information during 9-11 AM sessions. Schedule key learning during this window.',
        confidence: 78,
        priority: 'medium',
        actionable: true,
        contentSuggestions: ['schedule_morning_blocks', 'focus_techniques']
      },
      {
        id: '4',
        type: 'trend',
        category: 'industry_benchmark',
        title: 'Industry Content Gap',
        description: 'Construction industry reps using our enterprise discovery framework see 41% higher close rates.',
        confidence: 95,
        priority: 'high',
        actionable: true,
        contentSuggestions: ['enterprise_discovery_advanced', 'construction_case_studies']
      }
    ];

    const mockPatterns: LearningPattern[] = [
      {
        skillArea: 'objection_handling',
        successRate: 45,
        timeSpent: 12,
        strugglingTopics: ['price_objections', 'timeline_pushback'],
        preferredContentTypes: ['video', 'interactive'],
        optimalLearningTimes: ['9_10_am', 'tuesday', 'wednesday']
      },
      {
        skillArea: 'prospecting',
        successRate: 87,
        timeSpent: 23,
        strugglingTopics: [],
        preferredContentTypes: ['scripts', 'recordings'],
        optimalLearningTimes: ['morning', 'midweek']
      }
    ];

    const recommendations = [
      'Focus next 2 weeks on price objection handling - complete Alex Hormozi value stacking series',
      'Leverage your cold calling strength by mentoring newer reps - builds confidence',
      'Schedule learning sessions between 9-11 AM for optimal retention',
      'Review enterprise discovery framework - high ROI for your industry focus'
    ];

    return {
      insights: mockInsights,
      patterns: mockPatterns,
      recommendations
    };
  };

  // Auto-generate insights when component mounts
  useEffect(() => {
    if (profile?.role === 'sales_rep') {
      analyzeUserLearning();
    }
  }, [profile]);

  const getInsightsByCategory = (category: string) => {
    return insights.filter(insight => insight.category === category);
  };

  const getHighPriorityInsights = () => {
    return insights.filter(insight => 
      insight.priority === 'high' || insight.priority === 'critical'
    );
  };

  const getActionableInsights = () => {
    return insights.filter(insight => insight.actionable);
  };

  const markInsightAsActioned = (insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
  };

  return {
    insights,
    patterns,
    isAnalyzing,
    analyzeUserLearning,
    getInsightsByCategory,
    getHighPriorityInsights,
    getActionableInsights,
    markInsightAsActioned
  };
};
