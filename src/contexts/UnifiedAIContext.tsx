
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { masterAIBrain } from '@/services/masterAIBrain';
import { useManagerAI } from '@/hooks/useManagerAI';
import { useSalesRepAI } from '@/hooks/useSalesRepAI';

interface UnifiedAIContextType {
  // Manager AI
  managerAI: ReturnType<typeof useManagerAI>;
  
  // Sales Rep AI
  salesRepAI: ReturnType<typeof useSalesRepAI>;
  
  // Shared AI functions
  logUserAction: (action: string, data: Record<string, any>) => Promise<void>;
  logAIInteraction: (type: string, data: Record<string, any>) => Promise<void>;
  getAIRecommendations: () => Promise<void>;
  
  // AI State
  isAIActive: boolean;
  aiErrors: string[];
  clearAIErrors: () => void;
}

const UnifiedAIContext = createContext<UnifiedAIContextType | undefined>(undefined);

interface UnifiedAIProviderProps {
  children: ReactNode;
}

export const UnifiedAIProvider: React.FC<UnifiedAIProviderProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiErrors, setAIErrors] = useState<string[]>([]);

  // Initialize AI hooks
  const managerAI = useManagerAI();
  const salesRepAI = useSalesRepAI();

  useEffect(() => {
    if (user?.id && profile?.company_id) {
      setIsAIActive(true);
      initializeAI();
    } else {
      setIsAIActive(false);
    }
  }, [user?.id, profile?.company_id]);

  const initializeAI = async () => {
    try {
      // Log AI system initialization
      await masterAIBrain.ingestEvent({
        user_id: user!.id,
        company_id: profile!.company_id,
        event_type: 'user_action',
        source: 'ai_system',
        data: {
          action: 'initialize_ai',
          role: profile!.role,
          timestamp: new Date().toISOString()
        }
      });

      // Get initial recommendations based on role
      if (profile?.role === 'manager') {
        await managerAI.getContextualInsights('/dashboard');
      } else if (profile?.role === 'sales_rep') {
        await salesRepAI.getPersonalizedRecommendations();
      }

    } catch (error) {
      console.error('Error initializing AI:', error);
      addAIError('Failed to initialize AI system');
    }
  };

  const logUserAction = async (action: string, data: Record<string, any>) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'user_action',
        source: 'unified_ai_context',
        data: {
          action,
          ...data,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error logging user action:', error);
      addAIError('Failed to log user action');
    }
  };

  const logAIInteraction = async (type: string, data: Record<string, any>) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'ai_output',
        source: type,
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error logging AI interaction:', error);
      addAIError('Failed to log AI interaction');
    }
  };

  const getAIRecommendations = async () => {
    if (!user?.id || !profile?.company_id) return;

    try {
      if (profile.role === 'manager') {
        await managerAI.getContextualInsights(window.location.pathname);
      } else if (profile.role === 'sales_rep') {
        await salesRepAI.getPersonalizedRecommendations();
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      addAIError('Failed to get AI recommendations');
    }
  };

  const addAIError = (error: string) => {
    setAIErrors(prev => [...prev, error]);
    
    // Auto-clear errors after 10 seconds
    setTimeout(() => {
      setAIErrors(prev => prev.filter(e => e !== error));
    }, 10000);
  };

  const clearAIErrors = () => {
    setAIErrors([]);
  };

  const value: UnifiedAIContextType = {
    managerAI,
    salesRepAI,
    logUserAction,
    logAIInteraction,
    getAIRecommendations,
    isAIActive,
    aiErrors,
    clearAIErrors
  };

  return (
    <UnifiedAIContext.Provider value={value}>
      {children}
    </UnifiedAIContext.Provider>
  );
};

export const useUnifiedAI = () => {
  const context = useContext(UnifiedAIContext);
  if (context === undefined) {
    throw new Error('useUnifiedAI must be used within a UnifiedAIProvider');
  }
  return context;
};
