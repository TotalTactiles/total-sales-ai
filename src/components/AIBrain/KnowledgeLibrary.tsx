
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Loader2, RefreshCw, Trash2, Search } from "lucide-react";

interface KnowledgeEntry {
  id: string;
  source_type: string;
  source_id: string;
  created_at: string;
  content: string;
  company_id: string | null;
}

interface KnowledgeLibraryProps {
  isManager: boolean;
}

const KnowledgeLibrary: React.FC<KnowledgeLibraryProps> = ({ isManager }) => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [isReindexing, setIsReindexing] = useState<boolean>(false);
  const { user } = useAuth();
  
  // Fetch knowledge entries
  const fetchEntries = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('industry_knowledge')
        .select('*');
      
      // Apply filters
      if (sourceTypeFilter !== 'all') {
        query = query.eq('source_type', sourceTypeFilter);
      }
      
      if (companyFilter === 'company') {
        query = query.not('company_id', 'is', null);
      } else if (companyFilter === 'industry') {
        query = query.is('company_id', null);
      }
      
      // Apply search if provided
      if (searchTerm) {
        query = query.ilike('content', `%${searchTerm}%`);
      }
      
      // Order by created date, descending
      query = query.order('created_at', { ascending: false });
      
      // Limit to 100 results for performance
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      setEntries(data as KnowledgeEntry[]);
    } catch (err) {
      console.error("Error fetching knowledge entries:", err);
      toast.error("Failed to fetch knowledge entries");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle reindex
  const handleReindex = async () => {
    if (!isManager) {
      toast.error("Only managers can trigger reindexing");
      return;
    }
    
    setIsReindexing(true);
    
    try {
      // This should call your existing reindex function or edge function
      const { data, error } = await supabase.functions.invoke('ai-brain-reindex');
      
      if (error) throw error;
      
      if (data.success) {
        toast.success(`Successfully reindexed ${data.recordsProcessed} records`);
      } else {
        throw new Error(data.error || "Reindex failed");
      }
    } catch (err: any) {
      console.error("Error reindexing:", err);
      toast.error(err.message || "Failed to reindex knowledge base");
    } finally {
      setIsReindexing(false);
      // Refresh entries after reindexing
      fetchEntries();
    }
  };
  
  // Delete entry
  const handleDelete = async (id: string) => {
    if (!isManager) {
      toast.error("Only managers can delete entries");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      try {
        const { error } = await supabase
          .from('industry_knowledge')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Entry deleted successfully");
        // Refresh entries to update the list
        fetchEntries();
      } catch (err) {
        console.error("Error deleting entry:", err);
        toast.error("Failed to delete entry");
      }
    }
  };
  
  // Handle marking entry as case study
  const handleMarkAsCaseStudy = async (entry: KnowledgeEntry) => {
    if (!isManager) {
      toast.error("Only managers can mark case studies");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('industry_knowledge')
        .update({ source_type: 'case-study' })
        .eq('id', entry.id);
        
      if (error) throw error;
      
      toast.success("Entry marked as case study");
      // Refresh entries to update the list
      fetchEntries();
    } catch (err) {
      console.error("Error marking as case study:", err);
      toast.error("Failed to mark as case study");
    }
  };
  
  // Load entries when component mounts or filters change
  useEffect(() => {
    fetchEntries();
  }, [sourceTypeFilter, companyFilter]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Knowledge Library</CardTitle>
          {isManager && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReindex}
              disabled={isReindexing}
            >
              {isReindexing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Re-indexing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-index Now
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search content..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchEntries}
              >
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Select value={sourceTypeFilter} onValueChange={setSourceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="transcript">Transcripts</SelectItem>
                  <SelectItem value="SOP">SOPs</SelectItem>
                  <SelectItem value="case-study">Case Studies</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scope</SelectItem>
                  <SelectItem value="company">Company Only</SelectItem>
                  <SelectItem value="industry">Industry Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Knowledge Entries Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Type</TableHead>
                    <TableHead className="hidden md:table-cell">Source ID</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No entries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {entry.source_type}
                          </Badge>
                          {entry.company_id ? (
                            <Badge variant="secondary" className="ml-1 text-xs">Company</Badge>
                          ) : (
                            <Badge variant="outline" className="ml-1 text-xs">Industry</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-xs truncate block max-w-[120px]">
                            {entry.source_id}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="line-clamp-2 text-xs">
                            {entry.content}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {isManager && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsCaseStudy(entry)}
                                  className="h-7 px-2"
                                  disabled={entry.source_type === 'case-study'}
                                >
                                  {entry.source_type === 'case-study' ? 'Case Study' : 'Mark as Case Study'}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(entry.id)}
                                  className="text-destructive h-7 w-7 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeLibrary;
