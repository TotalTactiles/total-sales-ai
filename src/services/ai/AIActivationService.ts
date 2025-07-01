
import { supabase } from '@/integrations/supabase/client';
import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { agentOrchestrator } from '@/services/agents/AgentOrchestrator';
import { userOnboardingAgentService } from '@/services/agents/UserOnboardingAgentService';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

export interface AIActivationResult {
  success: boolean;
  activatedAgents: string[];
  errors: string[];
  userAccounts: {
    demoSalesRep: boolean;
    demoManager: boolean;
    realUsers: string[];
  };
}

class AIActivationService {
  private static instance: AIActivationService;

  static getInstance(): AIActivationService {
    if (!AIActivationService.instance) {
      AIActivationService.instance = new AIActivationService();
    }
    return AIActivationService.instance;
  }

  async activateFullAISystem(): Promise<AIActivationResult> {
    const result: AIActivationResult = {
      success: false,
      activatedAgents: [],
      errors: [],
      userAccounts: {
        demoSalesRep: false,
        demoManager: false,
        realUsers: []
      }
    };

    try {
      // 1. Activate demo accounts
      await this.activateDemoAccounts(result);

      // 2. Activate real user accounts
      await this.activateRealUserAccounts(result);

      // 3. Initialize agent connections
      await this.initializeAgentConnections(result);

      // 4. Validate system health
      await this.validateSystemHealth(result);

      result.success = result.errors.length === 0;
      
      if (result.success) {
        toast.success('AI System fully activated!');
        logger.info('AI System activation complete', result);
      } else {
        toast.error(`AI Activation completed with ${result.errors.length} errors`);
        logger.warn('AI System activation completed with errors', result.errors);
      }

      return result;

    } catch (error) {
      logger.error('AI Activation failed:', error);
      result.errors.push(error.message);
      result.success = false;
      return result;
    }
  }

  private async activateDemoAccounts(result: AIActivationResult): Promise<void> {
    try {
      // Create demo sales rep account
      const demoSalesData = {
        userId: 'demo_sales_rep',
        userRole: 'sales_rep' as const,
        firstName: 'Demo',
        lastName: 'Sales Rep',
        email: 'demo.sales@company.com',
        companyId: 'demo_company',
        salesRegion: 'North America',
        teamId: 'demo_team'
      };

      const salesResult = await userOnboardingAgentService.duplicateAgentsForUser(demoSalesData);
      if (salesResult.success) {
        result.userAccounts.demoSalesRep = true;
        result.activatedAgents.push('Demo Sales Agent (Sam)');
      } else {
        result.errors.push(`Demo Sales Rep activation failed: ${salesResult.error}`);
      }

      // Create demo manager account
      const demoManagerData = {
        userId: 'demo_manager',
        userRole: 'manager' as const,
        firstName: 'Demo',
        lastName: 'Manager',
        email: 'demo.manager@company.com',
        companyId: 'demo_company',
        assignedTeam: 'demo_team'
      };

      const managerResult = await userOnboardingAgentService.duplicateAgentsForUser(demoManagerData);
      if (managerResult.success) {
        result.userAccounts.demoManager = true;
        result.activatedAgents.push('Demo Manager Agent (MIRA)');
      } else {
        result.errors.push(`Demo Manager activation failed: ${managerResult.error}`);
      }

    } catch (error) {
      result.errors.push(`Demo account activation error: ${error.message}`);
    }
  }

  private async activateRealUserAccounts(result: AIActivationResult): Promise<void> {
    try {
      // Get all real users who need agent activation
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['sales_rep', 'manager'])
        .is('personalized_agent_id', null);

      if (!users) return;

      for (const user of users) {
        try {
          const userData = {
            userId: user.id,
            userRole: user.role as 'sales_rep' | 'manager',
            firstName: user.full_name?.split(' ')[0] || 'User',
            lastName: user.full_name?.split(' ')[1] || '',
            email: user.email || '',
            companyId: user.company_id,
            salesRegion: (user as any).sales_region,
            teamId: (user as any).team_id,
            assignedTeam: (user as any).assigned_team
          };

          const activationResult = await userOnboardingAgentService.duplicateAgentsForUser(userData);
          
          if (activationResult.success) {
            result.userAccounts.realUsers.push(user.id);
            result.activatedAgents.push(`${user.role} Agent for ${user.full_name}`);
          } else {
            result.errors.push(`User ${user.full_name} activation failed: ${activationResult.error}`);
          }

        } catch (userError) {
          result.errors.push(`Error activating user ${user.full_name}: ${userError.message}`);
        }
      }

    } catch (error) {
      result.errors.push(`Real user activation error: ${error.message}`);
    }
  }

  private async initializeAgentConnections(result: AIActivationResult): Promise<void> {
    try {
      // Initialize Sales Agent capabilities
      const salesCapabilities = [
        'lead_summary',
        'follow_up_suggestions', 
        'objection_handling',
        'email_drafting',
        'automation_recommendations',
        'lead_prioritization',
        'deal_review',
        'pitch_rehearsal'
      ];

      // Initialize Manager Agent capabilities
      const managerCapabilities = [
        'weekly_digest',
        'coaching_nudges',
        'reassignment_suggestions',
        'lead_quality_audit',
        'pipeline_analysis',
        'pulse_survey',
        'training_suggestions'
      ];

      // Test each capability
      for (const capability of salesCapabilities) {
        try {
          const testResult = await agentOrchestrator.executeTask({
            agentType: 'salesAgent_v1',
            taskType: capability,
            context: {
              workspace: 'test',
              userRole: 'sales_rep',
              companyId: 'demo_company',
              userId: 'demo_sales_rep'
            },
            priority: 'low'
          });

          if (testResult.status === 'completed') {
            result.activatedAgents.push(`Sales Agent - ${capability}`);
          } else {
            result.errors.push(`Sales Agent ${capability} test failed`);
          }
        } catch (capError) {
          result.errors.push(`Sales Agent ${capability} initialization error: ${capError.message}`);
        }
      }

      for (const capability of managerCapabilities) {
        try {
          const testResult = await agentOrchestrator.executeTask({
            agentType: 'managerAgent_v1',
            taskType: capability,
            context: {
              workspace: 'test',
              userRole: 'manager',
              companyId: 'demo_company',
              userId: 'demo_manager'
            },
            priority: 'low'
          });

          if (testResult.status === 'completed') {
            result.activatedAgents.push(`Manager Agent - ${capability}`);
          } else {
            result.errors.push(`Manager Agent ${capability} test failed`);
          }
        } catch (capError) {
          result.errors.push(`Manager Agent ${capability} initialization error: ${capError.message}`);
        }
      }

    } catch (error) {
      result.errors.push(`Agent connection initialization error: ${error.message}`);
    }
  }

  private async validateSystemHealth(result: AIActivationResult): Promise<void> {
    try {
      // Check Relevance AI health
      const relevanceHealth = await relevanceAgentService.healthCheck();
      if (!relevanceHealth) {
        result.errors.push('Relevance AI service health check failed');
      }

      // Check orchestrator performance metrics
      const metrics = agentOrchestrator.getPerformanceMetrics();
      if (metrics.size === 0) {
        result.errors.push('No agent performance metrics available');
      }

      // Validate demo user agents
      const { data: demoSalesProfile } = await supabase
        .from('profiles')
        .select('personalized_agent_id')
        .eq('id', 'demo_sales_rep')
        .single();

      if (!demoSalesProfile?.personalized_agent_id) {
        result.errors.push('Demo sales rep agent not properly linked');
      }

      const { data: demoManagerProfile } = await supabase
        .from('profiles')
        .select('personalized_agent_id')
        .eq('id', 'demo_manager')
        .single();

      if (!demoManagerProfile?.personalized_agent_id) {
        result.errors.push('Demo manager agent not properly linked');
      }

    } catch (error) {
      result.errors.push(`System health validation error: ${error.message}`);
    }
  }

  async getActivationStatus(): Promise<{
    isActive: boolean;
    agentCount: number;
    activeUsers: number;
    lastActivation: string | null;
  }> {
    try {
      // Get active agents count
      const { count: agentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .not('personalized_agent_id', 'is', null);

      // Get active users count
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .in('role', ['sales_rep', 'manager']);

      // Get last activation timestamp
      const { data: lastLog } = await supabase
        .from('ai_brain_logs')
        .select('created_at')
        .eq('type', 'system_activation')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        isActive: (agentCount || 0) > 0,
        agentCount: agentCount || 0,
        activeUsers: activeUsers || 0,
        lastActivation: lastLog?.created_at || null
      };

    } catch (error) {
      logger.error('Error getting activation status:', error);
      return {
        isActive: false,
        agentCount: 0,
        activeUsers: 0,
        lastActivation: null
      };
    }
  }
}

export const aiActivationService = AIActivationService.getInstance();
