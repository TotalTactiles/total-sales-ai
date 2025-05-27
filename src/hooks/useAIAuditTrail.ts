
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuditEntry, AuditFilters } from './audit/types';
import { AuditLoggingService } from '@/services/audit/auditLoggingService';
import { AuditRetrievalService } from '@/services/audit/auditRetrievalService';
import { AuditExportService } from '@/services/audit/auditExportService';

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

    await AuditLoggingService.logAuditEvent(
      user.id,
      profile.role,
      profile.company_id,
      action,
      resource,
      details,
      outcome,
      riskLevel
    );
  };

  const getAuditTrail = async (filters?: AuditFilters) => {
    if (!profile) return;

    setIsLoading(true);
    
    try {
      const entries = await AuditRetrievalService.getAuditTrail(profile.role, filters);
      setAuditEntries(entries);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditTrail = async (format: 'json' | 'csv' = 'json') => {
    if (!profile || !user?.id) {
      throw new Error('User not authenticated');
    }

    await AuditExportService.exportAuditTrail(
      auditEntries,
      profile.role,
      user.id,
      profile.company_id,
      format
    );
  };

  return {
    auditEntries,
    isLoading,
    logAuditEvent,
    getAuditTrail,
    exportAuditTrail
  };
};
