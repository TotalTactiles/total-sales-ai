
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface LeadQualityMetrics {
  score: number;
  source: string;
  responseRate: number;
  engagementSpeed: number;
  saleability: number;
  qualityThreshold: number;
}

export interface QualityAuditResult {
  leadId: string;
  score: number;
  passed: boolean;
  issues: string[];
  recommendations: string[];
  sourceAttribution: {
    source: string;
    performance: number;
    cost?: number;
  };
}

class LeadQualityAuditService {
  private static instance: LeadQualityAuditService;
  private qualityThreshold = 70; // Configurable threshold

  static getInstance(): LeadQualityAuditService {
    if (!LeadQualityAuditService.instance) {
      LeadQualityAuditService.instance = new LeadQualityAuditService();
    }
    return LeadQualityAuditService.instance;
  }

  async auditNewLead(leadId: string, companyId: string): Promise<QualityAuditResult> {
    try {
      // Get lead data
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .eq('company_id', companyId)
        .single();

      if (!lead) {
        throw new Error('Lead not found');
      }

      // Calculate quality metrics
      const metrics = await this.calculateQualityMetrics(lead);
      
      // Determine if lead passes quality check
      const passed = metrics.score >= this.qualityThreshold;
      
      // Generate issues and recommendations
      const issues = this.identifyIssues(metrics, lead);
      const recommendations = this.generateRecommendations(metrics, lead);

      // Get source attribution data
      const sourceAttribution = await this.getSourceAttribution(lead.source, companyId);

      const result: QualityAuditResult = {
        leadId,
        score: metrics.score,
        passed,
        issues,
        recommendations,
        sourceAttribution
      };

      // Log audit result
      await this.logAuditResult(result, companyId);

      // If failed, trigger manager notification
      if (!passed) {
        await this.notifyManagerOfLowQuality(result, companyId);
      }

      return result;

    } catch (error) {
      logger.error('Lead quality audit failed:', error);
      throw error;
    }
  }

  private async calculateQualityMetrics(lead: any): Promise<LeadQualityMetrics> {
    // Base score calculation
    let score = 50;
    
    // Email quality
    if (lead.email && this.isValidEmail(lead.email)) {
      score += 15;
      if (!this.isGenericEmail(lead.email)) score += 10;
    }

    // Phone quality
    if (lead.phone && this.isValidPhone(lead.phone)) {
      score += 15;
    }

    // Company information
    if (lead.company && lead.company.length > 2) {
      score += 10;
    }

    // Lead source quality
    const sourceQuality = await this.getSourceQuality(lead.source);
    score += sourceQuality;

    // Speed to contact (if available)
    if (lead.speed_to_lead && lead.speed_to_lead < 300) { // 5 minutes
      score += 10;
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      source: lead.source || 'unknown',
      responseRate: sourceQuality / 2, // Simplified calculation
      engagementSpeed: lead.speed_to_lead || 0,
      saleability: score * 0.8, // Estimated saleability
      qualityThreshold: this.qualityThreshold
    };
  }

  private async getSourceQuality(source: string): Promise<number> {
    try {
      const { data: stats } = await supabase
        .from('lead_source_stats')
        .select('conversion_rate')
        .eq('source', source)
        .single();

      if (stats) {
        return Math.round(stats.conversion_rate * 20); // Convert to 0-20 scale
      }
    } catch (error) {
      logger.warn('Could not get source quality:', error);
    }
    
    return 5; // Default score
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isGenericEmail(email: string): boolean {
    const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return genericDomains.includes(domain);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleaned) && cleaned.length >= 10;
  }

  private identifyIssues(metrics: LeadQualityMetrics, lead: any): string[] {
    const issues: string[] = [];

    if (!lead.email || !this.isValidEmail(lead.email)) {
      issues.push('Invalid or missing email address');
    }

    if (!lead.phone || !this.isValidPhone(lead.phone)) {
      issues.push('Invalid or missing phone number');
    }

    if (!lead.company || lead.company.length < 3) {
      issues.push('Missing or incomplete company information');
    }

    if (metrics.responseRate < 30) {
      issues.push('Low response rate from this source');
    }

    if (metrics.engagementSpeed > 1800) { // 30 minutes
      issues.push('Slow speed to contact');
    }

    return issues;
  }

  private generateRecommendations(metrics: LeadQualityMetrics, lead: any): string[] {
    const recommendations: string[] = [];

    if (metrics.score < 60) {
      recommendations.push('Consider data enrichment services');
      recommendations.push('Verify lead information before assignment');
    }

    if (metrics.responseRate < 40) {
      recommendations.push('Review source attribution and ROI');
      recommendations.push('Consider reducing spend on this source');
    }

    if (!lead.company) {
      recommendations.push('Research company information before contact');
    }

    recommendations.push('Assign to top-performing rep for this source');

    return recommendations;
  }

  private async getSourceAttribution(source: string, companyId: string) {
    try {
      const { data: stats } = await supabase
        .from('lead_source_stats')
        .select('*')
        .eq('source', source)
        .eq('company_id', companyId)
        .single();

      return {
        source,
        performance: stats?.conversion_rate || 0,
        cost: stats?.total_spend || 0
      };
    } catch (error) {
      return {
        source,
        performance: 0
      };
    }
  }

  private async logAuditResult(result: QualityAuditResult, companyId: string) {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'lead_quality_audit',
          event_summary: `Lead quality audit: ${result.score}/100`,
          payload: result,
          company_id: companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Failed to log audit result:', error);
    }
  }

  private async notifyManagerOfLowQuality(result: QualityAuditResult, companyId: string) {
    try {
      await supabase
        .from('notifications')
        .insert({
          company_id: companyId,
          type: 'lead_quality_alert',
          title: 'Low Quality Lead Detected',
          message: `Lead scored ${result.score}/100. Issues: ${result.issues.join(', ')}`,
          metadata: {
            leadId: result.leadId,
            score: result.score,
            issues: result.issues,
            recommendations: result.recommendations
          }
        });
    } catch (error) {
      logger.error('Failed to notify manager:', error);
    }
  }
}

export const leadQualityAuditService = LeadQualityAuditService.getInstance();
