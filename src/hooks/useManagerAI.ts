
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  metric?: string;
  change?: number;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface ManagerReport {
  id: string;
  type: string;
  title: string;
  content: string;
  generatedAt: string;
  insights: Insight[];
}

export const useManagerAI = () => {
  const [contextualInsights, setContextualInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<ManagerReport | null>(null);
  const { user, profile } = useAuth();

  const generateMockInsights = (page: string): Insight[] => {
    const baseInsights: Record<string, Insight[]> = {
      '/manager-dashboard': [
        {
          id: '1',
          type: 'success',
          title: 'Team Performance Up',
          description: 'Your team exceeded targets by 23% this week. Sarah and Michael are leading the charge.',
          metric: '23% above target',
          change: 23,
          action: 'Send Recognition',
          priority: 'medium'
        },
        {
          id: '2',
          type: 'warning',
          title: 'Burnout Risk Detected',
          description: 'Alex has worked 52 hours this week. Consider redistributing workload.',
          action: 'Schedule 1-on-1',
          priority: 'high'
        }
      ],
      '/analytics': [
        {
          id: '3',
          type: 'info',
          title: 'Conversion Trends',
          description: 'Email campaigns show 34% higher engagement on Tuesday mornings.',
          metric: '34% higher engagement',
          change: 34,
          action: 'Optimize Scheduling',
          priority: 'medium'
        },
        {
          id: '4',
          type: 'success',
          title: 'Pipeline Health',
          description: 'Q4 pipeline is 127% of target with strong momentum in enterprise segment.',
          metric: '127% of target',
          change: 27,
          priority: 'low'
        }
      ],
      '/leads': [
        {
          id: '5',
          type: 'warning',
          title: 'Lead Response Time',
          description: 'Average response time increased to 4.2 hours. Quick action needed.',
          metric: '4.2 hour average',
          change: -15,
          action: 'Reassign Hot Leads',
          priority: 'high'
        }
      ],
      '/company-brain': [
        {
          id: '6',
          type: 'info',
          title: 'Knowledge Gap Detected',
          description: 'Team questions indicate need for updated competitor comparison content.',
          action: 'Add Content',
          priority: 'medium'
        }
      ]
    };

    return baseInsights[page] || [];
  };

  const getContextualInsights = useCallback(async (currentPage: string) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const insights = generateMockInsights(currentPage);
    setContextualInsights(insights);
    setIsGenerating(false);
  }, []);

  const generateManagerReport = useCallback(async (reportType: string) => {
    if (!user?.id) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const reportContent = {
        weekly_report: {
          title: 'Weekly Team Performance Report',
          content: `Team delivered exceptional results this week:\n\n• Total calls: 847 (+12%)\n• Conversion rate: 23.4% (+3.2%)\n• Revenue: $156,000 (+8%)\n\nTop performers: Sarah Johnson (34 closes), Michael Chen (28 closes)\n\nAreas for improvement: Lead response time averaging 3.8 hours`
        },
        team_health: {
          title: 'Team Health Assessment',
          content: `Overall team health: GOOD\n\n• Burnout risk: 2 team members (Alex, David)\n• Morale score: 8.2/10\n• Workload distribution: Uneven\n\nRecommendations:\n• Redistribute 15% of Alex's leads\n• Schedule wellness check-ins\n• Consider additional team member`
        },
        revenue_forecast: {
          title: 'Revenue Forecast Analysis',
          content: `Q4 Revenue Projection: $2.3M (127% of target)\n\nPipeline breakdown:\n• Enterprise: $1.4M (strong momentum)\n• Mid-market: $650K (on track)\n• SMB: $250K (needs attention)\n\nRisk factors: Holiday slowdown, budget freezes\nOpportunities: Year-end procurement push`
        },
        risk_assessment: {
          title: 'Risk Assessment Report',
          content: `Current risks identified:\n\nHIGH:\n• Team capacity at 94% - burnout risk\n• Lead response time trending up\n\nMEDIUM:\n• Pipeline concentration in Q4\n• Dependency on top 2 performers\n\nLOW:\n• Seasonal market changes\n• Competitor activity normal`
        }
      };

      const report: ManagerReport = {
        id: Date.now().toString(),
        type: reportType,
        title: reportContent[reportType as keyof typeof reportContent]?.title || 'Manager Report',
        content: reportContent[reportType as keyof typeof reportContent]?.content || 'Report content generated.',
        generatedAt: new Date().toISOString(),
        insights: generateMockInsights('/manager-dashboard')
      };

      setCurrentReport(report);
      toast.success('Report generated successfully!');
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id]);

  const askJarvis = useCallback(async (question: string) => {
    if (!user?.id) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate contextual response based on question
      const responses = {
        'close rate': 'Your team\'s close rate this month is 23.4%, up 3.2% from last month. Sarah leads at 31% while Alex needs coaching at 18%.',
        'lead sources': 'LinkedIn generates highest quality leads (28% close rate), followed by referrals (24%). Web forms underperforming at 12%.',
        'coaching': 'Alex and David show declining metrics. Alex needs objection handling practice, David requires confidence building.',
        'pipeline': 'Pipeline health is strong at 127% of target. Enterprise segment performing exceptionally well.',
        'conversion': 'Improve conversion by: 1) Faster lead response (target <2hrs), 2) Better qualification, 3) Scheduled follow-ups'
      };
      
      const defaultResponse = 'Based on current data, I recommend focusing on lead response time optimization and team capacity planning for sustainable growth.';
      
      const responseKey = Object.keys(responses).find(key => 
        question.toLowerCase().includes(key)
      );
      
      const response = responseKey ? responses[responseKey as keyof typeof responses] : defaultResponse;
      
      const insight: Insight = {
        id: Date.now().toString(),
        type: 'info',
        title: 'Jarvis Response',
        description: response,
        priority: 'medium'
      };
      
      setContextualInsights(prev => [insight, ...prev]);
      toast.success('Question answered!');
      
    } catch (error) {
      console.error('Error asking Jarvis:', error);
      toast.error('Failed to get response from Jarvis');
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id]);

  return {
    contextualInsights,
    isGenerating,
    currentReport,
    getContextualInsights,
    generateManagerReport,
    askJarvis
  };
};
