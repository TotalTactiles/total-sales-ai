
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead } from '@/types/lead';
import { useLocation } from 'react-router-dom';

interface AIContextData {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions';
  currentLead?: Lead;
  isCallActive?: boolean;
  callDuration?: number;
  emailContext?: {
    to?: string;
    subject?: string;
    thread?: any[];
  };
  smsContext?: {
    phoneNumber?: string;
    conversation?: any[];
  };
  setCurrentLead: (lead?: Lead) => void;
  setCallActive: (active: boolean) => void;
  setCallDuration: (duration: number) => void;
  setEmailContext: (context: any) => void;
  setSmsContext: (context: any) => void;
}

const AIContext = createContext<AIContextData | undefined>(undefined);

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIContextProvider');
  }
  return context;
};

interface AIContextProviderProps {
  children: React.ReactNode;
}

export const AIContextProvider: React.FC<AIContextProviderProps> = ({ children }) => {
  const location = useLocation();
  const [currentLead, setCurrentLead] = useState<Lead | undefined>();
  const [isCallActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [emailContext, setEmailContext] = useState<any>();
  const [smsContext, setSmsContext] = useState<any>();

  // Determine workspace based on current route
  const getWorkspace = (): AIContextData['workspace'] => {
    const path = location.pathname;
    
    if (path.includes('/dialer')) return 'dialer';
    if (path.includes('/lead/')) return 'lead_details';
    if (path.includes('/email')) return 'email';
    if (path.includes('/sms')) return 'sms';
    if (path.includes('/notes')) return 'notes';
    if (path.includes('/meetings')) return 'meetings';
    if (path.includes('/company-brain')) return 'company_brain';
    if (path.includes('/agent-missions')) return 'agent_missions';
    
    return 'dashboard';
  };

  const workspace = getWorkspace();

  const value: AIContextData = {
    workspace,
    currentLead,
    isCallActive,
    callDuration,
    emailContext,
    smsContext,
    setCurrentLead,
    setCallActive,
    setCallDuration,
    setEmailContext,
    setSmsContext
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
