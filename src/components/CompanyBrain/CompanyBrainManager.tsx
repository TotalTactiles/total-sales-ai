
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
  FileImage
} from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyBrain } from '@/hooks/useCompanyBrain';

const CompanyBrainManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
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
    await uploadFiles(fileArray, selectedCategory !== 'all' ? selectedCategory : 'general');
  };

  const handleInsightAction = async (insight: any, action: 'email' | 'brief') => {
    if (action === 'email') {
      await sendInsightEmail(insight);
    } else if (action === 'brief') {
      const brief = await createCampaignBrief(insight);
      console.log('Campaign brief created:', brief);
    }
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const fileCategories = ['all', 'SOPs', 'Case Studies', 'Product Sheets', 'Training Materials', 'Marketing Assets'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Company Brain</h1>
                <p className="text-slate-600 mt-1">Centralized Knowledge Management & AI Insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                AI Learning Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Knowledge Graph Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Documents</p>
                  <p className="text-2xl font-bold text-slate-900">{dataStatus.documents.count}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Website</p>
                  <div className="flex items-center gap-1 mt-1">
                    {dataStatus.website.status === 'connected' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <p className="text-sm font-semibold capitalize">{dataStatus.website.status}</p>
                  </div>
                </div>
                <Globe className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Social</p>
                  <p className="text-2xl font-bold text-slate-900">{dataStatus.social.connected}/{dataStatus.social.total}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">AI Insights</p>
                  <p className="text-2xl font-bold text-slate-900">{insights.length}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Last Sync</p>
                  <p className="text-xs font-semibold text-slate-700">
                    {dataStatus.documents.lastUpload 
                      ? dataStatus.documents.lastUpload.toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Data Health</p>
                  <p className="text-sm font-semibold text-green-700">Excellent</p>
                </div>
                <Database className="h-8 w-8 text-green-600" />
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

        {/* Main Navigation */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Navigation Panel */}
          <div className="lg:w-64 space-y-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="w-full justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'social' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('social')}
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              Social Media
            </Button>
            <Button
              variant={activeTab === 'documents' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('documents')}
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
            <Button
              variant={activeTab === 'website' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('website')}
              className="w-full justify-start"
            >
              <Globe className="h-4 w-4 mr-2" />
              Website
            </Button>
            <Button
              variant={activeTab === 'insights' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('insights')}
              className="w-full justify-start"
            >
              <Target className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
            <Button
              variant={activeTab === 'access' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('access')}
              className="w-full justify-start"
            >
              <Shield className="h-4 w-4 mr-2" />
              Access Control
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Knowledge Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-700">Data Sources</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium">Website Content</span>
                            <Badge variant="outline">
                              {websiteData ? `${websiteData.pages} pages` : 'Not connected'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium">Social Media</span>
                            <Badge variant="outline">
                              {dataStatus.social.connected} connected
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium">Documents</span>
                            <Badge variant="outline">
                              {dataStatus.documents.count} files
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-700">Recent Activity</h4>
                        <div className="space-y-2">
                          {insights.slice(0, 3).map((insight) => (
                            <div key={insight.id} className="p-3 border border-slate-200 rounded-lg">
                              <p className="text-sm font-medium">{insight.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{insight.summary}</p>
                            </div>
                          ))}
                          {insights.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-4">
                              No recent insights. Connect data sources to generate insights.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Social Media Integrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { platform: 'linkedin', icon: Linkedin, color: 'blue', name: 'LinkedIn' },
                        { platform: 'instagram', icon: Instagram, color: 'pink', name: 'Instagram' },
                        { platform: 'facebook', icon: Facebook, color: 'blue', name: 'Facebook' },
                        { platform: 'tiktok', icon: Users, color: 'black', name: 'TikTok' }
                      ].map(({ platform, icon: Icon, color, name }) => {
                        const connection = socialConnections.find(c => c.platform === platform);
                        return (
                          <Card key={platform} className="border-2 hover:border-blue-200 transition-colors">
                            <CardContent className="p-6 text-center">
                              <Icon className={`h-12 w-12 mx-auto mb-4 text-${color}-600`} />
                              <h3 className="font-semibold mb-2">{name}</h3>
                              <p className="text-sm text-slate-600 mb-4">
                                {connection?.connected ? 'Connected & Active' : 'Connect your business account'}
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
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Document Library</span>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Search documents..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-64"
                        />
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                      <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">Upload Documents</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Drop PDFs, Word docs, CSVs, images, videos, or ZIP files here
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.zip,.mp4,.mov"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload">
                        <Button className="cursor-pointer">
                          <Plus className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </label>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      {fileCategories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {category === 'all' ? 'All Files' : category}
                        </Button>
                      ))}
                    </div>

                    {/* File Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredFiles.map((file) => (
                        <Card key={file.id} className="border hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {file.type?.includes('image') ? (
                                  <FileImage className="h-5 w-5 text-blue-600" />
                                ) : file.type?.includes('video') ? (
                                  <Video className="h-5 w-5 text-purple-600" />
                                ) : (
                                  <FileText className="h-5 w-5 text-slate-600" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {file.category || 'General'}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                            <h4 className="font-medium text-sm truncate mb-2">{file.name}</h4>
                            <div className="text-xs text-slate-500 space-y-1">
                              <p>Size: {(file.size / 1024).toFixed(1)}KB</p>
                              <p>Uploaded: {file.uploadedAt.toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-1 mt-3">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Target className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {filteredFiles.length === 0 && (
                        <div className="col-span-full text-center py-8 text-slate-500">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No documents found. Upload some files to get started.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'website' && (
              <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Website Content Ingestion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter your company website URL (e.g., https://company.com)"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleWebsiteIngest} disabled={isLoading}>
                        {isLoading ? 'Crawling...' : 'Crawl Website'}
                      </Button>
                    </div>
                    
                    {websiteData && (
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-green-800 mb-2">Website Successfully Crawled</h4>
                              <div className="text-sm text-green-700 space-y-1">
                                <p><strong>URL:</strong> {websiteData.url}</p>
                                <p><strong>Pages Analyzed:</strong> {websiteData.pages}</p>
                                <p><strong>Last Crawled:</strong> {websiteData.lastCrawled?.toLocaleDateString()}</p>
                                {websiteData.title && <p><strong>Site Title:</strong> {websiteData.title}</p>}
                                {websiteData.description && <p><strong>Description:</strong> {websiteData.description}</p>}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => crawlWebsite(websiteData.url)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Re-crawl
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">How Website Crawling Works</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• AI analyzes all public pages and content</li>
                        <li>• Extracts text, images, and metadata automatically</li>
                        <li>• Creates searchable knowledge base for your team</li>
                        <li>• Auto-refreshes every 30 days or on manual request</li>
                        <li>• Respects robots.txt and site policies</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        AI-Generated Insights
                      </span>
                      <Button onClick={refreshInsights} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Insights
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.map((insight) => (
                        <Card key={insight.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg text-slate-900">{insight.title}</h3>
                                <Badge variant="secondary" className="mt-1">
                                  {insight.type}
                                </Badge>
                              </div>
                              <Badge variant="outline">
                                {Math.round(insight.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            
                            <p className="text-slate-600 mb-4">{insight.summary}</p>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-4">
                              <p className="font-medium text-blue-800 mb-2">💡 AI Suggestion</p>
                              <p className="text-blue-700">{insight.suggestion}</p>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={() => handleInsightAction(insight, 'email')}
                                className="flex-1"
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Data in Email
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleInsightAction(insight, 'brief')}
                                className="flex-1"
                              >
                                <FileDown className="h-4 w-4 mr-2" />
                                Create Campaign Brief
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {insights.length === 0 && (
                        <Card className="border-dashed border-2 border-slate-300">
                          <CardContent className="p-12 text-center">
                            <Zap className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">No AI Insights Yet</h3>
                            <p className="text-slate-600 mb-6">
                              Connect your data sources and upload content to generate powerful AI insights.
                            </p>
                            <div className="flex gap-3 justify-center">
                              <Button onClick={() => setActiveTab('social')}>
                                Connect Social Media
                              </Button>
                              <Button variant="outline" onClick={() => setActiveTab('documents')}>
                                Upload Documents
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="space-y-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Sales Rep Access Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-4">✅ Approved Content for Sales Reps</h4>
                        <div className="space-y-3">
                          {[
                            'Product information & specifications',
                            'Objection handling scripts',
                            'Approved call recordings',
                            'Best practices & playbooks',
                            'Customer case studies',
                            'Sales training materials',
                            'Pricing guidelines',
                            'Competition analysis'
                          ].map((item, index) => (
                            <label key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                              <input type="checkbox" defaultChecked className="rounded text-green-600" />
                              <span className="text-sm text-green-800">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-700 mb-4">🚫 Restricted Content</h4>
                        <div className="space-y-3">
                          {[
                            'Financial data & revenue reports',
                            'Strategic business plans',
                            'HR information & personnel files',
                            'Internal communications',
                            'Sensitive customer data',
                            'Confidential legal documents',
                            'Executive meeting notes',
                            'Competitive intelligence'
                          ].map((item, index) => (
                            <label key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                              <input type="checkbox" className="rounded text-red-600" />
                              <span className="text-sm text-red-800">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="flex gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Save Access Settings
                        </Button>
                        <Button variant="outline">
                          Preview Sales Rep View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBrainManager;
