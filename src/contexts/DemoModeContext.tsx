
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { demoUsers } from '@/data/demo.mock.data';
import { mockSalesData, mockManagerData, mockDeveloperData } from '@/data/mockDemoData';
import { logger } from '@/utils/logger';

interface DemoModeContextType {
  isDemoUser: boolean;
  demoRole: string | null;
  getMockData: (dataType: string) => any;
  simulateAction: (action: string, payload?: any) => Promise<any>;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

interface DemoModeProviderProps {
  children: ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [demoRole, setDemoRole] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.email) {
      const demoUser = demoUsers.find(du => du.email === user.email);
      if (demoUser) {
        setIsDemoUser(true);
        setDemoRole(demoUser.role);
        logger.info(`🎭 Demo mode activated for: ${demoUser.name} (${demoUser.role})`);
      } else {
        setIsDemoUser(false);
        setDemoRole(null);
      }
    } else {
      setIsDemoUser(false);
      setDemoRole(null);
    }
  }, [user]);

  const getMockData = (dataType: string): any => {
    if (!isDemoUser) return null;

    logger.info(`🎭 Fetching mock data: ${dataType} for role: ${demoRole}`);

    switch (dataType) {
      case 'leads':
        return demoRole === 'sales_rep' ? mockSalesData.leads : [];
      case 'tasks':
        return demoRole === 'sales_rep' ? mockSalesData.tasks : [];
      case 'ai-insights':
        return demoRole === 'sales_rep' ? mockSalesData.aiInsights : [];
      case 'team-members':
        return demoRole === 'manager' ? mockManagerData.teamMembers : [];
      case 'pipeline-health':
        return demoRole === 'manager' ? mockManagerData.pipelineHealth : {};
      case 'manager-alerts':
        return demoRole === 'manager' ? mockManagerData.alerts : [];
      case 'agent-logs':
        return demoRole === 'developer' ? mockDeveloperData.agentLogs : [];
      case 'system-health':
        return demoRole === 'developer' ? mockDeveloperData.systemHealth : {};
      case 'recent-commits':
        return demoRole === 'developer' ? mockDeveloperData.recentCommits : [];
      default:
        logger.warn(`🎭 Unknown mock data type requested: ${dataType}`);
        return null;
    }
  };

  const simulateAction = async (action: string, payload?: any): Promise<any> => {
    if (!isDemoUser) {
      throw new Error('Simulation only available for demo users');
    }

    logger.info(`🎭 Simulating action: ${action} with payload: ${JSON.stringify(payload)}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    switch (action) {
      case 'send-email':
        return {
          success: true,
          message: 'Demo email sent successfully',
          emailId: `demo-email-${Date.now()}`,
          recipient: payload?.recipient || 'Demo Recipient'
        };

      case 'log-call':
        return {
          success: true,
          message: 'Call logged successfully',
          callId: `demo-call-${Date.now()}`,
          duration: payload?.duration || '15 minutes'
        };

      case 'update-lead-status':
        return {
          success: true,
          message: 'Lead status updated',
          leadId: payload?.leadId,
          newStatus: payload?.status,
          timestamp: new Date().toISOString()
        };

      case 'generate-report':
        return {
          success: true,
          message: 'Report generated successfully',
          reportId: `demo-report-${Date.now()}`,
          reportType: payload?.type || 'performance',
          generatedAt: new Date().toISOString()
        };

      case 'schedule-meeting':
        return {
          success: true,
          message: 'Meeting scheduled successfully',
          meetingId: `demo-meeting-${Date.now()}`,
          scheduledFor: payload?.datetime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

      case 'run-automation':
        return {
          success: true,
          message: 'Automation executed successfully',
          automationId: payload?.automationId,
          result: 'Demo automation completed',
          executedAt: new Date().toISOString()
        };

      case 'system-health-check':
        return {
          success: true,
          message: 'System health check completed',
          status: 'All systems operational',
          uptime: '99.8%',
          lastCheck: new Date().toISOString()
        };

      case 'deploy-agent':
        return {
          success: true,
          message: 'Agent deployed successfully',
          agentId: payload?.agentId,
          version: `v1.${Math.floor(Math.random() * 100)}`,
          deployedAt: new Date().toISOString()
        };

      default:
        return {
          success: true,
          message: `Demo action "${action}" completed`,
          timestamp: new Date().toISOString()
        };
    }
  };

  const value: DemoModeContextType = {
    isDemoUser,
    demoRole,
    getMockData,
    simulateAction
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
