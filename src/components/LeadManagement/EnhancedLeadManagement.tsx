
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus, Download, Settings } from 'lucide-react';
import { Lead } from '@/types/lead';
import LeadCardGrid from './LeadCardGrid';
import LeadTableView from './LeadTableView';
import LeadProfile from '@/components/LeadProfile/LeadProfile';
import { toast } from 'sonner';

interface EnhancedLeadManagementProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  isDemo?: boolean;
}

const statusColors = {
  new: 'bg-blue-500 text-white',
  contacted: 'bg-yellow-500 text-white',
  qualified: 'bg-green-500 text-white',
  proposal: 'bg-purple-500 text-white',
  negotiation: 'bg-orange-500 text-white',
  'ai_handle': 'bg-cyan-500 text-white',
  closed_won: 'bg-emerald-500 text-white',
  closed_lost: 'bg-red-500 text-white'
};

const statusOrder = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'ai_handle', 'closed_won', 'closed_lost'];

const EnhancedLeadManagement: React.FC<EnhancedLeadManagementProps> = ({
  leads,
  onLeadSelect,
  isDemo = false
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showCustomization, setShowCustomization] = useState(false);

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !searchTerm || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(lead.status);
      const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(lead.priority);
      const matchesSource = selectedSources.length === 0 || selectedSources.includes(lead.source);
      const matchesScore = lead.score >= scoreRange[0] && lead.score <= scoreRange[1];

      return matchesSearch && matchesStatus && matchesPriority && matchesSource && matchesScore;
    });
  }, [leads, searchTerm, selectedStatuses, selectedPriorities, selectedSources, scoreRange]);

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(leads.map(lead => lead.status)));
  const uniquePriorities = Array.from(new Set(leads.map(lead => lead.priority)));
  const uniqueSources = Array.from(new Set(leads.map(lead => lead.source)));

  // Group leads by status
  const leadsByStatus = useMemo(() => {
    const grouped = statusOrder.reduce((acc, status) => {
      acc[status] = filteredLeads.filter(lead => lead.status === status);
      return acc;
    }, {} as Record<string, Lead[]>);
    return grouped;
  }, [filteredLeads]);

  const handleStatusFilter = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    onLeadSelect(lead);
  };

  const handleDelegateToAI = async (leadId: string) => {
    try {
      // Update lead status to ai_handle
      const updatedLeads = leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: 'ai_handle' as Lead['status'] }
          : lead
      );
      
      // Sync with backend for manager OS
      await syncLeadWithManager(leadId, 'ai_handle');
      
      toast.success('Lead delegated to AI successfully');
      setSelectedLead(null);
    } catch (error) {
      toast.error('Failed to delegate lead to AI');
    }
  };

  const syncLeadWithManager = async (leadId: string, status: string) => {
    // Backend sync logic for manager OS
    try {
      // This would sync lead data to manager dashboard
      console.log(`Syncing lead ${leadId} with status ${status} to manager OS`);
      
      // In a real implementation, this would be an API call
      // await supabase.from('leads').update({ status }).eq('id', leadId);
      
      return true;
    } catch (error) {
      console.error('Failed to sync with manager:', error);
      throw error;
    }
  };

  const handleCustomizeClick = () => {
    setShowCustomization(!showCustomization);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">
            Manage and track your sales leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCustomizeClick}>
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search leads by name, company, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {statusOrder.map((status) => {
              const count = leadsByStatus[status]?.length || 0;
              const isSelected = selectedStatuses.includes(status);
              const statusLabel = status === 'ai_handle' ? 'AI Handle' : 
                               status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <Badge
                  key={status}
                  variant={isSelected ? "default" : "secondary"}
                  className={`cursor-pointer hover:opacity-80 ${
                    isSelected ? statusColors[status] : ''
                  }`}
                  onClick={() => handleStatusFilter(status)}
                >
                  {statusLabel} ({count})
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'table')}>
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          <LeadCardGrid 
            leads={filteredLeads} 
            onLeadSelect={handleLeadClick}
            showCustomization={showCustomization}
            onCustomizationChange={setShowCustomization}
          />
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <LeadTableView 
            leads={filteredLeads} 
            onLeadSelect={handleLeadClick}
          />
        </TabsContent>
      </Tabs>

      {/* Lead Profile Modal */}
      {selectedLead && (
        <LeadProfile
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onDelegateToAI={handleDelegateToAI}
        />
      )}
    </div>
  );
};

export default EnhancedLeadManagement;
