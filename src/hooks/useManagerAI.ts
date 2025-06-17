
import { useState, useEffect } from 'react';
import { useDemoData } from '@/contexts/DemoDataContext';

export const useManagerAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [contextualInsights, setContextualInsights] = useState<any[]>([]);
  const demoData = useDemoData();

  useEffect(() => {
    if (demoData.isDemoMode) {
      // Use demo data for insights
      setInsights(demoData.aiInsights);
      setContextualInsights(demoData.aiInsights);
    }
  }, [demoData.isDemoMode, demoData.aiInsights]);

  const analyzeTeamPerformance = async () => {
    setIsAnalyzing(true);
    
    try {
      // In demo mode, return mock insights
      if (demoData.isDemoMode) {
        setTimeout(() => {
          setInsights(demoData.aiInsights);
          setIsAnalyzing(false);
        }, 1000);
        return;
      }

      // Real implementation would go here
      setInsights([]);
    } catch (error) {
      console.error('Error analyzing team performance:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getContextualInsights = async (currentPath: string) => {
    setIsGenerating(true);
    
    try {
      // Generate contextual insights based on current page
      const pathInsights = demoData.aiInsights.filter(insight => 
        insight.type === 'performance' || insight.type === 'opportunity'
      );
      setContextualInsights(pathInsights);
    } catch (error) {
      console.error('Error getting contextual insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateManagerReport = async () => {
    setIsGenerating(true);
    
    try {
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'Manager report generated successfully';
    } catch (error) {
      console.error('Error generating manager report:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const askJarvis = async (question: string) => {
    setIsGenerating(true);
    
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `AI Response to: ${question}`;
    } catch (error) {
      console.error('Error asking Jarvis:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isAnalyzing,
    isGenerating,
    insights,
    contextualInsights,
    analyzeTeamPerformance,
    getContextualInsights,
    generateManagerReport,
    askJarvis,
    // Provide access to demo data
    calls: demoData.calls,
    recommendations: demoData.recommendations,
    teamMembers: demoData.teamMembers,
    aiInsights: demoData.aiInsights
  };
};
