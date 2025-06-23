
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockLeads, mockTeamMembers, mockRecommendations, mockCalls, mockAIInsights } from '@/data/mockData';
import { Lead } from '@/types/lead';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { logger } from '@/utils/logger';

interface DemoDataContextType {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  isDemoMode: boolean;
  teamMembers: any[];
  recommendations: any[];
  calls: any[];
  aiInsights: any[];
  error: string | null;
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
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Always provide demo data for development purposes
      const convertedLeads = mockLeads.map(mockLead => 
        convertMockLeadToLead({
          ...mockLead,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          companyId: user?.id || 'demo-company'
        })
      );
      setLeads(convertedLeads);
      setError(null);
    } catch (err) {
      logger.error('Error loading demo data:', err);
      setError('Failed to load demo data');
    }
  }, [user]);

  const value = {
    leads,
    setLeads,
    isDemoMode: false, // No longer using demo mode
    teamMembers: mockTeamMembers || [],
    recommendations: mockRecommendations || [],
    calls: mockCalls || [],
    aiInsights: mockAIInsights || [],
    error
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};
