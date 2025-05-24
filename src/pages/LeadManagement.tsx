
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import LeadManagementHeader from '@/components/LeadManagement/LeadManagementHeader';
import LeadManagementActions from '@/components/LeadManagement/LeadManagementActions';
import LeadManagementTabs from '@/components/LeadManagement/LeadManagementTabs';
import LeadSlidePanel from '@/components/LeadManagement/LeadSlidePanel';
import LeadIntelligencePanel from '@/components/LeadIntelligence/LeadIntelligencePanel';
import LeadImportDialog from '@/components/LeadImport/LeadImportDialog';
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
          <LeadManagementHeader
            showDemoIndicator={(isInDemoMode || (!hasRealData && showDemo))}
            isInDemoMode={isInDemoMode}
            hasRealData={hasRealData}
            showDemo={showDemo}
          />
          
          <div className="flex justify-end mb-6">
            <LeadManagementActions
              isInDemoMode={isInDemoMode}
              hasRealData={hasRealData}
              showDemo={showDemo}
              onResetMockData={handleResetMockData}
              onClearMockData={handleClearMockData}
              onImportDialogOpen={() => setIsImportDialogOpen(true)}
            />
          </div>
          
          <LeadManagementTabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            displayLeads={displayLeads}
            filteredLeads={filteredLeads}
            isLoading={isLoading}
            onLeadClick={handleLeadClick}
            onQuickAction={handleQuickAction}
          />
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
