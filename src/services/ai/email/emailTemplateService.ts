import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  industry?: string;
  companyId: string;
}

export class EmailTemplateService {
  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .insert({
          name: template.name,
          subject_template: template.subject,
          body_template: template.body,
          delay_hours: 0,
          is_active: true,
          company_id: template.companyId
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        subject: data.subject_template,
        body: data.body_template,
        variables: template.variables,
        industry: template.industry,
        companyId: data.company_id
      };
    } catch (error) {
      logger.error('Error creating email template:', error);
      throw error;
    }
  }

  async generateEmailFromTemplate(
    templateId: string, 
    variables: Record<string, string>
  ): Promise<{ subject: string; body: string }> {
    try {
      const { data: template, error } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error || !template) {
        throw new Error('Template not found');
      }

      let subject = template.subject_template;
      let body = template.body_template;

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        subject = subject.replace(new RegExp(placeholder, 'g'), value);
        body = body.replace(new RegExp(placeholder, 'g'), value);
      });

      return { subject, body };
    } catch (error) {
      logger.error('Error generating email from template:', error);
      throw error;
    }
  }
}

export const emailTemplateService = new EmailTemplateService();
