
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
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyBrain } from '@/hooks/useCompanyBrain';

const CompanyBrainManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [websiteUrl, setWebsiteUrl] = useState('');
  
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

  const handleInsightAction = async (insight: any, action: 'email' | 'brief') => {
    if (action === 'email') {
      await sendInsightEmail(insight);
    } else if (action === 'brief') {
      const brief = await createCampaignBrief(insight);
      console.log('Campaign brief created:', brief);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Brain className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Company Brain Manager</h1>
                <p className="text-slate-600 text-sm md:text-base">Master knowledge hub for your entire organization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                AI Learning Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-600">Total Knowledge</p>
                  <p className="text-lg md:text-2xl font-bold">{dataStatus.documents.count}</p>
                </div>
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-600">Website Status</p>
                  <div className="flex items-center gap-1 mt-1">
                    {dataStatus.website.status === 'connected' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <p className="text-sm font-semibold capitalize">{dataStatus.website.status}</p>
                  </div>
                </div>
                <Globe className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-600">Social Connected</p>
                  <p className="text-lg md:text-2xl font-bold">{dataStatus.social.connected}/{dataStatus.social.total}</p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-600">AI Insights</p>
                  <p className="text-lg md:text-2xl font-bold">{insights.length}</p>
                </div>
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-slate-600">Last Update</p>
                  <p className="text-xs md:text-sm font-semibold">
                    {dataStatus.documents.lastUpload 
                      ? dataStatus.documents.lastUpload.toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alerts */}
        {dataStatus.errors.length > 0 && (
          <div className="mb-6">
            {dataStatus.errors.map((error, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ingestion">Ingestion</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="permissions">Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Knowledge Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Website Content</span>
                      <Badge variant="outline">
                        {websiteData ? `${websiteData.pages} pages` : 'Not connected'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Social Media</span>
                      <Badge variant="outline">
                        {dataStatus.social.connected} connected
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Documents</span>
                      <Badge variant="outline">
                        {dataStatus.documents.count} files
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Generated</span>
                      <Badge variant="outline">
                        {insights.length} insights
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recent AI Insights
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshInsights}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.slice(0, 3).map((insight) => (
                      <div key={insight.id} className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">{insight.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{insight.summary}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(insight.confidence * 100)}% confidence
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleInsightAction(insight, 'email')}
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleInsightAction(insight, 'brief')}
                            >
                              <FileDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {insights.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">
                        No insights available. Connect data sources to generate insights.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ingestion" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website Crawling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter website URL (e.g., https://company.com)"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleWebsiteIngest} disabled={isLoading}>
                      {isLoading ? 'Crawling...' : 'Crawl'}
                    </Button>
                  </div>
                  {websiteData && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        Last crawled: {websiteData.lastCrawled?.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-green-700">
                        {websiteData.pages} pages analyzed from {websiteData.url}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-slate-600">
                    AI will automatically extract and categorize all public content from the website.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    File Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600 mb-2">
                      Drop files here or click to upload
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.zip"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Choose Files
                      </Button>
                    </label>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recent Files ({uploadedFiles.length}):</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {uploadedFiles.slice(0, 5).map((file) => (
                          <div key={file.id} className="flex items-center justify-between text-sm text-slate-600 p-2 bg-slate-50 rounded">
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs">{(file.size / 1024).toFixed(1)}KB</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { platform: 'linkedin', icon: Linkedin, color: 'blue', name: 'LinkedIn' },
                { platform: 'instagram', icon: Instagram, color: 'pink', name: 'Instagram' },
                { platform: 'facebook', icon: Facebook, color: 'blue', name: 'Facebook' },
                { platform: 'tiktok', icon: Users, color: 'black', name: 'TikTok' }
              ].map(({ platform, icon: Icon, color, name }) => {
                const connection = socialConnections.find(c => c.platform === platform);
                return (
                  <Card key={platform} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Icon className={`h-12 w-12 mx-auto mb-4 text-${color}-600`} />
                      <h3 className="font-semibold mb-2">{name}</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {connection?.connected ? 'Connected' : 'Connect your business account'}
                      </p>
                      <div className="space-y-2">
                        <Button 
                          className="w-full" 
                          variant={connection?.connected ? "outline" : "default"}
                          onClick={() => connectSocialMedia(platform)}
                        >
                          {connection?.connected ? 'Reconnect' : 'Connect'}
                        </Button>
                        {connection?.connected && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                            onClick={() => syncSocialMedia(platform)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Data
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis & Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Content Analysis</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          AI analyzes all uploaded content for key insights and patterns
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Active</Badge>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Trend Detection</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Identifies emerging topics and industry trends from data sources
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Active</Badge>
                          <Button variant="outline" size="sm">View Trends</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Performance Insights</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Analyzes content performance and suggests optimizations
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Active</Badge>
                          <Button variant="outline" size="sm">View Report</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
                <Button onClick={refreshInsights} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight) => (
                  <Card key={insight.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <Badge variant="secondary">
                          {insight.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-3">{insight.summary}</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-blue-800 mb-1">AI Suggestion:</p>
                        <p className="text-sm text-blue-700">{insight.suggestion}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInsightAction(insight, 'email')}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Send Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInsightAction(insight, 'brief')}
                          >
                            <FileDown className="h-4 w-4 mr-1" />
                            Create Brief
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {insights.length === 0 && (
                  <Card className="md:col-span-2">
                    <CardContent className="p-8 text-center">
                      <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-slate-900 mb-2">No Insights Yet</h3>
                      <p className="text-slate-600 mb-4">
                        Connect your data sources and upload content to generate AI insights.
                      </p>
                      <Button onClick={() => setActiveTab('ingestion')}>
                        Start Adding Data
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sales Rep Access Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Approved Content</h4>
                      <div className="space-y-3">
                        {[
                          'Product information',
                          'Objection handling scripts',
                          'Call recordings (approved)',
                          'Best practices',
                          'Case studies',
                          'Sales training materials'
                        ].map((item, index) => (
                          <label key={index} className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Restricted Content</h4>
                      <div className="space-y-3">
                        {[
                          'Financial data',
                          'Strategic plans',
                          'HR information',
                          'Internal communications',
                          'Sensitive customer data',
                          'Confidential documents'
                        ].map((item, index) => (
                          <label key={index} className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button>Save Access Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyBrainManager;
