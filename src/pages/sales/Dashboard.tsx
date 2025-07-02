
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Users, 
  Target,
  ChevronDown,
  Filter,
  Play,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data - replace with real data fetching
const mockData = {
  summary: "Good morning! You have 12 high-priority leads requiring immediate attention. Your conversion rate improved by 23% this week. AI suggests focusing on Enterprise leads today.",
  stats: {
    callsMade: { value: 47, change: "+8%", trend: "up" },
    dealsWon: { value: 12, change: "+23%", trend: "up" },
    winStreak: { value: 5, change: "+15%", trend: "up" }
  },
  leads: [
    {
      id: 1,
      name: "Contact 1",
      company: "TechCorp Inc.",
      lastContact: "Never",
      status: "proposal",
      priority: "high",
      value: "$46,629",
      phone: "555-0123",
      email: "contact@techcorp.com"
    },
    {
      id: 2,
      name: "Contact 2",
      company: "Global Solutions",
      lastContact: "2024-01-12",
      status: "qualified",
      priority: "medium",
      value: "$37,974",
      phone: "555-0124",
      email: "contact@global.com"
    },
    {
      id: 3,
      name: "Contact 3",
      company: "Innovation Labs",
      lastContact: "Never",
      status: "contacted",
      priority: "high",
      value: "$55,122",
      phone: "555-0125",
      email: "contact@innovation.com"
    },
    {
      id: 4,
      name: "Contact 4",
      company: "StartupCo",
      lastContact: "Never",
      status: "new",
      priority: "high",
      value: "$55,457",
      phone: "555-0126",
      email: "contact@startup.com"
    }
  ],
  recentWins: [
    {
      id: 1,
      company: "TechCorp Inc.",
      tag: "new",
      date: "2024-01-15",
      value: "$125,000"
    },
    {
      id: 2,
      company: "Global Solutions",
      tag: "upsell",
      date: "2024-01-12",
      value: "$85,000"
    }
  ],
  aiAssistant: {
    emailsDrafted: 23,
    callsScheduled: 12,
    proposalsGenerated: 5,
    performanceImprovement: 34
  },
  timeBlocks: [
    { time: "09:00", task: "Priority Lead Calls", duration: "2h", color: "blue" },
    { time: "11:30", task: "Follow-up Emails", duration: "30m", color: "yellow" },
    { time: "14:00", task: "Warm Lead Outreach", duration: "1.5h", color: "orange" },
    { time: "16:00", task: "Deal Review & Notes", duration: "45m", color: "red" }
  ],
  aiActions: [
    {
      id: 1,
      contact: "Maria Rodriguez",
      company: "TechCorp",
      task: "Call Maria Rodriguez at TechCorp - warm lead ready to close",
      priority: "high",
      suggestedTime: "2:30 PM"
    },
    {
      id: 2,
      contact: "Global Solutions",
      company: "Global Solutions",
      task: "Send follow-up email to Global Solutions with updated proposal",
      priority: "medium",
      suggestedTime: "3:15 PM"
    }
  ]
};

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [timeBlockMode, setTimeBlockMode] = useState(true);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        switch (e.key) {
          case '1':
            window.location.href = '/sales/dashboard';
            break;
          case '2':
            window.location.href = '/sales/lead-management';
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
            window.location.href = '/sales/academy';
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

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* AI Daily Summary Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              🤖 AI Daily Summary
            </h2>
            <ChevronDown className="h-5 w-5" />
          </div>
          <p className="text-blue-50 leading-relaxed">
            {expandedSummary ? mockData.summary + " Your pipeline shows strong momentum with 3 deals expected to close this week. Focus on enterprise prospects for maximum impact." : mockData.summary}
          </p>
          <button
            onClick={() => setExpandedSummary(!expandedSummary)}
            className="mt-2 text-blue-200 hover:text-white text-sm flex items-center gap-1"
          >
            {expandedSummary ? 'Read less' : 'Read more'}
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedSummary ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                Calls Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{mockData.stats.callsMade.value}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {mockData.stats.callsMade.change}
                  </p>
                </div>
                <div className="w-16 h-8 bg-blue-100 rounded flex items-end justify-center gap-1 p-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className={`bg-blue-500 w-1 rounded-t`} style={{ height: `${Math.random() * 20 + 10}px` }} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-600" />
                Deals Won
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{mockData.stats.dealsWon.value}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {mockData.stats.dealsWon.change}
                  </p>
                </div>
                <div className="w-16 h-8 bg-green-100 rounded flex items-end justify-center gap-1 p-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className={`bg-green-500 w-1 rounded-t`} style={{ height: `${Math.random() * 20 + 10}px` }} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Win Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{mockData.stats.winStreak.value}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {mockData.stats.winStreak.change}
                  </p>
                </div>
                <div className="w-16 h-8 bg-purple-100 rounded flex items-end justify-center gap-1 p-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className={`bg-purple-500 w-1 rounded-t`} style={{ height: `${Math.random() * 20 + 10}px` }} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Pulse Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Pipeline Pulse
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Lead</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Priority</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Value</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockData.leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium text-gray-900">{lead.name}</p>
                              <p className="text-sm text-gray-500">{lead.lastContact === "Never" ? "Never" : new Date(lead.lastContact).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-lg">{getPriorityIcon(lead.priority)}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-medium text-gray-900">{lead.value}</span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Victory Archive */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🏆 Recent Wins
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentWins.map((win) => (
                    <div key={win.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{win.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={win.tag === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                            {win.tag}
                          </Badge>
                          <span className="text-sm text-gray-500">{new Date(win.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {win.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🤖 AI Assistant Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <Mail className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-gray-900">{mockData.aiAssistant.emailsDrafted}</p>
                    <p className="text-xs text-gray-500">Emails Drafted</p>
                  </div>
                  <div className="text-center">
                    <Phone className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-gray-900">{mockData.aiAssistant.callsScheduled}</p>
                    <p className="text-xs text-gray-500">Calls Scheduled</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-gray-900">{mockData.aiAssistant.proposalsGenerated}</p>
                    <p className="text-xs text-gray-500">Proposals Generated</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Performance Improvement</span>
                    <span className="text-lg font-bold text-green-600">+{mockData.aiAssistant.performanceImprovement}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Compared to previous period</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Time Blocks and AI Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI-Optimized Time Blocks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  ⏱ AI-Optimized Time Blocks
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeBlockMode(!timeBlockMode)}
                >
                  {timeBlockMode ? 'Task List' : 'Time Blocks'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.timeBlocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-3 h-3 rounded-full ${getTimeBlockColor(block.color)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{block.time}</span>
                        <span className="text-gray-600">—</span>
                        <span className="text-gray-700">{block.task}</span>
                      </div>
                      <p className="text-sm text-gray-500">{block.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                AI analyzed your performance patterns for optimal scheduling
              </p>
            </CardContent>
          </Card>

          {/* AI-Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ AI-Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.aiActions.map((action) => (
                  <div key={action.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{action.task}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={action.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {action.priority} priority
                          </Badge>
                          <span className="text-sm text-gray-500">Suggested: {action.suggestedTime}</span>
                        </div>
                      </div>
                      <Button size="sm" className="ml-4">
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </div>
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

export default Dashboard;
