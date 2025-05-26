
export interface SocialMediaConnection {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  connected: boolean;
  lastSync?: Date;
  accountInfo?: {
    username: string;
    followersCount?: number;
    postsCount?: number;
  };
  metrics?: {
    engagement: number;
    reach: number;
    impressions: number;
  };
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  category: string;
  tags: string[];
  url: string;
}

export interface WebsiteData {
  url: string;
  lastCrawled?: Date;
  pages: number;
  content: {
    title: string;
    description: string;
    keywords: string[];
    contentSummary: string;
  };
}

export interface AIInsight {
  id: string;
  type: 'social' | 'website' | 'documents' | 'general';
  title: string;
  summary: string;
  suggestion: string;
  confidence: number;
  data: any;
  createdAt: Date;
}

export interface DataIngestionStatus {
  social: { connected: number; total: number; lastSync?: Date };
  website: { status: 'connected' | 'disconnected'; lastCrawl?: Date };
  documents: { count: number; lastUpload?: Date };
  errors: string[];
}
