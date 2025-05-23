
import React from 'react';
import { Database, FileText, Clock } from "lucide-react";
import StatCard from './StatCard';
import { useAIBrainStats } from '@/hooks/useAIBrainStats';

const BrainStats = () => {
  const { totalDocuments, totalChunks, lastReindexed, isLoading } = useAIBrainStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Documents"
        value={totalDocuments}
        icon={<Database className="h-5 w-5" />}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Total Chunks Indexed"
        value={totalChunks}
        icon={<FileText className="h-5 w-5" />}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Last Re-indexed"
        value={lastReindexed}
        icon={<Clock className="h-5 w-5" />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BrainStats;
