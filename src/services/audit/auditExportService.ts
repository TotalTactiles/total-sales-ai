import { logger } from '@/utils/logger';

import { accessControlService } from '@/services/security/accessControlService';
import { AuditEntry } from '@/hooks/audit/types';
import { AuditLoggingService } from './auditLoggingService';

export class AuditExportService {
  static async exportAuditTrail(
    auditEntries: AuditEntry[],
    userRole: string,
    userId: string,
    companyId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<void> {
    if (!accessControlService.checkAccess('ai_audit_trail', 'read', userRole)) {
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
      await AuditLoggingService.logAuditEvent(
        userId,
        userRole,
        companyId,
        'export_audit_trail',
        'ai_audit_trail',
        { format, recordCount: auditEntries.length },
        'success',
        'medium'
      );

    } catch (error) {
      logger.error('Failed to export audit trail:', error);
      throw error;
    }
  }
}
