
import React, { useState } from 'react';
import { Users, Filter, Search, Plus, Download, Upload, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerLeadManagement = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore comprehensive lead management capabilities.');
  };

  // Enhanced mock data for manager view
  const mockManagerLeadData = {
    leadDistribution: [
      { rep: 'Sarah Johnson', total: 45, qualified: 23, closed: 8, conversion: 34.2 },
      { rep: 'Michael Chen', total: 38, qualified: 19, closed: 6, conversion: 28.1 },
      { rep: 'Jennifer Park', total: 42, qualified: 21, closed: 7, conversion: 25.8 },
      { rep: 'David Rodriguez', total: 29, qualified: 12, closed: 3, conversion: 22.3 }
    ],
    leadSources: [
      { source: 'LinkedIn Outreach', count: 67, quality: 85, cost: 45 },
      { source: 'Website Forms', count: 34, quality: 72, cost: 23 },
      { source: 'Referrals', count: 28, quality: 92, cost: 12 },
      { source: 'Trade Shows', count: 25, quality: 78, cost: 156 }
    ],
    leadQuality: {
      averageScore: 73.5,
      highQuality: 42,
      mediumQuality: 89,
      lowQuality: 23,
      needsAttention: 15
    },
    territoryPerformance: [
      { territory: 'North America', leads: 89, conversion: 28.5, revenue: 1250000 },
      { territory: 'Europe', leads: 45, conversion: 32.1, revenue: 890000 },
      { territory: 'Asia Pacific', leads: 34, conversion: 25.8, revenue: 567000 }
    ]
  };

  const handleAssignLead = (leadId: string, repId: string) => {
    toast.success('Lead reassigned successfully');
  };

  const handleBulkAction = (action: string) => {
    toast.info(`${action} applied to selected leads`);
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Manager Lead Management" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Demo Mode Indicator */}
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Manager Lead Management & Distribution System" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management Center</h1>
          <p className="text-muted-foreground mt-2">
            Oversee lead distribution, quality, and team performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Leads
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Lead Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockManagerLeadData.leadQuality.highQuality + 
               mockManagerLeadData.leadQuality.mediumQuality + 
               mockManagerLeadData.leadQuality.lowQuality}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockManagerLeadData.leadQuality.averageScore}</div>
            <p className="text-xs text-muted-foreground">
              +5.2 points vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Quality</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockManagerLeadData.leadQuality.highQuality}</div>
            <p className="text-xs text-muted-foreground">
              Score 80+ leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockManagerLeadData.leadQuality.needsAttention}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-6">
        <TabsList>
          <TabsTrigger value="distribution">Lead Distribution</TabsTrigger>
          <TabsTrigger value="sources">Source Analysis</TabsTrigger>
          <TabsTrigger value="territories">Territory Performance</TabsTrigger>
          <TabsTrigger value="quality">Quality Management</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Rep Distribution Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Lead Distribution</CardTitle>
              <CardDescription>Lead assignment and performance by sales representative</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManagerLeadData.leadDistribution.map((rep, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {rep.rep.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold">{rep.rep}</h4>
                        <p className="text-sm text-muted-foreground">Sales Representative</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <div className="text-lg font-bold">{rep.total}</div>
                        <div className="text-xs text-muted-foreground">Total Leads</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{rep.qualified}</div>
                        <div className="text-xs text-muted-foreground">Qualified</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{rep.closed}</div>
                        <div className="text-xs text-muted-foreground">Closed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{rep.conversion}%</div>
                        <div className="text-xs text-muted-foreground">Conversion</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Manage Leads
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent High-Priority Leads</CardTitle>
              <CardDescription>Latest leads requiring manager attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.company} • {lead.position}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={lead.priority === 'high' ? 'destructive' : 'secondary'}>
                          {lead.priority}
                        </Badge>
                        <Badge variant="outline">{lead.source}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{lead.score}</div>
                      <div className="text-xs text-muted-foreground">Lead Score</div>
                      <div className="text-xs text-green-600 mt-1">
                        {lead.conversion_likelihood}% conversion
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Reassign
                      </Button>
                      <Button size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Performance</CardTitle>
              <CardDescription>Analysis of lead generation channels and their effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManagerLeadData.leadSources.map((source, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{source.source}</h4>
                      <p className="text-sm text-muted-foreground">Lead Source</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{source.count}</div>
                      <div className="text-xs text-muted-foreground">Leads Generated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{source.quality}%</div>
                      <div className="text-xs text-muted-foreground">Quality Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">${source.cost}</div>
                      <div className="text-xs text-muted-foreground">Cost per Lead</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Source ROI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">🎯 Best Performer</h4>
                    <p className="text-green-700 text-sm">Referrals: 92% quality at $12/lead</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">📈 High Volume</h4>
                    <p className="text-blue-700 text-sm">LinkedIn: 67 leads with 85% quality</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900">⚡ Needs Optimization</h4>
                    <p className="text-yellow-700 text-sm">Trade Shows: High cost at $156/lead</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Increase referral program budget
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Optimize LinkedIn campaigns
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Review trade show ROI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="territories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Territory Performance Overview</CardTitle>
              <CardDescription>Regional lead performance and revenue analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManagerLeadData.territoryPerformance.map((territory, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{territory.territory}</h4>
                      <p className="text-sm text-muted-foreground">Geographic Region</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{territory.leads}</div>
                      <div className="text-xs text-muted-foreground">Active Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{territory.conversion}%</div>
                      <div className="text-xs text-muted-foreground">Conversion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        ${territory.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>High Quality (80+)</span>
                    <span className="font-bold text-green-600">{mockManagerLeadData.leadQuality.highQuality}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Medium Quality (60-79)</span>
                    <span className="font-bold text-blue-600">{mockManagerLeadData.leadQuality.mediumQuality}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Low Quality (<60)</span>
                    <span className="font-bold text-yellow-600">{mockManagerLeadData.leadQuality.lowQuality}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span>Needs Attention</span>
                    <span className="font-bold text-red-600">{mockManagerLeadData.leadQuality.needsAttention}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Improvement Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleBulkAction('Quality Review')}
                  >
                    Review low-quality leads
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleBulkAction('Reassignment')}
                  >
                    Reassign neglected leads
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleBulkAction('Training')}
                  >
                    Schedule team training
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerLeadManagement;
