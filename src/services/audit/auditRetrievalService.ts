
import { supabase } from '@/integrations/supabase/client';
import { EncryptionService } from '@/services/security/encryptionService';
import { AccessControlService } from '@/services/security/accessControlService';
import { AuditEntry, AuditPayload, AuditFilters } from '@/hooks/audit/types';

// Simple logger for client-side
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

export class AuditRetrievalService {
  static async getAuditTrail(
    userRole: string,
    filters?: AuditFilters
  ): Promise<AuditEntry[]> {
    if (!await AccessControlService.checkAccess('ai_audit_trail', 'read', userRole)) {
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
            const decryptedDetails = await EncryptionService.decryptSensitiveData(
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
      AccessControlService.logSecurityEvent(
        'Audit trail access failure',
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'medium'
      );
      return [];
    }
  }
}
