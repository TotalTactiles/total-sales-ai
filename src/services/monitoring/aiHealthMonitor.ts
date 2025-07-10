
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { accessControlService } from '@/services/security/accessControlService';

interface ModuleHealth {
  moduleId: string;
  status: 'online' | 'offline' | 'degraded' | 'slow';
  healthScore: number;
  lastHeartbeat: Date;
  errorCount: number;
  successCount: number;
  avgResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export class AIHealthMonitor {
  private static instance: AIHealthMonitor;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

  static getInstance(): AIHealthMonitor {
    if (!this.instance) {
      this.instance = new AIHealthMonitor();
    }
    return this.instance;
  }

  // Start monitoring AI modules
  startMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.HEALTH_CHECK_INTERVAL);

    logger.info('AI Health Monitor started');
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    logger.info('AI Health Monitor stopped');
  }

  // Perform health check on all modules
  private async performHealthCheck(): Promise<void> {
    try {
      const modules = [
        'tsam_orchestrator',
        'lead_profile_ai',
        'lead_management_ai',
        'dialer_ai',
        'analytics_ai',
        'academy_ai'
      ];

      for (const moduleId of modules) {
        await this.checkModuleHealth(moduleId);
      }

      // Update system health metrics
      await this.updateSystemHealth();
    } catch (error) {
      logger.error('Health check failed:', error);
    }
  }

  // Check individual module health
  private async checkModuleHealth(moduleId: string): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Simulate module health check (in real implementation, this would ping the actual service)
      const isHealthy = Math.random() > 0.1; // 90% uptime simulation
      const responseTime = Math.random() * 1000; // Random response time
      
      const endTime = Date.now();
      const actualResponseTime = endTime - startTime;

      // Get current status
      const { data: currentStatus } = await supabase
        .from('ai_module_status')
        .select('*')
        .eq('module_id', moduleId)
        .single();

      const errorCount = currentStatus?.error_count || 0;
      const successCount = currentStatus?.success_count || 0;

      // Update module status
      const { error } = await supabase
        .from('ai_module_status')
        .upsert({
          module_id: moduleId,
          status: isHealthy ? 'online' : 'offline',
          health_score: this.calculateHealthScore(isHealthy, responseTime, errorCount, successCount),
          last_heartbeat: new Date().toISOString(),
          error_count: isHealthy ? errorCount : errorCount + 1,
          success_count: isHealthy ? successCount + 1 : successCount,
          avg_response_time_ms: Math.round((responseTime + (currentStatus?.avg_response_time_ms || 0)) / 2),
          memory_usage_mb: Math.round(Math.random() * 512), // Simulated memory usage
          cpu_usage_percent: Math.round(Math.random() * 100 * 100) / 100, // Simulated CPU usage
          metadata: {
            last_check: new Date().toISOString(),
            check_duration_ms: actualResponseTime
          }
        });

      if (error) throw error;

      // Log critical issues
      if (!isHealthy || responseTime > 5000) {
        await accessControlService.logSecurityEvent(
          `AI Module ${moduleId} health issue detected`,
          { moduleId, isHealthy, responseTime, errorCount, successCount },
          'high',
          'ai_module_health'
        );
      }

    } catch (error) {
      logger.error(`Failed to check health for module ${moduleId}:`, error);
    }
  }

  // Calculate health score based on various metrics
  private calculateHealthScore(
    isHealthy: boolean,
    responseTime: number,
    errorCount: number,
    successCount: number
  ): number {
    if (!isHealthy) return 0;

    let score = 100;
    
    // Deduct points for slow response times
    if (responseTime > 1000) score -= 20;
    if (responseTime > 2000) score -= 30;
    if (responseTime > 5000) score -= 40;
    
    // Deduct points for error ratio
    const totalRequests = errorCount + successCount;
    if (totalRequests > 0) {
      const errorRatio = errorCount / totalRequests;
      score -= Math.round(errorRatio * 50);
    }
    
    return Math.max(0, Math.min(100, score));
  }

  // Update overall system health
  private async updateSystemHealth(): Promise<void> {
    try {
      // Get all module statuses
      const { data: modules } = await supabase
        .from('ai_module_status')
        .select('health_score, status');

      if (!modules || modules.length === 0) return;

      // Calculate average health score
      const avgHealthScore = modules.reduce((sum, module) => sum + (module.health_score || 0), 0) / modules.length;
      
      // Count online modules
      const onlineModules = modules.filter(m => m.status === 'online').length;
      const totalModules = modules.length;

      // Update system health metrics
      await supabase
        .from('system_health_monitor')
        .upsert([
          {
            metric_name: 'ai_system_health_score',
            metric_value: Math.round(avgHealthScore),
            status: avgHealthScore > 80 ? 'normal' : avgHealthScore > 50 ? 'warning' : 'critical'
          },
          {
            metric_name: 'ai_modules_online',
            metric_value: onlineModules,
            status: (onlineModules / totalModules) > 0.8 ? 'normal' : 'warning'
          }
        ]);

      logger.info('System health updated', {
        avgHealthScore: Math.round(avgHealthScore),
        onlineModules,
        totalModules
      });

    } catch (error) {
      logger.error('Failed to update system health:', error);
    }
  }

  // Get current health status
  async getHealthStatus(): Promise<ModuleHealth[]> {
    try {
      const { data, error } = await supabase
        .from('ai_module_status')
        .select('*')
        .order('module_id');

      if (error) throw error;

      return (data || []).map(module => ({
        moduleId: module.module_id,
        status: module.status as 'online' | 'offline' | 'degraded' | 'slow',
        healthScore: module.health_score || 0,
        lastHeartbeat: new Date(module.last_heartbeat),
        errorCount: module.error_count || 0,
        successCount: module.success_count || 0,
        avgResponseTime: module.avg_response_time_ms || 0,
        memoryUsage: module.memory_usage_mb || 0,
        cpuUsage: module.cpu_usage_percent || 0
      }));
    } catch (error) {
      logger.error('Failed to get health status:', error);
      return [];
    }
  }
}

export const aiHealthMonitor = AIHealthMonitor.getInstance();
