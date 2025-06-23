
import { supabase } from '@/integrations/supabase/client';
import { encryptionService } from '@/services/security/encryptionService';
import { accessControlService } from '@/services/security/accessControlService';
import { AuditPayload } from '@/hooks/audit/types';

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

export class AuditLoggingService {
  static async logAuditEvent(
    userId: string,
    userRole: string,
    companyId: string,
    action: string,
    resource: string,
    details: any,
    outcome: 'success' | 'failure' | 'unauthorized' = 'success',
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    try {
      // Encrypt sensitive details
      const encryptedDetails = await encryptionService.encryptSensitiveData(details);
      
      const auditEntryForStorage = {
        timestamp: new Date().toISOString(),
        userId,
        userRole,
        action,
        resource,
        details: encryptedDetails,
        outcome,
        riskLevel,
        ipAddress: 'client-side',
        userAgent: navigator.userAgent.substring(0, 100)
      };

      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'ai_audit_trail',
          event_summary: `${action} on ${resource}`,
          payload: JSON.parse(JSON.stringify({
            auditEntry: auditEntryForStorage,
            riskLevel,
            outcome
          })),
          company_id: companyId,
          visibility: riskLevel === 'critical' || riskLevel === 'high' ? 'admin_manager' : 'admin_only',
          processed: false
        });

      if (error) throw error;

      // Log security event if high risk
      if (riskLevel === 'high' || riskLevel === 'critical') {
        accessControlService.logSecurityEvent(
          `High-risk AI action: ${action}`,
          { resource, userId, riskLevel },
          riskLevel
        );
      }

    } catch (error) {
      logger.error('Failed to log audit event:', error);
      accessControlService.logSecurityEvent(
        'Audit logging failure',
        { action, resource, error: error instanceof Error ? error.message : 'Unknown error' },
        'critical'
      );
    }
  }
}

export const auditLoggingService = new AuditLoggingService();
