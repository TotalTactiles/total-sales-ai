
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar,
  Target,
  Award,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useDemoData } from '@/contexts/DemoDataContext';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { leads, activities } = useDemoData();
  
  // Mock stats data for June 11th state
  const personalStats = {
    callsMade: 156,
    emailsSent: 89,
    meetingsBooked: 23,
    dealsWon: 12,
    revenue: 245000,
    conversionRate: 7.7,
    pipelineValue: 847000,
    leadsGenerated: 234,
    followUpsScheduled: 45
  };

  const weeklyGoals = {
    calls: { current: 47, target: 60, percentage: 78 },
    emails: { current: 32, target: 45, percentage: 71 },
    meetings: { current: 8, target: 12, percentage: 67 },
    deals: { current: 3, target: 5, percentage: 60 }
  };

  const todayTasks = [
    { id: 1, task: 'Call Sarah Johnson at TechCorp', priority: 'high', time: '10:00 AM' },
    { id: 2, task: 'Send proposal to Global Solutions', priority: 'high', time: '11:30 AM' },
    { id: 3, task: 'Demo for StartupXYZ', priority: 'medium', time: '2:00 PM' },
    { id: 4, task: 'Follow up with Enterprise Corp', priority: 'medium', time: '3:30 PM' }
  ];

  const recentLeads = leads.slice(0, 5).map(lead => ({
    id: lead.id,
    name: lead.name,
    company: lead.company,
    status: lead.status,
    priority: lead.priority,
    value: `$${Math.floor(Math.random() * 50000 + 10000).toLocaleString()}`,
    lastContact: lead.lastContact
  }));

  const handleLeadClick = (leadId: string) => {
    navigate(`/sales/lead-workspace/${leadId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || 'Sales Rep'}! Here's your performance overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            +23% This Month
          </Badge>
          <Button onClick={() => navigate('/sales/dialer')} className="bg-blue-600 hover:bg-blue-700">
            Start Calling
          </Button>
        </div>
      </div>

      {/* Daily Summary Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            AI Daily Brief
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Good morning! You have 12 high-priority leads requiring immediate attention. Your conversion rate improved by 23% this week. 
            AI suggests focusing on Enterprise prospects between 2-4 PM for optimal engagement. Your pipeline value increased to $847K with 3 deals expected to close this week.
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats.callsMade}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats.emailsSent}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats.meetingsBooked}</div>
            <p className="text-xs text-muted-foreground">Booked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats.dealsWon}</div>
            <p className="text-xs text-muted-foreground">Closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(personalStats.pipelineValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Goals Progress
          </CardTitle>
          <CardDescription>Track your progress towards weekly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(weeklyGoals).map(([key, goal]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <Progress value={goal.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {goal.percentage}% complete
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline & Leads */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pipeline Pulse
              </CardTitle>
              <CardDescription>Your hottest leads requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLeadClick(lead.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        lead.priority === 'high' ? 'bg-red-500' : 
                        lead.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{lead.value}</p>
                      <p className="text-sm text-gray-500 capitalize">{lead.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm">{task.task}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{task.time}</span>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Revenue Generated</span>
                <span className="font-medium">${(personalStats.revenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Conversion Rate</span>
                <span className="font-medium">{personalStats.conversionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Leads Generated</span>
                <span className="font-medium">{personalStats.leadsGenerated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Follow-ups Scheduled</span>
                <span className="font-medium">{personalStats.followUpsScheduled}</span>
              </div>
            </CardContent>
          </Card>

          {/* Victory Archive */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Victories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">TechCorp Inc.</p>
                <p className="text-sm text-green-600">$125,000 - Closed</p>
                <p className="text-xs text-green-500">Jan 15, 2024</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Global Solutions</p>
                <p className="text-sm text-blue-600">$85,000 - Upsell</p>
                <p className="text-xs text-blue-500">Jan 12, 2024</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium">High Priority</p>
                <p className="text-xs text-gray-600">Call Maria Rodriguez at TechCorp - warm lead ready to close</p>
                <p className="text-xs text-yellow-600 mt-1">Suggested: 2:30 PM</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium">Follow-up Needed</p>
                <p className="text-xs text-gray-600">Send updated proposal to Global Solutions</p>
                <p className="text-xs text-blue-600 mt-1">Suggested: 3:15 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
