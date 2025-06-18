
import { useState, useEffect } from 'react';
import { useDemoData } from '@/contexts/DemoDataContext';
import { logger } from '@/utils/logger';

export const useManagerAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [contextualInsights, setContextualInsights] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const demoData = useDemoData();

  useEffect(() => {
    try {
      if (demoData.isDemoMode) {
        // Use demo data for insights
        setInsights(demoData.aiInsights);
        setContextualInsights(demoData.aiInsights);
      }
    } catch (err) {
      logger.error('Error loading demo insights:', err);
      setError('Failed to load AI insights');
    }
  }, [demoData.isDemoMode, demoData.aiInsights]);

  const analyzeTeamPerformance = async () => {
    setIsAnalyzing(true);
    setError(null);
    
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
      logger.error('Error analyzing team performance:', error);
      setError('Failed to analyze team performance');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getContextualInsights = async (currentPath: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate contextual insights based on current page
      const pathInsights = demoData.aiInsights.filter(insight => 
        insight.type === 'performance' || insight.type === 'opportunity'
      );
      setContextualInsights(pathInsights);
    } catch (error) {
      logger.error('Error getting contextual insights:', error);
      setError('Failed to get contextual insights');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateManagerReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'Manager report generated successfully';
    } catch (error) {
      logger.error('Error generating manager report:', error);
      setError('Failed to generate report');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const askJarvis = async (question: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `AI Response to: ${question}`;
    } catch (error) {
      logger.error('Error asking Jarvis:', error);
      setError('AI temporarily unavailable');
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
    error,
    analyzeTeamPerformance,
    getContextualInsights,
    generateManagerReport,
    askJarvis,
    // Provide access to demo data with fallbacks
    calls: demoData.calls || [],
    recommendations: demoData.recommendations || [],
    teamMembers: demoData.teamMembers || [],
    aiInsights: demoData.aiInsights || []
  };
};
