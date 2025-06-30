
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
  // Enhanced mock data for Sales Rep OS
  salesRepDashboardData: {
    aiSummary: string;
    aiAssistant: {
      emailsDrafted: number;
      callsScheduled: number;
      proposalsGenerated: number;
      performanceImprovement: number;
    };
    suggestedSchedule: any[];
    priorityTasks: any[];
    pipelineData: any[];
  };
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
  const { user, profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Enhanced mock data for Sales Rep OS dashboard
  const salesRepDashboardData = {
    aiSummary: "Good morning! You have 12 high-priority leads requiring immediate attention. Your conversion rate improved by 23% this week. AI suggests focusing on Enterprise leads today.",
    aiAssistant: {
      emailsDrafted: 23,
      callsScheduled: 12,
      proposalsGenerated: 5,
      performanceImprovement: 34
    },
    suggestedSchedule: [
      {
        time: "09:00",
        activity: "Priority Lead Calls",
        description: "High impact activities",
        duration: "2h",
        color: "blue"
      },
      {
        time: "11:30",
        activity: "Follow-up Emails",
        description: "Nurture warm leads",
        duration: "30m",
        color: "green"
      },
      {
        time: "14:00",
        activity: "Warm Lead Outreach",
        description: "Peak response time",
        duration: "1.5h",
        color: "orange"
      }
    ],
    priorityTasks: [
      {
        id: 1,
        type: "call",
        title: "Call Maria Rodriguez at TechCorp",
        priority: "high",
        suggestedTime: "2:30 PM",
        description: "Warm lead ready to close - $125K potential",
        value: "$125K"
      },
      {
        id: 2,
        type: "email",
        title: "Send follow-up email to Global Solutions",
        priority: "medium",
        suggestedTime: "3:15 PM",
        description: "Proposal sent 3 days ago - follow up needed",
        value: "$85K"
      }
    ],
    pipelineData: [
      {
        id: 1,
        company: "TechCorp Inc.",
        contact: "Maria Rodriguez",
        status: "qualified",
        priority: "high",
        value: "$125K",
        avatar: "T",
        color: "blue"
      },
      {
        id: 2,
        company: "Global Solutions",
        contact: "Mike Chen",
        status: "proposal",
        priority: "medium",
        value: "$85K",
        avatar: "G",
        color: "purple"
      },
      {
        id: 3,
        company: "Innovation Labs",
        contact: "Sarah Johnson",
        status: "negotiation",
        priority: "high",
        value: "$95K",
        avatar: "I",
        color: "green"
      },
      {
        id: 4,
        company: "Future Systems",
        contact: "David Kim",
        status: "follow-up",
        priority: "low",
        value: "$45K",
        avatar: "F",
        color: "orange"
      }
    ]
  };

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
    error,
    salesRepDashboardData
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};
