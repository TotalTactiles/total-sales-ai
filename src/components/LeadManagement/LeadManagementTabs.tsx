
import { logger } from '@/utils/logger';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lead } from '@/types/lead';
import LeadCardGrid from './LeadCardGrid';

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
  // Group leads by status for tabs
  const allLeads = leads;
  const newLeads = leads.filter(lead => lead.status === 'new');
  const contactedLeads = leads.filter(lead => lead.status === 'contacted');
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified');

  const handleQuickAction = (action: string, lead: Lead) => {
    logger.info('Quick action executed', { action, leadId: lead.id });
    // Handle quick actions here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            onLeadClick={onLeadSelect}
            onQuickAction={handleQuickAction}
          />
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <LeadCardGrid 
            leads={newLeads} 
            onLeadClick={onLeadSelect}
            onQuickAction={handleQuickAction}
          />
        </TabsContent>

        <TabsContent value="contacted" className="space-y-6">
          <LeadCardGrid 
            leads={contactedLeads} 
            onLeadClick={onLeadSelect}
            onQuickAction={handleQuickAction}
          />
        </TabsContent>

        <TabsContent value="qualified" className="space-y-6">
          <LeadCardGrid 
            leads={qualifiedLeads} 
            onLeadClick={onLeadSelect}
            onQuickAction={handleQuickAction}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadManagementTabs;
