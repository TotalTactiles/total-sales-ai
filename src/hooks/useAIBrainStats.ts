
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface TrendInfo {
  value: string;
  direction: 'up' | 'down' | 'neutral';
}

interface BrainStats {
  totalDocuments: number;
  totalChunks: number;
  lastReindexed: string;
  isLoading: boolean;
  trends?: {
    documents?: TrendInfo;
    chunks?: TrendInfo;
  };
}

export function useAIBrainStats() {
  const [stats, setStats] = useState<BrainStats>({
    totalDocuments: 0,
    totalChunks: 0,
    lastReindexed: 'Never',
    isLoading: true,
    trends: undefined
  });

  const fetchStats = async () => {
    try {
      // Get total documents count (counting unique source IDs)
      const { data: sourceData, error: sourceError } = await supabase
        .from('industry_knowledge')
        .select('source_id', { count: 'exact', head: true })
        .not('source_id', 'eq', null);

      if (sourceError) throw sourceError;
      const uniqueSourceCount = sourceData?.length || 0;
      
      // Get total chunks count
      const { count: chunkCount, error: chunkError } = await supabase
        .from('industry_knowledge')
        .select('*', { count: 'exact', head: true });

      if (chunkError) throw chunkError;
      
      // Get last reindex time
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('last_run')
        .eq('job_name', 'ai_brain_reindex')
        .single();

      if (jobError && jobError.code !== 'PGRST116') throw jobError;
      
      let lastReindexed = 'Never';
      if (jobData?.last_run) {
        const date = new Date(jobData.last_run);
        lastReindexed = date.toLocaleString();
      }

      // Get previous stats for trend comparison
      const { data: statsHistory } = await supabase
        .from('stats_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      // Calculate trends
      let trends;
      if (statsHistory && statsHistory.length >= 2) {
        const current = statsHistory[0];
        const previous = statsHistory[1];
        
        const documentChange = current.document_count - previous.document_count;
        const chunkChange = current.chunk_count - previous.chunk_count;
        
        trends = {
          documents: {
            value: documentChange === 0 ? 'No change' : `${documentChange > 0 ? '+' : ''}${documentChange}`,
            direction: documentChange > 0 ? 'up' : documentChange < 0 ? 'down' : 'neutral'
          },
          chunks: {
            value: chunkChange === 0 ? 'No change' : `${chunkChange > 0 ? '+' : ''}${chunkChange}`,
            direction: chunkChange > 0 ? 'up' : chunkChange < 0 ? 'down' : 'neutral'
          }
        };
      }

      setStats({
        totalDocuments: uniqueSourceCount,
        totalChunks: chunkCount || 0,
        lastReindexed,
        isLoading: false,
        trends
      });
    } catch (error) {
      console.error("Error fetching brain stats:", error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
