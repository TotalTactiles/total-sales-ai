
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export interface SystemError {
  id: string;
  timestamp: string;
  component: string;
  route?: string;
  error_type: string;
  stack_trace?: string;
  retry_attempted: boolean;
  retry_result?: string;
  fix_type?: string;
  fixed_by_ai: boolean;
  escalated: boolean;
  developer_note?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ai_fix_summary?: string;
}

export interface AIBrainStatus {
  id: string;
  status_timestamp: string;
  system_health_score: number;
  last_fix_description?: string;
  pending_errors: number;
  auto_fixes_today: number;
  escalation_count: number;
  ai_uptime_minutes: number;
  last_check_in: string;
  critical_routes_monitored: string[];
}

class InternalAIBrain {
  private isActive = true;
  private checkInterval: NodeJS.Timeout | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private startTime = Date.now();

  constructor() {
    this.initialize();
  }

  private async initialize() {
    logger.info('Internal AI Brain initializing...');
    
    // Start health monitoring
    this.startHealthMonitoring();
    
    // Start error monitoring
    this.startErrorMonitoring();
    
    // Register global error handlers
    this.registerGlobalErrorHandlers();
    
    logger.info('Internal AI Brain initialized successfully');
  }

  private startHealthMonitoring() {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Check every 30 seconds
  }

  private startErrorMonitoring() {
    this.checkInterval = setInterval(async () => {
      await this.monitorCriticalRoutes();
    }, 60000); // Check every minute
  }

  private registerGlobalErrorHandlers() {
    // React error boundary fallback
    window.addEventListener('error', (event) => {
      this.handleError({
        component: 'global',
        route: window.location.pathname,
        error_type: 'javascript_error',
        stack_trace: event.error?.stack || event.message,
        severity: 'high'
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        component: 'global',
        route: window.location.pathname,
        error_type: 'promise_rejection',
        stack_trace: event.reason?.toString() || 'Unknown promise rejection',
        severity: 'medium'
      });
    });
  }

  async handleError(errorData: {
    component: string;
    route?: string;
    error_type: string;
    stack_trace?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }) {
    try {
      logger.error('AI Brain handling error:', errorData);

      // Log the error to database
      const { data: errorLog } = await supabase
        .from('system_error_log')
        .insert({
          ...errorData,
          retry_attempted: false,
          fixed_by_ai: false,
          escalated: false
        })
        .select()
        .single();

      if (errorLog) {
        // Attempt to fix the error
        const fixResult = await this.attemptFix(errorLog.id, errorData);
        
        // Update error log with fix result
        await supabase
          .from('system_error_log')
          .update({
            retry_attempted: true,
            retry_result: fixResult.success ? 'success' : 'failed',
            fix_type: fixResult.fix_type,
            fixed_by_ai: fixResult.success,
            ai_fix_summary: fixResult.summary,
            escalated: !fixResult.success && errorData.severity === 'critical'
          })
          .eq('id', errorLog.id);

        // Update system health
        await this.updateSystemHealth();
      }
    } catch (error) {
      logger.error('AI Brain failed to handle error:', error);
    }
  }

  private async attemptFix(errorId: string, errorData: {
    component: string;
    route?: string;
    error_type: string;
    stack_trace?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<{ success: boolean; fix_type?: string; summary?: string }> {
    
    logger.info('AI Brain attempting to fix error:', errorId);

    // Implement specific fix strategies based on error type
    switch (errorData.error_type) {
      case 'api_error':
        return await this.fixAPIError(errorData);
      
      case 'auth_error':
        return await this.fixAuthError(errorData);
      
      case 'route_error':
        return await this.fixRouteError(errorData);
      
      case 'supabase_error':
        return await this.fixSupabaseError(errorData);
      
      case 'agent_error':
        return await this.fixAgentError(errorData);
      
      default:
        return await this.genericFix(errorData);
    }
  }

  private async fixAPIError(errorData: any): Promise<{ success: boolean; fix_type?: string; summary?: string }> {
    // Implement exponential backoff retry
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        
        // Test API connectivity
        const response = await fetch('/api/health', { method: 'GET' });
        if (response.ok) {
          return {
            success: true,
            fix_type: 'api_retry',
            summary: `API connectivity restored after ${attempts + 1} attempts`
          };
        }
        attempts++;
      } catch (error) {
        attempts++;
      }
    }
    
    return {
      success: false,
      fix_type: 'api_retry',
      summary: `Failed to restore API connectivity after ${maxAttempts} attempts`
    };
  }

  private async fixAuthError(errorData: any): Promise<{ success: boolean; fix_type?: string; summary?: string }> {
    try {
      // Check if user session is valid
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login if no session
        window.location.href = '/auth';
        return {
          success: true,
          fix_type: 'auth_redirect',
          summary: 'Redirected user to login page due to invalid session'
        };
      }
      
      return {
        success: true,
        fix_type: 'auth_validation',
        summary: 'Session validated successfully'
      };
    } catch (error) {
      return {
        success: false,
        fix_type: 'auth_validation',
        summary: 'Failed to validate or restore authentication'
      };
    }
  }

  private async fixRouteError(errorData: any): Promise<{ success: boolean; fix_type?: string; summary?: string }> {
    try {
      // Check if route exists and is accessible
      const currentPath = window.location.pathname;
      
      // List of safe fallback routes
      const fallbackRoutes = ['/dashboard', '/auth', '/'];
      
      for (const route of fallbackRoutes) {
        if (currentPath !== route) {
          window.location.href = route;
          return {
            success: true,
            fix_type: 'route_redirect',
            summary: `Redirected from broken route ${currentPath} to ${route}`
          };
        }
      }
      
      return {
        success: false,
        fix_type: 'route_redirect',
        summary: 'No suitable fallback route found'
      };
    } catch (error) {
      return {
        success: false,
        fix_type: 'route_redirect',
        summary: 'Failed to redirect to safe route'
      };
    }
  }

  private async fixSupabaseError(errorData: any): Promise<{ success: boolean; fix_type?: string; summary?: string }> {
    try {
      // Test Supabase connectivity
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      
      if (!error) {
        return {
          success: true,
          fix_type: 'supabase_reconnect',
          summary: 'Supabase connectivity verified'
        };
      }
      
      return {
        success: false,
        fix_type: 'supabase_reconnect',
        summary: `Supabase error persists: ${error.message}`
      };
    } catch (error) {
      return {
        success: false,
        fix_type: 'supabase_reconnect',
        summary: 'Failed to test Supabase connectivity'
      };
    }
  }

  private async fixAgentError(errorData: any): Promise<{ success: boolean; fix_type?: string; summary?: string }> {
    // Implement agent-specific fixes
    return {
      success: false,
      fix_type: 'agent_restart',
      summary: 'Agent error fix not yet implemented'
    };
  }

  private async genericFix(errorData: any): Promise<{ success: boolean; fix_type?: string; summary?: string }> {
    // Generic fix strategy - usually involves refreshing or resetting state
    try {
      // Clear any cached data that might be causing issues
      localStorage.removeItem('auth-storage');
      sessionStorage.clear();
      
      return {
        success: true,
        fix_type: 'cache_clear',
        summary: 'Cleared browser cache and storage to reset application state'
      };
    } catch (error) {
      return {
        success: false,
        fix_type: 'cache_clear',
        summary: 'Failed to clear cache and reset state'
      };
    }
  }

  private async performHealthCheck() {
    try {
      const uptime = Math.floor((Date.now() - this.startTime) / 60000); // in minutes
      
      // Get current error count
      const { count } = await supabase
        .from('system_error_log')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const pendingErrors = count || 0;
      
      // Calculate health score
      const healthScore = Math.max(0, 100 - (pendingErrors * 5));
      
      // Update AI brain status
      await supabase
        .from('internal_ai_brain_status')
        .update({
          last_check_in: new Date().toISOString(),
          ai_uptime_minutes: uptime,
          pending_errors: pendingErrors,
          system_health_score: healthScore
        })
        .eq('id', (await this.getOrCreateBrainStatus()).id);

    } catch (error) {
      logger.error('Health check failed:', error);
    }
  }

  private async monitorCriticalRoutes() {
    const criticalRoutes = [
      '/auth',
      '/dashboard', 
      '/manager/dashboard',
      '/sales/dashboard',
      '/developer/dashboard'
    ];

    for (const route of criticalRoutes) {
      try {
        // This would typically involve checking if the route renders properly
        // For now, we'll just log that we're monitoring
        logger.debug(`Monitoring critical route: ${route}`);
      } catch (error) {
        await this.handleError({
          component: 'route_monitor',
          route,
          error_type: 'route_error',
          stack_trace: error instanceof Error ? error.stack : String(error),
          severity: 'high'
        });
      }
    }
  }

  private async updateSystemHealth() {
    try {
      const { data: recentErrors } = await supabase
        .from('system_error_log')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const totalErrors = recentErrors?.length || 0;
      const fixedErrors = recentErrors?.filter(e => e.fixed_by_ai).length || 0;
      
      const healthScore = Math.max(0, 100 - (totalErrors * 3) + (fixedErrors * 2));
      
      await supabase
        .from('internal_ai_brain_status')
        .update({
          system_health_score: healthScore,
          auto_fixes_today: fixedErrors,
          pending_errors: totalErrors - fixedErrors
        })
        .eq('id', (await this.getOrCreateBrainStatus()).id);

    } catch (error) {
      logger.error('Failed to update system health:', error);
    }
  }

  private async getOrCreateBrainStatus(): Promise<{ id: string }> {
    const { data } = await supabase
      .from('internal_ai_brain_status')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      return data;
    }

    // Create new status record if none exists
    const { data: newStatus } = await supabase
      .from('internal_ai_brain_status')
      .insert({
        system_health_score: 100,
        last_fix_description: 'AI Brain initialized'
      })
      .select('id')
      .single();

    return newStatus!;
  }

  async getSystemStatus(): Promise<AIBrainStatus | null> {
    const { data } = await supabase
      .from('internal_ai_brain_status')
      .select('*')
      .order('status_timestamp', { ascending: false })
      .limit(1)
      .single();

    return data;
  }

  async getRecentErrors(limit = 50): Promise<SystemError[]> {
    const { data } = await supabase
      .from('system_error_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    return data || [];
  }

  async retryError(errorId: string): Promise<boolean> {
    try {
      const { data: error } = await supabase
        .from('system_error_log')
        .select('*')
        .eq('id', errorId)
        .single();

      if (!error) return false;

      const fixResult = await this.attemptFix(errorId, {
        component: error.component,
        route: error.route,
        error_type: error.error_type,
        stack_trace: error.stack_trace,
        severity: error.severity
      });

      await supabase
        .from('system_error_log')
        .update({
          retry_attempted: true,
          retry_result: fixResult.success ? 'success' : 'failed',
          fix_type: fixResult.fix_type,
          fixed_by_ai: fixResult.success,
          ai_fix_summary: fixResult.summary
        })
        .eq('id', errorId);

      return fixResult.success;
    } catch (error) {
      logger.error('Failed to retry error:', error);
      return false;
    }
  }

  setActive(active: boolean) {
    this.isActive = active;
    if (!active) {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }
    } else {
      this.startHealthMonitoring();
      this.startErrorMonitoring();
    }
  }

  destroy() {
    this.setActive(false);
  }
}

// Export singleton instance
export const internalAIBrain = new InternalAIBrain();
