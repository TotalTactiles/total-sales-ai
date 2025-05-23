
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AIBrainReindex: React.FC = () => {
  const [isReindexing, setIsReindexing] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [recordsProcessed, setRecordsProcessed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch the last reindex job information
  const fetchLastRunInfo = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('last_run, metadata, status')
        .eq('job_name', 'ai_brain_reindex')
        .single();

      if (error) throw error;
      
      if (data) {
        setLastRun(data.last_run);
        
        // Check if metadata exists and is an object before accessing records_processed
        if (data.metadata && typeof data.metadata === 'object' && data.metadata !== null) {
          // Using type assertion to tell TypeScript that metadata has the records_processed property
          const metadata = data.metadata as { records_processed?: number };
          setRecordsProcessed(metadata.records_processed || 0);
        } else {
          setRecordsProcessed(0);
        }
      }
    } catch (err: any) {
      console.error("Error fetching reindex job info:", err);
    }
  };

  // Run the reindex job on-demand
  const handleReindex = async () => {
    if (!user?.id) {
      setError("User must be authenticated to reindex data");
      toast.error("Authentication required to use AI Brain");
      return;
    }

    setIsReindexing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-brain-reindex');

      if (error) {
        console.error("Error reindexing AI Brain data:", error);
        setError(error.message || "Error reindexing data");
        toast.error("Failed to reindex AI Brain data");
        return;
      }

      if (data.success) {
        toast.success(`Successfully reindexed ${data.recordsProcessed} records`);
        setRecordsProcessed(data.recordsProcessed);
        
        // Update the last run time
        const now = new Date().toISOString();
        setLastRun(now);
      } else {
        setError(data.error || "Unknown error during reindexing");
        toast.error("Reindexing failed");
      }
      
    } catch (err: any) {
      console.error("Exception when reindexing AI Brain data:", err);
      setError(err.message || "Unknown error occurred");
      toast.error("Failed to reindex data");
    } finally {
      setIsReindexing(false);
    }
  };

  // Load job data when component mounts
  React.useEffect(() => {
    fetchLastRunInfo();
  }, [user]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Brain - Re-index Knowledge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <p>Re-indexing ensures that all knowledge is properly vectorized and searchable. It's automatically run daily, but you can also trigger it manually.</p>
            
            {lastRun && (
              <div className="mt-2 p-2 bg-secondary/50 rounded">
                <p><strong>Last run:</strong> {new Date(lastRun).toLocaleString()}</p>
                {recordsProcessed !== null && <p><strong>Records processed:</strong> {recordsProcessed}</p>}
              </div>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleReindex} 
            disabled={isReindexing}
            className="w-full"
          >
            {isReindexing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Re-indexing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Re-index Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIBrainReindex;
