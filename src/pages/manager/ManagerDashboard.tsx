import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, Target, AlertTriangle, DollarSign, Calendar, BarChart3, Award, Clock, Phone, Mail, Brain } from 'lucide-react';
import { useTeamData } from '@/hooks/useMockData';

const ManagerDashboard: React.FC = () => {
  const { teamMembers, pipelineHealth, alerts, isLoading } = useTeamData();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Ensure pipelineHealth has default values
  const healthData = {
    totalValue: 450000,
    dealCount: 25,
    avgDealSize: 18000,
    conversionRate: 24.5,
    hotDeals: 8,
    stalled: 3,
    ...pipelineHealth
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager OS Dashboard</h1>
          <p className="text-gray-600 mt-2">Team Performance & Pipeline Management Center</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            {teamMembers.length} Team Members
          </Badge>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule 1:1s
          </Button>
        </div>
      </div>

      {/* Pipeline Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              ${healthData.totalValue?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {healthData.dealCount || 0} active deals
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Avg Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              ${healthData.avgDealSize?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-green-600 mt-1">
              ↑ 12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">
              {healthData.conversionRate || 0}%
            </div>
            <div className="text-sm text-green-600 mt-1">
              ↑ 3.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Hot Deals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">
              {healthData.hotDeals || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Closing this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Performance Dashboard */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Performance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {teamMembers.map((member: any) => (
                  <div key={member.id} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-xl">{member.performance}%</div>
                        <div className="text-sm text-gray-500">of quota</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="font-semibold text-green-600 text-lg">{member.dealsWon}</div>
                        <div className="text-xs text-gray-500">Deals Won</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="font-semibold text-blue-600 text-lg">{member.callsMade}</div>
                        <div className="text-xs text-gray-500">Calls Made</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="font-semibold text-purple-600 text-lg">{member.moodScore}</div>
                        <div className="text-xs text-gray-500">Mood Score</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="font-semibold text-gray-700 text-lg">${(member.revenue || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Quota Progress</span>
                        <span className="font-semibold">{member.performance}%</span>
                      </div>
                      <Progress value={member.performance} className="h-3" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Burnout Risk</span>
                        <span className={`font-semibold ${
                          member.burnoutRisk > 50 ? 'text-red-600' : 
                          member.burnoutRisk > 30 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {member.burnoutRisk}%
                        </span>
                      </div>
                      <Progress 
                        value={member.burnoutRisk} 
                        className={`h-3 ${
                          member.burnoutRisk > 50 ? 'bg-red-100' : 
                          member.burnoutRisk > 30 ? 'bg-yellow-100' : 'bg-green-100'
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button size="sm" variant="outline" className="flex-1 hover:bg-blue-50">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 hover:bg-green-50">
                        <Mail className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
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
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                AI Team Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {alerts.map((alert: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    alert.priority === 'high' ? 'bg-red-50 border-red-400' :
                    alert.priority === 'positive' ? 'bg-green-50 border-green-400' :
                    'bg-yellow-50 border-yellow-400'
                  }`}>
                    <div className="font-semibold text-gray-900 mb-2">{alert.message}</div>
                    <div className="text-sm text-gray-600 mb-3">{alert.actionRequired}</div>
                    {alert.priority === 'high' && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        Take Action
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Health */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Pipeline Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((healthData.conversionRate || 24.5))}%
                  </div>
                  <div className="text-sm text-gray-500">Overall Health Score</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Active Deals</span>
                    <span className="font-semibold text-gray-900">{healthData.dealCount}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Stalled Deals</span>
                    <span className="font-semibold text-red-600">{healthData.stalled}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">Hot Prospects</span>
                    <span className="font-semibold text-orange-600">{healthData.hotDeals}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Performance Trend</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      Team performance up 15% this quarter
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Recognition</span>
                    </div>
                    <div className="text-sm text-green-700">
                      3 team members exceeded targets
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Activity Timeline */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Alex Thompson closed a $45,000 deal</div>
                  <div className="text-sm text-gray-500">TechCorp Solutions • 2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Maria Santos completed 15 calls today</div>
                  <div className="text-sm text-gray-500">Exceeded daily target • 4 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">James Wilson needs coaching support</div>
                  <div className="text-sm text-gray-500">AI burnout risk detected • 1 day ago</div>
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
