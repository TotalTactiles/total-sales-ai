
import { useState, useEffect } from 'react';
import { useDemoData } from '@/contexts/DemoDataContext';

export const useManagerAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const demoData = useDemoData();

  useEffect(() => {
    if (demoData.isDemoMode) {
      // Use demo data for insights
      setInsights(demoData.aiInsights);
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

  return {
    isAnalyzing,
    insights,
    analyzeTeamPerformance,
    // Provide access to demo data
    calls: demoData.calls,
    recommendations: demoData.recommendations,
    teamMembers: demoData.teamMembers,
    aiInsights: demoData.aiInsights
  };
};
