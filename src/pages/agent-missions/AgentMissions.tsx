
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  BarChart3, 
  FileText, 
  Settings,
  TrendingUp,
  Users,
  Target,
  Clock
} from 'lucide-react';
import AutomationDashboard from '@/components/AgentMissions/AutomationDashboard';
import { useUsageTracking } from '@/hooks/useUsageTracking';

const AgentMissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('automation');
  const { trackTabOpen } = useUsageTracking();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackTabOpen('agent_missions', `tab_${tab}`);
  };

  // Mock data for other tabs
  const missionStats = {
    activeMissions: 3,
    completedToday: 7,
    successRate: 94,
    timesSaved: 2.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Agent Missions</h1>
            <p className="text-gray-600">Automate your workflow with intelligent AI agents</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{missionStats.activeMissions}</div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{missionStats.completedToday}</div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{missionStats.successRate}%</div>
                <div className="text-xs text-gray-500">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{missionStats.timesSaved}h</div>
                <div className="text-xs text-gray-500">Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automation" className="space-y-6">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">+0.8% from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47.3h</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leads Processed</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+23% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Download detailed performance reports and usage analytics
                </p>
                <div className="flex gap-4">
                  <Button variant="outline">
                    Export PDF Report
                  </Button>
                  <Button variant="outline">
                    Export Excel Data
                  </Button>
                  <Button variant="outline">
                    Send to Manager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Email Follow-up Sequence</h4>
                      <Badge className="bg-green-100 text-green-800">New</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Automated email sequence for lead nurturing
                    </p>
                    <Button variant="outline" size="sm">
                      Preview Template
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Call Follow-up Script</h4>
                      <Badge className="bg-blue-100 text-blue-800">Updated</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Optimized script for follow-up calls
                    </p>
                    <Button variant="outline" size="sm">
                      Preview Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Notification Preferences</h4>
                  <p className="text-sm text-gray-600">
                    Configure how you want to receive automation updates
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Approval Settings</h4>
                  <p className="text-sm text-gray-600">
                    Set automation approval thresholds and manager review requirements
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentMissions;
