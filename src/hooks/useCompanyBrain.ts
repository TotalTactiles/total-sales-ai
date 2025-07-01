
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface WebsiteData {
  url: string;
  pages: number;
  lastCrawled: Date;
  content?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

interface SocialConnection {
  platform: string;
  connected: boolean;
  lastSync?: Date;
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
          keywords: ['business', 'services', 'technology', 'solutions']
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

  return {
    crawlWebsite,
    connectSocialMedia,
    syncSocialMedia,
    websiteData,
    socialConnections,
    isLoading
  };
};
