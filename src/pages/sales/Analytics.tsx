
import React from 'react';
import { BarChart3, TrendingUp, Target, Users, Phone, Calendar, Award, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const SalesAnalytics = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Sales Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your personal performance and identify opportunities for growth
        </p>
      </div>

      {/* Personal KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$47,320</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
            <Progress value={78} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">78% of monthly goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% from last month
            </p>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Above team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +4 from last month
            </p>
            <Progress value={60} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">60% of monthly target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              +7 from last week
            </p>
            <Progress value={68} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Pipeline health: Good</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings Booked</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Performance Trends</CardTitle>
            <CardDescription>
              Your sales performance over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Personal performance chart will be displayed here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>
              How you're spending your time this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calling</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Outreach</span>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <Progress value={30} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Meetings</span>
                <span className="text-sm text-muted-foreground">20%</span>
              </div>
              <Progress value={20} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Admin Tasks</span>
                <span className="text-sm text-muted-foreground">5%</span>
              </div>
              <Progress value={5} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Recognition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Goals</CardTitle>
            <CardDescription>
              Track your progress towards this month's targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Revenue Target</span>
                <span className="text-sm text-muted-foreground">$47K / $60K</span>
              </div>
              <Progress value={78} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Deals Target</span>
                <span className="text-sm text-muted-foreground">12 / 20</span>
              </div>
              <Progress value={60} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Calls Target</span>
                <span className="text-sm text-muted-foreground">89 / 100</span>
              </div>
              <Progress value={89} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
            <CardDescription>
              Your recent wins and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Top Performer</p>
                  <p className="text-xs text-muted-foreground">Exceeded monthly target by 18%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Consistent Caller</p>
                  <p className="text-xs text-muted-foreground">Made 100+ calls this week</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div>
                  <p className="text-sm font-medium">Quick Responder</p>
                  <p className="text-xs text-muted-foreground">Average response time under 5 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAnalytics;
