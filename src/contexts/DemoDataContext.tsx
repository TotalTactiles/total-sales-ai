
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockLeads, mockTeamMembers, mockRecommendations, mockCalls, mockAIInsights } from '@/data/mockData';
import { Lead } from '@/types/lead';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';

interface DemoDataContextType {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  isDemoMode: boolean;
  teamMembers: any[];
  recommendations: any[];
  calls: any[];
  aiInsights: any[];
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Only load demo data if no user is authenticated or in demo mode
    if (!user || isDemoMode()) {
      // Convert mockLeads to proper Lead type with additional required properties
      const convertedLeads = mockLeads.map(mockLead => 
        convertMockLeadToLead({
          ...mockLead,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          companyId: 'demo-company'
        })
      );
      setLeads(convertedLeads);
    } else {
      setLeads([]);
    }
  }, [user, isDemoMode]);

  const value = {
    leads,
    setLeads,
    isDemoMode: isDemoMode(),
    teamMembers: mockTeamMembers || [],
    recommendations: mockRecommendations || [],
    calls: mockCalls || [],
    aiInsights: mockAIInsights || []
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};
