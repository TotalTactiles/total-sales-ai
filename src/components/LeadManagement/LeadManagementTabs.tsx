
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import LeadCard from './LeadCard';
import { Search, Filter, SortAsc } from 'lucide-react';

interface LeadManagementTabsProps {
  leads: Lead[];
  loading: boolean;
  onLeadSelect: (lead: Lead) => void;
  selectedLead: Lead | null;
}

const LeadManagementTabs: React.FC<LeadManagementTabsProps> = ({
  leads,
  loading,
  onLeadSelect,
  selectedLead
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'lastContact'>('score');

  const filterLeadsByStatus = (status: string) => {
    return leads.filter(lead => {
      const matchesStatus = status === 'all' || lead.status === status;
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  };

  const sortLeads = (leadList: Lead[]) => {
    return [...leadList].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'lastContact':
          const aDate = a.lastContact ? new Date(a.lastContact).getTime() : 0;
          const bDate = b.lastContact ? new Date(b.lastContact).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });
  };

  const getLeadCounts = () => {
    return {
      all: leads.length,
      new: leads.filter(lead => lead.status === 'new').length,
      contacted: leads.filter(lead => lead.status === 'contacted').length,
      qualified: leads.filter(lead => lead.status === 'qualified').length,
      proposal: leads.filter(lead => lead.status === 'proposal').length,
      closed: leads.filter(lead => lead.status === 'closed').length
    };
  };

  const counts = getLeadCounts();

  const TabContent = ({ status }: { status: string }) => {
    const filteredLeads = filterLeadsByStatus(status);
    const sortedLeads = sortLeads(filteredLeads);

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (sortedLeads.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'No leads match your search criteria' : 'No leads found'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onLeadSelect={onLeadSelect}
            selected={selectedLead?.id === lead.id}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === 'score' ? 'name' : sortBy === 'name' ? 'lastContact' : 'score')}
          >
            <SortAsc className="h-4 w-4 mr-2" />
            Sort by {sortBy === 'score' ? 'Score' : sortBy === 'name' ? 'Name' : 'Last Contact'}
          </Button>
        </div>
      </div>

      {/* Lead Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary" className="text-xs">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            New
            <Badge variant="secondary" className="text-xs">
              {counts.new}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="contacted" className="flex items-center gap-2">
            Contacted
            <Badge variant="secondary" className="text-xs">
              {counts.contacted}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="qualified" className="flex items-center gap-2">
            Qualified
            <Badge variant="secondary" className="text-xs">
              {counts.qualified}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="proposal" className="flex items-center gap-2">
            Proposal
            <Badge variant="secondary" className="text-xs">
              {counts.proposal}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-2">
            Closed
            <Badge variant="secondary" className="text-xs">
              {counts.closed}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="all">
            <TabContent status="all" />
          </TabsContent>
          <TabsContent value="new">
            <TabContent status="new" />
          </TabsContent>
          <TabsContent value="contacted">
            <TabContent status="contacted" />
          </TabsContent>
          <TabsContent value="qualified">
            <TabContent status="qualified" />
          </TabsContent>
          <TabsContent value="proposal">
            <TabContent status="proposal" />
          </TabsContent>
          <TabsContent value="closed">
            <TabContent status="closed" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LeadManagementTabs;
