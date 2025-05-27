
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { encryptionService } from '@/services/security/encryptionService';
import { accessControlService } from '@/services/security/accessControlService';

interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  outcome: 'success' | 'failure' | 'unauthorized';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditPayload {
  auditEntry: {
    timestamp: string;
    userId: string;
    userRole: string;
    action: string;
    resource: string;
    details: any;
    ipAddress?: string;
    userAgent?: string;
    outcome: 'success' | 'failure' | 'unauthorized';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  outcome: 'success' | 'failure' | 'unauthorized';
}

export const useAIAuditTrail = () => {
  const { user, profile } = useAuth();
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const logAuditEvent = async (
    action: string,
    resource: string,
    details: any,
    outcome: 'success' | 'failure' | 'unauthorized' = 'success',
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    if (!user?.id || !profile) return;

    try {
      // Encrypt sensitive details
      const encryptedDetails = await encryptionService.encryptSensitiveData(details);
      
      const auditEntryForStorage = {
        timestamp: new Date().toISOString(),
        userId: user.id,
        userRole: profile.role,
        action,
        resource,
        details: encryptedDetails,
        outcome,
        riskLevel,
        ipAddress: 'client-side', // In production, get from server
        userAgent: navigator.userAgent.substring(0, 100)
      };

      // Store in database via AI brain logs
      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'ai_audit_trail',
          event_summary: `${action} on ${resource}`,
          payload: {
            auditEntry: auditEntryForStorage,
            riskLevel,
            outcome
          } as AuditPayload,
          company_id: profile.company_id,
          visibility: riskLevel === 'critical' || riskLevel === 'high' ? 'admin_manager' : 'admin_only'
        });

      if (error) throw error;

      // Log security event if high risk
      if (riskLevel === 'high' || riskLevel === 'critical') {
        accessControlService.logSecurityEvent(
          `High-risk AI action: ${action}`,
          { resource, userId: user.id, riskLevel },
          riskLevel
        );
      }

    } catch (error) {
      console.error('Failed to log audit event:', error);
      accessControlService.logSecurityEvent(
        'Audit logging failure',
        { action, resource, error: error instanceof Error ? error.message : 'Unknown error' },
        'critical'
      );
    }
  };

  const getAuditTrail = async (filters?: {
    userId?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    riskLevel?: string;
  }) => {
    if (!profile || !accessControlService.checkAccess('ai_audit_trail', 'read', profile.role)) {
      console.warn('Insufficient permissions to access audit trail');
      return;
    }

    setIsLoading(true);
    
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
            const payload = entry.payload as AuditPayload;
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
            console.error('Failed to decrypt audit entry:', decryptError);
            return null;
          }
        })
      );

      setAuditEntries(decryptedEntries.filter(Boolean) as AuditEntry[]);

    } catch (error) {
      console.error('Failed to fetch audit trail:', error);
      accessControlService.logSecurityEvent(
        'Audit trail access failure',
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'medium'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditTrail = async (format: 'json' | 'csv' = 'json') => {
    if (!profile || !accessControlService.checkAccess('ai_audit_trail', 'read', profile.role)) {
      throw new Error('Insufficient permissions to export audit trail');
    }

    try {
      let exportData: string;
      
      if (format === 'json') {
        exportData = JSON.stringify(auditEntries, null, 2);
      } else {
        // CSV format
        const headers = ['Timestamp', 'User ID', 'Role', 'Action', 'Resource', 'Outcome', 'Risk Level'];
        const csvRows = [
          headers.join(','),
          ...auditEntries.map(entry => [
            entry.timestamp.toISOString(),
            entry.userId,
            entry.userRole,
            entry.action,
            entry.resource,
            entry.outcome,
            entry.riskLevel
          ].map(field => `"${field}"`).join(','))
        ];
        exportData = csvRows.join('\n');
      }

      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-audit-trail-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);

      // Log the export action
      await logAuditEvent(
        'export_audit_trail',
        'ai_audit_trail',
        { format, recordCount: auditEntries.length },
        'success',
        'medium'
      );

    } catch (error) {
      console.error('Failed to export audit trail:', error);
      throw error;
    }
  };

  return {
    auditEntries,
    isLoading,
    logAuditEvent,
    getAuditTrail,
    exportAuditTrail
  };
};
