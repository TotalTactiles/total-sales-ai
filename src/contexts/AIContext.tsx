
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead } from '@/types/lead';

interface AIContextType {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions' | 'leads';
  currentLead?: Lead;
  isCallActive: boolean;
  callDuration: number;
  emailContext?: {
    to?: string;
    subject?: string;
    thread?: any[];
  };
  smsContext?: {
    phoneNumber?: string;
    conversation?: any[];
  };
  setWorkspace: (workspace: AIContextType['workspace']) => void;
  setCurrentLead: (lead?: Lead) => void;
  setCallActive: (active: boolean) => void;
  setCallDuration: (duration: number) => void;
  setEmailContext: (context?: AIContextType['emailContext']) => void;
  setSmsContext: (context?: AIContextType['smsContext']) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIContextProviderProps {
  children: ReactNode;
}

export const AIContextProvider: React.FC<AIContextProviderProps> = ({ children }) => {
  const [workspace, setWorkspace] = useState<AIContextType['workspace']>('dashboard');
  const [currentLead, setCurrentLead] = useState<Lead>();
  const [isCallActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [emailContext, setEmailContext] = useState<AIContextType['emailContext']>();
  const [smsContext, setSmsContext] = useState<AIContextType['smsContext']>();

  const value: AIContextType = {
    workspace,
    currentLead,
    isCallActive,
    callDuration,
    emailContext,
    smsContext,
    setWorkspace,
    setCurrentLead,
    setCallActive,
    setCallDuration,
    setEmailContext,
    setSmsContext
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAIContext must be used within an AIContextProvider');
  }
  return context;
};
