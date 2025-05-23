
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CaseStudy } from './types';

export function useCaseStudies(
  industryFilter: string,
  dateFilter: string,
  sourceFilter: string
) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [industries, setIndustries] = useState<string[]>([]);

  // Fetch case studies
  const fetchCaseStudies = async () => {
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
      console.error("Error fetching case studies:", err);
      toast.error("Failed to fetch case studies");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch unique industries for the filter dropdown
  const fetchIndustries = async () => {
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
      console.error("Error fetching industries:", err);
    }
  };

  // Load case studies when component mounts or filters change
  useEffect(() => {
    fetchCaseStudies();
  }, [industryFilter, dateFilter, sourceFilter]);
  
  // Fetch industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  return { caseStudies, isLoading, industries };
}
