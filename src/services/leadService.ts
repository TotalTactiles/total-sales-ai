
import { Lead } from '@/types/lead';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AppErrorHandler, ERROR_CODES } from '@/utils/errorHandler';

export class LeadService {
  static async getLeads(companyId: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw AppErrorHandler.createError(
          'Failed to fetch leads',
          ERROR_CODES.NETWORK_ERROR,
          { companyId, error }
        );
      }

      return data || [];
    } catch (error) {
      logger.error('Error fetching leads:', error);
      throw error;
    }
  }

  static async getLeadById(leadId: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) {
        throw AppErrorHandler.createError(
          'Lead not found',
          ERROR_CODES.LEAD_NOT_FOUND,
          { leadId, error }
        );
      }

      return data;
    } catch (error) {
      logger.error('Error fetching lead:', error);
      throw error;
    }
  }

  static async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        throw AppErrorHandler.createError(
          'Failed to update lead',
          ERROR_CODES.NETWORK_ERROR,
          { leadId, updates, error }
        );
      }

      return data;
    } catch (error) {
      logger.error('Error updating lead:', error);
      throw error;
    }
  }

  static async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw AppErrorHandler.createError(
          'Failed to create lead',
          ERROR_CODES.NETWORK_ERROR,
          { leadData, error }
        );
      }

      return data;
    } catch (error) {
      logger.error('Error creating lead:', error);
      throw error;
    }
  }

  static async deleteLead(leadId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) {
        throw AppErrorHandler.createError(
          'Failed to delete lead',
          ERROR_CODES.NETWORK_ERROR,
          { leadId, error }
        );
      }
    } catch (error) {
      logger.error('Error deleting lead:', error);
      throw error;
    }
  }
}
