
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, ExternalLink, Tag, Clock } from "lucide-react";

interface CaseStudyProps {
  isManager: boolean;
}

interface CaseStudy {
  id: string;
  source_id: string;
  content: string;
  created_at: string;
  industry: string;
  source_type: string;
  company_id: string | null;
  // Additional fields we might add through metadata
  title?: string;
  outcome?: string;
  date?: string;
}

const CaseStudiesPanel: React.FC<CaseStudyProps> = ({ isManager }) => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

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

  // Load case studies when component mounts or filters change
  useEffect(() => {
    fetchCaseStudies();
  }, [industryFilter, dateFilter, sourceFilter]);

  // Fetch unique industries for the filter dropdown
  const [industries, setIndustries] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        // Fix: Removed the distinct() call and implement client-side deduplication
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
    
    fetchIndustries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Case Study Library</h2>
        {isManager && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Case Study
          </Button>
        )}
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="recent">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="company">Company Specific</SelectItem>
            <SelectItem value="industry">Industry Wide</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Case Studies Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No case studies found</p>
              <p className="text-sm">Try adjusting your filters or adding new case studies</p>
            </div>
          ) : (
            caseStudies.map((study) => (
              <Card key={study.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {/* Use source_id as title if no specific title exists */}
                      {study.title || study.source_id}
                    </CardTitle>
                    <Badge variant={study.company_id ? "default" : "outline"}>
                      {study.company_id ? "Company" : "Industry"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(study.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {study.industry}
                      </Badge>
                      <p className="text-sm line-clamp-3">{study.content}</p>
                    </div>
                    
                    {/* Additional outcome information if available */}
                    {study.outcome && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium">Outcome</p>
                        <p className="text-sm">{study.outcome}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                      
                      {isManager && (
                        <Button variant="ghost" size="sm">
                          <Tag className="mr-1 h-3 w-3" />
                          Edit Tags
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CaseStudiesPanel;
