import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, Brain, DollarSign, AlertTriangle, TrendingUp, Calendar, MessageCircle, Video, CheckCircle, Clock, Phone, Target } from 'lucide-react';
import { toast } from 'sonner';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import MetricModal from '@/components/Manager/MetricModal';
import TeamMemberModal from '@/components/Manager/TeamMemberModal';
import BusinessOpsSnapshot from '@/components/Manager/BusinessOpsSnapshot';

// Mock data for demo manager account
const mockTeamMembers = [{
  id: 'demo-tm-1',
  full_name: 'Sarah Johnson',
  last_login: new Date().toISOString(),
  role: 'sales_rep',
  stats: {
    call_count: 172,
    win_count: 45,
    current_streak: 5,
    burnout_risk: 10,
    last_active: new Date().toISOString(),
    mood_score: 85
  }
}, {
  id: 'demo-tm-2',
  full_name: 'Michael Chen',
  last_login: new Date(Date.now() - 3600000).toISOString(),
  role: 'sales_rep',
  stats: {
    call_count: 143,
    win_count: 32,
    current_streak: 0,
    burnout_risk: 75,
    last_active: new Date(Date.now() - 3600000).toISOString(),
    mood_score: 45
  }
}, {
  id: 'demo-tm-3',
  full_name: 'Jasmine Lee',
  last_login: new Date(Date.now() - 86400000).toISOString(),
  role: 'sales_rep',
  stats: {
    call_count: 198,
    win_count: 57,
    current_streak: 7,
    burnout_risk: 20,
    last_active: new Date(Date.now() - 43200000).toISOString(),
    mood_score: 90
  }
}];
const AIManagerDashboard = () => {
  const [activeMetricModal, setActiveMetricModal] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Metric modal configurations with mock data
  const getMetricModalConfig = (metricType: string) => {
    switch (metricType) {
      case 'revenue':
        return {
          title: 'Forecasted Revenue',
          metric: '$340,320',
          change: '+15% projected growth',
          insights: ['Q4 trending 23% above target based on current pipeline velocity', 'Enterprise segment driving 67% of growth', 'SMB conversion rates improving by 12% month-over-month'],
          recommendations: ['Focus enterprise team on closing Q4 deals', 'Increase SMB marketing spend while conversion is high', 'Schedule revenue forecast review with leadership'],
          deepDiveLink: '/manager/reports',
          deepDiveLinkText: 'View Revenue Analytics'
        };
      case 'risk':
        return {
          title: 'Risk Flagged Reps',
          metric: '1 Rep',
          change: 'Needs immediate attention',
          insights: ['Michael Chen showing 75% burnout risk indicators', 'Performance declining 18% over past 2 weeks', 'Mood score dropped from 78% to 45%'],
          recommendations: ['Schedule immediate 1-on-1 with Michael', 'Review workload distribution', 'Consider temporary support assignment'],
          deepDiveLink: '/manager/team',
          deepDiveLinkText: 'View Team Health'
        };
      case 'pipeline':
        return {
          title: 'Pipeline Movement',
          metric: '+$137,700',
          change: 'Net positive this week',
          insights: ['Strong activity in enterprise segment', '12 deals advanced to negotiation stage', 'Average deal size increased by 23%'],
          recommendations: ['Accelerate negotiation training for team', 'Focus on enterprise deal coaching', 'Review pricing strategies for optimal close rates'],
          deepDiveLink: '/manager/leads',
          deepDiveLinkText: 'View Pipeline Details'
        };
      case 'alerts':
        return {
          title: 'AI Alerts',
          metric: '3 Active',
          change: '2 require action',
          insights: ['Hot leads going cold in pipeline', 'Rep burnout indicators detected', 'Follow-up delays impacting conversion'],
          recommendations: ['Assign hot leads to available reps', 'Implement automated follow-up sequences', 'Review team capacity and workload'],
          deepDiveLink: '/manager/ai',
          deepDiveLinkText: 'View AI Alert Center'
        };
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ManagerNavigation />
      
      <main className="pt-[60px] py-0">
        <div className="flex-1 px-4 md:px-6 py-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 py-0 my-[28px]">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, Demo Manager</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                AI Analytics Active
              </Badge>
            </div>

            {/* Interactive Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Forecasted Revenue Card */}
              <div onClick={() => setActiveMetricModal('revenue')} className="cursor-pointer transform hover:scale-105 transition-all duration-200">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Forecasted Revenue</p>
                        <p className="text-3xl font-bold text-green-700">$340,320</p>
                        <p className="text-green-600 text-sm mt-1">+15% projected growth</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Flagged Reps Card */}
              <div onClick={() => setActiveMetricModal('risk')} className="cursor-pointer transform hover:scale-105 transition-all duration-200">
                <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">Risk Flagged Reps</p>
                        <p className="text-3xl font-bold text-red-700">1</p>
                        <p className="text-red-600 text-sm mt-1">Need immediate attention</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pipeline Movement Card */}
              <div onClick={() => setActiveMetricModal('pipeline')} className="cursor-pointer transform hover:scale-105 transition-all duration-200">
                <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Pipeline Movement</p>
                        <p className="text-3xl font-bold text-blue-700">+$137,700</p>
                        <p className="text-blue-600 text-sm mt-1">Net positive this week</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Alerts Card */}
              <div onClick={() => setActiveMetricModal('alerts')} className="cursor-pointer transform hover:scale-105 transition-all duration-200">
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">AI Alerts</p>
                        <p className="text-3xl font-bold text-purple-700">3</p>
                        <p className="text-purple-600 text-sm mt-1">2 require action</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Brain className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Performance Grid */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg mb-8">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Performance Grid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {mockTeamMembers.map(member => <div key={member.id} onClick={() => setSelectedTeamMember(member)} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                            {member.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.full_name}</h3>
                          <p className="text-sm text-gray-600">{member.stats.last_active ? 'Active' : 'Offline'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-semibold text-green-600">${(Math.random() * 100000).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calls:</span>
                          <span className="font-semibold">{member.stats.call_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conversion:</span>
                          <span className="font-semibold text-blue-600">{Math.floor(Math.random() * 40 + 20)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Level:</span>
                          <span className={`font-semibold ${member.stats.burnout_risk >= 70 ? 'text-red-600' : member.stats.burnout_risk >= 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {member.stats.burnout_risk >= 70 ? 'High' : member.stats.burnout_risk >= 40 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Business Operations Snapshot */}
            <BusinessOpsSnapshot />

            {/* Quick Actions Panel */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Team Meeting
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send Team Message
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    <Brain className="h-5 w-5 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Metric Modals */}
      {activeMetricModal && <MetricModal isOpen={true} onClose={() => setActiveMetricModal(null)} type={activeMetricModal as any} {...getMetricModalConfig(activeMetricModal)!} />}

      {/* Team Member Modal */}
      {selectedTeamMember && <TeamMemberModal isOpen={true} onClose={() => setSelectedTeamMember(null)} member={selectedTeamMember} />}
    </div>;
};
export default AIManagerDashboard;