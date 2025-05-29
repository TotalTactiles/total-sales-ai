
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lead } from '@/types/lead';
import LeadCardGrid from './LeadCardGrid';
import LeadManagementActions from './LeadManagementActions';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter leads based on current filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group leads by status for tabs
  const allLeads = filteredLeads;
  const newLeads = filteredLeads.filter(lead => lead.status === 'new');
  const contactedLeads = filteredLeads.filter(lead => lead.status === 'contacted');
  const qualifiedLeads = filteredLeads.filter(lead => lead.status === 'qualified');

  return (
    <div className="space-y-6">
      <LeadManagementActions
        onSearch={setSearchTerm}
        onStatusFilter={setStatusFilter}
        onPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Leads ({allLeads.length})</TabsTrigger>
          <TabsTrigger value="new">New ({newLeads.length})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({contactedLeads.length})</TabsTrigger>
          <TabsTrigger value="qualified">Qualified ({qualifiedLeads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <LeadCardGrid 
            leads={allLeads} 
            loading={loading}
            onLeadClick={onLeadSelect}
            selectedLead={selectedLead}
          />
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <LeadCardGrid 
            leads={newLeads} 
            loading={loading}
            onLeadClick={onLeadSelect}
            selectedLead={selectedLead}
          />
        </TabsContent>

        <TabsContent value="contacted" className="space-y-6">
          <LeadCardGrid 
            leads={contactedLeads} 
            loading={loading}
            onLeadClick={onLeadSelect}
            selectedLead={selectedLead}
          />
        </TabsContent>

        <TabsContent value="qualified" className="space-y-6">
          <LeadCardGrid 
            leads={qualifiedLeads} 
            loading={loading}
            onLeadClick={onLeadSelect}
            selectedLead={selectedLead}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadManagementTabs;
