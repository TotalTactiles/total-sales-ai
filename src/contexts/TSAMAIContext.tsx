
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { aiOrchestrator } from '@/services/ai/AIOrchestrator';
import { masterAIBrain } from '@/services/masterAIBrain';
import { automationEngine } from '@/services/automation/AutomationEngine';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface TSAMAIContextType {
  // System Status
  isSystemReady: boolean;
  isLive: boolean;
  systemStatus: any;
  
  // AI Processing
  processAIRequest: (request: {
    workspace: 'sales' | 'manager' | 'developer';
    agentType: string;
    inputType: 'chat' | 'automation' | 'analysis';
    prompt: string;
    context?: any;
  }) => Promise<any>;
  
  // Automation
  triggerAutomation: (workflowId: string, triggerData: any) => Promise<string>;
  approveAutomationStep: (executionId: string, stepIndex: number) => Promise<void>;
  
  // Workspace-specific AI
  getSalesAI: () => any;
  getManagerAI: () => any;
  getDeveloperAI: () => any;
  
  // System Control (Developer only)
  activateAI: () => Promise<void>;
  deactivateAI: () => Promise<void>;
  
  // Status & Monitoring
  getAIMetrics: () => any;
  getAutomationStatus: () => any;
  
  // Loading states
  isProcessing: boolean;
  processingMessage: string;
}

const TSAMAIContext = createContext<TSAMAIContextType | undefined>(undefined);

interface TSAMAIProviderProps {
  children: ReactNode;
}

export const TSAMAIProvider: React.FC<TSAMAIProviderProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  useEffect(() => {
    if (user?.id && profile?.company_id) {
      initializeAISystem();
    }
  }, [user?.id, profile?.company_id]);

  const initializeAISystem = async () => {
    try {
      setProcessingMessage('Initializing TSAM AI System...');
      setIsProcessing(true);

      // Initialize all AI components
      const [orchestratorStatus, brainStatus, automationStatus] = await Promise.all([
        aiOrchestrator.getSystemStatus(),
        masterAIBrain.getSystemStatus(),
        automationEngine.getSystemStatus()
      ]);

      setSystemStatus({
        orchestrator: orchestratorStatus,
        brain: brainStatus,
        automation: automationStatus,
        lastUpdated: new Date()
      });

      setIsSystemReady(true);
      setIsLive(orchestratorStatus.isLive);

      logger.info('TSAM AI System initialized:', {
        ready: true,
        live: orchestratorStatus.isLive,
        agents: brainStatus.totalAgents,
        workflows: automationStatus.totalWorkflows
      });

    } catch (error) {
      logger.error('Failed to initialize AI system:', error);
      toast.error('AI system initialization failed');
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const processAIRequest = async (request: {
    workspace: 'sales' | 'manager' | 'developer';
    agentType: string;
    inputType: 'chat' | 'automation' | 'analysis';
    prompt: string;
    context?: any;
  }) => {
    if (!user?.id || !profile?.company_id) {
      throw new Error('User authentication required');
    }

    setIsProcessing(true);
    setProcessingMessage('Processing AI request...');

    try {
      const response = await aiOrchestrator.processRequest({
        userId: user.id,
        companyId: profile.company_id,
        workspace: request.workspace,
        agentType: request.agentType,
        inputType: request.inputType,
        prompt: request.prompt,
        context: request.context
      });

      // Log interaction
      await masterAIBrain.ingestEvent({
        user_id: user.id,
        company_id: profile.company_id,
        event_type: 'ai_interaction',
        source: 'tsam_ai_context',
        data: {
          workspace: request.workspace,
          agentType: request.agentType,
          inputType: request.inputType,
          responseId: response.id,
          model: response.model,
          confidence: response.confidence
        }
      });

      return response;

    } catch (error) {
      logger.error('AI request processing failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const triggerAutomation = async (workflowId: string, triggerData: any): Promise<string> => {
    if (!user?.id || !profile?.company_id) {
      throw new Error('User authentication required');
    }

    setIsProcessing(true);
    setProcessingMessage('Triggering automation workflow...');

    try {
      const executionId = await automationEngine.triggerWorkflow(
        workflowId,
        triggerData,
        user.id,
        profile.company_id
      );

      toast.success('Automation workflow triggered successfully');
      return executionId;

    } catch (error) {
      logger.error('Automation trigger failed:', error);
      toast.error('Failed to trigger automation');
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const approveAutomationStep = async (executionId: string, stepIndex: number): Promise<void> => {
    if (!user?.id) {
      throw new Error('User authentication required');
    }

    try {
      await automationEngine.approveStep(executionId, stepIndex, user.id);
      toast.success('Automation step approved');
    } catch (error) {
      logger.error('Automation approval failed:', error);
      toast.error('Failed to approve automation step');
      throw error;
    }
  };

  // Workspace-specific AI getters
  const getSalesAI = () => ({
    generateEmail: (prompt: string, context?: any) => 
      processAIRequest({
        workspace: 'sales',
        agentType: 'email_generation',
        inputType: 'chat',
        prompt,
        context
      }),
    analyzeLeads: (leads: any[]) =>
      processAIRequest({
        workspace: 'sales',
        agentType: 'lead_analysis',
        inputType: 'analysis',
        prompt: 'Analyze these leads for scoring and prioritization',
        context: { leads }
      }),
    generateCallScript: (leadData: any) =>
      processAIRequest({
        workspace: 'sales',
        agentType: 'call_preparation',
        inputType: 'chat',
        prompt: 'Generate a call script for this lead',
        context: { leadData }
      })
  });

  const getManagerAI = () => ({
    generateReport: (reportType: string, data: any) =>
      processAIRequest({
        workspace: 'manager',
        agentType: 'report_generation',
        inputType: 'analysis',
        prompt: `Generate a ${reportType} report`,
        context: { reportType, data }
      }),
    analyzeTeamPerformance: (teamData: any) =>
      processAIRequest({
        workspace: 'manager',
        agentType: 'performance_analysis',
        inputType: 'analysis',
        prompt: 'Analyze team performance and provide insights',
        context: { teamData }
      }),
    getStrategicInsights: (businessData: any) =>
      processAIRequest({
        workspace: 'manager',
        agentType: 'strategic_planning',
        inputType: 'analysis',
        prompt: 'Provide strategic insights and recommendations',
        context: { businessData }
      })
  });

  const getDeveloperAI = () => ({
    analyzeError: (errorData: any) =>
      processAIRequest({
        workspace: 'developer',
        agentType: 'error_analysis',
        inputType: 'analysis',
        prompt: 'Analyze this error and suggest solutions',
        context: { errorData }
      }),
    optimizeSystem: (systemMetrics: any) =>
      processAIRequest({
        workspace: 'developer',
        agentType: 'system_optimization',
        inputType: 'analysis',
        prompt: 'Analyze system metrics and suggest optimizations',
        context: { systemMetrics }
      }),
    generateFix: (bugReport: any) =>
      processAIRequest({
        workspace: 'developer',
        agentType: 'bug_resolution',
        inputType: 'chat',
        prompt: 'Generate a fix for this bug',
        context: { bugReport }
      })
  });

  // System control methods (Developer only)
  const activateAI = async (): Promise<void> => {
    if (profile?.role !== 'developer') {
      throw new Error('Only developers can activate the AI system');
    }

    setIsProcessing(true);
    setProcessingMessage('Activating TSAM AI System...');

    try {
      await Promise.all([
        aiOrchestrator.goLive(),
        automationEngine.activateAutomation()
      ]);

      setIsLive(true);
      toast.success('🚀 TSAM AI System Activated!');
      
      logger.info('🚀 TSAM AI SYSTEM ACTIVATED - Full launch complete');

    } catch (error) {
      logger.error('AI system activation failed:', error);
      toast.error('Failed to activate AI system');
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const deactivateAI = async (): Promise<void> => {
    if (profile?.role !== 'developer') {
      throw new Error('Only developers can deactivate the AI system');
    }

    setIsLive(false);
    toast.info('AI system deactivated');
    logger.info('TSAM AI system deactivated');
  };

  const getAIMetrics = () => {
    if (!systemStatus) return null;

    return {
      totalModels: systemStatus.orchestrator?.totalModels || 0,
      activeModels: systemStatus.orchestrator?.activeModels || 0,
      totalAgents: systemStatus.brain?.totalAgents || 0,
      activeAgents: systemStatus.brain?.activeAgents || 0,
      queuedInteractions: systemStatus.brain?.queuedInteractions || 0,
      readyForLaunch: systemStatus.brain?.readyForLaunch || false
    };
  };

  const getAutomationStatus = () => {
    if (!systemStatus) return null;

    return {
      totalWorkflows: systemStatus.automation?.totalWorkflows || 0,
      activeWorkflows: systemStatus.automation?.activeWorkflows || 0,
      pendingExecutions: systemStatus.automation?.pendingExecutions || 0,
      awaitingApproval: systemStatus.automation?.awaitingApproval || 0,
      isActive: systemStatus.automation?.isActive || false
    };
  };

  const value: TSAMAIContextType = {
    isSystemReady,
    isLive,
    systemStatus,
    processAIRequest,
    triggerAutomation,
    approveAutomationStep,
    getSalesAI,
    getManagerAI,
    getDeveloperAI,
    activateAI,
    deactivateAI,
    getAIMetrics,
    getAutomationStatus,
    isProcessing,
    processingMessage
  };

  return (
    <TSAMAIContext.Provider value={value}>
      {children}
    </TSAMAIContext.Provider>
  );
};

export const useTSAMAI = () => {
  const context = useContext(TSAMAIContext);
  if (context === undefined) {
    throw new Error('useTSAMAI must be used within a TSAMAIProvider');
  }
  return context;
};
