
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Calendar,
  Upload,
  Download,
  BarChart3,
  Phone,
  MessageSquare
} from 'lucide-react';
import PipelinePulse from '@/components/Dashboard/PipelinePulse';
import PerformanceOverview from '@/components/Dashboard/PerformanceOverview';
import LeadImportExport from '@/components/Sales/LeadImportExport';

const SalesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  // Mock leads data for PipelinePulse component
  const mockLeads = [
    {
      id: '1',
      name: 'John Smith',
      company: 'TechCorp Inc',
      email: 'john@techcorp.com',
      phone: '+1 (555) 123-4567',
      status: 'qualified' as const,
      priority: 'high' as const,
      value: 15000,
      conversionLikelihood: 78,
      lastAIInsight: 'High engagement on recent email, ready for demo call',
      aiPriority: 'High' as const,
      lastActivity: '2 hours ago',
      nextAction: 'Schedule demo call',
      source: 'Website'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'CloudFirst',
      email: 'sarah@cloudfirst.com',
      phone: '+1 (555) 987-6543',
      status: 'contacted' as const,
      priority: 'medium' as const,
      value: 8500,
      conversionLikelihood: 45,
      lastAIInsight: 'Showed interest in pricing, needs follow-up',
      aiPriority: 'Medium' as const,
      lastActivity: '1 day ago',
      nextAction: 'Send pricing proposal',
      source: 'LinkedIn'
    },
    {
      id: '3',
      name: 'Mike Chen',
      company: 'StartupXYZ',
      email: 'mike@startupxyz.com',
      phone: '+1 (555) 456-7890',
      status: 'new' as const,
      priority: 'low' as const,
      value: 5000,
      conversionLikelihood: 23,
      lastAIInsight: 'New lead, requires qualification call',
      aiPriority: 'Low' as const,
      lastActivity: '3 days ago',
      nextAction: 'Qualification call',
      source: 'Referral'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Dashboard</h1>
          <p className="text-slate-600">
            Track your sales performance and manage your pipeline
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import/Export
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Activities
            </TabsTrigger>
          </TabsList>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline" className="space-y-6">
            <PipelinePulse leads={mockLeads} />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Leads</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">+12% this week</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">23%</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">+5% vs last month</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Calls Made</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <Phone className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">This week</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Follow-ups</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">Due today</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <PerformanceOverview />
          </TabsContent>

          {/* Import/Export Tab */}
          <TabsContent value="data" className="space-y-6">
            <LeadImportExport />
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Called John Smith at TechCorp</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sent follow-up email to Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Scheduled demo with CloudFirst Inc</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
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

export default SalesDashboard;
