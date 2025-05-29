
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Target, BarChart3, Calendar, Award, AlertTriangle, CheckCircle } from 'lucide-react';

const ManagerDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Executive command center for team oversight and strategic insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 new hires this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$485,320</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground">+3.2% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Strong pipeline quality</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
              <CardDescription>Individual rep performance and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">125% of quota</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$52,400</p>
                    <p className="text-sm text-green-600">+15% vs last month</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Mike Chen</p>
                      <p className="text-sm text-muted-foreground">98% of quota</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$41,200</p>
                    <p className="text-sm text-blue-600">On track</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Alex Rivera</p>
                      <p className="text-sm text-muted-foreground">78% of quota</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$32,800</p>
                    <p className="text-sm text-yellow-600">Needs attention</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Insights</CardTitle>
              <CardDescription>AI-generated business intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Opportunity Identification</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Enterprise deals closing 23% faster when demo includes ROI calculator. 
                        Consider standardizing this approach across the team.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Performance Trend</p>
                      <p className="text-sm text-green-600 mt-1">
                        Q4 pipeline velocity up 34%. Current trajectory suggests 
                        exceeding quarterly targets by 12%.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">Action Required</p>
                      <p className="text-sm text-orange-600 mt-1">
                        3 high-value prospects haven't been contacted in 7+ days. 
                        Immediate follow-up recommended.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manager command center</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors border">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Team Standup</p>
                    <p className="text-sm text-muted-foreground">Schedule daily sync</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors border">
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Lead Assignment</p>
                    <p className="text-sm text-muted-foreground">Distribute new leads</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors border">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium">Generate Report</p>
                    <p className="text-sm text-muted-foreground">Weekly performance</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors border">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-medium">1-on-1 Schedule</p>
                    <p className="text-sm text-muted-foreground">Book coaching sessions</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
