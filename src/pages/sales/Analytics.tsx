
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DollarSign
} from 'lucide-react';

const SalesAnalytics = () => {
  const personalStats = {
    callsMade: 156,
    emailsSent: 89,
    meetingsBooked: 23,
    dealsWon: 12,
    revenue: 245000,
    conversionRate: 7.7
  };

  const weeklyGoals = {
    calls: { current: 47, target: 60, percentage: 78 },
    emails: { current: 32, target: 45, percentage: 71 },
    meetings: { current: 8, target: 12, percentage: 67 },
    deals: { current: 3, target: 5, percentage: 60 }
  };

  const performanceTrends = [
    { month: 'Jan', calls: 145, deals: 8, revenue: 180000 },
    { month: 'Feb', calls: 167, deals: 11, revenue: 220000 },
    { month: 'Mar', calls: 156, deals: 12, revenue: 245000 }
  ];

  const topLeads = [
    { name: 'TechCorp Inc.', value: 125000, stage: 'Proposal', probability: 85 },
    { name: 'Global Solutions', value: 89000, stage: 'Qualified', probability: 65 },
    { name: 'StartupXYZ', value: 45000, stage: 'Demo', probability: 40 },
    { name: 'Enterprise Corp', value: 200000, stage: 'Discovery', probability: 25 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Analytics</h1>
          <p className="text-muted-foreground">Track your performance and identify opportunities</p>
        </div>
        <Badge className="bg-green-500 text-white flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          +23% This Month
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(personalStats.revenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
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

      {/* Performance Trends & Top Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Trends
            </CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{month.month}</span>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{month.calls} calls</span>
                      <span>{month.deals} deals</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(month.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Pipeline Opportunities
            </CardTitle>
            <CardDescription>Highest value prospects in your pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${lead.value.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${lead.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{lead.probability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAnalytics;
