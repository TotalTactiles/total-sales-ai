import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Upload, 
  Globe, 
  FileText, 
  Users, 
  TrendingUp,
  Zap,
  Link,
  Instagram,
  Facebook,
  Linkedin,
  Settings,
  BarChart3,
  Shield,
  Target,
  Mail,
  FileDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Database,
  Activity,
  Clock,
  Tag,
  Filter,
  Search,
  Download,
  Eye,
  Plus,
  Folder,
  Image,
  Video,
  FileImage,
  Play,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyBrain } from '@/hooks/useCompanyBrain';

interface DataSourceCard {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'error';
  itemCount: number;
  lastUpdated: Date | null;
  description: string;
  actionButton: {
    text: string;
    action: () => void;
  };
}

const CompanyBrainManager: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
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

  const getCardTab = (cardId: string) => {
    return activeCardTab[cardId] || 'overview';
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

  const StatusBadge = ({ status }: { status: 'connected' | 'disconnected' | 'error' }) => {
    const statusConfig = {
      connected: { color: 'bg-green-500', text: 'Connected' },
      disconnected: { color: 'bg-gray-400', text: 'Disconnected' },
      error: { color: 'bg-red-500', text: 'Error' }
    };
    
    const config = statusConfig[status];
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        <span className="text-xs text-slate-600">{config.text}</span>
      </div>
    );
  };

  const CardTabs = ({ cardId, children }: { cardId: string; children: React.ReactNode }) => (
    <Tabs value={getCardTab(cardId)} onValueChange={(value) => setCardTab(cardId, value)}>
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
        <TabsTrigger value="data-sources" className="text-xs">Data Sources</TabsTrigger>
        <TabsTrigger value="ai-suggestions" className="text-xs">AI Suggestions</TabsTrigger>
        <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );

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
            <Card key={card.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <card.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">{card.title}</CardTitle>
                      <StatusBadge status={card.status} />
                    </div>
                  </div>
                  <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">Items Ingested</span>
                    <Badge variant="outline" className="font-bold">
                      {card.itemCount} {card.itemCount === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">Last Updated</span>
                    <span className="text-sm text-slate-600">
                      {card.lastUpdated ? card.lastUpdated.toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700" 
                  onClick={card.actionButton.action}
                  disabled={isLoading}
                >
                  {card.actionButton.text}
                </Button>
              </CardHeader>

              <CardContent>
                <CardTabs cardId={card.id}>
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-4">
                      <p className="text-slate-600">{card.description}</p>
                      {card.id === 'social-media' && (
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: 'Instagram', connected: false },
                            { name: 'LinkedIn', connected: false },
                            { name: 'TikTok', connected: false },
                            { name: 'Facebook', connected: false }
                          ].map((platform) => (
                            <div key={platform.name} className="flex items-center justify-between p-2 border rounded-lg">
                              <span className="text-sm">{platform.name}</span>
                              <div className={`w-2 h-2 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="data-sources" className="mt-0">
                    {card.id === 'social-media' && (
                      <div className="space-y-4">
                        {[
                          { platform: 'instagram', icon: Instagram, name: 'Instagram', color: 'text-pink-600' },
                          { platform: 'linkedin', icon: Linkedin, name: 'LinkedIn', color: 'text-blue-600' },
                          { platform: 'facebook', icon: Facebook, name: 'Facebook', color: 'text-blue-600' }
                        ].map(({ platform, icon: Icon, name, color }) => (
                          <div key={platform} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Icon className={`h-6 w-6 ${color}`} />
                                <span className="font-semibold">{name}</span>
                              </div>
                              <Button size="sm" onClick={() => connectSocialMedia(platform)}>
                                Connect
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {card.id === 'website' && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter website URL..."
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleWebsiteIngest} disabled={isLoading}>
                            {isLoading ? 'Crawling...' : 'Crawl'}
                          </Button>
                        </div>
                        {websiteData && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">Website Connected</h4>
                            <div className="text-sm text-green-700 space-y-1">
                              <p><strong>URL:</strong> {websiteData.url}</p>
                              <p><strong>Pages:</strong> {websiteData.pages}</p>
                              <p><strong>Last Crawled:</strong> {websiteData.lastCrawled?.toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {card.id === 'file-uploads' && (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
                          <Upload className="h-12 w-12 mx-auto text-blue-500 mb-3" />
                          <p className="text-blue-700 font-semibold mb-2">Drag & Drop Files Here</p>
                          <p className="text-sm text-blue-600 mb-4">Support: PDFs, Docs, CSVs, Images, Videos, ZIPs</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.mp4,.zip"
                            onChange={handleBulkUpload}
                            className="hidden"
                            id="bulk-upload"
                          />
                          <Button size="sm" onClick={() => document.getElementById('bulk-upload')?.click()}>
                            Select Files
                          </Button>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {uploadedFiles.slice(0, 3).map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)}KB</span>
                              </div>
                            ))}
                            {uploadedFiles.length > 3 && (
                              <p className="text-xs text-slate-500 text-center">+{uploadedFiles.length - 3} more files</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="ai-suggestions" className="mt-0">
                    <div className="space-y-3">
                      {insights.filter(insight => 
                        card.id === 'social-media' && insight.type === 'social' ||
                        card.id === 'website' && insight.type === 'website' ||
                        card.id === 'ai-insights'
                      ).slice(0, 2).map((insight) => (
                        <div key={insight.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                          <h5 className="font-semibold text-blue-800 text-sm mb-1">{insight.title}</h5>
                          <p className="text-blue-700 text-xs">{insight.summary}</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => sendInsightEmail(insight)}>
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => createCampaignBrief(insight)}>
                              <FileDown className="h-3 w-3 mr-1" />
                              Brief
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {insights.length === 0 && (
                        <div className="text-center py-6 text-slate-500">
                          <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No AI suggestions yet. Connect data sources to generate insights.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="mt-0">
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      <div className="flex items-center gap-2 p-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-slate-600">Data source initialized</span>
                        <span className="text-slate-400 ml-auto">5 min ago</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-slate-600">AI analysis completed</span>
                        <span className="text-slate-400 ml-auto">1 hour ago</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-slate-600">Sync scheduled</span>
                        <span className="text-slate-400 ml-auto">2 hours ago</span>
                      </div>
                    </div>
                  </TabsContent>
                </CardTabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Library Preview */}
        <Card className="mt-8 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Database className="h-7 w-7 text-blue-600" />
                Central Data Library
              </CardTitle>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Full Library
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Social Posts', 'Website Pages', 'Documents', 'Videos'].map((category, index) => (
                <div key={category} className="p-4 border rounded-lg text-center hover:bg-slate-50 transition-colors">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{[24, 156, 89, 12][index]}</div>
                  <div className="text-sm text-slate-600">{category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
