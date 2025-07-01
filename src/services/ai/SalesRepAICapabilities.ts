
import { agentOrchestrator } from '@/services/agents/AgentOrchestrator';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface SalesAICapability {
  name: string;
  description: string;
  category: 'lead_management' | 'communication' | 'training' | 'automation';
  isActive: boolean;
}

export interface LeadSummaryRequest {
  leadId: string;
  includeHistory?: boolean;
  includeInsights?: boolean;
}

export interface FollowUpSuggestion {
  type: 'email' | 'call' | 'task';
  priority: 'high' | 'medium' | 'low';
  content: string;
  bestTime?: string;
  reasoning: string;
}

class SalesRepAICapabilities {
  private static instance: SalesRepAICapabilities;

  static getInstance(): SalesRepAICapabilities {
    if (!SalesRepAICapabilities.instance) {
      SalesRepAICapabilities.instance = new SalesRepAICapabilities();
    }
    return SalesRepAICapabilities.instance;
  }

  // Lead Summary Generation
  async getLeadSummary(request: LeadSummaryRequest, userId: string, companyId: string) {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'lead_summary',
        context: {
          workspace: 'leads',
          userRole: 'sales_rep',
          companyId,
          userId,
          leadId: request.leadId,
          includeHistory: request.includeHistory,
          includeInsights: request.includeInsights
        },
        priority: 'medium'
      });

      return result;
    } catch (error) {
      logger.error('Lead summary generation failed:', error);
      throw error;
    }
  }

  // Smart Follow-Up Suggestions
  async generateFollowUpSuggestions(leadId: string, userId: string, companyId: string): Promise<FollowUpSuggestion[]> {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'follow_up_suggestions',
        context: {
          workspace: 'leads',
          userRole: 'sales_rep',
          companyId,
          userId,
          leadId
        },
        priority: 'medium'
      });

      return result.output_payload?.suggestions || [];
    } catch (error) {
      logger.error('Follow-up suggestions failed:', error);
      return [];
    }
  }

  // Objection Handling
  async handleObjection(objectionType: string, context: string, userId: string, companyId: string) {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'objection_handling',
        context: {
          workspace: 'conversation',
          userRole: 'sales_rep',
          companyId,
          userId,
          objectionType,
          conversationContext: context
        },
        priority: 'high'
      });

      return result;
    } catch (error) {
      logger.error('Objection handling failed:', error);
      throw error;
    }
  }

  // Email Drafting
  async draftEmail(templateId: string, leadContext: any, userId: string, companyId: string) {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'email_drafting',
        context: {
          workspace: 'email',
          userRole: 'sales_rep',
          companyId,
          userId,
          templateId,
          leadContext
        },
        priority: 'medium'
      });

      return result;
    } catch (error) {
      logger.error('Email drafting failed:', error);
      throw error;
    }
  }

  // Automation Recommendations
  async suggestAutomation(leadStatus: string, userId: string, companyId: string) {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'automation_recommendations',
        context: {
          workspace: 'automation',
          userRole: 'sales_rep',
          companyId,
          userId,
          leadStatus
        },
        priority: 'low'
      });

      return result;
    } catch (error) {
      logger.error('Automation suggestions failed:', error);
      throw error;
    }
  }

  // Lead Prioritization
  async prioritizeLeads(criteria: any, userId: string, companyId: string) {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'lead_prioritization',
        context: {
          workspace: 'leads',
          userRole: 'sales_rep',
          companyId,
          userId,
          prioritizationCriteria: criteria
        },
        priority: 'medium'
      });

      return result;
    } catch (error) {
      logger.error('Lead prioritization failed:', error);
      throw error;
    }
  }

  // Deal Review
  async reviewDeal(leadId: string, outcome: 'won' | 'lost', userId: string, companyId: string) {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'deal_review',
        context: {
          workspace: 'deals',
          userRole: 'sales_rep',
          companyId,
          userId,
          leadId,
          dealOutcome: outcome
        },
        priority: 'medium'
      });

      // Log the review for learning
      await this.logDealReview(leadId, outcome, result, userId, companyId);

      return result;
    } catch (error) {
      logger.error('Deal review failed:', error);
      throw error;
    }
  }

  // Pitch Rehearsal
  async startPitchRehearsal(topic: string, userId: string, companyId: string) {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: 'salesAgent_v1',
        taskType: 'pitch_rehearsal',
        context: {
          workspace: 'training',
          userRole: 'sales_rep',
          companyId,
          userId,
          rehearsalTopic: topic
        },
        priority: 'low'
      });

      return result;
    } catch (error) {
      logger.error('Pitch rehearsal failed:', error);
      throw error;
    }
  }

  // Get Available Capabilities
  async getCapabilities(userId: string, companyId: string): Promise<SalesAICapability[]> {
    const capabilities: SalesAICapability[] = [
      {
        name: 'Lead Summary',
        description: 'Generate comprehensive lead summaries with insights',
        category: 'lead_management',
        isActive: true
      },
      {
        name: 'Follow-Up Suggestions',
        description: 'Smart recommendations for next steps with leads',
        category: 'lead_management',
        isActive: true
      },
      {
        name: 'Objection Handling',
        description: 'AI-powered responses to common objections',
        category: 'communication',
        isActive: true
      },
      {
        name: 'Email Drafting',
        description: 'Personalized email templates and suggestions',
        category: 'communication',
        isActive: true
      },
      {
        name: 'Automation Recommendations',
        description: 'Suggest optimal workflows and automations',
        category: 'automation',
        isActive: true
      },
      {
        name: 'Lead Prioritization',
        description: 'AI-driven lead scoring and queue optimization',
        category: 'lead_management',
        isActive: true
      },
      {
        name: 'Deal Review',
        description: 'Post-deal analysis and learning extraction',
        category: 'lead_management',
        isActive: true
      },
      {
        name: 'Pitch Rehearsal',
        description: 'Interactive practice sessions with AI feedback',
        category: 'training',
        isActive: true
      }
    ];

    return capabilities;
  }

  private async logDealReview(leadId: string, outcome: string, review: any, userId: string, companyId: string) {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'deal_review',
          event_summary: `Deal ${outcome}: AI review completed`,
          payload: {
            leadId,
            outcome,
            review: review.output_payload,
            insights: review.output_payload?.insights,
            recommendations: review.output_payload?.recommendations
          },
          user_id: userId,
          company_id: companyId,
          visibility: 'user_accessible'
        });
    } catch (error) {
      logger.error('Failed to log deal review:', error);
    }
  }
}

export const salesRepAICapabilities = SalesRepAICapabilities.getInstance();
