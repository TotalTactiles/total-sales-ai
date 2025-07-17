
import { logger } from '@/utils/logger';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeadData } from '@/hooks/useLeadData';
import { useMockData } from '@/hooks/useMockData';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { Lead } from '@/types/lead';
import EnhancedLeadManagement from '@/components/LeadManagement/EnhancedLeadManagement';
import LeadSlidePanel from '@/components/LeadManagement/LeadSlidePanel';
import LeadIntelligencePanel from '@/components/LeadIntelligence/LeadIntelligencePanel';
import LeadImportDialog from '@/components/LeadImport/LeadImportDialog';
import LeadProfile from '@/components/LeadProfile/LeadProfile';

const LeadManagement = () => {
  const { profile } = useAuth();
  const { leads: realLeads } = useLeadData();
  const { leads: mockLeads } = useMockData();
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isLeadProfileOpen, setIsLeadProfileOpen] = useState(false);

  // Determine which leads to show and loading state
  const { leads, isInDemoMode, hasRealData, showDemo } = useMemo(() => {
    const hasReal = realLeads.length > 0;
    const shouldShowDemo = !hasReal;
    
    logger.info('LeadManagement state:', {
      hasReal,
      shouldShowDemo,
      realLeadsCount: realLeads.length,
      mockLeadsCount: mockLeads.length
    });

    if (shouldShowDemo) {
      return {
        leads: mockLeads.map(convertMockLeadToLead),
        isInDemoMode: true,
        hasRealData: hasReal,
        showDemo: shouldShowDemo
      };
    }

    return {
      leads: realLeads,
      isInDemoMode: false,
      hasRealData: hasReal,
      showDemo: shouldShowDemo
    };
  }, [realLeads, mockLeads]);

  const handleLeadSelect = (lead: Lead) => {
    logger.info('Lead selected:', lead);
    setSelectedLead(lead);
    setIsLeadProfileOpen(true);
  };

  const handleClosePanel = () => {
    setIsIntelligencePanelOpen(false);
    setIsSlidePanelOpen(false);
    setIsLeadProfileOpen(false);
    setSelectedLead(null);
  };

  return (
    <>
      <EnhancedLeadManagement
        leads={leads}
        onLeadSelect={handleLeadSelect}
        isDemo={showDemo}
      />

      {/* Lead Profile Modal */}
      <LeadProfile
        lead={selectedLead}
        isOpen={isLeadProfileOpen}
        onClose={handleClosePanel}
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

      <LeadImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImportComplete={() => setIsImportDialogOpen(false)}
      />
    </>
  );
};

export default LeadManagement;
