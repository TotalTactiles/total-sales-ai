
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CaseStudy } from './types';

// Simple logger for client-side
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

export function useCaseStudies(
  industryFilter: string,
  dateFilter: string,
  sourceFilter: string
) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [industries, setIndustries] = useState<string[]>([]);

  // Fetch case studies
  const fetchCaseStudies = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('industry_knowledge')
        .select('*')
        .eq('source_type', 'case-study');
      
      // Apply industry filter if selected
      if (industryFilter !== 'all') {
        query = query.eq('industry', industryFilter);
      }
      
      // Apply date filter
      if (dateFilter === 'recent') {
        // Last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('created_at', thirtyDaysAgo.toISOString());
      }
      
      // Apply source filter
      if (sourceFilter === 'company') {
        query = query.not('company_id', 'is', null);
      } else if (sourceFilter === 'industry') {
        query = query.is('company_id', null);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setCaseStudies(data as CaseStudy[]);
    } catch (err) {
      logger.error("Error fetching case studies:", err);
      toast.error("Failed to fetch case studies");
    } finally {
      setIsLoading(false);
    }
  }, [industryFilter, dateFilter, sourceFilter]);
  
  // Fetch unique industries for the filter dropdown
  const fetchIndustries = useCallback(async () => {
    try {
      // Get industries from case studies
      const { data, error } = await supabase
        .from('industry_knowledge')
        .select('industry')
        .eq('source_type', 'case-study')
        .order('industry');
        
      if (error) throw error;
      
      // Client-side deduplication of industries
      const uniqueIndustries = Array.from(
        new Set(data.map(item => item.industry))
      );
      
      setIndustries(uniqueIndustries);
    } catch (err) {
      logger.error("Error fetching industries:", err);
    }
  }, []);

  // Load case studies when component mounts or filters change
  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);
  
  // Fetch industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  return { caseStudies, isLoading, industries };
}
