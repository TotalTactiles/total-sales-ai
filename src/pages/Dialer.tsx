
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AutoDialerInterface from '@/components/AutoDialer/AutoDialerInterface';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import { toast } from 'sonner';

const Dialer = () => {
  const [showDemo, setShowDemo] = useState(false);
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  
  const hasRealData = leads && leads.length > 0;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Experience the AI-powered dialer with mock data.');
  };

  // Show workspace showcase if no real data and demo not started
  if (!hasRealData && !showDemo) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto py-12">
            <WorkspaceShowcase 
              workspace="AI Dialer" 
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
      
      <div className="flex-1">
        {/* Demo Mode Indicator */}
        {!hasRealData && (
          <div className="p-6 pb-0">
            <div className="max-w-7xl mx-auto">
              <DemoModeIndicator workspace="AI-Powered Dialer" />
            </div>
          </div>
        )}
        
        <AutoDialerInterface />
      </div>
    </div>
  );
};

export default Dialer;
