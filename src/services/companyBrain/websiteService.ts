
import { supabase } from '@/integrations/supabase/client';
import { WebsiteData } from './types';

export class WebsiteService {
  async crawlWebsite(url: string, companyId: string): Promise<WebsiteData> {
    try {
      // Use existing AI brain crawl function
      const { data, error } = await supabase.functions.invoke('ai-brain-crawl', {
        body: {
          url,
          industry: 'general',
          sourceType: 'website',
          companyId
        }
      });

      if (error) throw error;

      // Log crawl activity
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'website_crawl',
          event_summary: `Website crawled: ${url}`,
          payload: {
            url,
            pages: data?.pages || 0,
            status: 'completed',
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });

      return {
        url,
        lastCrawled: new Date(),
        pages: data?.pages || 0,
        content: {
          title: data?.title || '',
          description: data?.description || '',
          keywords: data?.keywords || [],
          contentSummary: data?.summary || ''
        }
      };
    } catch (error) {
      console.error('Error crawling website:', error);
      throw error;
    }
  }

  async getWebsiteData(companyId: string): Promise<WebsiteData | null> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'website_crawl')
        .eq('company_id', companyId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      const payload = this.safeGetPayload(data.payload);

      return {
        url: this.safeGetString(payload.url, ''),
        lastCrawled: new Date(data.timestamp),
        pages: this.safeGetNumber(payload.pages, 0),
        content: {
          title: this.safeGetString(payload.title, ''),
          description: this.safeGetString(payload.description, ''),
          keywords: Array.isArray(payload.keywords) ? payload.keywords : [],
          contentSummary: this.safeGetString(payload.summary, '')
        }
      };
    } catch (error) {
      console.error('Error getting website data:', error);
      return null;
    }
  }

  private safeGetPayload(payload: any): Record<string, any> {
    if (payload && typeof payload === 'object') {
      return payload as Record<string, any>;
    }
    return {};
  }

  private safeGetString(value: any, defaultValue: string): string {
    if (typeof value === 'string') return value;
    if (value !== null && value !== undefined) return String(value);
    return defaultValue;
  }

  private safeGetNumber(value: any, defaultValue: number): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  }
}

export const websiteService = new WebsiteService();
