import { logger } from '@/utils/logger';

import { DatabaseLead } from '@/hooks/useLeads';

export interface ZohoLead {
  id: string;
  First_Name?: string;
  Last_Name?: string;
  Email?: string;
  Phone?: string;
  Company?: string;
  Lead_Status?: string;
  Lead_Source?: string;
  Owner?: {
    name: string;
    id: string;
  };
  Tag?: string[];
  Created_Time?: string;
  Modified_Time?: string;
}

export class ZohoHelpers {
  transformZohoLeadToOSLead(zohoLead: ZohoLead, companyId: string): Omit<DatabaseLead, 'id' | 'created_at' | 'updated_at'> {
    try {
      const name = this.buildFullName(zohoLead.First_Name, zohoLead.Last_Name);
      const status = this.mapZohoStatusToOSStatus(zohoLead.Lead_Status);
      const priority = this.determineLeadPriority(zohoLead);
      const score = this.calculateLeadScore(zohoLead);
      const tags = this.processZohoTags(zohoLead.Tag);

      return {
        company_id: companyId,
        name: name || 'Unknown Lead',
        email: zohoLead.Email || undefined,
        phone: zohoLead.Phone || undefined,
        company: zohoLead.Company || undefined,
        source: this.mapZohoSourceToOSSource(zohoLead.Lead_Source),
        status,
        priority,
        score,
        tags,
        last_contact: undefined, // Will be set separately if available
        conversion_likelihood: this.calculateConversionLikelihood(zohoLead),
        speed_to_lead: this.calculateSpeedToLead(zohoLead),
        is_sensitive: this.checkIfSensitiveLead(zohoLead)
      };
    } catch (error) {
      logger.error('Error transforming Zoho lead:', error);
      throw new Error(`Failed to transform Zoho lead ${zohoLead.id}: ${error.message}`);
    }
  }

  private buildFullName(firstName?: string, lastName?: string): string {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : '';
  }

  private mapZohoStatusToOSStatus(zohoStatus?: string): string {
    if (!zohoStatus) return 'new';

    const statusMap: Record<string, string> = {
      'Not Contacted': 'new',
      'Contacted': 'contacted',
      'Qualified': 'qualified',
      'Not Qualified': 'disqualified',
      'Lost Lead': 'lost',
      'Converted': 'converted',
      'Junk Lead': 'spam'
    };

    return statusMap[zohoStatus] || 'new';
  }

  private mapZohoSourceToOSSource(zohoSource?: string): string {
    if (!zohoSource) return 'zoho';

    const sourceMap: Record<string, string> = {
      'Web Form': 'website',
      'Email': 'email',
      'Phone Call': 'phone',
      'Social Media': 'social',
      'Advertisement': 'ads',
      'Referral': 'referral',
      'Trade Show': 'event',
      'Partner': 'partner'
    };

    return sourceMap[zohoSource] || 'zoho';
  }

  private determineLeadPriority(zohoLead: ZohoLead): 'low' | 'medium' | 'high' {
    // Determine priority based on various factors
    let score = 0;

    // Company presence increases priority
    if (zohoLead.Company) score += 1;

    // Email and phone both present increases priority
    if (zohoLead.Email && zohoLead.Phone) score += 1;

    // Certain sources are higher priority
    const highPrioritySources = ['Referral', 'Partner', 'Trade Show'];
    if (zohoLead.Lead_Source && highPrioritySources.includes(zohoLead.Lead_Source)) {
      score += 1;
    }

    // VIP or urgent tags increase priority
    const urgentTags = zohoLead.Tag?.some(tag => 
      ['VIP', 'Urgent', 'Hot', 'Priority'].some(keyword => 
        tag.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    if (urgentTags) score += 2;

    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  private calculateLeadScore(zohoLead: ZohoLead): number {
    let score = 50; // Base score

    // Complete contact info
    if (zohoLead.Email) score += 10;
    if (zohoLead.Phone) score += 10;
    if (zohoLead.Company) score += 15;

    // High-value sources
    const highValueSources = ['Referral', 'Partner', 'Trade Show'];
    if (zohoLead.Lead_Source && highValueSources.includes(zohoLead.Lead_Source)) {
      score += 20;
    }

    // Tag-based scoring
    const valueTags = zohoLead.Tag?.some(tag => 
      ['Enterprise', 'Decision Maker', 'Budget Confirmed'].some(keyword =>
        tag.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    if (valueTags) score += 25;

    return Math.min(score, 100);
  }

  private processZohoTags(zohoTags?: string[]): string[] {
    if (!Array.isArray(zohoTags)) return [];
    
    return zohoTags
      .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
      .map(tag => tag.trim())
      .slice(0, 10); // Limit to 10 tags
  }

  private calculateConversionLikelihood(zohoLead: ZohoLead): number {
    let likelihood = 30; // Base likelihood

    // Status-based likelihood
    const statusLikelihood: Record<string, number> = {
      'Qualified': 80,
      'Contacted': 60,
      'Not Contacted': 30,
      'Not Qualified': 10,
      'Lost Lead': 5
    };

    if (zohoLead.Lead_Status && statusLikelihood[zohoLead.Lead_Status]) {
      likelihood = statusLikelihood[zohoLead.Lead_Status];
    }

    // Adjust based on completeness
    if (zohoLead.Email && zohoLead.Phone && zohoLead.Company) {
      likelihood += 15;
    }

    return Math.min(likelihood, 95);
  }

  private calculateSpeedToLead(zohoLead: ZohoLead): number {
    if (!zohoLead.Created_Time) return 0;

    try {
      const createdTime = new Date(zohoLead.Created_Time);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - createdTime.getTime()) / (1000 * 60));
      
      // Return hours since creation
      return Math.floor(diffMinutes / 60);
    } catch (error) {
      logger.error('Error calculating speed to lead:', error);
      return 0;
    }
  }

  private checkIfSensitiveLead(zohoLead: ZohoLead): boolean {
    // Check for sensitive indicators
    const sensitiveKeywords = ['government', 'healthcare', 'finance', 'legal', 'confidential'];
    
    const companyText = (zohoLead.Company || '').toLowerCase();
    const tagText = (zohoLead.Tag || []).join(' ').toLowerCase();
    
    return sensitiveKeywords.some(keyword => 
      companyText.includes(keyword) || tagText.includes(keyword)
    );
  }

  formatZohoDate(dateString?: string): Date | null {
    if (!dateString) return null;
    
    try {
      return new Date(dateString);
    } catch (error) {
      logger.error('Invalid date format from Zoho:', dateString);
      return null;
    }
  }

  validateZohoLead(zohoLead: any): zohoLead is ZohoLead {
    if (!zohoLead || typeof zohoLead !== 'object') {
      return false;
    }

    // Must have an ID
    if (!zohoLead.id || typeof zohoLead.id !== 'string') {
      return false;
    }

    // Basic structure validation
    return true;
  }

  sanitizeZohoData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        continue;
      }
      
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else if (Array.isArray(value)) {
        sanitized[key] = value.filter(item => item !== null && item !== undefined);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}
