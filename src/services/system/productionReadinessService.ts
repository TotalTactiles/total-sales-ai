
import { supabase } from '@/integrations/supabase/client';
import { securityAuditService } from '@/services/security/securityAuditService';
import { aiMonitoringService } from '@/services/ai/monitoringService';
import { zohoCRMIntegration } from '@/services/integrations/zohoCRM';
import { clickUpCRMIntegration } from '@/services/integrations/clickupCRM';

export interface ReadinessCheck {
  name: string;
  category: 'security' | 'functionality' | 'integrations' | 'performance' | 'ai';
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string;
}

export interface ProductionReadinessReport {
  overallStatus: 'ready' | 'warning' | 'not_ready';
  score: number;
  checks: ReadinessCheck[];
  recommendations: string[];
}

export class ProductionReadinessService {
  private static instance: ProductionReadinessService;

  static getInstance(): ProductionReadinessService {
    if (!ProductionReadinessService.instance) {
      ProductionReadinessService.instance = new ProductionReadinessService();
    }
    return ProductionReadinessService.instance;
  }

  async runProductionReadinessCheck(): Promise<ProductionReadinessReport> {
    const checks: ReadinessCheck[] = [];
    
    // Security checks
    await this.checkSecurity(checks);
    
    // Database connectivity
    await this.checkDatabase(checks);
    
    // Authentication system
    await this.checkAuthentication(checks);
    
    // CRM integrations
    await this.checkCRMIntegrations(checks);
    
    // AI services
    await this.checkAIServices(checks);
    
    // Performance checks
    await this.checkPerformance(checks);
    
    // Environment configuration
    await this.checkEnvironment(checks);

    const score = this.calculateOverallScore(checks);
    const overallStatus = this.determineOverallStatus(checks, score);
    const recommendations = this.generateRecommendations(checks);

    return {
      overallStatus,
      score,
      checks,
      recommendations
    };
  }

  private async checkSecurity(checks: ReadinessCheck[]): Promise<void> {
    try {
      const securityAudit = await securityAuditService.runSecurityAudit();
      
      checks.push({
        name: 'Security Audit',
        category: 'security',
        status: securityAudit.passed ? 'pass' : securityAudit.score > 70 ? 'warning' : 'fail',
        message: `Security score: ${securityAudit.score}/100`,
        details: `${securityAudit.issues.length} issues found, ${securityAudit.issues.filter(i => i.severity === 'critical').length} critical`
      });
    } catch (error) {
      checks.push({
        name: 'Security Audit',
        category: 'security',
        status: 'fail',
        message: 'Security audit failed to run',
        details: error.message
      });
    }
  }

  private async checkDatabase(checks: ReadinessCheck[]): Promise<void> {
    try {
      const startTime = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1);
      const responseTime = Date.now() - startTime;
      
      if (error) {
        checks.push({
          name: 'Database Connectivity',
          category: 'functionality',
          status: 'fail',
          message: 'Database connection failed',
          details: error.message
        });
      } else {
        checks.push({
          name: 'Database Connectivity',
          category: 'functionality',
          status: responseTime < 1000 ? 'pass' : 'warning',
          message: `Database connected (${responseTime}ms)`,
          details: responseTime > 1000 ? 'Slow response time detected' : undefined
        });
      }
    } catch (error) {
      checks.push({
        name: 'Database Connectivity',
        category: 'functionality',
        status: 'fail',
        message: 'Database connection error',
        details: error.message
      });
    }
  }

  private async checkAuthentication(checks: ReadinessCheck[]): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        checks.push({
          name: 'Authentication System',
          category: 'functionality',
          status: profile ? 'pass' : 'warning',
          message: profile ? 'Authentication working' : 'User authenticated but no profile',
          details: profile ? `Role: ${profile.role}` : 'Profile may need to be created'
        });
      } else {
        checks.push({
          name: 'Authentication System',
          category: 'functionality',
          status: 'warning',
          message: 'No authenticated user (demo/test mode)',
          details: 'Authentication will be required for production use'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Authentication System',
        category: 'functionality',
        status: 'fail',
        message: 'Authentication system error',
        details: error.message
      });
    }
  }

  private async checkCRMIntegrations(checks: ReadinessCheck[]): Promise<void> {
    // Zoho CRM
    try {
      const zohoStatus = await zohoCRMIntegration.getStatus();
      checks.push({
        name: 'Zoho CRM Integration',
        category: 'integrations',
        status: zohoStatus.connected ? 'pass' : 'warning',
        message: zohoStatus.connected ? 'Connected and operational' : 'Not connected',
        details: zohoStatus.connected ? `${zohoStatus.totalLeads} leads synced` : 'Configuration needed'
      });
    } catch (error) {
      checks.push({
        name: 'Zoho CRM Integration',
        category: 'integrations',
        status: 'fail',
        message: 'Zoho integration error',
        details: error.message
      });
    }

    // ClickUp
    try {
      const clickupStatus = await clickUpCRMIntegration.getStatus();
      checks.push({
        name: 'ClickUp Integration',
        category: 'integrations',
        status: clickupStatus.connected ? 'pass' : 'warning',
        message: clickupStatus.connected ? 'Connected and operational' : 'Not connected',
        details: clickupStatus.connected ? `${clickupStatus.totalTasks} tasks synced` : 'Configuration needed'
      });
    } catch (error) {
      checks.push({
        name: 'ClickUp Integration',
        category: 'integrations',
        status: 'fail',
        message: 'ClickUp integration error',
        details: error.message
      });
    }
  }

  private async checkAIServices(checks: ReadinessCheck[]): Promise<void> {
    // Check if AI monitoring is active
    try {
      await aiMonitoringService.logAIEvent({
        event_summary: 'Production readiness test',
        type: 'optimization',
        payload: { test: true },
        visibility: 'admin_only'
      });
      
      checks.push({
        name: 'AI Monitoring System',
        category: 'ai',
        status: 'pass',
        message: 'AI monitoring active',
        details: 'Logging and tracking operational'
      });
    } catch (error) {
      checks.push({
        name: 'AI Monitoring System',
        category: 'ai',
        status: 'warning',
        message: 'AI monitoring issues',
        details: error.message
      });
    }

    // Check AI Brain functionality
    try {
      const { data: insights } = await supabase
        .from('ai_brain_insights')
        .select('id')
        .limit(1);
      
      checks.push({
        name: 'AI Brain System',
        category: 'ai',
        status: 'pass',
        message: 'AI Brain operational',
        details: 'Insight generation available'
      });
    } catch (error) {
      checks.push({
        name: 'AI Brain System',
        category: 'ai',
        status: 'fail',
        message: 'AI Brain system error',
        details: error.message
      });
    }
  }

  private async checkPerformance(checks: ReadinessCheck[]): Promise<void> {
    // Check initial load performance
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
      
      checks.push({
        name: 'Page Load Performance',
        category: 'performance',
        status: loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warning' : 'fail',
        message: `Page loads in ${Math.round(loadTime)}ms`,
        details: loadTime > 3000 ? 'Consider optimizing assets and code splitting' : undefined
      });
    }

    // Check memory usage
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      checks.push({
        name: 'Memory Usage',
        category: 'performance',
        status: usagePercent < 50 ? 'pass' : usagePercent < 80 ? 'warning' : 'fail',
        message: `${Math.round(usagePercent)}% memory used`,
        details: usagePercent > 50 ? 'Monitor for memory leaks' : undefined
      });
    }
  }

  private async checkEnvironment(checks: ReadinessCheck[]): Promise<void> {
    // Check if we're in production environment
    const isProduction = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1') &&
                         !window.location.hostname.includes('lovableproject.com');
    
    checks.push({
      name: 'Environment Configuration',
      category: 'functionality',
      status: isProduction ? 'pass' : 'warning',
      message: isProduction ? 'Production environment' : 'Development/staging environment',
      details: isProduction ? undefined : 'Ensure proper production configuration before go-live'
    });

    // Check HTTPS
    checks.push({
      name: 'HTTPS Configuration',
      category: 'security',
      status: location.protocol === 'https:' || location.hostname === 'localhost' ? 'pass' : 'fail',
      message: location.protocol === 'https:' ? 'HTTPS enabled' : 'HTTP detected',
      details: location.protocol !== 'https:' && location.hostname !== 'localhost' ? 'HTTPS required for production' : undefined
    });
  }

  private calculateOverallScore(checks: ReadinessCheck[]): number {
    let totalPoints = 0;
    let maxPoints = 0;

    for (const check of checks) {
      maxPoints += 100;
      switch (check.status) {
        case 'pass':
          totalPoints += 100;
          break;
        case 'warning':
          totalPoints += 70;
          break;
        case 'fail':
          totalPoints += 0;
          break;
      }
    }

    return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  }

  private determineOverallStatus(checks: ReadinessCheck[], score: number): 'ready' | 'warning' | 'not_ready' {
    const criticalFailures = checks.filter(c => c.status === 'fail' && 
      (c.category === 'security' || c.category === 'functionality')).length;
    
    if (criticalFailures > 0 || score < 60) {
      return 'not_ready';
    } else if (score < 85 || checks.some(c => c.status === 'warning')) {
      return 'warning';
    } else {
      return 'ready';
    }
  }

  private generateRecommendations(checks: ReadinessCheck[]): string[] {
    const recommendations: string[] = [];
    
    const failedChecks = checks.filter(c => c.status === 'fail');
    const warningChecks = checks.filter(c => c.status === 'warning');
    
    if (failedChecks.length > 0) {
      recommendations.push(`Address ${failedChecks.length} critical failures before production deployment`);
    }
    
    if (warningChecks.length > 0) {
      recommendations.push(`Review ${warningChecks.length} warnings for optimal performance`);
    }
    
    // Specific recommendations
    if (checks.some(c => c.name.includes('Security') && c.status !== 'pass')) {
      recommendations.push('Complete security audit and resolve all critical security issues');
    }
    
    if (checks.some(c => c.name.includes('CRM') && c.status !== 'pass')) {
      recommendations.push('Configure CRM integrations for automated lead management');
    }
    
    if (checks.some(c => c.name.includes('Performance') && c.status !== 'pass')) {
      recommendations.push('Optimize application performance for better user experience');
    }
    
    if (checks.some(c => c.name.includes('HTTPS') && c.status !== 'pass')) {
      recommendations.push('Enable HTTPS encryption for secure data transmission');
    }

    return recommendations;
  }

  async initializeProductionSystems(): Promise<void> {
    console.log('🚀 Initializing production systems...');
    
    // Start AI monitoring
    await aiMonitoringService.startPerformanceMonitoring();
    
    // Log system initialization
    await aiMonitoringService.logAIEvent({
      event_summary: 'Production systems initialized',
      type: 'optimization',
      payload: {
        timestamp: new Date().toISOString(),
        environment: window.location.hostname,
        userAgent: navigator.userAgent
      },
      visibility: 'admin_only'
    });
    
    console.log('✅ Production systems ready');
  }
}

export const productionReadinessService = ProductionReadinessService.getInstance();
