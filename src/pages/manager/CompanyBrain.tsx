
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  Users, 
  FileText, 
  Zap,
  Settings,
  Search,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import CRMIntegrationsPanel from '@/components/CRM/CRMIntegrationsPanel';
import WorkflowBuilder from '@/components/Automation/WorkflowBuilder';

const ManagerCompanyBrain = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-900">Company Brain</h1>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              AI-Powered
            </Badge>
          </div>
          <p className="text-slate-600">
            Central intelligence hub for your organization's knowledge and automation
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Knowledge
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Integrations</p>
                        <p className="text-3xl font-bold text-slate-900">5</p>
                      </div>
                      <Database className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Knowledge Articles</p>
                        <p className="text-3xl font-bold text-slate-900">1,247</p>
                      </div>
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Automation Flows</p>
                        <p className="text-3xl font-bold text-slate-900">12</p>
                      </div>
                      <Zap className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">AI Confidence</p>
                        <p className="text-3xl font-bold text-slate-900">94%</p>
                      </div>
                      <Brain className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent AI Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Lead Scoring Updated</p>
                          <p className="text-sm text-slate-600">AI analyzed 47 new leads and updated scoring models</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">Success</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">Workflow Optimization</p>
                          <p className="text-sm text-slate-600">Email sequence performance improved by 23%</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">Optimized</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">CRM Sync Complete</p>
                          <p className="text-sm text-slate-600">Successfully imported 125 leads from Zoho CRM</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">Complete</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search knowledge base..." 
                      className="flex-1 p-2 border border-slate-300 rounded-md"
                    />
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Add Article
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Sales Playbooks</h4>
                        <p className="text-sm text-slate-600 mb-3">342 articles</p>
                        <Badge variant="outline">Most Active</Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Product Information</h4>
                        <p className="text-sm text-slate-600 mb-3">189 articles</p>
                        <Badge variant="outline">Updated Recently</Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Competitor Analysis</h4>
                        <p className="text-sm text-slate-600 mb-3">96 articles</p>
                        <Badge variant="outline">High Impact</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <CRMIntegrationsPanel />
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <WorkflowBuilder />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Lead Conversion Opportunity</h4>
                        <p className="text-blue-800 text-sm">
                          AI detected a 23% increase in response rates for emails sent between 2-4 PM. 
                          Consider adjusting your team's outreach schedule.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 border-blue-300 text-blue-700">
                          Apply Suggestion
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">Performance Trend</h4>
                        <p className="text-green-800 text-sm">
                          Your team's average deal size has increased by 15% this month. 
                          The AI suggests focusing on enterprise leads for continued growth.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 border-green-300 text-green-700">
                          View Analysis
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-purple-900 mb-1">Automation Recommendation</h4>
                        <p className="text-purple-800 text-sm">
                          Create an automated follow-up sequence for leads in "proposal" stage. 
                          This could improve conversion rates by an estimated 18%.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 border-purple-300 text-purple-700">
                          Create Workflow
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Brain Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">AI Learning Preferences</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Enable automatic lead scoring updates</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Allow AI to suggest workflow optimizations</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Auto-update knowledge base from CRM data</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Data Sources</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">CRM Data</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                        </div>
                      </div>
                      <div className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Email Analytics</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                        </div>
                      </div>
                      <div className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Call Recordings</span>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                      </div>
                      <div className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Social Media</span>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerCompanyBrain;
