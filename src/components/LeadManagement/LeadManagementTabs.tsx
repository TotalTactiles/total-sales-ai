
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lead } from '@/types/lead';
import LeadCardGrid from './LeadCardGrid';

interface LeadManagementTabsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  displayLeads: Lead[];
  filteredLeads: Lead[];
  isLoading: boolean;
  onLeadClick: (lead: Lead) => void;
  onQuickAction: (action: string, lead: Lead) => void;
}

const LeadManagementTabs: React.FC<LeadManagementTabsProps> = ({
  activeFilter,
  setActiveFilter,
  displayLeads,
  filteredLeads,
  isLoading,
  onLeadClick,
  onQuickAction
}) => {
  return (
    <Tabs defaultValue="all" className="mb-6">
      <TabsList className="mb-4">
        <TabsTrigger 
          value="all" 
          onClick={() => setActiveFilter('all')}
        >
          All Leads ({displayLeads.length})
        </TabsTrigger>
        <TabsTrigger 
          value="new" 
          onClick={() => setActiveFilter('new')}
        >
          New ({displayLeads.filter(l => l.status === 'new').length})
        </TabsTrigger>
        <TabsTrigger 
          value="contacted" 
          onClick={() => setActiveFilter('contacted')}
        >
          Contacted ({displayLeads.filter(l => l.status === 'contacted').length})
        </TabsTrigger>
        <TabsTrigger 
          value="qualified" 
          onClick={() => setActiveFilter('qualified')}
        >
          Qualified ({displayLeads.filter(l => l.status === 'qualified').length})
        </TabsTrigger>
        <TabsTrigger 
          value="closed" 
          onClick={() => setActiveFilter('closed')}
        >
          Closed ({displayLeads.filter(l => l.status === 'closed').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading leads...</p>
          </div>
        ) : (
          <LeadCardGrid
            leads={filteredLeads}
            onLeadClick={onLeadClick}
            onQuickAction={onQuickAction}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default LeadManagementTabs;
