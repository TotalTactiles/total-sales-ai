import { supabase } from '@/integrations/supabase/client';
import { AccessControlService } from '@/services/security/accessControlService';
import { logger } from '@/utils/logger';
import { AuditEntry } from '@/hooks/audit/types';

export class AuditExportService {
  static async exportAuditTrail(
    auditEntries: AuditEntry[],
    userRole: string,
    userId: string,
    companyId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<void> {
    try {
      // Check permissions
      if (!await AccessControlService.checkAccess('audit_export', 'read', userRole)) {
        throw new Error('Insufficient permissions to export audit trail');
      }

      // Log export activity
      await AccessControlService.logSecurityEvent(
        'Audit trail export initiated',
        { userId, companyId, format, entryCount: auditEntries.length },
        'medium',
        'audit_export'
      );

      let exportData: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        exportData = JSON.stringify(auditEntries, null, 2);
        filename = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        // CSV format
        const headers = [
          'Timestamp',
          'User ID',
          'User Role',
          'Action',
          'Resource',
          'Outcome',
          'Risk Level',
          'IP Address'
        ];

        const csvRows = auditEntries.map(entry => [
          entry.timestamp.toISOString(),
          entry.userId,
          entry.userRole,
          entry.action,
          entry.resource,
          entry.outcome,
          entry.riskLevel,
          entry.ipAddress || 'N/A'
        ]);

        exportData = [
          headers.join(','),
          ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');

        filename = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      // Create and download file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      // Log successful export
      await AccessControlService.logSecurityEvent(
        'Audit trail export completed',
        { userId, companyId, format, filename, entryCount: auditEntries.length },
        'low',
        'audit_export_success'
      );

      logger.info('Audit trail exported successfully', {
        format,
        filename,
        entryCount: auditEntries.length
      });

    } catch (error) {
      logger.error('Audit trail export failed:', error);
      
      await AccessControlService.logSecurityEvent(
        'Audit trail export failed',
        { userId, companyId, format, error: error instanceof Error ? error.message : 'Unknown error' },
        'high',
        'audit_export_failure'
      );
      
      throw error;
    }
  }

  static async scheduleAutomatedExport(
    companyId: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    format: 'json' | 'csv' = 'json'
  ): Promise<void> {
    try {
      // Store automated export configuration
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          company_id: companyId,
          personalization_flags: {
            automated_audit_export: {
              enabled: true,
              frequency,
              format,
              last_export: null,
              next_export: this.calculateNextExportDate(frequency)
            }
          }
        });

      if (error) throw error;

      logger.info('Automated audit export scheduled', {
        companyId,
        frequency,
        format
      });

    } catch (error) {
      logger.error('Failed to schedule automated export:', error);
      throw error;
    }
  }

  private static calculateNextExportDate(frequency: string): string {
    const now = new Date();
    let nextDate: Date;

    switch (frequency) {
      case 'daily':
        nextDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        nextDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        break;
      default:
        nextDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    return nextDate.toISOString();
  }
}
