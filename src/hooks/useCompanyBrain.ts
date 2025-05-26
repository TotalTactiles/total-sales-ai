
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { socialMediaService } from '@/services/companyBrain/socialMediaService';
import { documentService } from '@/services/companyBrain/documentService';
import { websiteService } from '@/services/companyBrain/websiteService';
import { aiInsightsService } from '@/services/companyBrain/aiInsightsService';
import { 
  SocialMediaConnection, 
  UploadedFile, 
  WebsiteData, 
  AIInsight,
  DataIngestionStatus 
} from '@/services/companyBrain/types';

export const useCompanyBrain = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [socialConnections, setSocialConnections] = useState<SocialMediaConnection[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [dataStatus, setDataStatus] = useState<DataIngestionStatus>({
    social: { connected: 0, total: 4 },
    website: { status: 'disconnected' },
    documents: { count: 0 },
    errors: []
  });

  const companyId = profile?.company_id;

  // Load initial data
  const loadData = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const [connections, files, website, aiInsights, status] = await Promise.all([
        socialMediaService.getSocialConnections(companyId),
        documentService.getUploadedFiles(companyId),
        websiteService.getWebsiteData(companyId),
        aiInsightsService.generateInsights(companyId),
        aiInsightsService.getDataIngestionStatus(companyId)
      ]);

      setSocialConnections(connections);
      setUploadedFiles(files);
      setWebsiteData(website);
      setInsights(aiInsights);
      setDataStatus(status);
    } catch (error) {
      console.error('Error loading company brain data:', error);
      toast.error('Failed to load company brain data');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Social media functions
  const connectSocialMedia = useCallback(async (platform: string) => {
    if (!companyId) return false;

    try {
      const success = await socialMediaService.connectPlatform(platform, companyId);
      if (success) {
        await loadData(); // Refresh data
      }
      return success;
    } catch (error) {
      console.error('Error connecting social media:', error);
      toast.error(`Failed to connect ${platform}`);
      return false;
    }
  }, [companyId, loadData]);

  const syncSocialMedia = useCallback(async (platform: string) => {
    if (!companyId) return;

    try {
      await socialMediaService.syncPlatformData(platform, companyId);
      await loadData(); // Refresh data
      toast.success(`${platform} data synced successfully`);
    } catch (error) {
      console.error('Error syncing social media:', error);
      toast.error(`Failed to sync ${platform} data`);
    }
  }, [companyId, loadData]);

  // Document functions
  const uploadFiles = useCallback(async (files: File[], category: string = 'general') => {
    if (!companyId) return [];

    try {
      const uploaded = await documentService.uploadFiles(files, companyId, category);
      await loadData(); // Refresh data
      return uploaded;
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
      return [];
    }
  }, [companyId, loadData]);

  // Website functions
  const crawlWebsite = useCallback(async (url: string) => {
    if (!companyId) return null;

    setIsLoading(true);
    try {
      const data = await websiteService.crawlWebsite(url, companyId);
      await loadData(); // Refresh data
      toast.success('Website crawled successfully');
      return data;
    } catch (error) {
      console.error('Error crawling website:', error);
      toast.error('Failed to crawl website');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [companyId, loadData]);

  // AI Insights functions
  const refreshInsights = useCallback(async () => {
    if (!companyId) return;

    try {
      const newInsights = await aiInsightsService.generateInsights(companyId);
      setInsights(newInsights);
      toast.success('Insights refreshed');
    } catch (error) {
      console.error('Error refreshing insights:', error);
      toast.error('Failed to refresh insights');
    }
  }, [companyId]);

  const createCampaignBrief = useCallback(async (insight: AIInsight) => {
    if (!companyId) return '';

    try {
      const brief = await aiInsightsService.createCampaignBrief(insight, companyId);
      toast.success('Campaign brief created');
      return brief;
    } catch (error) {
      console.error('Error creating campaign brief:', error);
      toast.error('Failed to create campaign brief');
      return '';
    }
  }, [companyId]);

  const sendInsightEmail = useCallback(async (insight: AIInsight) => {
    try {
      // Create email draft with insight data
      const emailBody = `
Subject: AI Insight: ${insight.title}

${insight.summary}

Recommendation: ${insight.suggestion}

Confidence: ${Math.round(insight.confidence * 100)}%

Generated: ${insight.createdAt.toLocaleDateString()}
      `.trim();

      // In a real implementation, this would open the user's email client
      navigator.clipboard.writeText(emailBody);
      toast.success('Email content copied to clipboard');
    } catch (error) {
      console.error('Error preparing email:', error);
      toast.error('Failed to prepare email');
    }
  }, []);

  return {
    isLoading,
    socialConnections,
    uploadedFiles,
    websiteData,
    insights,
    dataStatus,
    connectSocialMedia,
    syncSocialMedia,
    uploadFiles,
    crawlWebsite,
    refreshInsights,
    createCampaignBrief,
    sendInsightEmail,
    refreshData: loadData
  };
};
