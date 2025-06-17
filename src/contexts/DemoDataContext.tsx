
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockLeads } from '@/data/mockData';
import { Lead } from '@/types/lead';

interface DemoDataContextType {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  isDemoMode: boolean;
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
      setLeads(mockLeads);
    } else {
      setLeads([]);
    }
  }, [user, isDemoMode]);

  const value = {
    leads,
    setLeads,
    isDemoMode: isDemoMode()
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};
