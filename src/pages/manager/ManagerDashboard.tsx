
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { useTeamData } from '@/hooks/useMockData';
import ManagerDemoActions from '@/components/demo/ManagerDemoActions';

const ManagerDashboard: React.FC = () => {
  const { teamMembers, pipelineHealth, alerts, isLoading } = useTeamData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Demo Actions Panel */}
        <ManagerDemoActions />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-2">Team Performance & Pipeline Overview</p>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Users className="h-3 w-3 mr-1" />
            {teamMembers.length} Team Members
          </Badge>
        </div>

        {/* Pipeline Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${pipelineHealth.totalValue?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-500">
                {pipelineHealth.dealCount || 0} active deals
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Deal Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${pipelineHealth.avgDealSize?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-green-600">
                ↑ 12% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {pipelineHealth.conversionRate || 0}%
              </div>
              <div className="text-sm text-green-600">
                ↑ 3.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Hot Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pipelineHealth.hotDeals || 0}
              </div>
              <div className="text-sm text-gray-500">
                Closing this week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{member.performance}%</div>
                      <div className="text-sm text-gray-500">{member.dealsWon} deals won</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Team Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.priority === 'high' ? 'bg-red-50 border-red-400' :
                    alert.priority === 'positive' ? 'bg-green-50 border-green-400' :
                    'bg-yellow-50 border-yellow-400'
                  }`}>
                    <div className="font-medium text-gray-900">{alert.message}</div>
                    <div className="text-sm text-gray-600 mt-1">{alert.actionRequired}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
