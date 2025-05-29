
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeadData } from '@/hooks/useLeadData';
import { useMockData } from '@/hooks/useMockData';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { Lead } from '@/types/lead';
import LeadManagementHeader from '@/components/LeadManagement/LeadManagementHeader';
import LeadManagementTabs from '@/components/LeadManagement/LeadManagementTabs';
import LeadSlidePanel from '@/components/LeadManagement/LeadSlidePanel';
import LeadIntelligencePanel from '@/components/LeadIntelligence/LeadIntelligencePanel';

const LeadManagement = () => {
  const { profile, isDemoMode } = useAuth();
  const { leads: realLeads, loading: realLoading } = useLeadData();
  const { mockLeads, loading: mockLoading } = useMockData();
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);

  // Determine which leads to show and loading state
  const { leads, loading, isInDemoMode, hasRealData, showDemo } = useMemo(() => {
    const isDemo = isDemoMode();
    const hasReal = realLeads.length > 0;
    const shouldShowDemo = isDemo || (!hasReal && !realLoading);
    
    console.log('LeadManagement state:', {
      isDemo,
      hasReal,
      shouldShowDemo,
      realLeadsCount: realLeads.length,
      mockLeadsCount: mockLeads.length,
      realLoading,
      mockLoading
    });

    if (shouldShowDemo) {
      return {
        leads: mockLeads.map(convertMockLeadToLead),
        loading: mockLoading,
        isInDemoMode: isDemo,
        hasRealData: hasReal,
        showDemo: shouldShowDemo
      };
    }

    return {
      leads: realLeads,
      loading: realLoading,
      isInDemoMode: isDemo,
      hasRealData: hasReal,
      showDemo: shouldShowDemo
    };
  }, [realLeads, mockLeads, realLoading, mockLoading, isDemoMode]);

  const handleLeadSelect = (lead: Lead) => {
    console.log('Lead selected:', lead);
    setSelectedLead(lead);
    setIsIntelligencePanelOpen(true);
    setIsSlidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsIntelligencePanelOpen(false);
    setIsSlidePanelOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <LeadManagementHeader
        showDemoIndicator={showDemo}
        isInDemoMode={isInDemoMode}
        hasRealData={hasRealData}
        showDemo={showDemo}
      />

      <LeadManagementTabs
        leads={leads}
        loading={loading}
        onLeadSelect={handleLeadSelect}
        selectedLead={selectedLead}
      />

      {/* Lead Slide Panel */}
      {selectedLead && (
        <LeadSlidePanel
          lead={selectedLead}
          isOpen={isSlidePanelOpen}
          onClose={handleClosePanel}
        />
      )}

      {/* Lead Intelligence Panel */}
      {selectedLead && (
        <LeadIntelligencePanel
          lead={selectedLead}
          isOpen={isIntelligencePanelOpen}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
};

export default LeadManagement;
