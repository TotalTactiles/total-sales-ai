
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads } = useMockData();

  // Mock data for dashboard
  const dashboardStats = {
    callsMade: 12,
    dealsWon: 3,
    winStreak: 5,
    totalRevenue: 45000,
    conversionRate: 23.5
  };

  const recentLeads = leads.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return '🔥';
      case 'medium': return '📊';
      case 'low': return '🧊';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Good morning, {profile?.full_name || 'Sales Rep'}! 👋
          </h1>
          <p className="text-blue-100">
            You have {recentLeads.length} leads requiring attention today. 
            Your conversion rate improved by {dashboardStats.conversionRate}% this week!
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.callsMade}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.dealsWon}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.winStreak}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">Active</span> streak
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Pulse Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pipeline Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.company}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getPriorityIcon(lead.priority)}</span>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">${lead.value?.toLocaleString() || '0'}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Wins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏆 Recent Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">TechCorp Inc</div>
                      <div className="text-sm text-gray-500">Enterprise Deal</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$25,000</div>
                      <div className="text-sm text-gray-500">2 days ago</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">StartupXYZ</div>
                      <div className="text-sm text-gray-500">New Customer</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$12,000</div>
                      <div className="text-sm text-gray-500">1 week ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Blocks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">09:00 - Priority Lead Calls</div>
                      <div className="text-xs text-gray-500">2 hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">11:30 - Follow-up Emails</div>
                      <div className="text-xs text-gray-500">30 minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">14:00 - Warm Lead Outreach</div>
                      <div className="text-xs text-gray-500">1.5 hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">16:00 - Deal Review & Notes</div>
                      <div className="text-xs text-gray-500">45 minutes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
