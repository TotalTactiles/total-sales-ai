
import { supabase } from '@/integrations/supabase/client';
import { AIInsight, DataIngestionStatus } from './types';

export class AIInsightsService {
  async generateInsights(companyId: string): Promise<AIInsight[]> {
    try {
      // Query recent data from all sources
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('company_id', companyId)
        .in('type', ['social_sync', 'website_crawl', 'document_upload'])
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;

      const insights: AIInsight[] = [];

      // Generate social media insights
      const socialData = data?.filter(d => d.type === 'social_sync') || [];
      if (socialData.length > 0) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'social',
          title: 'Social Media Performance',
          summary: `${socialData.length} social media syncs completed`,
          suggestion: 'Consider creating content based on top-performing posts',
          confidence: 0.8,
          data: socialData,
          createdAt: new Date()
        });
      }

      // Generate website insights
      const websiteData = data?.filter(d => d.type === 'website_crawl') || [];
      if (websiteData.length > 0) {
        const latestCrawl = websiteData[0];
        insights.push({
          id: crypto.randomUUID(),
          type: 'website',
          title: 'Website Content Analysis',
          summary: `${latestCrawl.payload?.pages || 0} pages analyzed`,
          suggestion: 'Update product pages with latest features',
          confidence: 0.9,
          data: latestCrawl,
          createdAt: new Date()
        });
      }

      // Generate document insights
      const documentData = data?.filter(d => d.type === 'document_upload') || [];
      if (documentData.length > 0) {
        insights.push({
          id: crypto.randomUUID(),
          type: 'documents',
          title: 'Knowledge Base Status',
          summary: `${documentData.length} documents in knowledge base`,
          suggestion: 'Organize documents into sales training modules',
          confidence: 0.7,
          data: documentData,
          createdAt: new Date()
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  async getDataIngestionStatus(companyId: string): Promise<DataIngestionStatus> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('type, timestamp')
        .eq('company_id', companyId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const socialConnections = data?.filter(d => d.type === 'social_connection') || [];
      const websiteCrawls = data?.filter(d => d.type === 'website_crawl') || [];
      const documents = data?.filter(d => d.type === 'document_upload') || [];

      return {
        social: {
          connected: socialConnections.length,
          total: 4, // Instagram, Facebook, LinkedIn, TikTok
          lastSync: socialConnections[0] ? new Date(socialConnections[0].timestamp) : undefined
        },
        website: {
          status: websiteCrawls.length > 0 ? 'connected' : 'disconnected',
          lastCrawl: websiteCrawls[0] ? new Date(websiteCrawls[0].timestamp) : undefined
        },
        documents: {
          count: documents.length,
          lastUpload: documents[0] ? new Date(documents[0].timestamp) : undefined
        },
        errors: []
      };
    } catch (error) {
      console.error('Error getting data ingestion status:', error);
      return {
        social: { connected: 0, total: 4 },
        website: { status: 'disconnected' },
        documents: { count: 0 },
        errors: ['Failed to load status']
      };
    }
  }

  async createCampaignBrief(insight: AIInsight, companyId: string): Promise<string> {
    try {
      const brief = `
Campaign Brief - ${insight.title}

Generated: ${new Date().toLocaleDateString()}
Confidence: ${Math.round(insight.confidence * 100)}%

Summary:
${insight.summary}

Recommendation:
${insight.suggestion}

Next Steps:
1. Review attached data
2. Create content outline
3. Schedule campaign
4. Monitor performance

Data Source: ${insight.type}
      `.trim();

      // Log the campaign brief creation
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'campaign_brief',
          event_summary: `Campaign brief created: ${insight.title}`,
          payload: {
            insightId: insight.id,
            brief,
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });

      return brief;
    } catch (error) {
      console.error('Error creating campaign brief:', error);
      throw error;
    }
  }
}

export const aiInsightsService = new AIInsightsService();
