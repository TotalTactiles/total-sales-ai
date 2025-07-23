
import React, { createContext, useContext, ReactNode } from 'react';
import { useCallManager } from '@/hooks/useCallManager';

interface CallManagerContextType {
  activeCalls: any[];
  initiateCall: (lead: any) => string;
  updateCall: (callId: string, updates: any) => void;
  endCall: (callId: string) => void;
  minimizeCall: (callId: string) => void;
  maximizeCall: (callId: string) => void;
  getActiveCall: (callId: string) => any;
}

const CallManagerContext = createContext<CallManagerContextType | undefined>(undefined);

interface CallManagerProviderProps {
  children: ReactNode;
}

export const CallManagerProvider: React.FC<CallManagerProviderProps> = ({ children }) => {
  const callManager = useCallManager();

  return (
    <CallManagerContext.Provider value={callManager}>
      {children}
    </CallManagerContext.Provider>
  );
};

export const useCallManagerContext = () => {
  const context = useContext(CallManagerContext);
  if (context === undefined) {
    throw new Error('useCallManagerContext must be used within a CallManagerProvider');
  }
  return context;
};
