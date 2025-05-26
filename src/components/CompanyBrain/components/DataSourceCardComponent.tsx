
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Input,
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
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0 overflow-hidden">
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
        <CardTabs cardId={card.id} activeCardTab={activeCardTab} setCardTab={setCardTab}>
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
  );
};
