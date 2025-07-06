
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, Target, AlertTriangle, DollarSign, Calendar, BarChart3, Award, Clock, Phone, Mail } from 'lucide-react';
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

  // Ensure pipelineHealth has default values
  const healthData = {
    totalValue: 0,
    dealCount: 0,
    avgDealSize: 0,
    conversionRate: 0,
    hotDeals: 0,
    stalled: 0,
    ...pipelineHealth
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Demo Actions Panel */}
        <ManagerDemoActions />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager OS Dashboard</h1>
            <p className="text-gray-600 mt-2">Team Performance & Pipeline Overview</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              <Users className="h-3 w-3 mr-1" />
              {teamMembers.length} Team Members
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule 1:1s
            </Button>
          </div>
        </div>

        {/* Pipeline Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${healthData.totalValue?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-500">
                {healthData.dealCount || 0} active deals
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Deal Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${healthData.avgDealSize?.toLocaleString() || '0'}
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
                {healthData.conversionRate || 0}%
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
                {healthData.hotDeals || 0}
              </div>
              <div className="text-sm text-gray-500">
                Closing this week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members Performance */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Team Performance Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member: any) => (
                    <div key={member.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{member.performance}%</div>
                          <div className="text-sm text-gray-500">of quota</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{member.dealsWon}</div>
                          <div className="text-xs text-gray-500">Deals Won</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{member.callsMade}</div>
                          <div className="text-xs text-gray-500">Calls Made</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{member.moodScore}</div>
                          <div className="text-xs text-gray-500">Mood Score</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Quota Progress</span>
                          <span>{member.performance}%</span>
                        </div>
                        <Progress value={member.performance} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Burnout Risk</span>
                          <span className={`font-medium ${
                            member.burnoutRisk > 50 ? 'text-red-600' : 
                            member.burnoutRisk > 30 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {member.burnoutRisk}%
                          </span>
                        </div>
                        <Progress 
                          value={member.burnoutRisk} 
                          className={`h-2 ${
                            member.burnoutRisk > 50 ? 'bg-red-100' : 
                            member.burnoutRisk > 30 ? 'bg-yellow-100' : 'bg-green-100'
                          }`}
                        />
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          1:1
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Team Alerts */}
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
                      {alert.priority === 'high' && (
                        <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                          Take Action
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Pipeline Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round((healthData.conversionRate || 24.5))}%
                    </div>
                    <div className="text-sm text-gray-500">Overall Health Score</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Deals</span>
                      <span className="font-medium">{healthData.dealCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stalled Deals</span>
                      <span className="font-medium text-red-600">{healthData.stalled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hot Prospects</span>
                      <span className="font-medium text-orange-600">{healthData.hotDeals}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Team Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Top Performer</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Alex Thompson - 128% of quota
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Most Improved</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Maria Santos - +15% this month
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Recent Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Alex Thompson closed a $45,000 deal</div>
                  <div className="text-sm text-gray-500">TechCorp Solutions • 2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Maria Santos completed 15 calls today</div>
                  <div className="text-sm text-gray-500">Exceeded daily target • 4 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">James Wilson needs coaching support</div>
                  <div className="text-sm text-gray-500">Burnout risk detected • 1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
