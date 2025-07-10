
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Phone, 
  Mail, 
  DollarSign,
  Target,
  Calendar,
  Star,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TooltipInfo } from '@/components/ui/tooltip-info';
import { PerformanceComparison } from '@/components/analytics/PerformanceComparison';
import { AIBriefingCard } from '@/components/analytics/AIBriefingCard';
import { EnhancedGoalsSection } from '@/components/analytics/EnhancedGoalsSection';

const SalesRepAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  const performanceData = [
    { name: 'Week 1', calls: 45, emails: 120, meetings: 8, revenue: 12000 },
    { name: 'Week 2', calls: 52, emails: 98, meetings: 12, revenue: 18000 },
    { name: 'Week 3', calls: 38, emails: 145, meetings: 6, revenue: 8500 },
    { name: 'Week 4', calls: 61, emails: 132, meetings: 15, revenue: 25000 }
  ];

  const conversionData = [
    { stage: 'Prospects', count: 120, percentage: 100 },
    { stage: 'Qualified', count: 84, percentage: 70 },
    { stage: 'Demo', count: 42, percentage: 35 },
    { stage: 'Proposal', count: 21, percentage: 17.5 },
    { stage: 'Closed Won', count: 8, percentage: 6.7 }
  ];

  const kpis = [
    { 
      title: 'Calls Made', 
      value: '196', 
      change: '+12%', 
      trend: 'up', 
      icon: Phone,
      color: 'text-blue-600',
      tooltip: 'Total outbound calls made this month. More calls typically lead to more opportunities and higher revenue.'
    },
    { 
      title: 'Email Responses', 
      value: '89', 
      change: '+8%', 
      trend: 'up', 
      icon: Mail,
      color: 'text-green-600',
      tooltip: 'Number of email responses received from prospects. Higher response rates indicate effective messaging and timing.'
    },
    { 
      title: 'Meetings Booked', 
      value: '41', 
      change: '+25%', 
      trend: 'up', 
      icon: Calendar,
      color: 'text-purple-600',
      tooltip: 'Qualified meetings scheduled with prospects. Higher meeting rates indicate better lead qualification and follow-up skills.'
    },
    { 
      title: 'Revenue Generated', 
      value: '$63.5K', 
      change: '+18%', 
      trend: 'up', 
      icon: DollarSign,
      color: 'text-green-600',
      tooltip: 'Total revenue closed this month. This directly impacts your commission and contributes to team targets.'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <p className="text-gray-600">Track your performance and identify opportunities</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {kpi.title}
                  <TooltipInfo content={kpi.tooltip} />
                </CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceComparison />
        </div>
        <div>
          <AIBriefingCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Performance Trends
              <TooltipInfo content="Track your activity trends over time. Consistent patterns help identify what works best for your sales process." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="meetings" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Weekly Revenue
              <TooltipInfo content="Weekly revenue performance shows your closing patterns. Consistent revenue generation is key to hitting monthly targets." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sales Funnel Conversion
            <TooltipInfo content="Shows how prospects move through your sales process. Focus on stages with low conversion rates to improve overall performance." />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionData.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{stage.count} leads</span>
                    <Badge variant="outline">{stage.percentage}%</Badge>
                    <TooltipInfo 
                      content={`${stage.stage}: ${stage.count} prospects at this stage (${stage.percentage}% of original prospects)`}
                    />
                  </div>
                </div>
                <Progress value={stage.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Goals & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedGoalsSection />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Recent Achievements
              <TooltipInfo content="Celebrate your wins! Achievements boost motivation and show areas where you excel. Share these with your manager during reviews." />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Top Performer</p>
                <p className="text-xs text-gray-600">Highest conversion rate this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
              <Phone className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Call Champion</p>
                <p className="text-xs text-gray-600">100+ calls made this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Revenue Goal</p>
                <p className="text-xs text-gray-600">80% of monthly target achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesRepAnalytics;
