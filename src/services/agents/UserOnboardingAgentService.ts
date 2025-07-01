
import { supabase } from '@/integrations/supabase/client';
import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

export interface UserOnboardingData {
  userId: string;
  userRole: 'sales_rep' | 'manager';
  firstName: string;
  lastName: string;
  email: string;
  companyId: string;
  salesRegion?: string;
  teamId?: string;
  assignedTeam?: string;
}

export interface AgentDuplicationResult {
  success: boolean;
  agentId?: string;
  agentName: string;
  error?: string;
}

class UserOnboardingAgentService {
  private static instance: UserOnboardingAgentService;

  static getInstance(): UserOnboardingAgentService {
    if (!UserOnboardingAgentService.instance) {
      UserOnboardingAgentService.instance = new UserOnboardingAgentService();
    }
    return UserOnboardingAgentService.instance;
  }

  async duplicateAgentsForUser(userData: UserOnboardingData): Promise<{
    salesAgent?: AgentDuplicationResult;
    managerAgent?: AgentDuplicationResult;
    success: boolean;
    error?: string;
  }> {
    try {
      const results: any = { success: true };

      if (userData.userRole === 'sales_rep') {
        results.salesAgent = await this.duplicateSalesAgent(userData);
        if (!results.salesAgent.success) {
          results.success = false;
          results.error = results.salesAgent.error;
        }
      } else if (userData.userRole === 'manager') {
        results.managerAgent = await this.duplicateManagerAgent(userData);
        if (!results.managerAgent.success) {
          results.success = false;
          results.error = results.managerAgent.error;
        }
      }

      // Log the duplication result
      await this.logAgentDuplication(userData, results);

      // Update user profile with agent information
      if (results.success) {
        await this.updateUserProfileWithAgent(userData, results);
      } else {
        await this.handleDuplicationFailure(userData, results.error);
      }

      return results;

    } catch (error) {
      logger.error('Agent duplication failed:', error);
      await this.handleDuplicationFailure(userData, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async duplicateSalesAgent(userData: UserOnboardingData): Promise<AgentDuplicationResult> {
    try {
      const agentName = `SalesAgent_${userData.firstName}${userData.lastName}`;
      
      // Create agent configuration for duplication
      const agentConfig = {
        templateName: 'SalesAgent_SAM_Template',
        newAgentName: agentName,
        memoryVariables: {
          repName: `${userData.firstName} ${userData.lastName}`,
          repID: userData.userId,
          repEmail: userData.email,
          userRole: 'sales_rep',
          salesRegion: userData.salesRegion || 'default',
          teamID: userData.teamId || 'default',
          companyId: userData.companyId
        },
        triggers: [
          `leadAssignedToRep == ${userData.firstName} ${userData.lastName}`,
          `repID == ${userData.userId}`,
          `userRole == sales_rep`
        ]
      };

      // Execute duplication via Relevance AI
      const result = await relevanceAgentService.executeDeveloperAgent(
        'duplicate_sales_agent',
        agentConfig,
        userData.userId,
        userData.companyId
      );

      if (result.success) {
        // Test the new agent
        const testResult = await this.testAgentResponse(agentName, userData);
        
        if (!testResult.success) {
          throw new Error(`Agent created but test failed: ${testResult.error}`);
        }

        return {
          success: true,
          agentId: result.taskId,
          agentName
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      return {
        success: false,
        agentName: `SalesAgent_${userData.firstName}${userData.lastName}`,
        error: error.message
      };
    }
  }

  private async duplicateManagerAgent(userData: UserOnboardingData): Promise<AgentDuplicationResult> {
    try {
      const agentName = `ManagerAgent_${userData.firstName}${userData.lastName}`;
      
      // Create agent configuration for duplication
      const agentConfig = {
        templateName: 'ManagerAgent_MIRA_Template',
        newAgentName: agentName,
        memoryVariables: {
          managerName: `${userData.firstName} ${userData.lastName}`,
          managerID: userData.userId,
          managerEmail: userData.email,
          userRole: 'manager',
          assignedTeam: userData.assignedTeam || 'default',
          salesRegion: userData.salesRegion || 'default',
          companyId: userData.companyId
        },
        triggers: [
          `managerID == ${userData.userId}`,
          `assignedTeam == ${userData.assignedTeam}`,
          `userRole == manager`
        ]
      };

      // Execute duplication via Relevance AI
      const result = await relevanceAgentService.executeDeveloperAgent(
        'duplicate_manager_agent',
        agentConfig,
        userData.userId,
        userData.companyId
      );

      if (result.success) {
        // Test the new agent
        const testResult = await this.testAgentResponse(agentName, userData);
        
        if (!testResult.success) {
          throw new Error(`Agent created but test failed: ${testResult.error}`);
        }

        return {
          success: true,
          agentId: result.taskId,
          agentName
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      return {
        success: false,
        agentName: `ManagerAgent_${userData.firstName}${userData.lastName}`,
        error: error.message
      };
    }
  }

  private async testAgentResponse(agentName: string, userData: UserOnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
      // Send a test prompt to verify the agent is working
      const testPrompt = `Hello, this is a test to verify agent ${agentName} is working correctly.`;
      
      if (userData.userRole === 'sales_rep') {
        const result = await relevanceAgentService.executeSalesAgent(
          'test_response',
          { prompt: testPrompt, agentName },
          userData.userId,
          userData.companyId
        );
        return { success: result.success, error: result.error };
      } else {
        const result = await relevanceAgentService.executeManagerAgent(
          'test_response',
          { prompt: testPrompt, agentName },
          userData.userId,
          userData.companyId
        );
        return { success: result.success, error: result.error };
      }

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async logAgentDuplication(userData: UserOnboardingData, results: any): Promise<void> {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'agent_duplication',
          event_summary: `Agent duplication for ${userData.userRole}: ${userData.firstName} ${userData.lastName}`,
          payload: {
            userId: userData.userId,
            userRole: userData.userRole,
            results,
            timestamp: new Date().toISOString()
          },
          user_id: userData.userId,
          company_id: userData.companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Failed to log agent duplication:', error);
    }
  }

  private async updateUserProfileWithAgent(userData: UserOnboardingData, results: any): Promise<void> {
    try {
      const agentInfo = userData.userRole === 'sales_rep' ? results.salesAgent : results.managerAgent;
      
      await supabase
        .from('profiles')
        .update({
          personalized_agent_id: agentInfo.agentId,
          personalized_agent_name: agentInfo.agentName,
          agent_created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.userId);

    } catch (error) {
      logger.error('Failed to update user profile with agent info:', error);
    }
  }

  private async handleDuplicationFailure(userData: UserOnboardingData, errorMessage: string): Promise<void> {
    try {
      // Log the failure
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'agent_duplication_failure',
          event_summary: `Agent duplication failed for ${userData.userRole}: ${userData.firstName} ${userData.lastName}`,
          payload: {
            userId: userData.userId,
            userRole: userData.userRole,
            error: errorMessage,
            timestamp: new Date().toISOString()
          },
          user_id: userData.userId,
          company_id: userData.companyId,
          visibility: 'admin_only'
        });

      // Send alert to Developer Agent
      await relevanceAgentService.executeDeveloperAgent(
        'handle_agent_duplication_failure',
        {
          agentDuplicationIssue: true,
          userRole: userData.userRole,
          userId: userData.userId,
          error: errorMessage,
          timestamp: new Date().toISOString()
        },
        'system',
        'system'
      );

      // Create notification for admin
      await supabase
        .from('notifications')
        .insert({
          user_id: userData.userId,
          company_id: userData.companyId,
          type: 'agent_duplication_failed',
          title: 'Agent Duplication Failed',
          message: `Failed to create personalized AI agent for ${userData.firstName} ${userData.lastName}`,
          metadata: {
            userRole: userData.userRole,
            error: errorMessage,
            requiresManualIntervention: true
          }
        });

    } catch (error) {
      logger.error('Failed to handle duplication failure:', error);
    }
  }

  async recreateAgentForUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      const userData: UserOnboardingData = {
        userId: profile.id,
        userRole: profile.role,
        firstName: profile.full_name?.split(' ')[0] || 'User',
        lastName: profile.full_name?.split(' ')[1] || '',
        email: profile.email || '',
        companyId: profile.company_id,
        salesRegion: profile.sales_region,
        teamId: profile.team_id,
        assignedTeam: profile.assigned_team
      };

      const result = await this.duplicateAgentsForUser(userData);
      
      if (result.success) {
        toast.success('AI Agent recreated successfully');
      } else {
        toast.error(`Failed to recreate AI Agent: ${result.error}`);
      }

      return result;

    } catch (error) {
      logger.error('Failed to recreate agent:', error);
      toast.error('Failed to recreate AI Agent');
      return { success: false, error: error.message };
    }
  }
}

export const userOnboardingAgentService = UserOnboardingAgentService.getInstance();
