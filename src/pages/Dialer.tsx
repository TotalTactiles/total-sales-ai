
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AutoDialerSystem from '@/components/AutoDialer/AutoDialerSystem';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { toast } from 'sonner';

const Dialer = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  
  const hasRealData = leads && leads.length > 0;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Experience the AI-powered auto-dialer with mock data.');
  };

  // Show workspace showcase if no real data and demo not started
  if (!hasRealData && !showDemo) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto py-12">
            <WorkspaceShowcase 
              workspace="AI Auto-Dialer" 
              onStartDemo={handleStartDemo}
            />
          </div>
        </div>
      </div>
    );
  }

  const displayLeads = hasRealData 
    ? leads.map(convertDatabaseLeadToLead) 
    : mockLeads.map(convertMockLeadToLead);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 pt-[60px]">
        {/* Demo Mode Indicator */}
        {!hasRealData && (
          <div className="p-4 pb-0">
            <div className="max-w-7xl mx-auto">
              <DemoModeIndicator workspace="AI Auto-Dialer System" />
            </div>
          </div>
        )}
        
        {/* Main Auto-Dialer Interface */}
        <div className="p-4 h-[calc(100vh-60px)]">
          <div className="max-w-7xl mx-auto h-full">
            <AutoDialerSystem 
              leads={displayLeads}
              onLeadSelect={setSelectedLead}
            />
          </div>
        </div>
      </div>

      {/* AI Assistant Bubble */}
      <UnifiedAIBubble 
        context={{
          workspace: 'dialer',
          currentLead: selectedLead,
          isCallActive: false
        }}
      />
    </div>
  );
};

export default Dialer;
