import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { masterAIBrain, AIRecommendation } from '@/services/masterAIBrain';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ManagerInsight {
  id: string;
  type: 'cac' | 'ltv' | 'conversion' | 'rep_performance' | 'lead_distribution' | 'automation_opportunity';
  title: string;
  description: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  suggestion?: string;
  metadata: Record<string, any>;
}

export interface AutomationSequence {
  id: string;
  name: string;
  type: 'email' | 'call' | 'sms' | 'nurture' | 'follow_up';
  triggers: string[];
  actions: Array<{
    delay: number;
    action: string;
    template?: string;
    conditions?: Record<string, any>;
  }>;
  active: boolean;
  performance: {
    triggered: number;
    completed: number;
    success_rate: number;
  };
}

export const useManagerAI = () => {
  const [contextualInsights, setContextualInsights] = useState<ManagerInsight[]>([]);
  const [automationSequences, setAutomationSequences] = useState<AutomationSequence[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, profile } = useAuth();

  const getContextualInsights = async (currentPage: string) => {
    if (!user?.id || !profile?.company_id) return;

    setIsGenerating(true);
    try {
      // Generate page-specific insights
      const insights = await generatePageInsights(currentPage);
      setContextualInsights(insights);

      // Get AI recommendations
      const aiRecommendations = await masterAIBrain.getPersonalizedRecommendations(
        user.id,
        profile.company_id,
        { page: currentPage, role: 'manager' }
      );
      setRecommendations(aiRecommendations);

      // Log interaction
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'user_action',
        source: 'manager_ai_assistant',
        data: {
          action: 'get_contextual_insights',
          page: currentPage,
          insights_count: insights.length
        }
      });

    } catch (error) {
      console.error('Error getting contextual insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePageInsights = async (page: string): Promise<ManagerInsight[]> => {
    const insights: ManagerInsight[] = [];

    switch (page) {
      case '/dashboard':
        insights.push(
          {
            id: 'cac-insight',
            type: 'cac',
            title: 'Customer Acquisition Cost',
            description: 'CAC decreased by 15% this month through optimized lead routing',
            value: '$142',
            trend: 'down',
            impact: 'high',
            actionable: true,
            suggestion: 'Continue current lead routing strategy and expand to new channels',
            metadata: { previous_value: '$167', improvement: '15%' }
          },
          {
            id: 'ltv-insight',
            type: 'ltv',
            title: 'Customer Lifetime Value',
            description: 'LTV increased due to improved retention from AI coaching',
            value: '$2,840',
            trend: 'up',
            impact: 'high',
            actionable: false,
            metadata: { previous_value: '$2,650', improvement: '7.2%' }
          },
          {
            id: 'conversion-insight',
            type: 'conversion',
            title: 'Lead to Customer Conversion',
            description: 'Conversion rate improved across all channels',
            value: '23.4%',
            trend: 'up',
            impact: 'medium',
            actionable: true,
            suggestion: 'Scale successful tactics to underperforming segments',
            metadata: { previous_rate: '21.1%', improvement: '2.3%' }
          }
        );
        break;

      case '/analytics':
        insights.push(
          {
            id: 'rep-performance',
            type: 'rep_performance',
            title: 'Top Performer Analysis',
            description: 'Sarah Johnson outperforming by 34% - analyze and replicate methods',
            value: '134%',
            trend: 'up',
            impact: 'high',
            actionable: true,
            suggestion: 'Schedule knowledge transfer session with underperformers',
            metadata: { rep_name: 'Sarah Johnson', methods: ['early_morning_calls', 'roi_focused_messaging'] }
          },
          {
            id: 'automation-opportunity',
            type: 'automation_opportunity',
            title: 'Automation Opportunity',
            description: '67% of follow-up emails could be automated',
            value: '67%',
            trend: 'stable',
            impact: 'medium',
            actionable: true,
            suggestion: 'Implement AI-driven follow-up sequences',
            metadata: { potential_time_saved: '8.5 hours/week' }
          }
        );
        break;

      case '/lead-management':
        insights.push(
          {
            id: 'lead-distribution',
            type: 'lead_distribution',
            title: 'Lead Distribution Optimization',
            description: 'AI suggests redistributing leads based on rep specializations',
            value: '+18%',
            trend: 'up',
            impact: 'high',
            actionable: true,
            suggestion: 'Implement skill-based lead routing',
            metadata: { 
              current_conversion: '23.4%',
              projected_conversion: '27.6%',
              optimization_areas: ['enterprise_leads', 'technical_products']
            }
          }
        );
        break;
    }

    return insights;
  };

  const generateManagerReport = async () => {
    if (!user?.id || !profile?.company_id) return null;

    setIsGenerating(true);
    try {
      // Gather comprehensive data for report generation
      const reportData = await gatherReportData();
      
      // Use AI to generate executive summary
      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          userId: user.id,
          prompt: `Generate an executive summary report based on this data: ${JSON.stringify(reportData)}. 
                   Focus on key metrics, trends, recommendations, and strategic insights for a CEO/Manager.`,
          currentPersona: {
            name: 'Executive AI Assistant',
            tone: 'professional',
            delivery_style: 'executive'
          }
        }
      });

      if (error) throw error;

      // Log the report generation
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'ai_output',
        source: 'manager_report_generation',
        data: {
          report_type: 'executive_summary',
          data_points: Object.keys(reportData).length
        }
      });

      toast.success('Executive report generated successfully');
      return data.response;

    } catch (error) {
      console.error('Error generating manager report:', error);
      toast.error('Failed to generate report');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const gatherReportData = async () => {
    try {
      // Gather data from multiple sources
      const [leadsData, callsData, analyticsData] = await Promise.all([
        supabase.from('leads').select('*').eq('company_id', profile?.company_id),
        supabase.from('call_logs').select('*').eq('company_id', profile?.company_id),
        supabase.from('usage_events').select('*').eq('company_id', profile?.company_id)
      ]);

      return {
        leads: leadsData.data || [],
        calls: callsData.data || [],
        analytics: analyticsData.data || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error gathering report data:', error);
      return {};
    }
  };

  const createAutomationSequence = async (sequenceData: Partial<AutomationSequence>) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      const newSequence: AutomationSequence = {
        id: crypto.randomUUID(),
        name: sequenceData.name || 'New Automation',
        type: sequenceData.type || 'email',
        triggers: sequenceData.triggers || [],
        actions: sequenceData.actions || [],
        active: false,
        performance: {
          triggered: 0,
          completed: 0,
          success_rate: 0
        }
      };

      // Store automation sequence - properly serialize as JSON
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: profile.company_id,
          type: 'automation_sequence',
          event_summary: `Created automation: ${newSequence.name}`,
          payload: newSequence as any, // Cast to any for JSON compatibility
          visibility: 'company'
        });

      if (error) throw error;

      setAutomationSequences(prev => [...prev, newSequence]);
      
      // Log creation
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'user_action',
        source: 'automation_creation',
        data: {
          sequence_type: newSequence.type,
          triggers_count: newSequence.triggers.length,
          actions_count: newSequence.actions.length
        }
      });

      toast.success('Automation sequence created successfully');
      return newSequence;

    } catch (error) {
      console.error('Error creating automation sequence:', error);
      toast.error('Failed to create automation sequence');
      return null;
    }
  };

  const askJarvis = async (question: string) => {
    if (!user?.id || !profile?.company_id) return null;

    setIsGenerating(true);
    try {
      // Get contextual data for better responses
      const context = await getManagerContext();
      
      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          userId: user.id,
          prompt: `Manager Question: ${question}\n\nContext: ${JSON.stringify(context)}`,
          currentPersona: {
            name: 'Jarvis - Executive AI Assistant',
            tone: 'professional',
            delivery_style: 'executive_consultant'
          }
        }
      });

      if (error) throw error;

      // Log the interaction
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'ai_output',
        source: 'jarvis_question',
        data: {
          question,
          response_length: data.response?.length || 0
        }
      });

      return data.response;

    } catch (error) {
      console.error('Error asking Jarvis:', error);
      toast.error('Failed to get response from Jarvis');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getManagerContext = async () => {
    try {
      const [teamStats, recentInsights, companyMetrics] = await Promise.all([
        getTeamPerformanceStats(),
        getRecentAIInsights(),
        getCompanyMetrics()
      ]);

      return {
        team_stats: teamStats,
        recent_insights: recentInsights,
        company_metrics: companyMetrics,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting manager context:', error);
      return {};
    }
  };

  const getTeamPerformanceStats = async () => {
    try {
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .limit(10);

      return data || [];
    } catch (error) {
      console.error('Error getting team stats:', error);
      return [];
    }
  };

  const getRecentAIInsights = async () => {
    try {
      const { data } = await supabase
        .from('ai_brain_insights')
        .select('*')
        .eq('company_id', profile?.company_id)
        .order('timestamp', { ascending: false })
        .limit(5);

      return data || [];
    } catch (error) {
      console.error('Error getting recent insights:', error);
      return [];
    }
  };

  const getCompanyMetrics = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('status, priority, score')
        .eq('company_id', profile?.company_id);

      const metrics = {
        total_leads: data?.length || 0,
        high_priority: data?.filter(l => l.priority === 'high').length || 0,
        avg_score: data?.reduce((sum, l) => sum + (l.score || 0), 0) / (data?.length || 1)
      };

      return metrics;
    } catch (error) {
      console.error('Error getting company metrics:', error);
      return {};
    }
  };

  return {
    contextualInsights,
    automationSequences,
    recommendations,
    isGenerating,
    getContextualInsights,
    generateManagerReport,
    createAutomationSequence,
    askJarvis
  };
};
