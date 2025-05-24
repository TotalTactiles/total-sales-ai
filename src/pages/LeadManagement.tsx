
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
  
  // Choose which leads to display based on demo state
  const shouldShowMockData = isInDemoMode || showDemo;
  let displayLeads: Lead[] = shouldShowMockData
    ? mockLeads.map(convertMockLeadToLead)
    : hasRealData 
      ? leads.map(convertDatabaseLeadToLead)
      : [];

  // Sort leads by AI optimization: conversion_likelihood * score, with priority boost
  displayLeads = displayLeads.sort((a, b) => {
    const priorityWeight = { high: 1.2, medium: 1.0, low: 0.8 };
    const aScore = (a.conversionLikelihood || 50) * (a.score || 50) * (priorityWeight[a.priority] || 1.0);
    const bScore = (b.conversionLikelihood || 50) * (b.score || 50) * (priorityWeight[b.priority] || 1.0);
    return bScore - aScore; // Descending order (highest probability first)
  });

  const handleLeadClick = (lead: Lead) => {
    // Navigate to the lead workspace
    navigate(`/workspace/${lead.id}`);
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
        if (shouldShowMockData) {
          deleteLead(lead.id);
          toast.success('Demo lead deleted successfully');
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
    console.log('Starting interactive demo mode');
    setShowDemo(true);
    toast.success('Interactive Demo activated! Click on any lead to explore the workspace experience.');
  };

  const handleExitDemo = () => {
    console.log('Exiting interactive demo mode');
    setShowDemo(false);
    toast.info('Interactive Demo deactivated. Showing real data view.');
  };

  const handleClearMockData = () => {
    if (shouldShowMockData) {
      clearAllMockData();
      toast.success('All demo data cleared');
    } else {
      toast.error('Cannot clear data when real leads are present');
    }
  };

  const handleResetMockData = () => {
    if (shouldShowMockData) {
      resetMockData();
      toast.success('Demo data reset to original state');
    } else {
      toast.error('Cannot reset when real leads are present');
    }
  };
  
  const filteredLeads = activeFilter === 'all' 
    ? displayLeads 
    : displayLeads.filter(lead => lead.status === activeFilter);

  // Show workspace showcase only if no real data, not in global demo mode, and demo not manually started
  if (!hasRealData && !isInDemoMode && !showDemo) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto py-12">
            <WorkspaceShowcase 
              workspace="leads" 
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
            showDemoIndicator={shouldShowMockData}
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
              onExitDemo={handleExitDemo}
            />
          </div>
          
          <LeadManagementTabs
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            displayLeads={displayLeads}
            filteredLeads={filteredLeads}
            isLoading={!shouldShowMockData && isLoading}
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
