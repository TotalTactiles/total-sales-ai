
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface RepPerformanceMetrics {
  repId: string;
  repName: string;
  closeRate: number;
  responseTime: number;
  currentWorkload: number;
  availability: 'available' | 'busy' | 'overloaded';
  specialties: string[];
}

export interface ReassignmentResult {
  leadId: string;
  fromRepId?: string;
  toRepId: string;
  reason: string;
  confidence: number;
  estimatedImprovement: string;
}

class SmartLeadReassignmentService {
  private static instance: SmartLeadReassignmentService;

  static getInstance(): SmartLeadReassignmentService {
    if (!SmartLeadReassignmentService.instance) {
      SmartLeadReassignmentService.instance = new SmartLeadReassignmentService();
    }
    return SmartLeadReassignmentService.instance;
  }

  async evaluateReassignment(leadId: string, companyId: string, trigger: string): Promise<ReassignmentResult | null> {
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

      // Get all reps performance metrics
      const repMetrics = await this.getRepPerformanceMetrics(companyId);
      
      // Find best rep for this lead
      const bestRep = this.findBestRep(lead, repMetrics, trigger);
      
      if (!bestRep || (lead.assigned_rep && bestRep.repId === lead.assigned_rep)) {
        return null; // No better assignment found
      }

      // Calculate reassignment confidence
      const confidence = this.calculateReassignmentConfidence(lead, bestRep, repMetrics);
      
      if (confidence < 0.7) {
        return null; // Not confident enough to reassign
      }

      const result: ReassignmentResult = {
        leadId,
        fromRepId: lead.assigned_rep,
        toRepId: bestRep.repId,
        reason: this.generateReassignmentReason(trigger, bestRep),
        confidence,
        estimatedImprovement: this.estimateImprovement(lead, bestRep)
      };

      // Execute the reassignment
      await this.executeReassignment(result, companyId);

      return result;

    } catch (error) {
      logger.error('Smart lead reassignment failed:', error);
      throw error;
    }
  }

  private async getRepPerformanceMetrics(companyId: string): Promise<RepPerformanceMetrics[]> {
    try {
      // Get all sales reps in company
      const { data: reps } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .eq('role', 'sales_rep');

      if (!reps) return [];

      const metrics: RepPerformanceMetrics[] = [];

      for (const rep of reps) {
        // Get rep metrics from rep_metrics table
        const { data: repStats } = await supabase
          .from('rep_metrics')
          .select('*')
          .eq('rep_id', rep.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Count current assigned leads
        const { count: currentWorkload } = await supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .eq('company_id', companyId)
          .eq('assigned_rep', rep.id)
          .in('status', ['new', 'contacted', 'qualified']);

        // Calculate availability
        let availability: 'available' | 'busy' | 'overloaded' = 'available';
        if (currentWorkload && currentWorkload > 50) availability = 'overloaded';
        else if (currentWorkload && currentWorkload > 25) availability = 'busy';

        metrics.push({
          repId: rep.id,
          repName: rep.full_name || 'Unknown Rep',
          closeRate: repStats?.closes || 0,
          responseTime: 300, // Default 5 minutes, would be calculated from actual data
          currentWorkload: currentWorkload || 0,
          availability,
          specialties: rep.industry ? [rep.industry] : []
        });
      }

      return metrics;

    } catch (error) {
      logger.error('Failed to get rep performance metrics:', error);
      return [];
    }
  }

  private findBestRep(lead: any, repMetrics: RepPerformanceMetrics[], trigger: string): RepPerformanceMetrics | null {
    // Filter available reps
    const availableReps = repMetrics.filter(rep => rep.availability !== 'overloaded');
    
    if (availableReps.length === 0) {
      return null;
    }

    // Score each rep based on multiple factors
    const scoredReps = availableReps.map(rep => {
      let score = 0;

      // Close rate (40% weight)
      score += rep.closeRate * 0.4;

      // Workload availability (30% weight)
      if (rep.availability === 'available') score += 30;
      else if (rep.availability === 'busy') score += 15;

      // Industry specialty match (20% weight)
      if (lead.company && rep.specialties.some(s => 
        lead.company.toLowerCase().includes(s.toLowerCase())
      )) {
        score += 20;
      }

      // Response time (10% weight)
      score += Math.max(0, 10 - (rep.responseTime / 60)); // Faster response = higher score

      return { ...rep, score };
    });

    // Sort by score and return best
    scoredReps.sort((a, b) => b.score - a.score);
    return scoredReps[0];
  }

  private calculateReassignmentConfidence(lead: any, bestRep: RepPerformanceMetrics, allReps: RepPerformanceMetrics[]): number {
    let confidence = 0.5; // Base confidence

    // Higher confidence if best rep has significantly better close rate
    const avgCloseRate = allReps.reduce((sum, rep) => sum + rep.closeRate, 0) / allReps.length;
    if (bestRep.closeRate > avgCloseRate * 1.5) {
      confidence += 0.3;
    }

    // Higher confidence if best rep is available vs current rep overloaded
    if (bestRep.availability === 'available') {
      confidence += 0.2;
    }

    // Industry match increases confidence
    if (lead.company && bestRep.specialties.some(s => 
      lead.company.toLowerCase().includes(s.toLowerCase())
    )) {
      confidence += 0.2;
    }

    return Math.min(1.0, confidence);
  }

  private generateReassignmentReason(trigger: string, bestRep: RepPerformanceMetrics): string {
    const reasons = [];

    if (trigger === 'unresponsive') {
      reasons.push('Lead marked as unresponsive');
    } else if (trigger === 'stale') {
      reasons.push('Lead has been stale for extended period');
    } else if (trigger === 'incorrect_assignment') {
      reasons.push('Lead incorrectly assigned initially');
    }

    if (bestRep.closeRate > 50) {
      reasons.push(`${bestRep.repName} has high close rate (${bestRep.closeRate}%)`);
    }

    if (bestRep.availability === 'available') {
      reasons.push(`${bestRep.repName} is currently available`);
    }

    if (bestRep.specialties.length > 0) {
      reasons.push(`${bestRep.repName} has relevant industry experience`);
    }

    return reasons.join('; ');
  }

  private estimateImprovement(lead: any, bestRep: RepPerformanceMetrics): string {
    const improvements = [];

    if (bestRep.closeRate > 60) {
      improvements.push(`${Math.round(bestRep.closeRate)}% close rate`);
    }

    if (bestRep.responseTime < 300) {
      improvements.push('Faster response time');
    }

    if (bestRep.availability === 'available') {
      improvements.push('Immediate attention available');
    }

    return improvements.length > 0 
      ? `Expected improvements: ${improvements.join(', ')}`
      : 'Optimized assignment based on current metrics';
  }

  private async executeReassignment(result: ReassignmentResult, companyId: string): Promise<void> {
    try {
      // Update lead assignment
      await supabase
        .from('leads')
        .update({ 
          assigned_rep: result.toRepId,
          updated_at: new Date().toISOString()
        })
        .eq('id', result.leadId);

      // Log the reassignment
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'lead_reassignment',
          event_summary: `Lead reassigned: ${result.reason}`,
          payload: result,
          company_id: companyId,
          visibility: 'admin_only'
        });

      // Notify relevant parties
      await this.notifyReassignment(result, companyId);

    } catch (error) {
      logger.error('Failed to execute reassignment:', error);
      throw error;
    }
  }

  private async notifyReassignment(result: ReassignmentResult, companyId: string): Promise<void> {
    try {
      // Notify new rep
      await supabase
        .from('notifications')
        .insert({
          user_id: result.toRepId,
          company_id: companyId,
          type: 'lead_assigned',
          title: 'New Lead Assigned',
          message: `You've been assigned a new lead. Reason: ${result.reason}`,
          metadata: {
            leadId: result.leadId,
            confidence: result.confidence,
            estimatedImprovement: result.estimatedImprovement
          }
        });

      // Notify manager
      const { data: managers } = await supabase
        .from('profiles')
        .select('id')
        .eq('company_id', companyId)
        .eq('role', 'manager');

      if (managers) {
        for (const manager of managers) {
          await supabase
            .from('notifications')
            .insert({
              user_id: manager.id,
              company_id: companyId,
              type: 'lead_reassignment',
              title: 'Lead Automatically Reassigned',
              message: `Lead reassigned with ${Math.round(result.confidence * 100)}% confidence. ${result.reason}`,
              metadata: result
            });
        }
      }

    } catch (error) {
      logger.error('Failed to notify reassignment:', error);
    }
  }
}

export const smartLeadReassignmentService = SmartLeadReassignmentService.getInstance();
