
import React from 'react';
import AIDailySummary from '@/components/Dashboard/AIDailySummary';
import ChatBubble from '@/components/AI/ChatBubble';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3
} from 'lucide-react';

const ManagerDashboard = () => {
  const aiSummary = "Good morning! Your team has achieved 68% month completion with strong pipeline data at $137,700. Revenue trends show +15.2% growth. AI suggests focusing on the 3 active rewards to maintain momentum.";

  // Top Metrics Data
  const topMetrics = [
    {
      title: 'Revenue',
      value: '$346,249',
      change: '+12% from last month',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Leads',
      value: '1,247',
      change: '+5% from last month',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Deals',
      value: '$187,500',
      change: '+8% from last month',
      icon: Target,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      change: '+3% from last month',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    }
  ];

  // Campaign Performance Data
  const campaigns = [
    { name: 'Social Media', metric: '85% CTR', bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200' },
    { name: 'Pay Per Click (PPC)', metric: '$2.50 CPC', bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200' },
    { name: 'Email Marketing', metric: '42% Open Rate', bgColor: 'bg-gradient-to-br from-green-100 to-green-200' },
    { name: 'Content Marketing', metric: '15K Views', bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200' }
  ];

  // Marketing Performance Data
  const marketingChannels = [
    { name: 'Google Ads', ctr: '3.2%', cpc: '$1.85', trend: 'up' },
    { name: 'Meta Ads', ctr: '2.8%', cpc: '$2.10', trend: 'up' },
    { name: 'LinkedIn', ctr: '1.9%', cpc: '$3.50', trend: 'down' },
    { name: 'Referrals', rate: '12%', value: '$450', trend: 'up' },
    { name: 'Organic', traffic: '25K', conv: '8%', trend: 'up' }
  ];

  // Team Performance Data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      title: 'Sales Manager',
      avatar: 'SJ',
      deals: 23,
      target: 85,
      performance: 'excellent'
    },
    {
      name: 'Michael Chen',
      title: 'Marketing Lead',
      avatar: 'MC',
      campaigns: 12,
      roi: '320%',
      performance: 'good'
    },
    {
      name: 'Emily Rodriguez',
      title: 'Account Executive',
      avatar: 'ER',
      accounts: 45,
      retention: '92%',
      performance: 'excellent'
    }
  ];

  // Revenue Progress Data
  const revenueProgress = [
    {
      title: 'Q4 Revenue Champion',
      current: 245000,
      target: 280000,
      percentage: 87,
      status: 'on-track'
    },
    {
      title: 'Team Collaboration Sprint',
      current: 74,
      target: 100,
      percentage: 74,
      status: 'needs-attention'
    },
    {
      title: 'Client Satisfaction Hero',
      current: 96,
      target: 100,
      percentage: 96,
      status: 'excellent'
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Page Header - NO NAVIGATION HERE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-2">Executive overview and AI-powered insights</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
          {/* Main Dashboard Content - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <Card 
                    key={index} 
                    className={`bg-gradient-to-br ${metric.bgGradient} ${metric.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <IconComponent className={`h-8 w-8 bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`} />
                        <div className="w-3 h-3 rounded-full bg-white/50"></div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                          {metric.title}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 leading-tight">
                          {metric.value}
                        </p>
                        <p className="text-sm text-emerald-600 font-medium">
                          {metric.change}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Monthly Forecast Section */}
            <Card className="bg-gradient-to-r from-white to-slate-50 border-2 border-slate-200 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Monthly Forecast</CardTitle>
                      <p className="text-slate-600 text-sm">Progress toward monthly goals</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% above pace
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-4xl font-bold text-slate-900">$450,000</span>
                    <p className="text-slate-600 text-sm">Projected Revenue</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">112%</div>
                    <div className="text-sm text-slate-500">Goal Completion</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-700">72% Month Complete</span>
                    <span className="text-slate-700">Target: $400,000</span>
                  </div>
                  <Progress value={112} className="h-3 bg-slate-200" />
                </div>
              </CardContent>
            </Card>

            {/* Campaign Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {campaigns.map((campaign, index) => (
                <Card key={index} className={`${campaign.bgColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-semibold text-slate-800 mb-2">{campaign.name}</h4>
                    <div className="text-2xl font-bold text-slate-900">{campaign.metric}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Marketing & Sales Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {marketingChannels.map((channel, index) => (
                <Card key={index} className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">{channel.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">CTR:</span>
                        <span className="font-semibold">{channel.ctr || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">CPC:</span>
                        <span className="font-semibold">{channel.cpc || channel.value || channel.conv || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Team Performance Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Team Performance</h2>
                    <p className="text-slate-600 mt-1">Individual performance metrics and insights</p>
                  </div>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                  <Award className="h-5 w-5 mr-1" />
                  3 Active Performers
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                          <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-lg font-bold">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-slate-900">
                            {member.name}
                          </CardTitle>
                          <p className="text-sm text-slate-600 font-medium">{member.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Activity className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-600">
                              {member.performance === 'excellent' ? 'Exceeding' : 'On Track'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center text-sm">
                        <div>
                          <p className="text-slate-600">Metric 1</p>
                          <p className="text-lg font-bold text-slate-900">
                            {member.deals || member.campaigns || member.accounts}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Metric 2</p>
                          <p className="text-lg font-bold text-slate-900">
                            {member.target ? `${member.target}%` : member.roi || member.retention}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sales Revenue Progress */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Revenue Progress & Achievements</h2>
                  <p className="text-slate-600 mt-1">Team challenges and milestone tracking</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {revenueProgress.map((progress, index) => (
                  <Card key={index} className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-slate-900">
                          {progress.title}
                        </CardTitle>
                        {progress.status === 'excellent' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : progress.status === 'needs-attention' ? (
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Activity className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-600">Progress</span>
                          <span className="text-slate-900">{progress.percentage}%</span>
                        </div>
                        <Progress value={progress.percentage} className="h-3" />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>
                            {typeof progress.current === 'number' && progress.current > 1000 
                              ? `$${(progress.current / 1000).toFixed(0)}K`
                              : progress.current
                            } / {typeof progress.target === 'number' && progress.target > 1000 
                              ? `$${(progress.target / 1000).toFixed(0)}K`
                              : progress.target
                            }
                          </span>
                          <span>
                            {progress.status === 'excellent' ? 'Exceeding goals' : 
                             progress.status === 'needs-attention' ? 'Needs attention' : 'On track'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - AI Daily Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AIDailySummary summary={aiSummary} isFullUser={true} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Bubble - Bottom Right */}
      <ChatBubble 
        assistantType="dashboard" 
        enabled={true}
        context={{
          workspace: 'dashboard',
          userRole: 'manager'
        }}
      />
    </div>
  );
};

export default ManagerDashboard;
