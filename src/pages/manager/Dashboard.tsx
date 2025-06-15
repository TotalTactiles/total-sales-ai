
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Brain,
  BarChart3,
  Calendar,
  AlertTriangle,
  Building2,
  Database,
  BarChart,
  UserPlus,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import the new components
import CompanyDashboard from '@/components/Manager/CompanyDashboard';
import IntegrationsTab from '@/components/Manager/IntegrationsTab';
import KnowledgeTab from '@/components/Manager/KnowledgeTab';
import MarketingAnalytics from '@/components/Manager/MarketingAnalytics';
import LeadAssignment from '@/components/Manager/LeadAssignment';
import AgentRiskPrediction from '@/components/Manager/AgentRiskPrediction';
import SmartLeadRouting from '@/components/Manager/SmartLeadRouting';

const ManagerDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('company-dashboard');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || 'Manager'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            managerAgent_v1 Active
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Insights
          </Badge>
        </div>
      </div>

      {/* AI-Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-800">Risk Prediction</div>
                <div className="text-xs text-blue-600">AI-powered team analysis</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-green-800">Smart Routing</div>
                <div className="text-xs text-green-600">AI lead assignment</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-purple-800">Performance AI</div>
                <div className="text-xs text-purple-600">Team optimization</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-orange-800">AI Insights</div>
                <div className="text-xs text-orange-600">Strategic analysis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="company-dashboard" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="lead-assignment" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Lead Assignment
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company-dashboard" className="space-y-6">
          <CompanyDashboard />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgentRiskPrediction />
            <SmartLeadRouting />
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <KnowledgeTab />
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <MarketingAnalytics />
        </TabsContent>

        <TabsContent value="lead-assignment" className="space-y-6">
          <LeadAssignment />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Automation Agent Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-yellow-800 mb-2">Active Automations</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-yellow-700">Lead Status Changes</span>
                        <Badge className="bg-green-600 text-white text-xs">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-yellow-700">Missed Call Follow-up</span>
                        <Badge className="bg-green-600 text-white text-xs">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-yellow-700">Email Sequences</span>
                        <Badge className="bg-green-600 text-white text-xs">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">Recent Triggers</div>
                    <div className="space-y-2">
                      <div className="text-xs text-blue-700">• 5 leads auto-assigned today</div>
                      <div className="text-xs text-blue-700">• 12 follow-up emails sent</div>
                      <div className="text-xs text-blue-700">• 3 workflow optimizations applied</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard;
