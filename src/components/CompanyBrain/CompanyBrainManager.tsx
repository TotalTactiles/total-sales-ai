
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Upload, 
  Globe, 
  Users, 
  Zap,
  Video,
  BookOpen,
  Activity,
  Settings,
  Search,
  Filter,
  Database,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyBrain } from '@/hooks/useCompanyBrain';
import { DataSourceCard } from './types';
import { DataSourceCardComponent } from './components/DataSourceCardComponent';
import { DataLibraryPreview } from './components/DataLibraryPreview';

const CompanyBrainManager: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCardTab, setActiveCardTab] = useState<Record<string, string>>({});
  
  const {
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
    sendInsightEmail
  } = useCompanyBrain();

  const handleWebsiteIngest = async () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }
    await crawlWebsite(websiteUrl);
    setWebsiteUrl('');
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    await uploadFiles(fileArray, 'general');
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    toast.info(`Uploading ${files.length} files...`);
    await handleFileUpload(files);
  };

  const setCardTab = (cardId: string, tab: string) => {
    setActiveCardTab(prev => ({ ...prev, [cardId]: tab }));
  };

  const dataSourceCards: DataSourceCard[] = [
    {
      id: 'social-media',
      title: 'Social Media Feeds',
      icon: Users,
      status: dataStatus.social.connected > 0 ? 'connected' : 'disconnected',
      itemCount: dataStatus.social.connected,
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      description: 'Instagram, LinkedIn, TikTok, Facebook integrations',
      actionButton: {
        text: 'Connect Accounts',
        action: () => setCardTab('social-media', 'data-sources')
      }
    },
    {
      id: 'website',
      title: 'Website Ingestion',
      icon: Globe,
      status: websiteData ? 'connected' : 'disconnected',
      itemCount: websiteData?.pages || 0,
      lastUpdated: websiteData?.lastCrawled || null,
      description: 'Automated website content scraping and analysis',
      actionButton: {
        text: websiteData ? 'Resync' : 'Ingest Data',
        action: () => setCardTab('website', 'data-sources')
      }
    },
    {
      id: 'file-uploads',
      title: 'File Uploads',
      icon: Upload,
      status: uploadedFiles.length > 0 ? 'connected' : 'disconnected',
      itemCount: uploadedFiles.length,
      lastUpdated: uploadedFiles.length > 0 ? uploadedFiles[0].uploadDate : null,
      description: 'PDFs, Word Docs, CSVs, Images, Videos',
      actionButton: {
        text: 'Upload Files',
        action: () => document.getElementById('bulk-upload')?.click()
      }
    },
    {
      id: 'video-library',
      title: 'Video Library',
      icon: Video,
      status: 'disconnected',
      itemCount: 0,
      lastUpdated: null,
      description: 'Training videos, product demos, webinars',
      actionButton: {
        text: 'Upload Videos',
        action: () => toast.info('Video upload coming soon')
      }
    },
    {
      id: 'sops-cases',
      title: 'SOPs & Case Studies',
      icon: BookOpen,
      status: 'connected',
      itemCount: 12,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      description: 'Standard Operating Procedures and success stories',
      actionButton: {
        text: 'Add Content',
        action: () => toast.info('SOP management coming soon')
      }
    },
    {
      id: 'ai-insights',
      title: 'AI Insights Engine',
      icon: Zap,
      status: insights.length > 0 ? 'connected' : 'disconnected',
      itemCount: insights.length,
      lastUpdated: insights.length > 0 ? new Date() : null,
      description: 'Automated analysis and recommendations',
      actionButton: {
        text: 'Generate Insights',
        action: refreshInsights
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Manager Company Brain</h1>
                <p className="text-slate-600 mt-1 text-lg">Centralized Knowledge Management & AI Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm">
                <Activity className="w-4 h-4 mr-2" />
                AI Learning Active
              </Badge>
              <Button variant="outline" size="lg" className="gap-2">
                <Settings className="h-5 w-5" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Global Actions */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search all data sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button variant="outline" size="lg" className="gap-2">
            <Filter className="h-5 w-5" />
            Filter
          </Button>
          <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Database className="h-5 w-5" />
            View Data Library
          </Button>
        </div>

        {/* Error Alerts */}
        {dataStatus.errors.length > 0 && (
          <div className="mb-8 space-y-3">
            {dataStatus.errors.map((error, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <span className="text-red-800 font-medium">{error}</span>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Source Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {dataSourceCards.map((card) => (
            <DataSourceCardComponent
              key={card.id}
              card={card}
              isLoading={isLoading}
              activeCardTab={activeCardTab}
              setCardTab={setCardTab}
              websiteUrl={websiteUrl}
              setWebsiteUrl={setWebsiteUrl}
              handleWebsiteIngest={handleWebsiteIngest}
              handleBulkUpload={handleBulkUpload}
              connectSocialMedia={connectSocialMedia}
              uploadedFiles={uploadedFiles}
              websiteData={websiteData}
              insights={insights}
              sendInsightEmail={sendInsightEmail}
              createCampaignBrief={createCampaignBrief}
            />
          ))}
        </div>

        {/* Data Library Preview */}
        <DataLibraryPreview />
      </div>

      {/* Hidden bulk upload input */}
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.mp4,.zip"
        onChange={handleBulkUpload}
        className="hidden"
        id="bulk-upload"
      />
    </div>
  );
};

export default CompanyBrainManager;
