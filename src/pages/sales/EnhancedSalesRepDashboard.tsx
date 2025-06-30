
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone,
  Trophy,
  Target,
  TrendingUp,
  Play,
  ChevronDown,
  Filter,
  Calendar,
  Mail,
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';

const EnhancedSalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { data: dashboardData } = useDashboardData();
  const [isExpanded, setIsExpanded] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        switch (e.key) {
          case '1':
            window.location.href = '/sales/dashboard';
            break;
          case '2':
            window.location.href = '/sales/leads';
            break;
          case '3':
            window.location.href = '/sales/ai-agent';
            break;
          case '4':
            window.location.href = '/sales/dialer';
            break;
          case '5':
            window.location.href = '/sales/analytics';
            break;
          case '6':
            window.location.href = '/sales/brain';
            break;
          case '7':
            window.location.href = '/sales/settings';
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const kpiCards = [
    {
      title: 'Calls Made',
      value: '0',
      change: '+8%',
      icon: Phone,
      color: 'blue',
      chart: [4, 6, 8, 5, 7, 9, 6],
      tooltip: '8% up vs last week. Try re-engaging leads from last week'
    },
    {
      title: 'Deals Won',
      value: '0',
      change: '+23%',
      icon: Trophy,
      color: 'green',
      chart: [2, 4, 3, 6, 4, 8, 7],
      tooltip: '23% improvement. Keep up the momentum!'
    },
    {
      title: 'Win Streak',
      value: '0',
      change: 'Personal best!',
      icon: Target,
      color: 'purple',
      chart: [1, 3, 2, 4, 3, 5, 4],
      tooltip: 'Current streak is your personal best'
    }
  ];

  const pipelineData = [
    {
      lead: 'Contact 1',
      lastContact: '2025-06-02T00:28:10.407Z',
      status: 'new',
      priority: 'high',
      value: '$46,629',
      company: 'TechCorp Inc.'
    },
    {
      lead: 'Contact 2',
      lastContact: 'Never',
      status: 'qualified',
      priority: 'medium',
      value: '$37,974',
      company: 'Global Solutions'
    },
    {
      lead: 'Contact 3',
      lastContact: 'Never',
      status: 'contacted',
      priority: 'high',
      value: '$55,122',
      company: 'Innovation Labs'
    },
    {
      lead: 'Contact 4',
      lastContact: 'Never',
      status: 'new',
      priority: 'high',
      value: '$55,457',
      company: 'Future Tech'
    },
    {
      lead: 'Contact 5',
      lastContact: '2025-06-03T00:36:27.407Z',
      status: 'proposal',
      priority: 'high',
      value: '$37,180',
      company: 'StartupCo'
    }
  ];

  const recentWins = [
    {
      company: 'TechCorp Inc.',
      tag: 'new',
      date: '2024-01-15',
      value: '$125,000'
    },
    {
      company: 'Global Solutions',
      tag: 'upsell',
      date: '2024-01-12',
      value: '$85,000'
    }
  ];

  const aiOptimizedBlocks = [
    {
      time: '09:00',
      task: 'Priority Lead Calls',
      duration: '2h',
      color: 'blue'
    },
    {
      time: '11:30',
      task: 'Follow-up Emails',
      duration: '30m',
      color: 'yellow'
    },
    {
      time: '14:00',
      task: 'Warm Lead Outreach',
      duration: '1.5h',
      color: 'orange'
    },
    {
      time: '16:00',
      task: 'Deal Review & Notes',
      duration: '45m',
      color: 'red'
    }
  ];

  const aiRecommendedActions = [
    {
      contact: 'Maria Rodriguez',
      company: 'TechCorp',
      task: 'Call Maria Rodriguez at TechCorp - warm lead ready to close',
      priority: 'high',
      suggestedTime: '2:30 PM'
    },
    {
      contact: 'John Smith',
      company: 'Global Solutions',
      task: 'Send follow-up email to Global Solutions with updated proposal',
      priority: 'medium',
      suggestedTime: '3:15 PM'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return '🔥';
    if (priority === 'medium') return '⚠️';
    return '📊';
  };

  const getTimeBlockColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 max-w-7xl mx-auto">
      {/* AI Daily Summary - Full Width Header */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                🤖
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Daily Summary</h2>
                <p className="text-blue-100 text-sm">Powered by advanced analytics</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
              <Play className="h-4 w-4 mr-2" />
              Listen
            </Button>
          </div>
          
          <div className="space-y-3">
            <p className="text-blue-50 leading-relaxed">
              Good morning! You have <span className="font-semibold text-white">12 high-priority leads</span> requiring immediate attention. 
              Your conversion rate improved by <span className="font-semibold text-green-300">23% this week</span>. 
              AI suggests focusing on Enterprise leads today.
            </p>
            
            {isExpanded && (
              <p className="text-blue-100 text-sm leading-relaxed">
                Based on your recent performance patterns, the optimal time for cold calls is between 2-4 PM. 
                Three prospects have shown increased engagement with your content this week.
              </p>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-200 hover:text-white p-0 h-auto font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'} 
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="bg-white hover:shadow-lg transition-all duration-200 group" title={kpi.tooltip}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${
                      kpi.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      kpi.color === 'green' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    } group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{kpi.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{kpi.change}</span>
                  </div>
                  
                  {/* Mini chart */}
                  <div className="flex items-end space-x-1">
                    {kpi.chart.map((height, idx) => (
                      <div 
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          kpi.color === 'blue' ? 'bg-blue-500' :
                          kpi.color === 'green' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}
                        style={{height: `${height * 3}px`}}
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
        {/* Pipeline Pulse Table - Main Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  🔄 Pipeline Pulse
                </CardTitle>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600 pb-3 border-b border-gray-100">
                  <span>Lead</span>
                  <span>Last Contact</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Value</span>
                  <span>Actions</span>
                </div>
                
                {/* Table Rows */}
                {pipelineData.map((item, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 items-center py-4 border-b border-gray-50 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{item.lead}</p>
                      <p className="text-sm text-gray-500">{item.company}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {item.lastContact === 'Never' ? 'Never' : new Date(item.lastContact).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <Badge className={`text-xs border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-lg" title={`${item.priority} priority`}>
                        {getPriorityIcon(item.priority)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
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
          {/* Victory Archive */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  🏆 Recent Wins
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentWins.map((win, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{win.company}</p>
                    <p className="text-sm text-green-600">{win.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${win.tag === 'new' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                      {win.tag}
                    </Badge>
                    <p className="text-sm font-semibold text-green-700 mt-1">{win.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Assistant Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                🤝 AI Assistant Summary
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
                    <Target className="h-5 w-5 text-purple-600" />
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

      {/* AI-Optimized Time Blocks */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⏱ AI-Optimized Time Blocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiOptimizedBlocks.map((block, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 rounded-full ${getTimeBlockColor(block.color)}`}></div>
                <div className="font-mono text-sm text-gray-600 w-16">{block.time}</div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{block.task}</span>
                  <span className="text-sm text-gray-500 ml-2">({block.duration})</span>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">AI analyzed your performance patterns for optimal scheduling</p>
        </CardContent>
      </Card>

      {/* AI-Recommended Actions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📌 AI-Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiRecommendedActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{action.contact}</span>
                    <Badge variant="outline" className={`text-xs ${
                      action.priority === 'high' ? 'border-red-200 text-red-700' : 'border-yellow-200 text-yellow-700'
                    }`}>
                      {action.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{action.task}</p>
                  <p className="text-xs text-gray-500 mt-1">Suggested: {action.suggestedTime}</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSalesRepDashboard;
