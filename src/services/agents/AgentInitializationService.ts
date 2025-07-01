
import { supabase } from '@/integrations/supabase/client';
import { relevanceAgentService } from '@/services/relevance/RelevanceAgentService';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

export interface RepProfile {
  repName: string;
  crmRepID: string;
  repCalendar: string;
  repMemorySpace: string;
  repTone: string;
  email: string;
  userId: string;
  companyId: string;
}

export interface AgentCreationResult {
  result: string;
  rep: string;
  salesAgent?: string;
  automationAgent?: string;
  developerAgent?: string;
  status: string;
  error?: string;
}

class AgentInitializationService {
  private static instance: AgentInitializationService;

  static getInstance(): AgentInitializationService {
    if (!AgentInitializationService.instance) {
      AgentInitializationService.instance = new AgentInitializationService();
    }
    return AgentInitializationService.instance;
  }

  async initializeAgentsForNewRep(repProfile: RepProfile): Promise<AgentCreationResult> {
    try {
      logger.info('Starting agent initialization for new rep', { repName: repProfile.repName }, 'agent_init');

      // Step 1: Create and personalize Sales Agent (Sam)
      const salesAgentResult = await this.createSalesAgent(repProfile);
      if (!salesAgentResult.success) {
        throw new Error(`Sales Agent creation failed: ${salesAgentResult.error}`);
      }

      // Step 2: Bind Automation Agent (Atlas)
      const automationAgentResult = await this.bindAutomationAgent(repProfile);
      if (!automationAgentResult.success) {
        throw new Error(`Automation Agent binding failed: ${automationAgentResult.error}`);
      }

      // Step 3: Link Developer Agent (Nova)
      const developerAgentResult = await this.linkDeveloperAgent(repProfile);
      if (!developerAgentResult.success) {
        throw new Error(`Developer Agent linking failed: ${developerAgentResult.error}`);
      }

      // Step 4: Inject trigger bindings
      await this.injectTriggerBindings(repProfile);

      // Step 5: Perform health checks
      const healthCheckResult = await this.performHealthChecks(repProfile);
      if (!healthCheckResult.success) {
        throw new Error(`Health checks failed: ${healthCheckResult.error}`);
      }

      // Log success
      await this.logAgentCreation(repProfile, 'success');

      const result: AgentCreationResult = {
        result: "Agents created and bound successfully",
        rep: repProfile.repName,
        salesAgent: `Sam | Sales Rep Agent ${repProfile.repName}`,
        automationAgent: "Atlas | Automation Agent",
        developerAgent: "Nova | Developer Agent",
        status: "✅ Active"
      };

      toast.success(`AI Agents initialized for ${repProfile.repName}`);
      return result;

    } catch (error) {
      logger.error('Agent initialization failed', error, 'agent_init');
      
      await this.logAgentCreation(repProfile, 'failed', error.message);
      await this.escalateToSystemOrchestrator(repProfile, error.message);

      const result: AgentCreationResult = {
        result: "Agent creation failed",
        rep: repProfile.repName,
        error: error.message,
        status: "❌ Escalated to Core"
      };

      toast.error(`Agent initialization failed for ${repProfile.repName}`);
      return result;
    }
  }

  private async createSalesAgent(repProfile: RepProfile): Promise<{ success: boolean; error?: string; agentId?: string }> {
    try {
      const agentName = `Sam | Sales Rep Agent ${repProfile.repName}`;
      
      // Create agent configuration
      const agentConfig = {
        name: agentName,
        repName: repProfile.repName,
        repTone: repProfile.repTone,
        crmRepID: repProfile.crmRepID,
        repCalendar: repProfile.repCalendar,
        memoryBucket: repProfile.repMemorySpace,
        triggers: [
          `leadAssignedToRep == ${repProfile.repName}`,
          `tagAddedByRep == ${repProfile.repName}`
        ]
      };

      // Execute agent creation via Relevance AI
      const result = await relevanceAgentService.executeSalesAgent(
        'create_personalized_agent',
        agentConfig,
        repProfile.userId,
        repProfile.companyId
      );

      if (result.success) {
        // Update sales agent memory
        await relevanceAgentService.updateSalesAgentMemory(
          repProfile.repName,
          {
            repName: repProfile.repName,
            repTone: repProfile.repTone,
            crmRepID: repProfile.crmRepID,
            repCalendar: repProfile.repCalendar,
            active: true,
            created_at: new Date().toISOString()
          }
        );

        return { success: true, agentId: result.taskId };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async bindAutomationAgent(repProfile: RepProfile): Promise<{ success: boolean; error?: string }> {
    try {
      const bindingConfig = {
        repName: repProfile.repName,
        sharedQueue: 'automation_queue',
        events: [
          'follow_up_tag_added',
          'task_completed',
          'delay_completed',
          'email_template_queued'
        ],
        fallbackAgent: 'Nova | Developer Agent'
      };

      const result = await relevanceAgentService.executeAutomationAgent(
        'bind_rep_to_automation',
        bindingConfig,
        repProfile.userId,
        repProfile.companyId
      );

      if (result.success) {
        // Update automation agent memory
        await relevanceAgentService.updateAutomationAgentMemory(
          `automation_${repProfile.repName}`,
          {
            repName: repProfile.repName,
            boundEvents: bindingConfig.events,
            active: true,
            created_at: new Date().toISOString()
          }
        );
      }

      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async linkDeveloperAgent(repProfile: RepProfile): Promise<{ success: boolean; error?: string }> {
    try {
      const linkConfig = {
        watchedRep: repProfile.repName,
        triggers: [
          'failed_automation',
          'ai_agent_timeout',
          'no_output_error'
        ],
        orchestrator: 'Core | System Brain Monitor',
        memoryType: 'shared_monitoring'
      };

      const result = await relevanceAgentService.executeDeveloperAgent(
        'link_rep_monitoring',
        linkConfig,
        repProfile.userId,
        repProfile.companyId
      );

      if (result.success) {
        // Update developer agent memory
        await relevanceAgentService.updateDeveloperAgentMemory(
          `dev_${repProfile.repName}`,
          {
            watchedRep: repProfile.repName,
            monitoringScope: linkConfig.triggers,
            active: true,
            created_at: new Date().toISOString()
          }
        );
      }

      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async injectTriggerBindings(repProfile: RepProfile): Promise<void> {
    try {
      // Inject repName into all agent triggers
      const triggerConfig = {
        triggeredBy: repProfile.repName,
        crmSync: repProfile.crmRepID,
        activeFlag: true
      };

      await Promise.all([
        relevanceAgentService.updateSalesAgentMemory(repProfile.repName, triggerConfig),
        relevanceAgentService.updateAutomationAgentMemory(`automation_${repProfile.repName}`, triggerConfig)
      ]);

    } catch (error) {
      logger.error('Failed to inject trigger bindings', error, 'agent_init');
      throw error;
    }
  }

  private async performHealthChecks(repProfile: RepProfile): Promise<{ success: boolean; error?: string }> {
    try {
      const agents = [
        `Sam | Sales Rep Agent ${repProfile.repName}`,
        'Atlas | Automation Agent',
        'Nova | Developer Agent'
      ];

      const healthResults = await Promise.allSettled(
        agents.map(async (agentName) => {
          const isHealthy = await relevanceAgentService.healthCheck();
          return { agentName, isHealthy };
        })
      );

      const failedAgents = healthResults
        .filter(result => result.status === 'rejected' || !result.value.isHealthy)
        .map(result => result.status === 'fulfilled' ? result.value.agentName : 'unknown');

      if (failedAgents.length > 0) {
        // Retry failed agents after 5 minutes
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
        
        const retryResults = await Promise.allSettled(
          failedAgents.map(async (agentName) => {
            const isHealthy = await relevanceAgentService.healthCheck();
            return { agentName, isHealthy };
          })
        );

        const stillFailedAgents = retryResults
          .filter(result => result.status === 'rejected' || !result.value.isHealthy)
          .map(result => result.status === 'fulfilled' ? result.value.agentName : 'unknown');

        if (stillFailedAgents.length > 0) {
          await this.logFailedAgents(repProfile, stillFailedAgents);
          await this.sendSlackNotification(repProfile, stillFailedAgents);
          return { success: false, error: `Agents still inactive: ${stillFailedAgents.join(', ')}` };
        }
      }

      await this.logSuccessfulAgents(repProfile);
      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async logAgentCreation(repProfile: RepProfile, status: string, error?: string): Promise<void> {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'agent_initialization',
          event_summary: `Agent creation ${status} for ${repProfile.repName}`,
          payload: {
            repName: repProfile.repName,
            status,
            error,
            timestamp: new Date().toISOString()
          },
          company_id: repProfile.companyId,
          visibility: 'admin_only'
        });
    } catch (logError) {
      logger.error('Failed to log agent creation', logError, 'agent_init');
    }
  }

  private async escalateToSystemOrchestrator(repProfile: RepProfile, error: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: repProfile.userId,
          company_id: repProfile.companyId,
          type: 'system_escalation',
          title: 'Agent Creation Failed',
          message: `Agent initialization failed for ${repProfile.repName}: ${error}`,
          metadata: {
            repName: repProfile.repName,
            escalationType: 'agent_creation_failure',
            requiresDevAttention: true
          }
        });
    } catch (escalationError) {
      logger.error('Failed to escalate to system orchestrator', escalationError, 'agent_init');
    }
  }

  private async logFailedAgents(repProfile: RepProfile, failedAgents: string[]): Promise<void> {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'agent_creation_failed',
          event_summary: `Failed agents: ${failedAgents.join(', ')}`,
          payload: {
            repName: repProfile.repName,
            failedAgents,
            timestamp: new Date().toISOString()
          },
          company_id: repProfile.companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Failed to log failed agents', error, 'agent_init');
    }
  }

  private async logSuccessfulAgents(repProfile: RepProfile): Promise<void> {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'agent_creation_success',
          event_summary: `All agents active for ${repProfile.repName}`,
          payload: {
            repName: repProfile.repName,
            timestamp: new Date().toISOString()
          },
          company_id: repProfile.companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Failed to log successful agents', error, 'agent_init');
    }
  }

  private async sendSlackNotification(repProfile: RepProfile, failedAgents: string[]): Promise<void> {
    try {
      await supabase.functions.invoke('slack-notification', {
        body: {
          message: `🚨 Agent Creation Alert: Failed to initialize agents for ${repProfile.repName}. Failed agents: ${failedAgents.join(', ')}`,
          channel: '#dev-alerts',
          repName: repProfile.repName,
          failedAgents
        }
      });
    } catch (error) {
      logger.error('Failed to send Slack notification', error, 'agent_init');
    }
  }
}

export const agentInitializationService = AgentInitializationService.getInstance();
