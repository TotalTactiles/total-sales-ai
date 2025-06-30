
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Upload, 
  FileText, 
  Database,
  Globe,
  Mail,
  Phone,
  Users,
  BarChart3,
  Settings,
  Link,
  Search,
  Tag,
  CheckCircle,
  AlertCircle,
  Activity,
  TrendingUp,
  Zap,
  Target,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Plus,
  ExternalLink
} from 'lucide-react';

const ManagerCompanyBrain: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isWebsiteCrawling, setIsWebsiteCrawling] = useState(false);

  // Mock data for AI engagements
  const aiEngagements = [
    {
      type: 'Lead Scoring',
      status: 'active',
      description: 'AI analyzed 47 new leads and updated scoring models',
      impact: '85% accuracy improvement',
      timestamp: '2 minutes ago',
      icon: <Target className="h-4 w-4 text-green-600" />
    },
    {
      type: 'Workflow Optimization',
      status: 'optimized',
      description: 'Email sequence performance improved by 23%',
      impact: '23% performance boost',
      timestamp: '15 minutes ago',
      icon: <Zap className="h-4 w-4 text-yellow-600" />
    },
    {
      type: 'CRM Sync',
      status: 'complete',
      description: 'Successfully imported 125 leads from Zoho CRM',
      impact: '125 leads processed',
      timestamp: '1 hour ago',
      icon: <Database className="h-4 w-4 text-blue-600" />
    }
  ];

  // Mock data for data sources
  const dataSources = [
    { name: 'CRM Data', progress: 85, status: 'Active', icon: <Database className="h-4 w-4" /> },
    { name: 'Email Analytics', progress: 72, status: 'Active', icon: <Mail className="h-4 w-4" /> },
    { name: 'Call Recordings', progress: 0, status: 'Disabled', icon: <Phone className="h-4 w-4" /> },
    { name: 'Social Media', progress: 0, status: 'Disabled', icon: <Globe className="h-4 w-4" /> },
    { name: 'Ad Performance', progress: 90, status: 'Active', icon: <BarChart3 className="h-4 w-4" /> },
    { name: 'Documents', progress: 45, status: 'Partial', icon: <FileText className="h-4 w-4" /> }
  ];

  // Mock data for AI suggestions
  const aiSuggestions = [
    {
      type: 'performance',
      title: 'Team Performance Alert',
      message: 'Your team is 15% ahead of monthly targets. Consider setting stretch goals for Q4.',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      type: 'strategy',
      title: 'Market Opportunity',
      message: 'AI detected increased demand in the healthcare sector. Recommend focusing 30% more effort here.',
      priority: 'medium',
      time: '4 hours ago'
    },
    {
      type: 'training',
      title: 'Skills Gap Alert',
      message: '3 reps haven\'t used the sales AI in 4 days. Consider training refresher.',
      priority: 'medium',
      time: '6 hours ago'
    }
  ];

  // Mock knowledge base data
  const knowledgeBase = [
    {
      category: 'Sales Playbooks',
      count: 342,
      status: 'Most Active',
      usage: 'Sales Academy + AI Assistant'
    },
    {
      category: 'Product Information',
      count: 189,
      status: 'Updated Recently',
      usage: 'AI Assistant Only'
    },
    {
      category: 'Competitor Analysis',
      count: 96,
      status: 'High Impact',
      usage: 'All Systems'
    }
  ];

  // Mock social media connections
  const socialConnections = [
    { platform: 'linkedin', name: 'LinkedIn', connected: false, icon: <Linkedin className="h-5 w-5" />, color: 'text-blue-600' },
    { platform: 'facebook', name: 'Facebook', connected: false, icon: <Facebook className="h-5 w-5" />, color: 'text-blue-800' },
    { platform: 'instagram', name: 'Instagram', connected: false, icon: <Instagram className="h-5 w-5" />, color: 'text-pink-600' },
    { platform: 'twitter', name: 'Twitter', connected: false, icon: <Twitter className="h-5 w-5" />, color: 'text-sky-500' },
    { platform: 'youtube', name: 'YouTube', connected: false, icon: <Youtube className="h-5 w-5" />, color: 'text-red-600' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
      
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleWebsiteCrawl = () => {
    if (!websiteUrl) return;
    
    setIsWebsiteCrawling(true);
    // Simulate crawling process
    setTimeout(() => {
      setIsWebsiteCrawling(false);
      setWebsiteUrl('');
    }, 3000);
  };

  const handleSocialConnect = (platform: string) => {
    // In a real implementation, this would trigger OAuth flow
    console.log(`Connecting to ${platform}...`);
  };

  const getSourceColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600';
      case 'Partial': return 'text-yellow-600';
      case 'Disabled': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Brain</h1>
          <p className="text-gray-600">Central intelligence hub for your organization's knowledge and automation</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Brain className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-green-600">+2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-blue-600">627 indexed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Flows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-purple-600">3 optimized today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600">High accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="strategy" disabled>Strategy Board</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Recent AI Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent AI Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiEngagements.map((engagement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {engagement.icon}
                    <div>
                      <h4 className="font-medium">{engagement.type}</h4>
                      <p className="text-sm text-gray-600">{engagement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={engagement.status === 'active' ? 'default' : 'secondary'}>
                      {engagement.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{engagement.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                What AI is Learning From
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataSources.map((source, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {source.icon}
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <Badge variant="outline" className={getSourceColor(source.status)}>
                        {source.status}
                      </Badge>
                    </div>
                    <Progress value={source.progress} className="mb-2" />
                    <p className="text-xs text-gray-600">{source.progress}% ingested</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className={`p-4 border-l-4 rounded-lg ${
                  suggestion.priority === 'high' ? 'bg-red-50 border-red-400' :
                  suggestion.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{suggestion.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{suggestion.time}</p>
                    </div>
                    <Badge variant="outline" className={`ml-2 ${
                      suggestion.priority === 'high' ? 'text-red-700 border-red-200' :
                      suggestion.priority === 'medium' ? 'text-yellow-700 border-yellow-200' :
                      'text-blue-700 border-blue-200'
                    }`}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          {/* Upload Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Knowledge Base Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                <p className="text-gray-600 mb-4">Drop files here or click to browse</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Select Files
                  </Button>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                  ))}
                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <p className="text-xs text-gray-600">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Knowledge Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sales Playbooks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">342 articles</div>
                <Badge variant="outline" className="mb-2">Most Active</Badge>
                <p className="text-xs text-gray-600">Sales Academy + AI Assistant</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">189 articles</div>
                <Badge variant="outline" className="mb-2">Updated Recently</Badge>
                <p className="text-xs text-gray-600">AI Assistant Only</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">96 articles</div>
                <Badge variant="outline" className="mb-2">High Impact</Badge>
                <p className="text-xs text-gray-600">All Systems</p>
              </CardContent>
            </Card>
          </div>

          {/* Website Crawling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Parsing & Scraping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://your-website.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleWebsiteCrawl}
                  disabled={!websiteUrl || isWebsiteCrawling}
                >
                  {isWebsiteCrawling ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Crawling...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Crawl Website
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                AI will automatically parse your website content, extract key information, and integrate it into your knowledge base.
              </p>
              
              {/* Website Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Company Website</span>
                    <Badge variant="outline" className="text-gray-600">Not Connected</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">0 pages indexed</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Product Pages</span>
                    <Badge variant="outline" className="text-gray-600">Not Connected</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">0 pages indexed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social Media Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Connect your social media accounts to help AI understand your brand voice, tone, and communication style.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">
                        <Linkedin className="h-5 w-5" />
                      </span>
                      <span className="font-medium">LinkedIn</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      Not Connected
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSocialConnect('linkedin')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect LinkedIn
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-800">
                        <Facebook className="h-5 w-5" />
                      </span>
                      <span className="font-medium">Facebook</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      Not Connected
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSocialConnect('facebook')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Facebook
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-pink-600">
                        <Instagram className="h-5 w-5" />
                      </span>
                      <span className="font-medium">Instagram</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      Not Connected
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSocialConnect('instagram')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Instagram
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sky-500">
                        <Twitter className="h-5 w-5" />
                      </span>
                      <span className="font-medium">Twitter</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      Not Connected
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSocialConnect('twitter')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Twitter
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">
                        <Youtube className="h-5 w-5" />
                      </span>
                      <span className="font-medium">YouTube</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      Not Connected
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSocialConnect('youtube')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect YouTube
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What AI learns from social media:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Brand voice and tone patterns</li>
                  <li>• Customer interaction styles</li>
                  <li>• Product positioning and messaging</li>
                  <li>• Industry trends and conversations</li>
                  <li>• Competitor analysis and market insights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Learning Settings */}
          <Card>
            <CardHeader>
              <CardTitle>AI Learning Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable automatic lead scoring updates</h4>
                  <p className="text-sm text-gray-600">AI will continuously update lead scores based on new data</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow AI to suggest workflow optimizations</h4>
                  <p className="text-sm text-gray-600">Get recommendations for improving sales processes</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-update knowledge base from CRM data</h4>
                  <p className="text-sm text-gray-600">Automatically parse and index CRM interactions</p>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Social media content analysis</h4>
                  <p className="text-sm text-gray-600">Analyze connected social accounts for brand insights</p>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Website content monitoring</h4>
                  <p className="text-sm text-gray-600">Automatically detect and index website updates</p>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerCompanyBrain;
