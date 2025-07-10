
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SecurityEvent {
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: any;
  company_id?: string;
  rep_id?: string;
}

export class AccessControlService {
  // Log security events
  static async logSecurityEvent(
    description: string,
    metadata: any = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    eventType: string = 'general'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_events')
        .insert({
          event_type: eventType,
          severity,
          description,
          metadata,
          company_id: metadata.company_id,
          rep_id: metadata.rep_id,
          ip_address: metadata.ip_address,
          user_agent: navigator.userAgent.substring(0, 255)
        });

      if (error) throw error;

      logger.info(`Security event logged: ${description}`, {
        severity,
        eventType,
        metadata
      });
    } catch (error) {
      logger.error('Failed to log security event:', error);
    }
  }

  // Check if user has specific permissions
  static async checkAccess(
    resource: string,
    action: 'read' | 'write' | 'delete' | 'admin',
    userRole: string
  ): Promise<boolean> {
    try {
      // Admin has access to everything
      if (userRole === 'admin') {
        return true;
      }

      // Manager has access to most resources
      if (userRole === 'manager') {
        return ['read', 'write'].includes(action);
      }

      // Sales rep has limited access
      if (userRole === 'sales_rep') {
        return action === 'read' || (action === 'write' && !resource.includes('admin'));
      }

      // Developer has special access to system resources
      if (userRole === 'developer') {
        return resource.includes('system') || resource.includes('debug');
      }

      return false;
    } catch (error) {
      logger.error('Access check failed:', error);
      await this.logSecurityEvent(
        'Access check failure',
        { resource, action, userRole, error: error instanceof Error ? error.message : 'Unknown error' },
        'medium',
        'access_control_error'
      );
      return false;
    }
  }

  // Validate request rate limiting
  static async checkRateLimit(
    endpoint: string,
    userId: string,
    companyId: string,
    limit: number = 100,
    windowMinutes: number = 1
  ): Promise<boolean> {
    try {
      const windowStart = new Date(Date.now() - (windowMinutes * 60 * 1000));
      
      const { data, error } = await supabase
        .from('rate_limit_tracking')
        .select('requests_count, blocked_count')
        .eq('company_id', companyId)
        .eq('rep_id', userId)
        .eq('endpoint', endpoint)
        .gte('window_start', windowStart.toISOString())
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const currentRequests = data?.requests_count || 0;
      
      if (currentRequests >= limit) {
        await this.logSecurityEvent(
          `Rate limit exceeded for ${endpoint}`,
          { userId, companyId, endpoint, currentRequests, limit },
          'high',
          'rate_limit_exceeded'
        );
        
        // Update blocked count
        await supabase
          .from('rate_limit_tracking')
          .upsert({
            company_id: companyId,
            rep_id: userId,
            endpoint,
            requests_count: currentRequests,
            blocked_count: (data?.blocked_count || 0) + 1,
            window_start: new Date().toISOString(),
            window_end: new Date(Date.now() + (windowMinutes * 60 * 1000)).toISOString()
          });

        return false;
      }

      // Update request count
      await supabase
        .from('rate_limit_tracking')
        .upsert({
          company_id: companyId,
          rep_id: userId,
          endpoint,
          requests_count: currentRequests + 1,
          blocked_count: data?.blocked_count || 0,
          window_start: new Date().toISOString(),
          window_end: new Date(Date.now() + (windowMinutes * 60 * 1000)).toISOString()
        });

      return true;
    } catch (error) {
      logger.error('Rate limit check failed:', error);
      return true; // Allow on error to prevent blocking legitimate requests
    }
  }

  // Monitor for suspicious activity
  static async detectSuspiciousActivity(
    userId: string,
    companyId: string,
    activity: string,
    metadata: any = {}
  ): Promise<void> {
    try {
      const suspiciousPatterns = [
        'rapid_requests',
        'unusual_access_pattern',
        'failed_authentication',
        'data_export_large',
        'permission_escalation_attempt'
      ];

      if (suspiciousPatterns.some(pattern => activity.includes(pattern))) {
        await this.logSecurityEvent(
          `Suspicious activity detected: ${activity}`,
          { userId, companyId, activity, ...metadata },
          'high',
          'suspicious_activity'
        );
      }
    } catch (error) {
      logger.error('Suspicious activity detection failed:', error);
    }
  }
}

export const accessControlService = new AccessControlService();
