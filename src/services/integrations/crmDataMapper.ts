import { logger } from '@/utils/logger';

import { toast } from 'sonner';

export interface LeadMappingTemplate {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
  required?: boolean;
}

export interface CRMLeadData {
  // Source system data
  sourceId: string;
  sourceName: string;
  sourceData: any;
  
  // Mapped lead data
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
  tags: string[];
  score: number;
  conversion_likelihood: number;
}

export class CRMDataMapper {
  private static instance: CRMDataMapper;
  
  static getInstance(): CRMDataMapper {
    if (!CRMDataMapper.instance) {
      CRMDataMapper.instance = new CRMDataMapper();
    }
    return CRMDataMapper.instance;
  }

  // Zoho CRM mapping templates
  private zohoMappingTemplates: LeadMappingTemplate[] = [
    { sourceField: 'First_Name', targetField: 'firstName', required: true },
    { sourceField: 'Last_Name', targetField: 'lastName', required: true },
    { sourceField: 'Email', targetField: 'email', required: false },
    { sourceField: 'Phone', targetField: 'phone', required: false },
    { sourceField: 'Company', targetField: 'company', required: false },
    { sourceField: 'Lead_Status', targetField: 'status', required: true },
    { sourceField: 'Lead_Source', targetField: 'source', required: false },
    { sourceField: 'Tag', targetField: 'tags', transform: (tags) => Array.isArray(tags) ? tags : [] }
  ];

  // ClickUp mapping templates
  private clickUpMappingTemplates: LeadMappingTemplate[] = [
    { sourceField: 'name', targetField: 'name', required: true },
    { sourceField: 'description', targetField: 'notes', required: false },
    { sourceField: 'status.status', targetField: 'status', required: true },
    { sourceField: 'priority.priority', targetField: 'priority', required: false },
    { sourceField: 'tags', targetField: 'tags', transform: (tags) => Array.isArray(tags) ? tags : [] },
    { sourceField: 'assignees', targetField: 'assignedTo', transform: (assignees) => assignees?.[0]?.email || null }
  ];

  mapZohoLeadToStandard(zohoLead: any, companyId: string): CRMLeadData {
    try {
      const mappedData: Partial<CRMLeadData> = {
        sourceId: zohoLead.id,
        sourceName: 'zoho',
        sourceData: zohoLead,
        source: 'zoho'
      };

      // Apply mapping templates
      for (const template of this.zohoMappingTemplates) {
        const sourceValue = this.getNestedValue(zohoLead, template.sourceField);
        
        if (template.required && !sourceValue) {
          logger.warn(`Missing required field: ${template.sourceField} for Zoho lead ${zohoLead.id}`);
          continue;
        }

        const transformedValue = template.transform ? template.transform(sourceValue) : sourceValue;
        
        switch (template.targetField) {
          case 'firstName':
          case 'lastName':
            if (!mappedData.name) mappedData.name = '';
            mappedData.name += (transformedValue || '') + ' ';
            break;
          default:
            (mappedData as any)[template.targetField] = transformedValue;
        }
      }

      // Clean up name
      if (mappedData.name) {
        mappedData.name = mappedData.name.trim();
      }

      // Set defaults and calculate scores
      return {
        ...mappedData,
        name: mappedData.name || 'Unknown Lead',
        status: this.normalizeStatus(mappedData.status as string) || 'new',
        priority: this.normalizePriority(zohoLead.Lead_Status) || 'medium',
        tags: mappedData.tags || [],
        score: this.calculateLeadScore(mappedData),
        conversion_likelihood: this.calculateConversionLikelihood(mappedData)
      } as CRMLeadData;
    } catch (error) {
      logger.error('Error mapping Zoho lead:', error);
      throw new Error(`Failed to map Zoho lead ${zohoLead.id}: ${error.message}`);
    }
  }

  mapClickUpTaskToStandard(clickUpTask: any, companyId: string): CRMLeadData {
    try {
      const mappedData: Partial<CRMLeadData> = {
        sourceId: clickUpTask.id,
        sourceName: 'clickup',
        sourceData: clickUpTask,
        source: 'clickup'
      };

      // Apply mapping templates
      for (const template of this.clickUpMappingTemplates) {
        const sourceValue = this.getNestedValue(clickUpTask, template.sourceField);
        
        if (template.required && !sourceValue) {
          logger.warn(`Missing required field: ${template.sourceField} for ClickUp task ${clickUpTask.id}`);
          continue;
        }

        const transformedValue = template.transform ? template.transform(sourceValue) : sourceValue;
        (mappedData as any)[template.targetField] = transformedValue;
      }

      // Extract email from custom fields if available
      if (clickUpTask.custom_fields) {
        const emailField = clickUpTask.custom_fields.find((field: any) => 
          field.name.toLowerCase().includes('email') || field.type === 'email'
        );
        if (emailField?.value) {
          mappedData.email = emailField.value;
        }

        const phoneField = clickUpTask.custom_fields.find((field: any) => 
          field.name.toLowerCase().includes('phone') || field.type === 'phone'
        );
        if (phoneField?.value) {
          mappedData.phone = phoneField.value;
        }

        const companyField = clickUpTask.custom_fields.find((field: any) => 
          field.name.toLowerCase().includes('company') || field.name.toLowerCase().includes('organization')
        );
        if (companyField?.value) {
          mappedData.company = companyField.value;
        }
      }

      // Set defaults and calculate scores
      return {
        ...mappedData,
        name: mappedData.name || clickUpTask.name || 'Unknown Lead',
        status: this.normalizeStatus(mappedData.status as string) || 'new',
        priority: this.normalizePriority(clickUpTask.priority?.priority) || 'medium',
        tags: [...(mappedData.tags || []), `clickup_task_${clickUpTask.id}`],
        score: this.calculateLeadScore(mappedData),
        conversion_likelihood: this.calculateConversionLikelihood(mappedData)
      } as CRMLeadData;
    } catch (error) {
      logger.error('Error mapping ClickUp task:', error);
      throw new Error(`Failed to map ClickUp task ${clickUpTask.id}: ${error.message}`);
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private normalizeStatus(status: string): string {
    if (!status) return 'new';
    
    const statusLower = status.toLowerCase();
    const statusMap: { [key: string]: string } = {
      'new': 'new',
      'open': 'new',
      'contacted': 'contacted',
      'qualified': 'qualified',
      'proposal': 'proposal',
      'negotiation': 'negotiation',
      'closed won': 'won',
      'closed lost': 'lost',
      'lost': 'lost',
      'won': 'won',
      'completed': 'won',
      'in progress': 'contacted',
      'to do': 'new'
    };

    return statusMap[statusLower] || 'new';
  }

  private normalizePriority(priority: string): 'low' | 'medium' | 'high' {
    if (!priority) return 'medium';
    
    const priorityLower = priority.toLowerCase();
    if (priorityLower.includes('high') || priorityLower.includes('urgent')) return 'high';
    if (priorityLower.includes('low')) return 'low';
    return 'medium';
  }

  private calculateLeadScore(leadData: Partial<CRMLeadData>): number {
    let score = 50; // Base score

    // Email presence adds points
    if (leadData.email) score += 20;
    
    // Phone presence adds points
    if (leadData.phone) score += 15;
    
    // Company presence adds points
    if (leadData.company) score += 10;
    
    // Priority affects score
    if (leadData.priority === 'high') score += 15;
    else if (leadData.priority === 'low') score -= 10;

    // Status affects score
    switch (leadData.status) {
      case 'qualified': score += 20; break;
      case 'proposal': score += 30; break;
      case 'negotiation': score += 40; break;
      case 'lost': score = 0; break;
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateConversionLikelihood(leadData: Partial<CRMLeadData>): number {
    let likelihood = 30; // Base likelihood

    // Complete contact info increases likelihood
    if (leadData.email && leadData.phone) likelihood += 25;
    else if (leadData.email || leadData.phone) likelihood += 15;

    // Company presence increases likelihood
    if (leadData.company) likelihood += 20;

    // Status-based likelihood
    switch (leadData.status) {
      case 'new': likelihood += 5; break;
      case 'contacted': likelihood += 15; break;
      case 'qualified': likelihood += 35; break;
      case 'proposal': likelihood += 60; break;
      case 'negotiation': likelihood += 80; break;
      case 'won': likelihood = 100; break;
      case 'lost': likelihood = 0; break;
    }

    return Math.max(0, Math.min(100, likelihood));
  }

  validateMappedLead(leadData: CRMLeadData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!leadData.name || leadData.name.trim() === '') {
      errors.push('Lead name is required');
    }

    if (!leadData.status) {
      errors.push('Lead status is required');
    }

    if (!leadData.sourceId) {
      errors.push('Source ID is required');
    }

    if (!leadData.source) {
      errors.push('Source system is required');
    }

    // Validate email format if present
    if (leadData.email && !this.isValidEmail(leadData.email)) {
      errors.push('Invalid email format');
    }

    // Validate phone format if present
    if (leadData.phone && !this.isValidPhone(leadData.phone)) {
      errors.push('Invalid phone format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  generateAIFeedback(leadData: CRMLeadData): string[] {
    const feedback: string[] = [];

    if (!leadData.email) {
      feedback.push('💡 Consider finding an email address for better lead nurturing');
    }

    if (!leadData.phone) {
      feedback.push('📞 Adding a phone number would enable direct calling');
    }

    if (!leadData.company) {
      feedback.push('🏢 Company information helps with lead qualification');
    }

    if (leadData.score < 30) {
      feedback.push('⚠️ Low lead score - consider lead qualification strategies');
    }

    if (leadData.conversion_likelihood < 20) {
      feedback.push('📈 Low conversion likelihood - focus on lead nurturing');
    }

    return feedback;
  }
}

export const crmDataMapper = CRMDataMapper.getInstance();
