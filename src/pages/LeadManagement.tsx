
import { logger } from '@/utils/logger';

import React, { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLeadData } from '@/hooks/useLeadData';
import { useMockData } from '@/hooks/useMockData';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { Lead } from '@/types/lead';
import EnhancedLeadManagement from '@/components/LeadManagement/EnhancedLeadManagement';
import LeadSlidePanel from '@/components/LeadManagement/LeadSlidePanel';
import LeadIntelligencePanel from '@/components/LeadIntelligence/LeadIntelligencePanel';
import LeadImportDialog from '@/components/LeadImport/LeadImportDialog';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';

const LeadManagement = () => {
  const { profile } = useAuth();
  const { leads: realLeads } = useLeadData();
  const { leads: mockLeads } = useMockData();
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
    setIsIntelligencePanelOpen(true);
    setIsSlidePanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsIntelligencePanelOpen(false);
    setIsSlidePanelOpen(false);
    setSelectedLead(null);
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Importing CSV file:', file.name);
        alert('CSV import functionality will be implemented here');
      }
    };
    input.click();
  };

  const handleExportCSV = () => {
    console.log('Exporting leads to CSV');
    alert('CSV export functionality will be implemented here');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* CSV Management Tools for Sales Reps - Small buttons in header */}
        {profile?.role === 'sales_rep' && (
          <div className="bg-white border-b px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Lead Tools:</span>
              <Button 
                size="sm"
                onClick={handleImportCSV}
                className="h-8 px-3 text-xs"
              >
                <Upload className="h-3 w-3 mr-1" />
                Import CSV
              </Button>
              
              <Button 
                size="sm"
                variant="outline"
                onClick={handleExportCSV}
                className="h-8 px-3 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        )}

        <EnhancedLeadManagement
          leads={leads}
          onLeadSelect={handleLeadSelect}
          isDemo={showDemo}
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
      </div>
    </div>
  );
};

export default LeadManagement;
