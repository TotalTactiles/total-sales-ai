
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, RotateCcw } from 'lucide-react';
import LeadCardGrid from '@/components/LeadManagement/LeadCardGrid';
import LeadSlidePanel from '@/components/LeadManagement/LeadSlidePanel';
import LeadIntelligencePanel from '@/components/LeadIntelligence/LeadIntelligencePanel';
import LeadImportDialog from '@/components/LeadImport/LeadImportDialog';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { Lead } from '@/types/lead';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import { useAuth } from '@/contexts/AuthContext';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { toast } from 'sonner';

const LeadManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  
  const { leads, isLoading, refetch } = useLeads();
  const { isDemoMode } = useAuth();
  const { 
    leads: mockLeads, 
    getLeadsByStatus, 
    getLeadMetrics,
    deleteLead,
    clearAllMockData,
    resetMockData
  } = useMockData();
  
  // Use mock data for demo or real data if available
  const hasRealData = leads && leads.length > 0;
  const isInDemoMode = isDemoMode();
  
  // Auto-enable showDemo if we're in demo mode
  useEffect(() => {
    if (isInDemoMode && !hasRealData) {
      setShowDemo(true);
    }
  }, [isInDemoMode, hasRealData]);
  
  const displayLeads: Lead[] = hasRealData 
    ? leads.map(convertDatabaseLeadToLead) 
    : mockLeads.map(convertMockLeadToLead);

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
      case 'delete':
        if (!hasRealData) {
          deleteLead(lead.id);
        } else {
          toast.error('Cannot delete real leads from demo mode');
        }
        break;
      default:
        break;
    }
  };

  const handleImportComplete = () => {
    refetch();
    toast.success('Leads refreshed with new imports');
  };

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore with mock data to see the full potential.');
  };

  const handleClearMockData = () => {
    if (!hasRealData) {
      clearAllMockData();
    } else {
      toast.error('Cannot clear data when real leads are present');
    }
  };

  const handleResetMockData = () => {
    if (!hasRealData) {
      resetMockData();
    } else {
      toast.error('Cannot reset when real leads are present');
    }
  };
  
  const filteredLeads = activeFilter === 'all' 
    ? displayLeads 
    : displayLeads.filter(lead => lead.status === activeFilter);

  // Show workspace showcase only if no real data, not in demo mode, and demo not manually started
  if (!hasRealData && !isInDemoMode && !showDemo) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto py-12">
            <WorkspaceShowcase 
              workspace="Lead Management" 
              onStartDemo={handleStartDemo}
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Demo Mode Indicator */}
          {(isInDemoMode || (!hasRealData && showDemo)) && <DemoModeIndicator workspace="Lead Management" />}
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-salesBlue">Lead Management</h1>
              {(isInDemoMode || (!hasRealData && showDemo)) && (
                <p className="text-sm text-slate-600 mt-1">
                  Showing mock data - see how your leads would look in the system
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {(isInDemoMode || (!hasRealData && showDemo)) && (
                <>
                  <Button 
                    variant="outline"
                    onClick={handleResetMockData}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Demo Data
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleClearMockData}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All Demo Data
                  </Button>
                </>
              )}
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
