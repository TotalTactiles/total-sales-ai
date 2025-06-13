
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Calendar,
  Award,
  Activity,
  BarChart3
} from 'lucide-react';

const ManagerAnalytics = () => {
  const teamPerformance = [
    { name: 'Sarah Johnson', calls: 172, deals: 45, conversion: 26.2, revenue: 125000 },
    { name: 'Michael Chen', calls: 143, deals: 32, conversion: 22.4, revenue: 89000 },
    { name: 'Jasmine Lee', calls: 198, deals: 57, conversion: 28.8, revenue: 167000 },
    { name: 'David Park', calls: 156, deals: 41, conversion: 26.3, revenue: 112000 }
  ];

  const monthlyMetrics = {
    totalRevenue: 493000,
    totalDeals: 175,
    avgConversion: 25.9,
    teamSize: 4
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Analytics</h1>
          <p className="text-muted-foreground">Performance insights and team metrics</p>
        </div>
        <Badge className="bg-green-500 text-white">
          <TrendingUp className="h-4 w-4 mr-1" />
          +12% This Month
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyMetrics.totalDeals}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyMetrics.avgConversion}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyMetrics.teamSize}</div>
            <p className="text-xs text-muted-foreground">Active reps</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Individual Performance
          </CardTitle>
          <CardDescription>Detailed performance metrics for each team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-medium text-primary">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.calls} calls made</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{member.deals} deals</p>
                      <p className="text-sm text-muted-foreground">{member.conversion}% conversion</p>
                    </div>
                    <div>
                      <p className="font-bold text-green-600">${member.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Calls Made</span>
                  <span className="text-sm font-medium">669/700</span>
                </div>
                <Progress value={95.6} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Deals Closed</span>
                  <span className="text-sm font-medium">175/180</span>
                </div>
                <Progress value={97.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Target</span>
                  <span className="text-sm font-medium">$493K/$500K</span>
                </div>
                <Progress value={98.6} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500">🥇</Badge>
                  <span>Jasmine Lee</span>
                </div>
                <span className="font-medium">$167K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-400">🥈</Badge>
                  <span>Sarah Johnson</span>
                </div>
                <span className="font-medium">$125K</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500">🥉</Badge>
                  <span>David Park</span>
                </div>
                <span className="font-medium">$112K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
