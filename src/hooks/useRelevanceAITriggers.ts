
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { relevanceAIAgent } from '@/services/relevance/RelevanceAIAgentService';
import { logger } from '@/utils/logger';

export const useRelevanceAITriggers = () => {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user?.id || !profile?.company_id) return;

    // Set up real-time listeners for lead changes
    const leadChannel = supabase
      .channel('lead-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `company_id=eq.${profile.company_id}`
        },
        async (payload) => {
          logger.info('New lead detected, triggering AI analysis', { leadId: payload.new.id });
          
          await relevanceAIAgent.executeAgentTask(
            'salesAgent_v1',
            'lead_analysis',
            {
              lead: payload.new,
              trigger: 'new_lead',
              timestamp: new Date().toISOString()
            },
            user.id,
            profile.company_id
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: `company_id=eq.${profile.company_id}`
        },
        async (payload) => {
          const oldLead = payload.old;
          const newLead = payload.new;
          
          // Trigger AI analysis on status changes
          if (oldLead.status !== newLead.status) {
            logger.info('Lead status changed, triggering AI analysis', { 
              leadId: newLead.id, 
              oldStatus: oldLead.status, 
              newStatus: newLead.status 
            });
            
            await relevanceAIAgent.executeAgentTask(
              'salesAgent_v1',
              'status_change_analysis',
              {
                lead: newLead,
                previousStatus: oldLead.status,
                newStatus: newLead.status,
                trigger: 'status_change',
                timestamp: new Date().toISOString()
              },
              user.id,
              profile.company_id
            );
          }

          // Trigger follow-up generation for high-priority leads
          if (newLead.priority === 'high' && oldLead.priority !== 'high') {
            logger.info('Lead marked as high priority, generating follow-up strategy', { leadId: newLead.id });
            
            await relevanceAIAgent.executeAgentTask(
              'salesAgent_v1',
              'follow_up_generation',
              {
                lead: newLead,
                trigger: 'high_priority',
                timestamp: new Date().toISOString()
              },
              user.id,
              profile.company_id
            );
          }
        }
      )
      .subscribe();

    // Set up call log triggers
    const callChannel = supabase
      .channel('call-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_logs',
          filter: `company_id=eq.${profile.company_id}`
        },
        async (payload) => {
          logger.info('New call logged, triggering AI analysis', { callId: payload.new.id });
          
          await relevanceAIAgent.executeAgentTask(
            'salesAgent_v1',
            'call_summary',
            {
              call: payload.new,
              trigger: 'call_completed',
              timestamp: new Date().toISOString()
            },
            user.id,
            profile.company_id
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadChannel);
      supabase.removeChannel(callChannel);
    };
  }, [user?.id, profile?.company_id]);

  // Manual trigger functions
  const triggerLeadAnalysis = async (leadId: string, leadData: any) => {
    if (!user?.id || !profile?.company_id) return;
    
    return await relevanceAIAgent.executeAgentTask(
      'salesAgent_v1',
      'lead_analysis',
      {
        lead: leadData,
        leadId,
        trigger: 'manual',
        timestamp: new Date().toISOString()
      },
      user.id,
      profile.company_id
    );
  };

  const triggerFollowUpGeneration = async (leadId: string, context: any) => {
    if (!user?.id || !profile?.company_id) return;
    
    return await relevanceAIAgent.executeAgentTask(
      'salesAgent_v1',
      'follow_up_generation',
      {
        leadId,
        context,
        trigger: 'manual',
        timestamp: new Date().toISOString()
      },
      user.id,
      profile.company_id
    );
  };

  const triggerObjectionHandling = async (objection: string, context: any) => {
    if (!user?.id || !profile?.company_id) return;
    
    return await relevanceAIAgent.executeAgentTask(
      'salesAgent_v1',
      'objection_handling',
      {
        objection,
        context,
        trigger: 'manual',
        timestamp: new Date().toISOString()
      },
      user.id,
      profile.company_id
    );
  };

  const triggerEmailDraft = async (recipient: string, context: any) => {
    if (!user?.id || !profile?.company_id) return;
    
    return await relevanceAIAgent.executeAgentTask(
      'salesAgent_v1',
      'email_draft',
      {
        recipient,
        context,
        trigger: 'manual',
        timestamp: new Date().toISOString()
      },
      user.id,
      profile.company_id
    );
  };

  return {
    triggerLeadAnalysis,
    triggerFollowUpGeneration,
    triggerObjectionHandling,
    triggerEmailDraft
  };
};
