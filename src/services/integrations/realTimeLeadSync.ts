
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMDataMapper, CRMLeadData } from './crmDataMapper';

export interface SyncResult {
  success: boolean;
  synced: number;
  errors: number;
  duplicates: number;
  message?: string;
}

export class RealTimeLeadSync {
  private static instance: RealTimeLeadSync;
  private mapper = CRMDataMapper.getInstance();
  private syncInProgress = false;

  static getInstance(): RealTimeLeadSync {
    if (!RealTimeLeadSync.instance) {
      RealTimeLeadSync.instance = new RealTimeLeadSync();
    }
    return RealTimeLeadSync.instance;
  }

  async syncLeadsToDatabase(leads: CRMLeadData[], companyId: string): Promise<SyncResult> {
    if (this.syncInProgress) {
      return {
        success: false,
        synced: 0,
        errors: 1,
        duplicates: 0,
        message: 'Sync already in progress'
      };
    }

    this.syncInProgress = true;
    let syncedCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    try {
      console.log(`Starting sync of ${leads.length} leads for company ${companyId}`);

      for (const leadData of leads) {
        try {
          // Validate lead data
          const validation = this.mapper.validateMappedLead(leadData);
          if (!validation.isValid) {
            console.warn(`Invalid lead data for ${leadData.sourceId}:`, validation.errors);
            errorCount++;
            continue;
          }

          // Check for existing lead
          const existingLead = await this.findExistingLead(leadData, companyId);
          
          if (existingLead) {
            // Update existing lead
            const updated = await this.updateExistingLead(existingLead.id, leadData);
            if (updated) {
              duplicateCount++;
            } else {
              errorCount++;
            }
          } else {
            // Create new lead
            const created = await this.createNewLead(leadData, companyId);
            if (created) {
              syncedCount++;
            } else {
              errorCount++;
            }
          }

          // Generate AI feedback
          const feedback = this.mapper.generateAIFeedback(leadData);
          if (feedback.length > 0) {
            await this.logAIFeedback(leadData.sourceId, feedback, companyId);
          }

        } catch (leadError) {
          console.error(`Error processing lead ${leadData.sourceId}:`, leadError);
          errorCount++;
        }
      }

      // Log sync summary
      await this.logSyncSummary(companyId, syncedCount, errorCount, duplicateCount);

      console.log(`Sync completed: ${syncedCount} new, ${duplicateCount} updated, ${errorCount} errors`);

      return {
        success: true,
        synced: syncedCount,
        errors: errorCount,
        duplicates: duplicateCount,
        message: `Successfully synced ${syncedCount} new leads, updated ${duplicateCount} existing leads`
      };

    } catch (error) {
      console.error('Lead sync failed:', error);
      return {
        success: false,
        synced: syncedCount,
        errors: errorCount + 1,
        duplicates: duplicateCount,
        message: `Sync failed: ${error.message}`
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  private async findExistingLead(leadData: CRMLeadData, companyId: string): Promise<any> {
    try {
      // Try to find by source ID first (most reliable)
      let query = supabase
        .from('leads')
        .select('id, name, email, phone, updated_at')
        .eq('company_id', companyId)
        .eq('source', leadData.source);

      // Add source-specific tag search
      if (leadData.source === 'clickup') {
        query = query.contains('tags', [`clickup_task_${leadData.sourceId}`]);
      } else {
        // For other sources, try to match by email or phone
        if (leadData.email) {
          const { data: emailMatch } = await supabase
            .from('leads')
            .select('id, name, email, phone, updated_at')
            .eq('company_id', companyId)
            .eq('email', leadData.email)
            .single();
          
          if (emailMatch) return emailMatch;
        }

        if (leadData.phone) {
          const { data: phoneMatch } = await supabase
            .from('leads')
            .select('id, name, email, phone, updated_at')
            .eq('company_id', companyId)
            .eq('phone', leadData.phone)
            .single();
          
          if (phoneMatch) return phoneMatch;
        }
      }

      const { data, error } = await query.single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error finding existing lead:', error);
      }

      return data;
    } catch (error) {
      console.error('Error in findExistingLead:', error);
      return null;
    }
  }

  private async createNewLead(leadData: CRMLeadData, companyId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          company_id: companyId,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          status: leadData.status,
          priority: leadData.priority,
          source: leadData.source,
          tags: leadData.tags,
          score: leadData.score,
          conversion_likelihood: leadData.conversion_likelihood,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating lead:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createNewLead:', error);
      return false;
    }
  }

  private async updateExistingLead(leadId: string, leadData: CRMLeadData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          status: leadData.status,
          priority: leadData.priority,
          tags: leadData.tags,
          score: leadData.score,
          conversion_likelihood: leadData.conversion_likelihood,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) {
        console.error('Error updating lead:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateExistingLead:', error);
      return false;
    }
  }

  private async logAIFeedback(sourceId: string, feedback: string[], companyId: string): Promise<void> {
    try {
      for (const suggestion of feedback) {
        await supabase.from('ai_brain_insights').insert({
          company_id: companyId,
          type: 'lead_improvement',
          suggestion_text: suggestion,
          context: { sourceId, source: 'crm_sync' },
          triggered_by: 'real_time_sync',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error logging AI feedback:', error);
    }
  }

  private async logSyncSummary(companyId: string, synced: number, errors: number, duplicates: number): Promise<void> {
    try {
      await supabase.from('ai_brain_logs').insert({
        company_id: companyId,
        type: 'crm_sync',
        event_summary: `CRM sync completed: ${synced} new, ${duplicates} updated, ${errors} errors`,
        payload: {
          synced_count: synced,
          error_count: errors,
          duplicate_count: duplicates,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        visibility: 'manager'
      });
    } catch (error) {
      console.error('Error logging sync summary:', error);
    }
  }

  async enableRealTimeSync(companyId: string): Promise<void> {
    try {
      // Set up real-time listener for lead changes
      const channel = supabase
        .channel('lead-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'leads',
            filter: `company_id=eq.${companyId}`
          },
          (payload) => {
            console.log('Real-time lead change detected:', payload);
            
            // Show toast notification for lead changes
            if (payload.eventType === 'INSERT') {
              toast.success(`New lead added: ${payload.new.name}`);
            } else if (payload.eventType === 'UPDATE') {
              toast.info(`Lead updated: ${payload.new.name}`);
            }
          }
        )
        .subscribe();

      console.log('Real-time sync enabled for company:', companyId);
    } catch (error) {
      console.error('Error enabling real-time sync:', error);
    }
  }
}

export const realTimeLeadSync = RealTimeLeadSync.getInstance();
