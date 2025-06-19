
import { useState, useCallback } from 'react';
import { Lead } from '@/types/lead';
import { Profile } from '@/contexts/auth/types';

interface AppState {
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  notifications: any[];
}

const initialState: AppState = {
  selectedLead: null,
  isLoading: false,
  error: null,
  sidebarOpen: true,
  notifications: []
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  const setSelectedLead = useCallback((lead: Lead | null) => {
    setState(prev => ({ ...prev, selectedLead: lead }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const addNotification = useCallback((notification: any) => {
    setState(prev => ({ 
      ...prev, 
      notifications: [...prev.notifications, notification] 
    }));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setState(prev => ({ 
      ...prev, 
      notifications: prev.notifications.filter(n => n.id !== id) 
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setSelectedLead,
    setLoading,
    setError,
    toggleSidebar,
    addNotification,
    removeNotification,
    resetState
  };
};
