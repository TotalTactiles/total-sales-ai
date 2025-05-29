
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerAnalytics = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore advanced analytics and insights.');
  };

  const mockAnalyticsData = {
    teamMetrics: {
      totalRevenue: 485320,
      avgConversion: 28.5,
      teamSize: 12,
      pipelineHealth: 94
    },
    trends: [
      { period: 'Q1', revenue: 320000, calls: 2400, conversions: 18.5 },
      { period: 'Q2', revenue: 410000, calls: 3100, conversions: 22.3 },
      { period: 'Q3', revenue: 485320, calls: 3800, conversions: 28.5 },
      { period: 'Q4', revenue: 520000, calls: 4200, conversions: 31.2 }
    ]
  };

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Manager Analytics" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Manager Analytics & Business Intelligence" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Advanced analytics and business intelligence for strategic decision making
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockAnalyticsData.teamMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+18% from last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.teamMetrics.avgConversion}%</div>
            <p className="text-xs text-muted-foreground">+3.2% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.teamMetrics.teamSize}</div>
            <p className="text-xs text-muted-foreground">+2 new hires</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.teamMetrics.pipelineHealth}%</div>
            <p className="text-xs text-muted-foreground">Excellent status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Performance Trends</CardTitle>
            <CardDescription>Revenue and conversion tracking over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{trend.period}</p>
                    <p className="text-sm text-muted-foreground">{trend.calls} calls made</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${trend.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">{trend.conversions}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Insights</CardTitle>
            <CardDescription>AI-generated business recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Revenue Optimization</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Enterprise segment showing 34% higher close rates. Consider reallocating resources.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Team Performance</p>
                    <p className="text-sm text-green-600 mt-1">
                      Top performers are using new objection handling scripts. Roll out to full team.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">Timing Insights</p>
                    <p className="text-sm text-orange-600 mt-1">
                      Tuesday 2-4 PM shows highest connect rates. Optimize calling schedules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
