
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Calendar,
  Bell,
  Brain,
  ArrowUpRight,
  Eye,
  ChevronRight,
  Activity,
  Briefcase,
  PieChart,
  BarChart3
} from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Mock data for the redesigned dashboard
  const keyMetrics = [
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: '$127,500',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-50 text-green-700',
      iconColor: 'text-green-600'
    },
    {
      id: 'team_performance',
      title: 'Team Performance',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      id: 'pipeline',
      title: 'Pipeline Value',
      value: '$340K',
      change: '+8.7%',
      trend: 'up',
      icon: Target,
      color: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '24.1%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-700',
      iconColor: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Review Team Performance',
      description: 'Weekly team assessment and coaching alerts',
      icon: Users,
      action: 'View Details',
      urgency: 'high'
    },
    {
      title: 'Pipeline Review',
      description: '3 deals need attention this week',
      icon: Target,
      action: 'Review Now',
      urgency: 'medium'
    },
    {
      title: 'AI Insights Ready',
      description: 'New business optimization suggestions',
      icon: Brain,
      action: 'View Insights',
      urgency: 'low'
    },
    {
      title: 'Monthly Reports',
      description: 'Generate executive summary reports',
      icon: BarChart3,
      action: 'Generate',
      urgency: 'low'
    }
  ];

  const recentActivities = [
    {
      title: 'Sarah completed 3 high-value deals',
      time: '2 hours ago',
      type: 'success',
      icon: DollarSign
    },
    {
      title: 'New lead source integration active',
      time: '4 hours ago',
      type: 'info',
      icon: Activity
    },
    {
      title: 'Michael needs coaching attention',
      time: '6 hours ago',
      type: 'warning',
      icon: Users
    },
    {
      title: 'Weekly business ops review completed',
      time: '1 day ago',
      type: 'info',
      icon: Briefcase
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Executive Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Real-time business intelligence and team insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <Card 
                key={metric.id} 
                className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm"
                onClick={() => setSelectedMetric(metric.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${metric.color}`}>
                      <IconComponent className={`h-5 w-5 ${metric.iconColor}`} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {metric.change} vs last period
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Priority Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  const urgencyColor = action.urgency === 'high' ? 'border-red-200 bg-red-50' : 
                                     action.urgency === 'medium' ? 'border-orange-200 bg-orange-50' : 
                                     'border-blue-200 bg-blue-50';
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${urgencyColor} hover:shadow-md transition-all duration-200 cursor-pointer`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <IconComponent className="h-5 w-5 text-slate-700" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{action.title}</h4>
                            <p className="text-sm text-slate-600">{action.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          {action.action}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  const typeColor = activity.type === 'success' ? 'text-green-600' :
                                   activity.type === 'warning' ? 'text-orange-600' :
                                   'text-blue-600';
                  
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`p-1.5 rounded-full bg-slate-100`}>
                        <IconComponent className={`h-3 w-3 ${typeColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Insights Panel */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Strategic Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Revenue Optimization</h4>
                <p className="text-sm text-slate-600 mb-3">Focus on enterprise deals - 23% higher close rate identified</p>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
              <div className="bg-white/70 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Team Performance</h4>
                <p className="text-sm text-slate-600 mb-3">Sarah's techniques could boost team performance by 15%</p>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
              <div className="bg-white/70 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Process Automation</h4>
                <p className="text-sm text-slate-600 mb-3">3 workflow optimizations ready for deployment</p>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border-0 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">12</p>
              <p className="text-sm text-slate-600">Active Reps</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">347</p>
              <p className="text-sm text-slate-600">Active Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">89%</p>
              <p className="text-sm text-slate-600">AI Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">15</p>
              <p className="text-sm text-slate-600">Automations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">4.8</p>
              <p className="text-sm text-slate-600">Team Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">97%</p>
              <p className="text-sm text-slate-600">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
