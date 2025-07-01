
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface WebsiteData {
  url: string;
  pages: number;
  lastCrawled: Date;
  content?: {
    title: string;
    description: string;
    keywords: string[];
    contentSummary: string;
  };
}

interface SocialConnection {
  platform: string;
  connected: boolean;
  lastSync?: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  uploadDate: Date;
  type: string;
  category: string;
  tags: string[];
  url: string;
}

interface DataStatus {
  totalFiles: number;
  totalSources: number;
  lastUpdate: Date;
  processingStatus: 'idle' | 'processing' | 'completed' | 'error';
  errors: string[];
  social: {
    connected: number;
    totalPlatforms: number;
  };
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  createdAt: Date;
  category: string;
  type: string;
  summary: string;
  suggestion: string;
  data: any;
}

export const useCompanyBrain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([
    { platform: 'instagram', connected: false },
    { platform: 'facebook', connected: false },
    { platform: 'linkedin', connected: false },
    { platform: 'tiktok', connected: false }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [dataStatus, setDataStatus] = useState<DataStatus>({
    totalFiles: 0,
    totalSources: 0,
    lastUpdate: new Date(),
    processingStatus: 'idle',
    errors: [],
    social: {
      connected: 0,
      totalPlatforms: 4
    }
  });

  const crawlWebsite = useCallback(async (url: string): Promise<WebsiteData | null> => {
    setIsLoading(true);
    try {
      // Simulate website crawling - in production this would call your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData: WebsiteData = {
        url,
        pages: Math.floor(Math.random() * 50) + 10,
        lastCrawled: new Date(),
        content: {
          title: `Website Analysis for ${new URL(url).hostname}`,
          description: 'Extracted content and metadata for AI training',
          keywords: ['business', 'services', 'technology', 'solutions'],
          contentSummary: 'Comprehensive analysis of website content, structure, and messaging for AI enhancement.'
        }
      };

      setWebsiteData(mockData);
      
      logger.info('Website crawled successfully', { url, pages: mockData.pages });
      return mockData;
    } catch (error) {
      logger.error('Website crawling failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectSocialMedia = useCallback(async (platformId: string): Promise<boolean> => {
    try {
      // Simulate OAuth connection - in production this would redirect to OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSocialConnections(prev => 
        prev.map(conn => 
          conn.platform === platformId 
            ? { ...conn, connected: true, lastSync: new Date() }
            : conn
        )
      );
      
      // Update social status
      setDataStatus(prev => ({
        ...prev,
        social: {
          ...prev.social,
          connected: prev.social.connected + 1
        }
      }));
      
      logger.info('Social media connected', { platform: platformId });
      return true;
    } catch (error) {
      logger.error('Social media connection failed', error);
      return false;
    }
  }, []);

  const syncSocialMedia = useCallback(async (platformId: string): Promise<void> => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSocialConnections(prev => 
        prev.map(conn => 
          conn.platform === platformId 
            ? { ...conn, lastSync: new Date() }
            : conn
        )
      );
      
      toast.success(`${platformId} data synced successfully`);
    } catch (error) {
      toast.error(`Failed to sync ${platformId} data`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    setIsLoading(true);
    try {
      const uploadedFiles: UploadedFile[] = files.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        uploadDate: new Date(),
        type: file.type,
        category: 'general',
        tags: [],
        url: URL.createObjectURL(file)
      }));

      setUploadedFiles(prev => [...prev, ...uploadedFiles]);
      setDataStatus(prev => ({
        ...prev,
        totalFiles: prev.totalFiles + files.length,
        lastUpdate: new Date(),
        processingStatus: 'processing'
      }));

      // Simulate processing
      setTimeout(() => {
        setDataStatus(prev => ({ ...prev, processingStatus: 'completed' }));
      }, 2000);

      return uploadedFiles;
    } catch (error) {
      logger.error('File upload failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshInsights = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          title: 'Content Gap Analysis',
          description: 'Missing technical content about product features',
          confidence: 0.85,
          createdAt: new Date(),
          category: 'content',
          type: 'analysis',
          summary: 'Content analysis shows gaps in technical documentation',
          suggestion: 'Create more detailed product feature content',
          data: { gaps: ['technical specs', 'integration guides'] }
        },
        {
          id: '2',
          title: 'Brand Voice Consistency',
          description: 'Social media tone varies from website messaging',
          confidence: 0.72,
          createdAt: new Date(),
          category: 'branding',
          type: 'consistency',
          summary: 'Inconsistent brand voice across channels',
          suggestion: 'Align social media tone with website messaging',
          data: { channels: ['social', 'website'] }
        }
      ];

      setInsights(mockInsights);
      toast.success('AI insights refreshed');
    } catch (error) {
      toast.error('Failed to refresh insights');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCampaignBrief = useCallback(async (insight: AIInsight): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Campaign brief created');
    } catch (error) {
      toast.error('Failed to create campaign brief');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendInsightEmail = useCallback(async (insight: AIInsight): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Insight sent successfully`);
    } catch (error) {
      toast.error('Failed to send insight');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await Promise.all([
        refreshInsights(),
        // Refresh other data sources
      ]);
      
      setDataStatus(prev => ({
        ...prev,
        lastUpdate: new Date(),
        processingStatus: 'completed'
      }));
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [refreshInsights]);

  return {
    crawlWebsite,
    connectSocialMedia,
    syncSocialMedia,
    uploadFiles,
    refreshInsights,
    createCampaignBrief,
    sendInsightEmail,
    refreshData,
    websiteData,
    socialConnections,
    uploadedFiles,
    insights,
    dataStatus,
    isLoading
  };
};
