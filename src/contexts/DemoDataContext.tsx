import React, { createContext, useContext } from 'react';
import {
  demoLeads,
  demoActivities,
  demoCalls,
  mockCRMIntegrations,
  mockWorkflows,
  mockLeadProfile,
  demoTeamMembers,
  demoManagerRecommendations,
  mockAIInsights,
} from '@/data/demoData';
import type { MockLead, MockActivity, MockCall } from '@/data/demoData';

interface DemoDataContextType {
  leads: MockLead[];
  activities: MockActivity[];
  calls: MockCall[];
  crmIntegrations: typeof mockCRMIntegrations;
  workflows: typeof mockWorkflows;
  leadProfile: typeof mockLeadProfile;
  teamMembers: typeof demoTeamMembers;
  recommendations: typeof demoManagerRecommendations;
  aiInsights: typeof mockAIInsights;
}

const DemoDataContext = createContext<DemoDataContextType | null>(null);

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: DemoDataContextType = {
    leads: demoLeads,
    activities: demoActivities,
    calls: demoCalls,
    crmIntegrations: mockCRMIntegrations,
    workflows: mockWorkflows,
    leadProfile: mockLeadProfile,
    teamMembers: demoTeamMembers,
    recommendations: demoManagerRecommendations,
    aiInsights: mockAIInsights,
  };

  return (
    <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>
  );
};

export const useDemoData = () => {
  const ctx = useContext(DemoDataContext);
  if (!ctx) {
    throw new Error('useDemoData must be used within DemoDataProvider');
  }
  return ctx;
};

