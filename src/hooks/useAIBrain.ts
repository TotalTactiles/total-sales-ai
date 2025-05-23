
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeIngest } from './useKnowledgeIngest';
import { useKnowledgeQuery, KnowledgeResult } from './useKnowledgeQuery';
import { useKnowledgeManagement } from './useKnowledgeManagement';
import { useKnowledgeReindex } from './useKnowledgeReindex';

// Re-export interfaces used by consumers
export interface IngestParams {
  companyId?: string;
  industry: string;
  sourceType: string;
  sourceId: string;
  text: string;
}

export interface IngestResponse {
  success: boolean;
  message: string;
  chunks_total: number;
  chunks_success: number;
}

export interface QueryParams {
  companyId?: string;
  industry: string;
  query: string;
  topK?: number;
}

export interface ReindexResponse {
  success: boolean;
  recordsProcessed: number;
  error?: string;
}

export type { KnowledgeResult };

export function useAIBrain() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Import functionality from the specialized hooks
  const { 
    ingestKnowledge: ingestKnowledgeImpl,
    crawlWebContent: crawlWebContentImpl,
    isIngesting,
    error: ingestError
  } = useKnowledgeIngest();

  const { 
    queryKnowledge: queryKnowledgeImpl, 
    isQuerying, 
    error: queryError 
  } = useKnowledgeQuery();

  const { 
    deleteKnowledgeEntry: deleteKnowledgeEntryImpl, 
    markAsCaseStudy: markAsCaseStudyImpl,
    error: managementError 
  } = useKnowledgeManagement();

  const { 
    reindexKnowledge: reindexKnowledgeImpl, 
    isReindexing, 
    error: reindexError 
  } = useKnowledgeReindex();

  // Update the error state whenever any of the specialized hooks report an error
  useState(() => {
    const currentError = ingestError || queryError || managementError || reindexError;
    if (currentError !== error) {
      setError(currentError);
    }
  });

  // Wrapper functions that pass the user object
  const ingestKnowledge = async (params: IngestParams) => 
    ingestKnowledgeImpl(user, params);

  const queryKnowledge = async (params: QueryParams) => 
    queryKnowledgeImpl(user, params);

  const reindexKnowledge = async () => 
    reindexKnowledgeImpl(user);

  const crawlWebContent = async (url: string, industry: string, sourceType: string) => 
    crawlWebContentImpl(user, url, industry, sourceType);

  const deleteKnowledgeEntry = async (id: string) => 
    deleteKnowledgeEntryImpl(user, id);

  const markAsCaseStudy = async (id: string, metadata?: Record<string, any>) => 
    markAsCaseStudyImpl(user, id, metadata);

  // Return the combined API
  return {
    ingestKnowledge,
    queryKnowledge,
    reindexKnowledge,
    crawlWebContent,
    deleteKnowledgeEntry,
    markAsCaseStudy,
    isIngesting,
    isQuerying,
    isReindexing,
    error
  };
}
