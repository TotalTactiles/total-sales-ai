import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Settings, 
  Grid3X3,
  List,
  Brain
} from 'lucide-react';
import { Lead } from '@/types/lead';
import LeadCard from './LeadCard';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface LeadCardGridProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onQuickAction: (action: string, lead: Lead) => void;
}

const LeadCardGrid: React.FC<LeadCardGridProps> = ({ 
  leads, 
  onLeadClick, 
  onQuickAction 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ai_optimized');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);

  const { trackEvent } = useUsageTracking();

  // AI suggestions for leads (mock data - would come from AI service)
  const aiSuggestions: Record<string, string> = {
    '1': 'Send ROI calculator - 78% likely to engage',
    '2': 'Schedule follow-up call - optimal time 2-4 PM',
    '4': 'Try LinkedIn approach - email bouncing'
  };

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'ai_optimized':
          // AI-optimized scoring: conversion likelihood * score * priority weight
          const priorityWeight = { high: 1.2, medium: 1.0, low: 0.8 };
          aValue = (a.conversionLikelihood || 50) * (a.score || 50) * (priorityWeight[a.priority] || 1.0);
          bValue = (b.conversionLikelihood || 50) * (b.score || 50) * (priorityWeight[b.priority] || 1.0);
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'lastContact':
          // Convert relative time to sortable value (mock implementation)
          aValue = a.lastContact ? 1 : 0;
          bValue = b.lastContact ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [leads, searchTerm, statusFilter, priorityFilter, sortBy, sortDirection]);

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection(newSortBy === 'ai_optimized' ? 'desc' : 'desc');
    }
    
    trackEvent({
      feature: 'lead_grid_sort',
      action: 'change',
      context: 'lead_management',
      metadata: { sortBy: newSortBy, direction: sortDirection }
    });
  };

  const handleLeadClick = (lead: Lead) => {
    // Fix: Navigate to the correct lead-workspace route
    navigate(`/lead-workspace/${lead.id}`);
    trackEvent({
      feature: 'lead_card_click',
      action: 'navigate_to_workspace',
      context: 'lead_management',
      metadata: { leadId: lead.id, leadScore: lead.score }
    });
  };

  const urgentLeads = leads.filter(lead => 
    lead.priority === 'high' && (!lead.lastContact || lead.score < 60)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Lead Pipeline</h2>
          {urgentLeads > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {urgentLeads} need attention
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAiSuggestionsEnabled(!aiSuggestionsEnabled)}
            className={aiSuggestionsEnabled ? 'bg-blue-50 text-blue-700' : ''}
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai_optimized">🤖 AI Optimized</SelectItem>
            <SelectItem value="score">Score</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="lastContact">Last Contact</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      {/* Lead Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1 max-w-4xl mx-auto'
      }`}>
        {filteredAndSortedLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onCardClick={handleLeadClick}
            onQuickAction={onQuickAction}
            aiSuggestion={aiSuggestionsEnabled ? aiSuggestions[lead.id] : undefined}
          />
        ))}
      </div>

      {/* Results Summary */}
      <div className="text-center text-sm text-slate-500">
        Showing {filteredAndSortedLeads.length} of {leads.length} leads
        {sortBy === 'ai_optimized' && (
          <span className="ml-2 text-blue-600">• Sorted by AI optimization for highest conversion probability</span>
        )}
      </div>
    </div>
  );
};

export default LeadCardGrid;
