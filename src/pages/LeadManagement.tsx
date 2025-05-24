
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import LeadCardGrid from '@/components/LeadManagement/LeadCardGrid';
import LeadSlidePanel from '@/components/LeadManagement/LeadSlidePanel';
import LeadIntelligencePanel from '@/components/LeadIntelligence/LeadIntelligencePanel';
import LeadImportDialog from '@/components/LeadImport/LeadImportDialog';
import { Lead } from '@/types/lead';
import { useLeads } from '@/hooks/useLeads';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';
import { toast } from 'sonner';

const LeadManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const { leads, isLoading, refetch } = useLeads();
  
  // Convert database leads to frontend Lead type
  const convertedLeads: Lead[] = leads.map(convertDatabaseLeadToLead);
  
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsSlidePanelOpen(true);
  };

  const handleQuickAction = (action: string, lead: Lead) => {
    switch (action) {
      case 'call':
        toast.success(`Initiating call to ${lead.name}`);
        break;
      case 'email':
        toast.success(`Opening email composer for ${lead.name}`);
        break;
      case 'chat':
        toast.success(`Starting chat with ${lead.name}`);
        break;
      case 'notes':
        toast.success(`Opening notes for ${lead.name}`);
        break;
      case 'ai_assist':
        setSelectedLead(lead);
        setIsIntelligencePanelOpen(true);
        break;
      case 'help':
        toast.success(`Requesting team help for ${lead.name}`);
        break;
      default:
        break;
    }
  };

  const handleImportComplete = () => {
    refetch();
    toast.success('Leads refreshed with new imports');
  };
  
  const filteredLeads = activeFilter === 'all' 
    ? convertedLeads 
    : convertedLeads.filter(lead => lead.status === activeFilter);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-salesBlue">Lead Management</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsImportDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Leads
              </Button>
              <Button className="bg-salesGreen hover:bg-salesGreen-dark">
                + Add New Lead
              </Button>
            </div>
          </div>
          
          {/* Status Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveFilter('all')}
              >
                All Leads ({convertedLeads.length})
              </TabsTrigger>
              <TabsTrigger 
                value="new" 
                onClick={() => setActiveFilter('new')}
              >
                New ({convertedLeads.filter(l => l.status === 'new').length})
              </TabsTrigger>
              <TabsTrigger 
                value="contacted" 
                onClick={() => setActiveFilter('contacted')}
              >
                Contacted ({convertedLeads.filter(l => l.status === 'contacted').length})
              </TabsTrigger>
              <TabsTrigger 
                value="qualified" 
                onClick={() => setActiveFilter('qualified')}
              >
                Qualified ({convertedLeads.filter(l => l.status === 'qualified').length})
              </TabsTrigger>
              <TabsTrigger 
                value="closed" 
                onClick={() => setActiveFilter('closed')}
              >
                Closed ({convertedLeads.filter(l => l.status === 'closed').length})
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
                  onLeadClick={handleLeadClick}
                  onQuickAction={handleQuickAction}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Lead Slide Panel */}
      <LeadSlidePanel
        lead={selectedLead}
        isOpen={isSlidePanelOpen}
        onClose={() => {
          setIsSlidePanelOpen(false);
          setSelectedLead(null);
        }}
      />

      {/* Lead Intelligence Panel */}
      <LeadIntelligencePanel
        lead={selectedLead}
        isOpen={isIntelligencePanelOpen}
        onClose={() => {
          setIsIntelligencePanelOpen(false);
          setSelectedLead(null);
        }}
      />

      {/* Lead Import Dialog */}
      <LeadImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default LeadManagement;
