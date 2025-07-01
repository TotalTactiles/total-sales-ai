
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Globe, 
  Search, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  FileText,
  Link,
  Database,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyBrain } from '@/hooks/useCompanyBrain';

const WebsiteParser = () => {
  const { crawlWebsite, websiteData, isLoading } = useCompanyBrain();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const handleSingleCrawl = async () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    if (!isValidUrl(websiteUrl)) {
      toast.error('Please enter a valid URL (including https://)');
      return;
    }

    try {
      const result = await crawlWebsite(websiteUrl);
      if (result) {
        toast.success(`Successfully crawled ${result.pages} pages from ${result.url}`);
        setWebsiteUrl('');
      }
    } catch (error) {
      toast.error('Failed to crawl website');
    }
  };

  const handleBulkCrawl = async () => {
    const urls = bulkUrls.split('\n').filter(url => url.trim());
    
    if (urls.length === 0) {
      toast.error('Please enter at least one URL');
      return;
    }

    const invalidUrls = urls.filter(url => !isValidUrl(url.trim()));
    if (invalidUrls.length > 0) {
      toast.error(`Invalid URLs found: ${invalidUrls.join(', ')}`);
      return;
    }

    toast.info(`Starting bulk crawl of ${urls.length} websites...`);
    
    let successful = 0;
    for (const url of urls) {
      try {
        await crawlWebsite(url.trim());
        successful++;
      } catch (error) {
        console.error(`Failed to crawl ${url}:`, error);
      }
    }

    toast.success(`Bulk crawl completed: ${successful}/${urls.length} websites processed successfully`);
    setBulkUrls('');
    setShowBulkInput(false);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const sampleUrls = [
    'https://example.com',
    'https://your-company.com',
    'https://competitor-site.com',
    'https://industry-blog.com'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Website Content Parser</h2>
          <p className="text-gray-600 mt-1">Automatically extract and analyze website content for AI training</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Single URL Crawler */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Globe className="h-5 w-5" />
            Single Website Crawler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter website URL (e.g., https://example.com)"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button 
              onClick={handleSingleCrawl}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Crawling...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Crawl Site
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-blue-700">
            Extracts content, metadata, SEO data, and page structure for AI analysis
          </p>
        </CardContent>
      </Card>

      {/* Bulk URL Crawler */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Database className="h-5 w-5" />
            Bulk Website Crawler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showBulkInput ? (
            <div className="text-center py-6">
              <Database className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-700 mb-4">Crawl multiple websites at once for comprehensive data collection</p>
              <Button 
                onClick={() => setShowBulkInput(true)}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Start Bulk Crawl
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder={`Enter one URL per line:\n${sampleUrls.join('\n')}`}
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                rows={6}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <div className="flex gap-3">
                <Button 
                  onClick={handleBulkCrawl}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Crawl All URLs
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowBulkInput(false);
                    setBulkUrls('');
                  }}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Website Data */}
      {websiteData && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="h-5 w-5" />
              Latest Crawled Website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Link className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">Website URL</span>
                </div>
                <p className="text-sm text-green-700 break-all">{websiteData.url}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">Pages Crawled</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{websiteData.pages}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">Last Crawled</span>
                </div>
                <p className="text-sm text-green-700">
                  {websiteData.lastCrawled?.toLocaleDateString()} at {websiteData.lastCrawled?.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            {websiteData.content && (
              <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">Content Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Title:</span>
                    <p className="text-green-600 mt-1">{websiteData.content.title || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Description:</span>
                    <p className="text-green-600 mt-1">{websiteData.content.description || 'Not available'}</p>
                  </div>
                  {websiteData.content.keywords && websiteData.content.keywords.length > 0 && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-green-700">Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {websiteData.content.keywords.slice(0, 10).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Enhancement Info */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <Zap className="h-5 w-5" />
            AI Content Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Data Extracted:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Page content and structure</li>
                <li>• Meta descriptions and titles</li>
                <li>• Keywords and SEO data</li>
                <li>• Product/service information</li>
                <li>• Contact information</li>
                <li>• Company background</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">AI Applications:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Enhanced lead qualification</li>
                <li>• Personalized outreach messages</li>
                <li>• Competitive intelligence</li>
                <li>• Industry trend analysis</li>
                <li>• Content strategy optimization</li>
                <li>• Sales conversation starters</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteParser;
