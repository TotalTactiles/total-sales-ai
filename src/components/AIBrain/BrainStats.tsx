
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database, FileText, Clock } from "lucide-react";

const BrainStats = () => {
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [lastReindexed, setLastReindexed] = useState<string>('Never');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      // Get total documents count (counting unique source IDs)
      const { data: sourceData, error: sourceError } = await supabase
        .from('industry_knowledge')
        .select('source_id', { count: 'exact', head: true })
        .not('source_id', 'eq', null);

      if (sourceError) throw sourceError;
      // Fix: Using the count directly from the response, not from data
      const uniqueSourceCount = sourceData?.length || 0;
      setTotalDocuments(uniqueSourceCount);

      // Get total chunks count
      const { count: chunkCount, error: chunkError } = await supabase
        .from('industry_knowledge')
        .select('*', { count: 'exact', head: true });

      if (chunkError) throw chunkError;
      setTotalChunks(chunkCount || 0);

      // Get last reindex time
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('last_run')
        .eq('job_name', 'ai_brain_reindex')
        .single();

      if (jobError && jobError.code !== 'PGRST116') throw jobError;
      
      if (jobData?.last_run) {
        const date = new Date(jobData.last_run);
        setLastReindexed(date.toLocaleString());
      }
    } catch (error) {
      console.error("Error fetching brain stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="flex items-center p-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Database className="h-5 w-5 mr-2" />
          )}
          <div>
            <p className="text-sm font-medium">Total Documents</p>
            <p className="text-2xl font-bold">{totalDocuments}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <FileText className="h-5 w-5 mr-2" />
          )}
          <div>
            <p className="text-sm font-medium">Total Chunks Indexed</p>
            <p className="text-2xl font-bold">{totalChunks}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Clock className="h-5 w-5 mr-2" />
          )}
          <div>
            <p className="text-sm font-medium">Last Re-indexed</p>
            <p className="text-lg font-medium">{lastReindexed}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrainStats;
