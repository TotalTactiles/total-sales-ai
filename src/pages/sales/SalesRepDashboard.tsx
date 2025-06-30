
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone,
  DollarSign,
  TrendingUp,
  Target,
  Trophy,
  Play,
  ChevronDown,
  Filter,
  Eye,
  Calendar,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { data: dashboardData } = useDashboardData();

  const metricCards = [
    {
      title: 'Calls Made',
      value: '0',
      change: '+8%',
      icon: Phone,
      color: 'blue',
      chart: [4, 6, 8, 5, 7, 9, 6]
    },
    {
      title: 'Deals Won',
      value: '0',
      change: '+23%',
      icon: Trophy,
      color: 'green',
      chart: [2, 4, 3, 6, 4, 8, 7]
    },
    {
      title: 'Win Streak',
      value: '0',
      change: '+15%',
      icon: Target,
      color: 'purple',
      chart: [1, 3, 2, 4, 3, 5, 4]
    }
  ];

  const pipelineData = [
    {
      lead: 'Contact 1',
      date: '2025-06-02T00:28:10.407Z',
      status: 'new',
      priority: 'high',
      value: '$46,629',
      company: 'TechCorp Inc.'
    },
    {
      lead: 'Contact 2',
      date: 'Never',
      status: 'qualified',
      priority: 'medium',
      value: '$37,974',
      company: 'Global Solutions'
    },
    {
      lead: 'Contact 3',
      date: 'Never',
      status: 'contacted',
      priority: 'high',
      value: '$55,122',
      company: 'Innovation Labs'
    },
    {
      lead: 'Contact 4',
      date: 'Never',
      status: 'new',
      priority: 'high',
      value: '$55,457',
      company: 'Future Tech'
    },
    {
      lead: 'Contact 5',
      date: '2025-06-03T00:36:27.407Z',
      status: 'proposal',
      priority: 'high',
      value: '$37,180',
      company: 'StartupCo'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'follow-up': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return '🔴';
    if (priority === 'medium') return '🟡';
    return '🟢';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* AI Daily Summary - Matching TSAM design */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                🤖
              </div>
              <h2 className="text-xl font-semibold">AI Daily Summary</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Play className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-blue-100 mb-4">
            Good morning! You have 12 high-priority leads requiring immediate attention. 
            Your conversion rate improved by 23% this week. AI suggests focusing on Enterprise leads today.
          </p>
          <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white p-0">
            Read more <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      metric.color === 'green' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">{metric.change}</span>
                  {/* Mini chart representation */}
                  <div className="flex items-end space-x-1">
                    {metric.chart.map((height, idx) => (
                      <div 
                        key={idx}
                        className={`w-1 rounded-full ${
                          metric.color === 'blue' ? 'bg-blue-500' :
                          metric.color === 'green' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}
                        style={{height: `${height * 2}px`}}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Pulse - 2/3 width */}
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Pipeline Pulse
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
                  <span>Lead</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Value</span>
                  <span>Actions</span>
                </div>
                
                {/* Table Rows */}
                {pipelineData.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.lead}</p>
                      <p className="text-sm text-gray-500">{item.date === 'Never' ? 'Never' : '2025-06-02T00:28:10.407Z'}</p>
                    </div>
                    <div>
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-lg">{getPriorityIcon(item.priority)}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Recent Wins */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Recent Wins
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">TechCorp Inc.</p>
                  <p className="text-sm text-green-600">2024-01-15</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600 text-white">new</Badge>
                  <p className="text-sm font-semibold text-green-700">$125,000</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Global Solutions</p>
                  <p className="text-sm text-blue-600">2024-01-12</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-600 text-white">upsell</Badge>
                  <p className="text-sm font-semibold text-blue-700">$85,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                🤖 AI Assistant Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-xs text-blue-700">Emails Drafted</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-xs text-green-700">Calls Scheduled</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-xs text-purple-700">Proposals Generated</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Performance Improvement</span>
                  <span className="text-lg font-bold text-green-600">+34%</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Compared to previous period</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
