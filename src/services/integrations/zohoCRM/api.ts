import { logger } from '@/utils/logger';

import { zohoAuth } from './auth';
import { ZohoErrorHandler } from './errorHandler';
import { ZohoHelpers } from './helpers';

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

export interface ZohoAPIResponse<T> {
  data: T[];
  info: {
    count: number;
    page: number;
    per_page: number;
    more_records: boolean;
  };
}

export class ZohoAPI {
  private static instance: ZohoAPI;
  private baseUrl = 'https://www.zohoapis.com/crm/v2';
  private errorHandler = new ZohoErrorHandler();

  static getInstance(): ZohoAPI {
    if (!ZohoAPI.instance) {
      ZohoAPI.instance = new ZohoAPI();
    }
    return ZohoAPI.instance;
  }

  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const accessToken = await zohoAuth.getValidAccessToken();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (response.status === 429) {
        // Rate limit hit - implement exponential backoff
        await this.handleRateLimit(response);
        return this.makeRequest<T>(endpoint, options);
      }

      if (!response.ok) {
        await this.errorHandler.handleAPIError(response, endpoint);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      await this.errorHandler.logError(error, `API request to ${endpoint}`);
      throw error;
    }
  }

  async getLeads(page: number = 1, perPage: number = 200): Promise<ZohoAPIResponse<ZohoLead>> {
    try {
      const endpoint = `/Leads?page=${page}&per_page=${perPage}&sort_by=Modified_Time&sort_order=desc`;
      return await this.makeRequest<ZohoAPIResponse<ZohoLead>>(endpoint);
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to fetch Zoho leads');
      throw error;
    }
  }

  async getRecentLeads(sinceDate?: Date): Promise<ZohoLead[]> {
    try {
      let endpoint = '/Leads?sort_by=Modified_Time&sort_order=desc&per_page=200';
      
      if (sinceDate) {
        const isoDate = sinceDate.toISOString();
        endpoint += `&criteria=(Modified_Time:greater_than:${isoDate})`;
      }

      const response = await this.makeRequest<ZohoAPIResponse<ZohoLead>>(endpoint);
      return response.data || [];
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to fetch recent Zoho leads');
      return [];
    }
  }

  async getLead(leadId: string): Promise<ZohoLead | null> {
    try {
      const response = await this.makeRequest<ZohoAPIResponse<ZohoLead>>(`/Leads/${leadId}`);
      return response.data?.[0] || null;
    } catch (error) {
      await this.errorHandler.logError(error, `Failed to fetch Zoho lead ${leadId}`);
      return null;
    }
  }

  async createLead(leadData: Partial<ZohoLead>): Promise<ZohoLead | null> {
    try {
      const response = await this.makeRequest<ZohoAPIResponse<ZohoLead>>('/Leads', {
        method: 'POST',
        body: JSON.stringify({ data: [leadData] })
      });
      return response.data?.[0] || null;
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to create Zoho lead');
      return null;
    }
  }

  async updateLead(leadId: string, updates: Partial<ZohoLead>): Promise<ZohoLead | null> {
    try {
      const response = await this.makeRequest<ZohoAPIResponse<ZohoLead>>(`/Leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: [updates] })
      });
      return response.data?.[0] || null;
    } catch (error) {
      await this.errorHandler.logError(error, `Failed to update Zoho lead ${leadId}`);
      return null;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const response = await this.makeRequest<ZohoAPIResponse<any>>('/users');
      return response.data || [];
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to fetch Zoho users');
      return [];
    }
  }

  private async handleRateLimit(response: Response): Promise<void> {
    const retryAfter = response.headers.get('Retry-After');
    const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // Default 1 minute
    
    logger.warn(`Zoho API rate limit hit. Retrying after ${delayMs}ms`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/org');
      return true;
    } catch (error) {
      logger.error('Zoho connection test failed:', error);
      return false;
    }
  }
}

export const zohoAPI = ZohoAPI.getInstance();
