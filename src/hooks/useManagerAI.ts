
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface AIInsight {
  id: string;
  type: 'alert' | 'insight' | 'recommendation';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  assistantType: 'dashboard' | 'business-ops' | 'team' | 'leads' | 'company-brain';
  actionRequired?: boolean;
}

export const useManagerAI = () => {
  const { profile } = useAuth();
  const [contextualInsights, setContextualInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const getContextualInsights = useCallback(async (currentPage: string) => {
    if (profile?.role !== 'manager' && profile?.role !== 'admin') {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate contextual insights based on current page
      const insights = generateMockInsights(currentPage);
      setContextualInsights(insights);
    } catch (error) {
      console.error('Failed to generate contextual insights:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [profile]);

  const generateManagerReport = useCallback(async (reportType: string) => {
    setIsGenerating(true);
    
    try {
      // This would call the appropriate AI endpoint for report generation
      const response = await fetch('/functions/v1/ai-manager-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Generate ${reportType} report`,
          context: {
            reportType,
            timestamp: new Date().toISOString(),
            userId: profile?.id
          }
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate manager report:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [profile]);

  const askJarvis = useCallback(async (question: string, context: any = {}) => {
    try {
      const response = await fetch('/functions/v1/ai-manager-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: question,
          context: {
            ...context,
            timestamp: new Date().toISOString(),
            userId: profile?.id
          }
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to ask Jarvis:', error);
      throw error;
    }
  }, [profile]);

  return {
    contextualInsights,
    isGenerating,
    getContextualInsights,
    generateManagerReport,
    askJarvis
  };
};

// Helper function to generate mock insights based on current page
function generateMockInsights(currentPage: string): AIInsight[] {
  const now = new Date().toISOString();
  
  const insightsByPage = {
    '/manager/dashboard': [
      {
        id: '1',
        type: 'alert' as const,
        title: 'Team Performance Alert',
        message: '2 team members are below 70% quota achievement. Immediate coaching recommended.',
        priority: 'high' as const,
        timestamp: now,
        assistantType: 'team' as const,
        actionRequired: true
      },
      {
        id: '2',
        type: 'insight' as const,
        title: 'Revenue Trend',
        message: 'Monthly revenue is trending 15% above forecast. Consider scaling successful campaigns.',
        priority: 'medium' as const,
        timestamp: now,
        assistantType: 'business-ops' as const
      }
    ],
    '/manager/business-ops': [
      {
        id: '3',
        type: 'recommendation' as const,
        title: 'ROAS Optimization',
        message: 'Shifting 20% of ad spend to high-performing channels could increase ROAS by 15%.',
        priority: 'medium' as const,
        timestamp: now,
        assistantType: 'business-ops' as const
      }
    ],
    '/manager/team': [
      {
        id: '4',
        type: 'recommendation' as const,
        title: 'Reward Opportunity',
        message: 'Sarah Johnson qualifies for top performer recognition. Consider public acknowledgment.',
        priority: 'low' as const,
        timestamp: now,
        assistantType: 'team' as const
      }
    ],
    '/manager/leads': [
      {
        id: '5',
        type: 'alert' as const,
        title: 'Stalled Lead Batch',
        message: '12 high-value leads have been stalled for 7+ days. Immediate follow-up required.',
        priority: 'high' as const,
        timestamp: now,
        assistantType: 'leads' as const,
        actionRequired: true
      }
    ]
  };

  return insightsByPage[currentPage as keyof typeof insightsByPage] || [];
}
