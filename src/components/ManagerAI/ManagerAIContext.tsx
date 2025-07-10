
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useManagerAI } from '@/hooks/useManagerAI';
import { logger } from '@/utils/logger';

interface ManagerAIContextType {
  // AI State
  isActive: boolean;
  contextualInsights: any[];
  isGenerating: boolean;
  
  // Company Brain Integration
  companyKnowledge: any[];
  salesRepInsights: any[];
  
  // AI Actions
  askJarvis: (question: string) => Promise<string>;
  getContextualInsights: (path: string) => Promise<void>;
  generateManagerReport: () => Promise<string>;
  
  // Company Integration
  syncWithCompanyBrain: () => Promise<void>;
  getSalesRepInsights: () => Promise<void>;
  broadcastToSalesReps: (message: string) => Promise<void>;
}

const ManagerAIContext = createContext<ManagerAIContextType | undefined>(undefined);

interface ManagerAIProviderProps {
  children: ReactNode;
}

export const ManagerAIProvider: React.FC<ManagerAIProviderProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const managerAI = useManagerAI();
  
  const [companyKnowledge, setCompanyKnowledge] = useState<any[]>([]);
  const [salesRepInsights, setSalesRepInsights] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Initialize Manager AI when user is authenticated
  useEffect(() => {
    if (user?.id && profile?.role === 'manager') {
      setIsActive(true);
      initializeManagerAI();
    } else {
      setIsActive(false);
    }
  }, [user?.id, profile?.role]);

  const initializeManagerAI = async () => {
    try {
      // Sync with company brain
      await syncWithCompanyBrain();
      
      // Get sales rep insights
      await getSalesRepInsights();
      
      logger.info('Manager AI initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Manager AI:', error);
    }
  };

  const syncWithCompanyBrain = async () => {
    try {
      // Mock company brain sync - replace with actual implementation
      const mockKnowledge = [
        {
          id: '1',
          title: 'Company Policies',
          content: 'Updated company policies and procedures',
          category: 'policies',
          lastUpdated: new Date()
        },
        {
          id: '2',
          title: 'Sales Playbook',
          content: 'Current sales strategies and techniques',
          category: 'sales',
          lastUpdated: new Date()
        }
      ];
      
      setCompanyKnowledge(mockKnowledge);
      logger.info('Synced with company brain');
    } catch (error) {
      logger.error('Failed to sync with company brain:', error);
    }
  };

  const getSalesRepInsights = async () => {
    try {
      // Mock sales rep insights - replace with actual implementation
      const mockInsights = [
        {
          repId: 'rep1',
          name: 'John Smith',
          performance: 85,
          activeLeads: 12,
          recentActivity: 'Closed 2 deals this week',
          aiRecommendations: ['Focus on follow-ups', 'Improve demo conversion']
        },
        {
          repId: 'rep2',
          name: 'Sarah Johnson', 
          performance: 92,
          activeLeads: 8,
          recentActivity: 'Exceeded quota by 15%',
          aiRecommendations: ['Share best practices', 'Mentor junior reps']
        }
      ];
      
      setSalesRepInsights(mockInsights);
      logger.info('Retrieved sales rep insights');
    } catch (error) {
      logger.error('Failed to get sales rep insights:', error);
    }
  };

  const broadcastToSalesReps = async (message: string) => {
    try {
      // Mock broadcast to sales reps - replace with actual implementation
      logger.info('Broadcasting message to sales reps:', message);
      
      // This would typically send a message through a real-time system
      // to all sales reps' AI assistants
      
      return Promise.resolve();
    } catch (error) {
      logger.error('Failed to broadcast to sales reps:', error);
      throw error;
    }
  };

  const enhancedAskJarvis = async (question: string): Promise<string> => {
    try {
      // Enhance the question with company context
      const contextualQuestion = `${question}
      
      Context:
      - Company Knowledge: ${companyKnowledge.length} documents available
      - Sales Rep Insights: ${salesRepInsights.length} reps monitored
      - User Role: Manager
      - Company: ${profile?.company_id}`;
      
      const response = await managerAI.askJarvis(contextualQuestion);
      return response;
    } catch (error) {
      logger.error('Enhanced askJarvis failed:', error);
      throw error;
    }
  };

  const value: ManagerAIContextType = {
    isActive,
    contextualInsights: managerAI.contextualInsights,
    isGenerating: managerAI.isGenerating,
    companyKnowledge,
    salesRepInsights,
    askJarvis: enhancedAskJarvis,
    getContextualInsights: managerAI.getContextualInsights,
    generateManagerReport: managerAI.generateManagerReport,
    syncWithCompanyBrain,
    getSalesRepInsights,
    broadcastToSalesReps
  };

  return (
    <ManagerAIContext.Provider value={value}>
      {children}
    </ManagerAIContext.Provider>
  );
};

export const useManagerAIContext = () => {
  const context = useContext(ManagerAIContext);
  if (context === undefined) {
    throw new Error('useManagerAIContext must be used within a ManagerAIProvider');
  }
  return context;
};
