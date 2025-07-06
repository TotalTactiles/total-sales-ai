
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface AIAgentConfig {
  agentId: string;
  agentType: 'sales' | 'manager' | 'developer' | 'automation' | 'orchestrator';
  capabilities: string[];
  workspace: string;
  isActive: boolean;
  priority: number;
}

export interface AIInteraction {
  id: string;
  userId: string;
  companyId: string;
  agentType: string;
  inputType: 'chat' | 'automation' | 'system';
  inputData: any;
  responseData?: any;
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp: Date;
  processingTime?: number;
}

export interface AutomationTrigger {
  id: string;
  eventType: string;
  sourceData: any;
  targetAgent: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  userId: string;
  companyId: string;
  metadata: any;
}

class MasterAIBrain {
  private static instance: MasterAIBrain;
  private agents: Map<string, AIAgentConfig> = new Map();
  private interactionQueue: AIInteraction[] = [];
  private automationQueue: AutomationTrigger[] = [];

  static getInstance(): MasterAIBrain {
    if (!MasterAIBrain.instance) {
      MasterAIBrain.instance = new MasterAIBrain();
    }
    return MasterAIBrain.instance;
  }

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    // Sales OS Agents
    this.registerAgent({
      agentId: 'sales-ai-primary',
      agentType: 'sales',
      capabilities: ['lead_analysis', 'email_generation', 'call_preparation', 'objection_handling'],
      workspace: 'sales',
      isActive: false, // Will be activated on go-live
      priority: 1
    });

    this.registerAgent({
      agentId: 'sales-automation',
      agentType: 'automation',
      capabilities: ['email_sequences', 'lead_scoring', 'follow_up_scheduling'],
      workspace: 'sales',
      isActive: false,
      priority: 2
    });

    // Manager OS Agents
    this.registerAgent({
      agentId: 'manager-ai-primary',
      agentType: 'manager',
      capabilities: ['team_analysis', 'performance_insights', 'strategic_planning', 'report_generation'],
      workspace: 'manager',
      isActive: false,
      priority: 1
    });

    this.registerAgent({
      agentId: 'manager-automation',
      agentType: 'automation',
      capabilities: ['team_notifications', 'report_automation', 'goal_tracking'],
      workspace: 'manager',
      isActive: false,
      priority: 2
    });

    // Developer OS Agents
    this.registerAgent({
      agentId: 'developer-ai-primary',
      agentType: 'developer',
      capabilities: ['code_analysis', 'bug_detection', 'system_optimization', 'error_resolution'],
      workspace: 'developer',
      isActive: false,
      priority: 1
    });

    this.registerAgent({
      agentId: 'system-orchestrator',
      agentType: 'orchestrator',
      capabilities: ['cross_agent_communication', 'system_coordination', 'resource_management'],
      workspace: 'developer',
      isActive: false,
      priority: 1
    });
  }

  registerAgent(config: AIAgentConfig) {
    this.agents.set(config.agentId, config);
    logger.info('AI Agent registered:', { agentId: config.agentId, workspace: config.workspace });
  }

  async processInteraction(interaction: Omit<AIInteraction, 'id' | 'timestamp' | 'status'>): Promise<string> {
    const fullInteraction: AIInteraction = {
      ...interaction,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: 'pending'
    };

    // Log to database
    await this.logInteraction(fullInteraction);

    // Queue for processing (when AI goes live)
    this.interactionQueue.push(fullInteraction);

    // For now, return simulation response
    return this.generateSimulationResponse(fullInteraction);
  }

  private async logInteraction(interaction: AIInteraction): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_logs')
        .insert({
          interaction_id: interaction.id,
          user_id: interaction.userId,
          company_id: interaction.companyId,
          agent_type: interaction.agentType,
          input_type: interaction.inputType,
          input_data: interaction.inputData,
          status: interaction.status,
          timestamp: interaction.timestamp.toISOString()
        });

      if (error) {
        logger.error('Failed to log AI interaction:', error);
      }
    } catch (error) {
      logger.error('Error logging AI interaction:', error);
    }
  }

  async queueAutomationTrigger(trigger: Omit<AutomationTrigger, 'id' | 'status'>): Promise<void> {
    const fullTrigger: AutomationTrigger = {
      ...trigger,
      id: crypto.randomUUID(),
      status: 'queued'
    };

    this.automationQueue.push(fullTrigger);

    // Log automation trigger
    await this.logAutomationTrigger(fullTrigger);

    logger.info('Automation trigger queued:', { 
      id: fullTrigger.id, 
      eventType: fullTrigger.eventType,
      targetAgent: fullTrigger.targetAgent 
    });
  }

  private async logAutomationTrigger(trigger: AutomationTrigger): Promise<void> {
    try {
      const { error } = await supabase
        .from('automation_trigger_events')
        .insert({
          trigger_id: trigger.id,
          event_type: trigger.eventType,
          source_data: trigger.sourceData,
          target_agent: trigger.targetAgent,
          status: trigger.status,
          user_id: trigger.userId,
          company_id: trigger.companyId,
          metadata: trigger.metadata
        });

      if (error) {
        logger.error('Failed to log automation trigger:', error);
      }
    } catch (error) {
      logger.error('Error logging automation trigger:', error);
    }
  }

  private generateSimulationResponse(interaction: AIInteraction): string {
    const responses = {
      sales: "AI Sales Assistant ready. Lead analysis and email generation prepared for activation.",
      manager: "AI Manager Assistant ready. Team insights and performance analytics prepared for activation.", 
      developer: "AI Developer Assistant ready. System monitoring and optimization prepared for activation.",
      automation: "Automation workflows prepared. Email sequences and triggers ready for activation.",
      orchestrator: "System orchestrator ready. Cross-agent communication pathways established."
    };

    return responses[interaction.agentType as keyof typeof responses] || "AI system ready for activation.";
  }

  // Agent communication methods
  async routeToAgent(agentId: string, data: any, userId: string, companyId: string): Promise<any> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    if (!agent.isActive) {
      logger.info('Agent not active, queuing request:', { agentId, workspace: agent.workspace });
      return { status: 'queued', message: 'Agent ready for activation' };
    }

    // When live, this will route to actual AI processing
    return { status: 'ready', agent: agent.agentType, workspace: agent.workspace };
  }

  async enableAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.isActive = true;
      logger.info('AI Agent activated:', { agentId, workspace: agent.workspace });
    }
  }

  async enableAllAgents(): Promise<void> {
    for (const [agentId, agent] of this.agents) {
      agent.isActive = true;
    }
    logger.info('All AI agents activated for go-live');
  }

  // Memory and context methods
  async storePromptCache(userId: string, companyId: string, prompt: string, response: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_prompt_cache')
        .insert({
          user_id: userId,
          company_id: companyId,
          prompt_hash: await this.hashPrompt(prompt),
          prompt_text: prompt,
          response_text: response,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to store prompt cache:', error);
      }
    } catch (error) {
      logger.error('Error storing prompt cache:', error);
    }
  }

  private async hashPrompt(prompt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(prompt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // System status methods
  getSystemStatus() {
    const totalAgents = this.agents.size;
    const activeAgents = Array.from(this.agents.values()).filter(a => a.isActive).length;
    const queuedInteractions = this.interactionQueue.length;
    const queuedAutomations = this.automationQueue.length;

    return {
      totalAgents,
      activeAgents,
      queuedInteractions,
      queuedAutomations,
      readyForLaunch: totalAgents > 0 && activeAgents === 0, // All agents registered but not active yet
      agents: Array.from(this.agents.values())
    };
  }

  // Event ingestion for backwards compatibility
  async ingestEvent(event: any): Promise<void> {
    if (event.event_type === 'ai_input') {
      await this.processInteraction({
        userId: event.user_id,
        companyId: event.company_id,
        agentType: event.data?.agentType || 'sales',
        inputType: 'chat',
        inputData: event.data
      });
    } else if (event.event_type === 'automation_trigger') {
      await this.queueAutomationTrigger({
        eventType: event.data?.triggerType || 'unknown',
        sourceData: event.data,
        targetAgent: event.data?.targetAgent || 'automation',
        userId: event.user_id,
        companyId: event.company_id,
        metadata: event.context || {}
      });
    }

    // Store in brain logs for backwards compatibility
    try {
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: event.event_type,
          event_summary: `${event.source}: ${event.event_type}`,
          payload: event,
          company_id: event.company_id,
          visibility: 'admin_only'
        });

      if (error) {
        logger.error('Failed to store brain log:', error);
      }
    } catch (error) {
      logger.error('Error storing brain log:', error);
    }
  }
}

export const masterAIBrain = MasterAIBrain.getInstance();
