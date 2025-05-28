
import { DatabaseLead } from '@/hooks/useLeads';

export interface ClickUpTask {
  id: string;
  name: string;
  description?: string;
  status: {
    status: string;
    color: string;
  };
  assignees: Array<{
    id: string;
    username: string;
    email: string;
  }>;
  creator: {
    id: string;
    username: string;
    email: string;
  };
  custom_fields: Array<{
    id: string;
    name: string;
    value?: any;
    type: string;
  }>;
  tags: string[];
  priority?: {
    priority: string;
    color: string;
  };
  date_created: string;
  date_updated: string;
  url: string;
}

export class ClickUpHelpers {
  transformClickUpTaskToOSLead(task: ClickUpTask, companyId: string): Omit<DatabaseLead, 'id' | 'created_at' | 'updated_at'> {
    try {
      const name = this.extractLeadName(task);
      const email = this.extractEmail(task);
      const phone = this.extractPhone(task);
      const company = this.extractCompany(task);
      const status = this.mapClickUpStatusToOSStatus(task.status?.status);
      const priority = this.determineLeadPriority(task);
      const score = this.calculateLeadScore(task);
      const tags = this.processClickUpTags(task.tags);

      return {
        company_id: companyId,
        name: name || task.name || 'Unknown Lead',
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        source: 'clickup',
        status,
        priority,
        score,
        tags,
        last_contact: undefined,
        conversion_likelihood: this.calculateConversionLikelihood(task),
        speed_to_lead: this.calculateSpeedToLead(task),
        is_sensitive: this.checkIfSensitiveTask(task)
      };
    } catch (error) {
      console.error('Error transforming ClickUp task:', error);
      throw new Error(`Failed to transform ClickUp task ${task.id}: ${error.message}`);
    }
  }

  private extractLeadName(task: ClickUpTask): string {
    // First try custom fields for lead name
    const nameField = task.custom_fields?.find(field => 
      ['name', 'lead_name', 'contact_name', 'client_name'].includes(field.name.toLowerCase())
    );
    
    if (nameField?.value) {
      return String(nameField.value).trim();
    }

    // Try to extract from task name if it follows patterns like "Lead: John Doe"
    const leadPattern = /^(?:lead|contact|client):\s*(.+)$/i;
    const match = task.name.match(leadPattern);
    if (match) {
      return match[1].trim();
    }

    // Try assignee name as fallback
    if (task.assignees?.[0]?.username) {
      return task.assignees[0].username;
    }

    return task.name;
  }

  private extractEmail(task: ClickUpTask): string | null {
    // Check custom fields for email
    const emailField = task.custom_fields?.find(field => 
      ['email', 'email_address', 'contact_email'].includes(field.name.toLowerCase())
    );
    
    if (emailField?.value) {
      const email = String(emailField.value).trim();
      if (this.isValidEmail(email)) {
        return email;
      }
    }

    // Check assignee email
    if (task.assignees?.[0]?.email) {
      return task.assignees[0].email;
    }

    // Try to extract email from description
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const descriptionMatch = task.description?.match(emailPattern);
    if (descriptionMatch) {
      return descriptionMatch[1];
    }

    return null;
  }

  private extractPhone(task: ClickUpTask): string | null {
    // Check custom fields for phone
    const phoneField = task.custom_fields?.find(field => 
      ['phone', 'phone_number', 'contact_phone', 'mobile'].includes(field.name.toLowerCase())
    );
    
    if (phoneField?.value) {
      return String(phoneField.value).trim();
    }

    // Try to extract phone from description
    const phonePattern = /(\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/;
    const descriptionMatch = task.description?.match(phonePattern);
    if (descriptionMatch) {
      return descriptionMatch[1];
    }

    return null;
  }

  private extractCompany(task: ClickUpTask): string | null {
    // Check custom fields for company
    const companyField = task.custom_fields?.find(field => 
      ['company', 'company_name', 'organization', 'business'].includes(field.name.toLowerCase())
    );
    
    if (companyField?.value) {
      return String(companyField.value).trim();
    }

    return null;
  }

  private mapClickUpStatusToOSStatus(clickUpStatus?: string): string {
    if (!clickUpStatus) return 'new';

    const statusLower = clickUpStatus.toLowerCase();
    
    const statusMap: Record<string, string> = {
      'new': 'new',
      'open': 'new',
      'to do': 'new',
      'contacted': 'contacted',
      'in progress': 'contacted',
      'qualified': 'qualified',
      'proposal': 'qualified',
      'negotiation': 'qualified',
      'won': 'converted',
      'closed': 'converted',
      'complete': 'converted',
      'lost': 'lost',
      'cancelled': 'lost',
      'disqualified': 'disqualified',
      'spam': 'spam',
      'invalid': 'spam'
    };

    // Try exact match first
    if (statusMap[statusLower]) {
      return statusMap[statusLower];
    }

    // Try partial matches
    for (const [key, value] of Object.entries(statusMap)) {
      if (statusLower.includes(key)) {
        return value;
      }
    }

    return 'new';
  }

  private determineLeadPriority(task: ClickUpTask): 'low' | 'medium' | 'high' {
    let score = 0;

    // ClickUp priority
    if (task.priority) {
      const priorityMap: Record<string, number> = {
        'urgent': 3,
        'high': 2,
        'normal': 1,
        'low': 0
      };
      score += priorityMap[task.priority.priority.toLowerCase()] || 0;
    }

    // Complete contact info
    if (this.extractEmail(task) && this.extractPhone(task)) score += 1;
    if (this.extractCompany(task)) score += 1;

    // Priority tags
    const priorityTags = task.tags?.some(tag => 
      ['urgent', 'high priority', 'hot', 'vip'].some(keyword => 
        tag.toLowerCase().includes(keyword)
      )
    );
    if (priorityTags) score += 2;

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  private calculateLeadScore(task: ClickUpTask): number {
    let score = 40; // Base score

    // Contact completeness
    if (this.extractEmail(task)) score += 15;
    if (this.extractPhone(task)) score += 15;
    if (this.extractCompany(task)) score += 20;

    // Priority bonus
    if (task.priority?.priority === 'urgent') score += 20;
    else if (task.priority?.priority === 'high') score += 10;

    // Assignee indicates active management
    if (task.assignees?.length > 0) score += 10;

    // Value tags
    const valueTags = task.tags?.some(tag => 
      ['enterprise', 'large deal', 'qualified', 'budget confirmed'].some(keyword =>
        tag.toLowerCase().includes(keyword)
      )
    );
    if (valueTags) score += 20;

    return Math.min(score, 100);
  }

  private processClickUpTags(tags?: string[]): string[] {
    if (!Array.isArray(tags)) return [];
    
    return tags
      .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
      .map(tag => tag.trim())
      .slice(0, 10);
  }

  private calculateConversionLikelihood(task: ClickUpTask): number {
    let likelihood = 25; // Base likelihood

    // Status-based likelihood
    const status = task.status?.status.toLowerCase();
    if (status?.includes('qualified') || status?.includes('proposal')) {
      likelihood = 75;
    } else if (status?.includes('contacted') || status?.includes('progress')) {
      likelihood = 50;
    } else if (status?.includes('new') || status?.includes('open')) {
      likelihood = 30;
    }

    // Completeness bonus
    if (this.extractEmail(task) && this.extractPhone(task) && this.extractCompany(task)) {
      likelihood += 20;
    }

    // Priority bonus
    if (task.priority?.priority === 'urgent') {
      likelihood += 15;
    }

    return Math.min(likelihood, 95);
  }

  private calculateSpeedToLead(task: ClickUpTask): number {
    if (!task.date_created) return 0;

    try {
      const createdTime = new Date(task.date_created);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - createdTime.getTime()) / (1000 * 60));
      
      return Math.floor(diffMinutes / 60);
    } catch (error) {
      console.error('Error calculating speed to lead:', error);
      return 0;
    }
  }

  private checkIfSensitiveTask(task: ClickUpTask): boolean {
    const sensitiveKeywords = ['confidential', 'sensitive', 'private', 'nda', 'government'];
    
    const taskName = task.name.toLowerCase();
    const description = (task.description || '').toLowerCase();
    const tagText = task.tags?.join(' ').toLowerCase() || '';
    
    return sensitiveKeywords.some(keyword => 
      taskName.includes(keyword) || 
      description.includes(keyword) || 
      tagText.includes(keyword)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  formatClickUpDate(dateString?: string): Date | null {
    if (!dateString) return null;
    
    try {
      return new Date(dateString);
    } catch (error) {
      console.error('Invalid date format from ClickUp:', dateString);
      return null;
    }
  }

  validateClickUpTask(task: any): task is ClickUpTask {
    if (!task || typeof task !== 'object') {
      return false;
    }

    if (!task.id || typeof task.id !== 'string') {
      return false;
    }

    if (!task.name || typeof task.name !== 'string') {
      return false;
    }

    return true;
  }

  sanitizeClickUpData(data: any): any {
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

  // Helper to find relevant ClickUp lists for lead management
  identifyLeadLists(lists: any[]): any[] {
    const leadKeywords = ['lead', 'prospect', 'client', 'customer', 'contact', 'sales', 'crm'];
    
    return lists.filter(list => {
      const listName = list.name.toLowerCase();
      return leadKeywords.some(keyword => listName.includes(keyword));
    });
  }
}
