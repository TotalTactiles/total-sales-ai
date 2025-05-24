
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Download,
  Link,
  Instagram,
  Facebook,
  Linkedin,
  Settings,
  BarChart3,
  Shield,
  Eye,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { useAIBrain } from '@/hooks/useAIBrain';
import { useAuth } from '@/contexts/AuthContext';

const CompanyBrainManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const { user } = useAuth();
  const { ingestKnowledge, crawlWebContent, queryKnowledge } = useAIBrain();

  const handleWebsiteIngest = async () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    setIsIngesting(true);
    try {
      const result = await crawlWebContent(websiteUrl, 'general', 'website');
      if (result) {
        toast.success('Website content ingested successfully');
        setWebsiteUrl('');
      }
    } catch (error) {
      toast.error('Failed to ingest website content');
    } finally {
      setIsIngesting(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    for (const file of newFiles) {
      try {
        const text = await file.text();
        await ingestKnowledge({
          industry: 'general',
          sourceType: 'document',
          sourceId: file.name,
          text: text
        });
        toast.success(`${file.name} processed successfully`);
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
      }
    }
  };

  const connectSocialMedia = (platform: string) => {
    toast.info(`${platform} integration coming soon`);
    // TODO: Implement OAuth flows for social media platforms
  };

  const knowledgeStats = {
    totalDocuments: 247,
    websitePages: 89,
    socialPosts: 156,
    aiInsights: 34,
    lastUpdate: '2 hours ago'
  };

  const competitorInsights = [
    { company: 'CompetitorA', strength: 'Product Features', threat: 'Medium', lastAnalyzed: '1 day ago' },
    { company: 'CompetitorB', strength: 'Pricing Strategy', threat: 'High', lastAnalyzed: '3 days ago' },
    { company: 'CompetitorC', strength: 'Market Presence', threat: 'Low', lastAnalyzed: '1 week ago' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Company Brain Manager</h1>
                <p className="text-slate-600">Master knowledge hub for your entire organization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                AI Learning Active
              </Badge>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Knowledge</p>
                  <p className="text-2xl font-bold">{knowledgeStats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Website Pages</p>
                  <p className="text-2xl font-bold">{knowledgeStats.websitePages}</p>
                </div>
                <Globe className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Social Posts</p>
                  <p className="text-2xl font-bold">{knowledgeStats.socialPosts}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">AI Insights</p>
                  <p className="text-2xl font-bold">{knowledgeStats.aiInsights}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Last Update</p>
                  <p className="text-lg font-semibold">{knowledgeStats.lastUpdate}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ingestion">Content Ingestion</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
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
                    <div className="flex justify-between">
                      <span>Website Content</span>
                      <span className="font-semibold">36%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Media</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Documents</span>
                      <span className="font-semibold">24%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Generated</span>
                      <span className="font-semibold">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recent AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">Customer Pain Point Identified</p>
                      <p className="text-xs text-slate-600">Integration complexity mentioned 23 times</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">Competitor Pricing Change</p>
                      <p className="text-xs text-slate-600">CompetitorA reduced enterprise pricing by 15%</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium">Content Gap Detected</p>
                      <p className="text-xs text-slate-600">Missing technical documentation for API v2</p>
                    </div>
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
                    />
                    <Button onClick={handleWebsiteIngest} disabled={isIngesting}>
                      {isIngesting ? 'Crawling...' : 'Crawl'}
                    </Button>
                  </div>
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
                      accept=".pdf,.doc,.docx,.txt,.csv"
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
                      <p className="text-sm font-medium">Uploaded Files:</p>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="text-sm text-slate-600">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => connectSocialMedia('LinkedIn')}>
                <CardContent className="p-6 text-center">
                  <Linkedin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">LinkedIn</h3>
                  <p className="text-sm text-slate-600 mb-4">Connect company page and employee posts</p>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => connectSocialMedia('Instagram')}>
                <CardContent className="p-6 text-center">
                  <Instagram className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Instagram</h3>
                  <p className="text-sm text-slate-600 mb-4">Sync business account posts and stories</p>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => connectSocialMedia('Facebook')}>
                <CardContent className="p-6 text-center">
                  <Facebook className="h-12 w-12 text-blue-700 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Facebook</h3>
                  <p className="text-sm text-slate-600 mb-4">Import business page content</p>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => connectSocialMedia('TikTok')}>
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                  <h3 className="font-semibold mb-2">TikTok</h3>
                  <p className="text-sm text-slate-600 mb-4">Connect business account videos</p>
                  <Button className="w-full">Connect</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Content Gaps</h4>
                        <p className="text-sm text-slate-600">AI has identified 7 content gaps in your knowledge base</p>
                        <Button variant="outline" size="sm" className="mt-2">View Details</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Trending Topics</h4>
                        <p className="text-sm text-slate-600">5 emerging topics detected in industry discussions</p>
                        <Button variant="outline" size="sm" className="mt-2">Explore</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Optimization Suggestions</h4>
                        <p className="text-sm text-slate-600">12 recommendations to improve sales effectiveness</p>
                        <Button variant="outline" size="sm" className="mt-2">Review</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorInsights.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{competitor.company}</h4>
                        <p className="text-sm text-slate-600">Strength: {competitor.strength}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          competitor.threat === 'High' ? 'bg-red-100 text-red-700' :
                          competitor.threat === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {competitor.threat} Threat
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">Last analyzed: {competitor.lastAnalyzed}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Approved Content</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          Product information
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          Objection handling scripts
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          Call recordings (approved)
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          Best practices
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Restricted Content</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          Financial data
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          Strategic plans
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          HR information
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          Internal communications
                        </label>
                      </div>
                    </div>
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
