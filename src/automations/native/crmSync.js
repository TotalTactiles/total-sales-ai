
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

export class CRMSync {
  static async syncLeadToCRM({ leadId, leadData, crmType, userId, companyId }) {
    try {
      logger.info(`Starting CRM sync to ${crmType}`, { leadId }, 'automation');

      let syncResult;
      switch (crmType) {
        case 'zoho':
          syncResult = await this.syncToZoho(leadData, userId, companyId);
          break;
        case 'clickup':
          syncResult = await this.syncToClickUp(leadData, userId, companyId);
          break;
        case 'slack':
          syncResult = await this.syncToSlack(leadData, userId, companyId);
          break;
        case 'monday':
          syncResult = await this.syncToMonday(leadData, userId, companyId);
          break;
        default:
          throw new Error(`Unsupported CRM type: ${crmType}`);
      }

      if (syncResult.success) {
        // Update lead with CRM sync info
        await supabase
          .from('leads')
          .update({
            crm_synced: true,
            crm_type: crmType,
            crm_id: syncResult.crmId,
            last_crm_sync: new Date().toISOString()
          })
          .eq('id', leadId);

        // Log successful sync
        await this.logCRMSync({
          leadId,
          crmType,
          status: 'success',
          crmId: syncResult.crmId,
          userId,
          companyId
        });
      }

      return syncResult;
    } catch (error) {
      logger.error('CRM sync failed', error, 'automation');
      
      await this.logCRMSync({
        leadId,
        crmType,
        status: 'failed',
        error: error.message,
        userId,
        companyId
      });

      return { success: false, error: error.message };
    }
  }

  static async syncToZoho(leadData, userId, companyId) {
    try {
      // Get Zoho credentials
      const credentials = await this.getCRMCredentials('zoho', companyId);
      if (!credentials) {
        throw new Error('Zoho credentials not found');
      }

      // Prepare Zoho lead data
      const zohoData = {
        'Last_Name': leadData.name,
        'Company': leadData.company,
        'Email': leadData.email,
        'Phone': leadData.phone,
        'Lead_Status': this.mapStatusToZoho(leadData.status),
        'Lead_Source': leadData.source || 'Sales OS',
        'Industry': leadData.industry,
        'Annual_Revenue': leadData.annual_revenue,
        'No_of_Employees': leadData.employees
      };

      // Simulate Zoho API call (replace with actual API call)
      const response = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${credentials.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: [zohoData] })
      });

      if (!response.ok) {
        throw new Error(`Zoho API error: ${response.statusText}`);
      }

      const result = await response.json();
      const crmId = result.data?.[0]?.details?.id;

      return { success: true, crmId, platform: 'Zoho' };
    } catch (error) {
      logger.error('Zoho sync failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async syncToClickUp(leadData, userId, companyId) {
    try {
      const credentials = await this.getCRMCredentials('clickup', companyId);
      if (!credentials) {
        throw new Error('ClickUp credentials not found');
      }

      // Create ClickUp task
      const taskData = {
        name: `Lead: ${leadData.name} - ${leadData.company}`,
        description: `Email: ${leadData.email}\nPhone: ${leadData.phone}\nStatus: ${leadData.status}`,
        status: this.mapStatusToClickUp(leadData.status),
        priority: this.mapPriorityToClickUp(leadData.priority),
        due_date: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
        custom_fields: [
          { id: 'lead_email', value: leadData.email },
          { id: 'lead_phone', value: leadData.phone },
          { id: 'lead_company', value: leadData.company }
        ]
      };

      // Simulate ClickUp API call
      const response = await fetch(`https://api.clickup.com/api/v2/list/${credentials.list_id}/task`, {
        method: 'POST',
        headers: {
          'Authorization': credentials.api_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error(`ClickUp API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, crmId: result.id, platform: 'ClickUp' };
    } catch (error) {
      logger.error('ClickUp sync failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async syncToSlack(leadData, userId, companyId) {
    try {
      const credentials = await this.getCRMCredentials('slack', companyId);
      if (!credentials) {
        throw new Error('Slack credentials not found');
      }

      // Create Slack message
      const message = {
        channel: credentials.channel_id,
        text: `🎯 New Lead Closed!`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New Lead Closed!*\n\n*Name:* ${leadData.name}\n*Company:* ${leadData.company}\n*Email:* ${leadData.email}\n*Phone:* ${leadData.phone}\n*Status:* ${leadData.status}`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View Lead' },
                url: `${window.location.origin}/sales/leads/${leadData.id}`
              }
            ]
          }
        ]
      };

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.bot_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, crmId: result.ts, platform: 'Slack' };
    } catch (error) {
      logger.error('Slack sync failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async syncToMonday(leadData, userId, companyId) {
    try {
      const credentials = await this.getCRMCredentials('monday', companyId);
      if (!credentials) {
        throw new Error('Monday.com credentials not found');
      }

      const mutation = `
        mutation {
          create_item (
            board_id: ${credentials.board_id},
            item_name: "${leadData.name} - ${leadData.company}",
            column_values: "{
              \\"email\\": \\"${leadData.email}\\",
              \\"phone\\": \\"${leadData.phone}\\",
              \\"status\\": \\"${this.mapStatusToMonday(leadData.status)}\\",
              \\"company\\": \\"${leadData.company}\\"
            }"
          ) {
            id
          }
        }
      `;

      const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Authorization': credentials.api_key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: mutation })
      });

      if (!response.ok) {
        throw new Error(`Monday.com API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, crmId: result.data.create_item.id, platform: 'Monday.com' };
    } catch (error) {
      logger.error('Monday.com sync failed', error, 'automation');
      return { success: false, error: error.message };
    }
  }

  static async getCRMCredentials(crmType, companyId) {
    try {
      const { data, error } = await supabase
        .from('crm_integrations')
        .select('credentials')
        .eq('crm_type', crmType)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .single();

      if (error) return null;
      return data.credentials;
    } catch (error) {
      logger.error('Failed to get CRM credentials', error, 'automation');
      return null;
    }
  }

  static mapStatusToZoho(status) {
    const statusMap = {
      'new': 'Not Contacted',
      'contacted': 'Contacted',
      'qualified': 'Qualified',
      'proposal_sent': 'Proposal/Price Quote',
      'negotiation': 'Negotiation/Review',
      'closed_won': 'Closed-Won',
      'closed_lost': 'Closed-Lost'
    };
    return statusMap[status] || 'Not Contacted';
  }

  static mapStatusToClickUp(status) {
    const statusMap = {
      'new': 'to do',
      'contacted': 'in progress',
      'qualified': 'review',
      'closed_won': 'complete',
      'closed_lost': 'closed'
    };
    return statusMap[status] || 'to do';
  }

  static mapStatusToMonday(status) {
    const statusMap = {
      'new': 'New Lead',
      'contacted': 'In Progress',
      'qualified': 'Qualified',
      'closed_won': 'Won',
      'closed_lost': 'Lost'
    };
    return statusMap[status] || 'New Lead';
  }

  static mapPriorityToClickUp(priority) {
    const priorityMap = {
      'low': 1,
      'normal': 2,
      'high': 3,
      'urgent': 4
    };
    return priorityMap[priority] || 2;
  }

  static async logCRMSync({ leadId, crmType, status, crmId, error, userId, companyId }) {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'crm_sync',
          event_summary: `CRM sync to ${crmType}: ${status}`,
          payload: {
            leadId,
            crmType,
            status,
            crmId,
            error,
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });
    } catch (logError) {
      logger.error('Failed to log CRM sync', logError, 'automation');
    }
  }
}

export const crmSync = CRMSync;
