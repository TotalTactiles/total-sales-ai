
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIContextType {
  currentLead: any;
  isCallActive: boolean;
  emailContext: any;
  smsContext: any;
  workspace: string;
  callDuration: number;
  setCurrentLead: (lead: any) => void;
  setCallActive: (active: boolean) => void;
  setEmailContext: (context: any) => void;
  setSmsContext: (context: any) => void;
  setWorkspace: (workspace: string) => void;
  setCallDuration: (duration: number) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLead, setCurrentLead] = useState(null);
  const [isCallActive, setCallActive] = useState(false);
  const [emailContext, setEmailContext] = useState(null);
  const [smsContext, setSmsContext] = useState(null);
  const [workspace, setWorkspace] = useState('dashboard');
  const [callDuration, setCallDuration] = useState(0);

  return (
    <AIContext.Provider value={{
      currentLead,
      isCallActive,
      emailContext,
      smsContext,
      workspace,
      callDuration,
      setCurrentLead,
      setCallActive,
      setEmailContext,
      setSmsContext,
      setWorkspace,
      setCallDuration
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
};
