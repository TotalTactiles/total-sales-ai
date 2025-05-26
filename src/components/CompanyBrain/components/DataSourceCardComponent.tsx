
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Upload,
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  FileDown,
  Zap
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CardTabs } from './CardTabs';
import { DataSourceCard } from '../types';
import { AIInsight, UploadedFile, WebsiteData } from '@/services/companyBrain/types';

interface DataSourceCardComponentProps {
  card: DataSourceCard;
  isLoading: boolean;
  activeCardTab: Record<string, string>;
  setCardTab: (cardId: string, tab: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
  handleWebsiteIngest: () => void;
  handleBulkUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  connectSocialMedia: (platform: string) => Promise<boolean>;
  uploadedFiles: UploadedFile[];
  websiteData: WebsiteData | null;
  insights: AIInsight[];
  sendInsightEmail: (insight: AIInsight) => void;
  createCampaignBrief: (insight: AIInsight) => void;
}

export const DataSourceCardComponent: React.FC<DataSourceCardComponentProps> = ({
  card,
  isLoading,
  activeCardTab,
  setCardTab,
  websiteUrl,
  setWebsiteUrl,
  handleWebsiteIngest,
  handleBulkUpload,
  connectSocialMedia,
  uploadedFiles,
  websiteData,
  insights,
  sendInsightEmail,
  createCampaignBrief
}) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-slate-200/50 overflow-hidden group">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-slate-50/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <card.icon className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 mb-1">{card.title}</CardTitle>
              <StatusBadge status={card.status} />
            </div>
          </div>
          <HelpCircle className="h-5 w-5 text-slate-400 cursor-help hover:text-slate-600 transition-colors" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{card.itemCount}</div>
              <div className="text-sm text-slate-600 font-medium">Items Ingested</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm">
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-700 mb-1">Last Updated</div>
              <div className="text-xs text-slate-500">
                {card.lastUpdated ? card.lastUpdated.toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
        </div>

        <Button 
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" 
          onClick={card.actionButton.action}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : card.actionButton.text}
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <CardTabs cardId={card.id} activeCardTab={activeCardTab} setCardTab={setCardTab}>
          <TabsContent value="overview" className="p-6 pt-4">
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">{card.description}</p>
              {card.id === 'social-media' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Instagram', connected: false },
                    { name: 'LinkedIn', connected: false },
                    { name: 'TikTok', connected: false },
                    { name: 'Facebook', connected: false }
                  ].map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                      <span className="text-sm font-medium">{platform.name}</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-slate-300'}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="data-sources" className="p-6 pt-4">
            {card.id === 'social-media' && (
              <div className="space-y-4">
                {[
                  { platform: 'instagram', icon: Instagram, name: 'Instagram', color: 'text-pink-600' },
                  { platform: 'linkedin', icon: Linkedin, name: 'LinkedIn', color: 'text-blue-600' },
                  { platform: 'facebook', icon: Facebook, name: 'Facebook', color: 'text-blue-600' }
                ].map(({ platform, icon: Icon, name, color }) => (
                  <div key={platform} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${color}`} />
                        <span className="font-semibold text-slate-800">{name}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => connectSocialMedia(platform)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Connect
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500">Connect to sync posts, metrics, and audience data</div>
                  </div>
                ))}
              </div>
            )}

            {card.id === 'website' && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">Website URL Scraper</h4>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter website URL (e.g., https://example.com)"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                      onClick={handleWebsiteIngest} 
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      {isLoading ? 'Crawling...' : 'Crawl Site'}
                    </Button>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Automatically extracts text, metadata, and product information</div>
                </div>
                
                {websiteData && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Website Connected
                    </h4>
                    <div className="text-sm text-green-700 space-y-2">
                      <div><strong>URL:</strong> {websiteData.url}</div>
                      <div><strong>Pages Scraped:</strong> {websiteData.pages}</div>
                      <div><strong>Last Crawled:</strong> {websiteData.lastCrawled?.toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {card.id === 'file-uploads' && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-gradient-to-br from-blue-50 to-slate-50">
                  <Upload className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Drag & Drop Files Here</h4>
                  <p className="text-sm text-blue-600 mb-4">Support: PDFs, Docs, CSVs, Images, Videos, ZIPs</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.mp4,.zip"
                    onChange={handleBulkUpload}
                    className="hidden"
                    id={`bulk-upload-${card.id}`}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => document.getElementById(`bulk-upload-${card.id}`)?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Select Files
                  </Button>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h4 className="font-semibold text-slate-800 mb-4">Recent Uploads</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {uploadedFiles.slice(0, 5).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700 truncate flex-1">{file.name}</span>
                          <span className="text-xs text-slate-500 ml-2">{(file.size / 1024).toFixed(1)}KB</span>
                        </div>
                      ))}
                      {uploadedFiles.length > 5 && (
                        <div className="text-xs text-slate-500 text-center py-2">
                          +{uploadedFiles.length - 5} more files uploaded
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-suggestions" className="p-6 pt-4">
            <div className="space-y-4">
              {insights.filter(insight => 
                card.id === 'social-media' && insight.type === 'social' ||
                card.id === 'website' && insight.type === 'website' ||
                card.id === 'ai-insights'
              ).slice(0, 3).map((insight) => (
                <div key={insight.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-blue-800 text-sm mb-2">{insight.title}</h5>
                      <p className="text-blue-700 text-sm mb-3 leading-relaxed">{insight.summary}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => sendInsightEmail(insight)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => createCampaignBrief(insight)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <FileDown className="h-3 w-3 mr-1" />
                          Brief
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {insights.filter(insight => 
                card.id === 'social-media' && insight.type === 'social' ||
                card.id === 'website' && insight.type === 'website' ||
                card.id === 'ai-insights'
              ).length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h4 className="font-medium text-slate-600 mb-2">No AI Suggestions Yet</h4>
                  <p className="text-sm">Connect data sources to generate intelligent insights and recommendations.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="p-6 pt-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-green-800">Data source initialized successfully</span>
                  <div className="text-xs text-green-600 mt-1">All systems operational</div>
                </div>
                <span className="text-xs text-green-600">5 min ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-blue-800">AI analysis completed</span>
                  <div className="text-xs text-blue-600 mt-1">Generated 3 new insights</div>
                </div>
                <span className="text-xs text-blue-600">1 hour ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-yellow-800">Sync scheduled</span>
                  <div className="text-xs text-yellow-600 mt-1">Next automatic sync in 6 days</div>
                </div>
                <span className="text-xs text-yellow-600">2 hours ago</span>
              </div>
            </div>
          </TabsContent>
        </CardTabs>
      </CardContent>
    </Card>
  );
};
