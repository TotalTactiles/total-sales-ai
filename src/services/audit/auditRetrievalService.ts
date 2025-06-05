import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { encryptionService } from '@/services/security/encryptionService';
import { accessControlService } from '@/services/security/accessControlService';
import { AuditEntry, AuditPayload, AuditFilters } from '@/hooks/audit/types';

export class AuditRetrievalService {
  static async getAuditTrail(
    userRole: string,
    filters?: AuditFilters
  ): Promise<AuditEntry[]> {
    if (!accessControlService.checkAccess('ai_audit_trail', 'read', userRole)) {
      logger.warn('Insufficient permissions to access audit trail');
      return [];
    }

    try {
      let query = supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'ai_audit_trail')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (filters?.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const decryptedEntries = await Promise.all(
        (data || []).map(async (entry) => {
          try {
            const payload = entry.payload as unknown as AuditPayload;
            const decryptedDetails = await encryptionService.decryptSensitiveData(
              payload.auditEntry.details
            );
            
            return {
              id: entry.id,
              timestamp: new Date(payload.auditEntry.timestamp),
              userId: payload.auditEntry.userId,
              userRole: payload.auditEntry.userRole,
              action: payload.auditEntry.action,
              resource: payload.auditEntry.resource,
              details: decryptedDetails,
              outcome: payload.auditEntry.outcome,
              riskLevel: payload.auditEntry.riskLevel,
              ipAddress: payload.auditEntry.ipAddress,
              userAgent: payload.auditEntry.userAgent
            } as AuditEntry;
          } catch (decryptError) {
            logger.error('Failed to decrypt audit entry:', decryptError);
            return null;
          }
        })
      );

      return decryptedEntries.filter(Boolean) as AuditEntry[];

    } catch (error) {
      logger.error('Failed to fetch audit trail:', error);
      accessControlService.logSecurityEvent(
        'Audit trail access failure',
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'medium'
      );
      return [];
    }
  }
}
