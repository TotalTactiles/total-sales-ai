
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  isDemoMode, 
  mockManagerTeamMembers, 
  mockManagerRecommendations, 
  mockManagerAIInsights,
  mockManagerLeads,
  mockBusinessOpsData
} from '@/data/demo.mock.data';
import { logger } from '@/utils/logger';

export const useManagerDemoData = () => {
  const { user, profile } = useAuth();
  const [isDemo, setIsDemo] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [aiInsights, setAIInsights] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [businessOpsData, setBusinessOpsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDemoData = () => {
      console.log('🎭 useManagerDemoData: Initializing demo data', { 
        isDemoMode, 
        userRole: profile?.role,
        userEmail: user?.email 
      });

      if (isDemoMode || profile?.role === 'manager') {
        setIsDemo(true);
        setTeamMembers(mockManagerTeamMembers);
        setRecommendations(mockManagerRecommendations);
        setAIInsights(mockManagerAIInsights);
        setLeads(mockManagerLeads);
        setBusinessOpsData(mockBusinessOpsData);
        
        console.log('✅ Manager demo data loaded:', {
          teamMembers: mockManagerTeamMembers.length,
          recommendations: mockManagerRecommendations.length,
          insights: mockManagerAIInsights.length,
          leads: mockManagerLeads.length
        });
      } else {
        setIsDemo(false);
        // In production, would fetch real data here
        setTeamMembers([]);
        setRecommendations([]);
        setAIInsights([]);
        setLeads([]);
        setBusinessOpsData(null);
      }
      
      setLoading(false);
    };

    initializeDemoData();
  }, [user, profile]);

  // Mock AI functions for demo
  const mockAIFunctions = {
    generateTeamSummary: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return "Your team is performing exceptionally well this quarter. Sarah and Jasmine are leading in conversions, while Michael may need additional support. Overall revenue is up 15% from last month.";
    },
    
    analyzeTeamRisks: async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return {
        highRisk: ['Michael Chen'],
        mediumRisk: ['Alex Rodriguez'], 
        recommendations: [
          'Schedule 1-on-1 with Michael to address burnout indicators',
          'Provide additional training resources for Alex',
          'Consider workload redistribution'
        ]
      };
    },
    
    getOptimizationSuggestions: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        'Focus on enterprise deals - they have 67% higher close rates',
        'Increase email sequence frequency for warm leads',
        'Implement team buddy system for knowledge sharing'
      ];
    },
    
    generateReport: async (reportType: string) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        type: reportType,
        generatedAt: new Date().toISOString(),
        summary: `${reportType} report generated successfully with current team metrics and performance indicators.`,
        downloadUrl: '#mock-download-url'
      };
    }
  };

  return {
    isDemo,
    loading,
    teamMembers,
    recommendations,
    aiInsights,
    leads,
    businessOpsData,
    mockAIFunctions,
    // Computed metrics for dashboard
    teamMetrics: {
      totalReps: teamMembers.length,
      totalCalls: teamMembers.reduce((sum, member) => sum + (member.stats?.call_count || 0), 0),
      totalWins: teamMembers.reduce((sum, member) => sum + (member.stats?.win_count || 0), 0),
      totalRevenue: teamMembers.reduce((sum, member) => sum + (member.stats?.revenue_generated || 0), 0),
      averageConversion: teamMembers.length > 0 
        ? Math.round(teamMembers.reduce((sum, member) => sum + (member.stats?.conversion_rate || 0), 0) / teamMembers.length * 10) / 10
        : 0,
      averageMood: teamMembers.length > 0 
        ? Math.round(teamMembers.reduce((sum, member) => sum + (member.stats?.mood_score || 0), 0) / teamMembers.length)
        : 0,
      highRiskCount: teamMembers.filter(member => (member.stats?.burnout_risk || 0) > 60).length
    }
  };
};
