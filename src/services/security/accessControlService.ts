
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface AccessRule {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  roles: string[];
  conditions?: Record<string, any>;
}

export class AccessControlService {
  private static instance: AccessControlService;
  private accessRules: AccessRule[] = [
    // AI System Access
    { resource: 'ai_brain', action: 'read', roles: ['manager', 'sales_rep'] },
    { resource: 'ai_brain', action: 'write', roles: ['manager'] },
    { resource: 'ai_insights', action: 'read', roles: ['manager', 'sales_rep'] },
    { resource: 'ai_training', action: 'write', roles: ['manager'] },
    
    // Lead Data Access
    { resource: 'leads', action: 'read', roles: ['manager', 'sales_rep'] },
    { resource: 'leads', action: 'write', roles: ['manager', 'sales_rep'] },
    { resource: 'leads_bulk', action: 'write', roles: ['manager'] },
    
    // Company Data Access
    { resource: 'company_settings', action: 'read', roles: ['manager'] },
    { resource: 'company_settings', action: 'write', roles: ['manager'] },
    { resource: 'company_brain', action: 'read', roles: ['manager', 'sales_rep'] },
    { resource: 'company_brain', action: 'write', roles: ['manager'] },
    
    // Developer & Security Logs
    { resource: 'developer_logs', action: 'read', roles: ['admin'] },
    { resource: 'security_logs', action: 'read', roles: ['admin', 'manager'] },
    { resource: 'ai_audit_trail', action: 'read', roles: ['admin', 'manager'] },
    
    // Voice & AI Services
    { resource: 'voice_services', action: 'read', roles: ['manager', 'sales_rep'] },
    { resource: 'voice_config', action: 'write', roles: ['manager'] },
    { resource: 'retell_ai', action: 'write', roles: ['manager', 'sales_rep'] },
  ];

  static getInstance(): AccessControlService {
    if (!AccessControlService.instance) {
      AccessControlService.instance = new AccessControlService();
    }
    return AccessControlService.instance;
  }

  checkAccess(resource: string, action: string, userRole: string, context?: Record<string, any>): boolean {
    try {
      const rule = this.accessRules.find(r => 
        r.resource === resource && r.action === action
      );

      if (!rule) {
        logger.warn('No access rule found', { resource, action, userRole }, 'security');
        return false;
      }

      const hasRoleAccess = rule.roles.includes(userRole);
      
      if (!hasRoleAccess) {
        logger.warn('Access denied - insufficient role', { 
          resource, 
          action, 
          userRole, 
          requiredRoles: rule.roles 
        }, 'security');
        return false;
      }

      // Check additional conditions if present
      if (rule.conditions && context) {
        for (const [key, value] of Object.entries(rule.conditions)) {
          if (context[key] !== value) {
            logger.warn('Access denied - condition not met', { 
              resource, 
              action, 
              condition: key, 
              expected: value, 
              actual: context[key] 
            }, 'security');
            return false;
          }
        }
      }

      logger.info('Access granted', { resource, action, userRole }, 'security');
      return true;
    } catch (error) {
      logger.error('Access control check failed', error, 'security');
      return false;
    }
  }

  logSecurityEvent(event: string, details: Record<string, any>, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    logger.info(`Security Event: ${event}`, { 
      ...details, 
      severity,
      timestamp: new Date().toISOString() 
    }, 'security');
    
    // In production, also send to security monitoring service
    if (severity === 'critical' || severity === 'high') {
      logger.warn(`🚨 Security Alert [${severity.toUpperCase()}]: ${event}`, details);
    }
  }

  sanitizeAIOutput(output: any): any {
    if (typeof output === 'string') {
      // Remove potential sensitive patterns
      return output
        .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]')
        .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD-REDACTED]')
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL-PARTIAL]')
        .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE-PARTIAL]');
    }
    
    if (typeof output === 'object' && output !== null) {
      const sanitized = { ...output };
      
      // Remove or hash sensitive fields
      const sensitiveFields = ['ssn', 'creditCard', 'password', 'apiKey', 'token'];
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      });
      
      return sanitized;
    }
    
    return output;
  }
}

export const accessControlService = AccessControlService.getInstance();
