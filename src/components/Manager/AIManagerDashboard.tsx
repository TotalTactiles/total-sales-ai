
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  TrendingUp,
  Users,
  AlertTriangle,
  Target,
  Phone,
  DollarSign,
  Award,
  Download,
  Filter,
  Bell,
  Calendar,
  MessageSquare,
  BookOpen,
  Zap,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  revenue: string;
  callVolume: number;
  conversionRate: number;
  aiStatus: 'fire' | 'coasting' | 'at-risk';
  lastActivity: string;
  xpEarned: number;
  academyProgress: number;
}

interface AIAlert {
  id: string;
  type: 'coaching' | 'risk' | 'opportunity' | 'milestone';
  title: string;
  description: string;
  repName?: string;
  actionRequired: boolean;
  timestamp: string;
}

interface CoachingCard {
  id: string;
  repName: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'assign' | 'review' | 'follow-up';
}

const AIManagerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [selectedRep, setSelectedRep] = useState<TeamMember | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data - in real implementation, this would come from live data streams
  const [teamData, setTeamData] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      revenue: '$89,500',
      callVolume: 47,
      conversionRate: 34,
      aiStatus: 'fire',
      lastActivity: '2 mins ago',
      xpEarned: 850,
      academyProgress: 78
    },
    {
      id: '2',
      name: 'Michael Chen',
      revenue: '$67,200',
      callVolume: 32,
      conversionRate: 18,
      aiStatus: 'at-risk',
      lastActivity: '4 hours ago',
      xpEarned: 420,
      academyProgress: 45
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      revenue: '$92,100',
      callVolume: 55,
      conversionRate: 41,
      aiStatus: 'fire',
      lastActivity: '15 mins ago',
      xpEarned: 1250,
      academyProgress: 85
    },
    {
      id: '4',
      name: 'David Kim',
      revenue: '$34,800',
      callVolume: 28,
      conversionRate: 12,
      aiStatus: 'coasting',
      lastActivity: '1 day ago',
      xpEarned: 320,
      academyProgress: 32
    }
  ]);

  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([
    {
      id: '1',
      type: 'risk',
      title: 'Conversion Rate Drop',
      description: 'Michael Chen dropped 15% in conversion this week',
      repName: 'Michael Chen',
      actionRequired: true,
      timestamp: '5 mins ago'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Hot Streak Alert',
      description: 'Lisa Rodriguez closed 3 deals in 2 days',
      repName: 'Lisa Rodriguez',
      actionRequired: false,
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      type: 'coaching',
      title: 'Academy Stagnation',
      description: 'David Kim hasn\'t completed training in 5 days',
      repName: 'David Kim',
      actionRequired: true,
      timestamp: '3 hours ago'
    }
  ]);

  const [coachingCards, setCoachingCards] = useState<CoachingCard[]>([
    {
      id: '1',
      repName: 'Michael Chen',
      suggestion: 'Assign "Price Objection Masterclass" module',
      priority: 'high',
      actionType: 'assign'
    },
    {
      id: '2',
      repName: 'David Kim',
      suggestion: 'Schedule 1-on-1 for follow-up best practices',
      priority: 'medium',
      actionType: 'follow-up'
    },
    {
      id: '3',
      repName: 'Sarah Johnson',
      suggestion: 'Review her winning call recordings for team sharing',
      priority: 'low',
      actionType: 'review'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fire': return '🔥';
      case 'coasting': return '💤';
      case 'at-risk': return '⚠️';
      default: return '📊';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fire': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'coasting': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'at-risk': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalRevenue = teamData.reduce((sum, member) => sum + parseFloat(member.revenue.replace(/[$,]/g, '')), 0);
  const avgConversion = teamData.reduce((sum, member) => sum + member.conversionRate, 0) / teamData.length;
  const totalCalls = teamData.reduce((sum, member) => sum + member.callVolume, 0);
  const atRiskCount = teamData.filter(member => member.aiStatus === 'at-risk').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Manager Command Center</h1>
          <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || 'Manager'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Brain className="h-3 w-3 mr-1" />
            Manager AI Active
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {aiAlerts.filter(alert => alert.actionRequired).length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </Button>
        </div>
      </div>

      {/* AI Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Forecasted Revenue</p>
                <p className="text-2xl font-bold text-green-900">${(totalRevenue * 1.2).toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% projected growth</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Risk Flagged Reps</p>
                <p className="text-2xl font-bold text-red-900">{atRiskCount}</p>
                <p className="text-xs text-red-600">Need immediate attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Pipeline Movement</p>
                <p className="text-2xl font-bold text-blue-900">+${totalCalls * 850}</p>
                <p className="text-xs text-blue-600">Net positive this week</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">AI Alerts</p>
                <p className="text-2xl font-bold text-purple-900">{aiAlerts.length}</p>
                <p className="text-xs text-purple-600">{aiAlerts.filter(a => a.actionRequired).length} require action</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Performance Grid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamData.map((member) => (
              <Card 
                key={member.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(member.aiStatus)}`}
                onClick={() => setSelectedRep(member)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.lastActivity}</p>
                    </div>
                    <span className="text-lg">{getStatusIcon(member.aiStatus)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-semibold">{member.revenue}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Calls:</span>
                      <span className="font-semibold">{member.callVolume}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conversion:</span>
                      <span className="font-semibold">{member.conversionRate}%</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Academy Progress</span>
                        <span>{member.academyProgress}%</span>
                      </div>
                      <Progress value={member.academyProgress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Coaching Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Coaching Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coachingCards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getPriorityColor(card.priority)}>
                      {card.priority}
                    </Badge>
                    <span className="font-medium text-gray-900">{card.repName}</span>
                  </div>
                  <p className="text-sm text-gray-600">{card.suggestion}</p>
                </div>
                <Button size="sm" className="ml-4">
                  {card.actionType === 'assign' && <BookOpen className="h-4 w-4 mr-1" />}
                  {card.actionType === 'follow-up' && <Calendar className="h-4 w-4 mr-1" />}
                  {card.actionType === 'review' && <MessageSquare className="h-4 w-4 mr-1" />}
                  Execute
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Tools Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Weekly Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Coaching Plan Generator
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Smart Team Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Bulk Action Center
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rep Detail Modal */}
      {selectedRep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {selectedRep.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedRep.name}</h3>
                    <Badge className={getStatusColor(selectedRep.aiStatus)}>
                      {getStatusIcon(selectedRep.aiStatus)} {selectedRep.aiStatus.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedRep(null)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedRep.revenue}</p>
                  <p className="text-sm text-green-800">Revenue This Month</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedRep.conversionRate}%</p>
                  <p className="text-sm text-blue-800">Conversion Rate</p>
                </div>
              </div>

              {/* AI Insights */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Insights
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Strength:</strong> Excellent at discovery calls (92% success rate)
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      <strong>Area for Improvement:</strong> Follow-up timing needs work (avg 3.2 days)
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <p className="font-medium">Completed call with Acme Corp</p>
                      <p className="text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium">Watched "Objection Handling" lesson</p>
                      <p className="text-gray-600">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule 1-on-1
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Alerts & Notifications</CardTitle>
                <Button variant="ghost" onClick={() => setShowNotifications(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.type === 'risk' ? 'bg-red-50 border-red-200' :
                    alert.type === 'opportunity' ? 'bg-green-50 border-green-200' :
                    alert.type === 'coaching' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                      </div>
                      {alert.actionRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIManagerDashboard;
