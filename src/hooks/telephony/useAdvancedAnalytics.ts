
import { useState, useEffect } from 'react';
import { 
  AdvancedAnalyticsService,
  CallAnalytics,
  SMSAnalytics,
  RepPerformance
} from '@/services/telephony/advancedAnalyticsService';
import { useAuth } from '@/contexts/AuthContext';

export const useAdvancedAnalytics = (
  startDate: string,
  endDate: string,
  repId?: string
) => {
  const [callAnalytics, setCallAnalytics] = useState<CallAnalytics | null>(null);
  const [smsAnalytics, setSmsAnalytics] = useState<SMSAnalytics | null>(null);
  const [repPerformance, setRepPerformance] = useState<RepPerformance[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.company_id && startDate && endDate) {
      fetchAnalytics();
    }
  }, [profile?.company_id, startDate, endDate, repId]);

  const fetchAnalytics = async () => {
    if (!profile?.company_id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [callData, smsData, repData, insightsData] = await Promise.all([
        AdvancedAnalyticsService.getCallAnalytics(profile.company_id, startDate, endDate, repId),
        AdvancedAnalyticsService.getSMSAnalytics(profile.company_id, startDate, endDate, repId),
        AdvancedAnalyticsService.getRepPerformance(profile.company_id, startDate, endDate),
        AdvancedAnalyticsService.generateInsights(profile.company_id, startDate, endDate)
      ]);

      setCallAnalytics(callData);
      setSmsAnalytics(smsData);
      setRepPerformance(repData);
      setInsights(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  return {
    callAnalytics,
    smsAnalytics,
    repPerformance,
    insights,
    isLoading,
    error,
    refreshAnalytics
  };
};
