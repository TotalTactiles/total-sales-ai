
import { useState, useCallback } from 'react';
import { Lead } from '@/types/lead';

interface ActiveCall {
  id: string;
  lead: Lead;
  sessionId?: string;
  isMinimized: boolean;
  status: 'dialing' | 'ringing' | 'connected' | 'ended';
}

export const useCallManager = () => {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);

  const initiateCall = useCallback((lead: Lead) => {
    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newCall: ActiveCall = {
      id: callId,
      lead,
      isMinimized: false,
      status: 'dialing'
    };

    setActiveCalls(prev => [...prev, newCall]);
    return callId;
  }, []);

  const updateCall = useCallback((callId: string, updates: Partial<ActiveCall>) => {
    setActiveCalls(prev => 
      prev.map(call => 
        call.id === callId ? { ...call, ...updates } : call
      )
    );
  }, []);

  const endCall = useCallback((callId: string) => {
    setActiveCalls(prev => prev.filter(call => call.id !== callId));
  }, []);

  const minimizeCall = useCallback((callId: string) => {
    updateCall(callId, { isMinimized: true });
  }, [updateCall]);

  const maximizeCall = useCallback((callId: string) => {
    updateCall(callId, { isMinimized: false });
  }, [updateCall]);

  const getActiveCall = useCallback((callId: string) => {
    return activeCalls.find(call => call.id === callId);
  }, [activeCalls]);

  return {
    activeCalls,
    initiateCall,
    updateCall,
    endCall,
    minimizeCall,
    maximizeCall,
    getActiveCall
  };
};
