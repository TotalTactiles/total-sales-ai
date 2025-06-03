
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  Users,
  Clock,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';

const AutomationAnalytics = () => {
  const [timeRange, setTimeRange] = useState('last30days');

  const overallMetrics = [
    {
      label: 'Total Automations',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Messages Sent',
      value: '2,847',
      change: '+18%',
      changeType: 'increase',
      icon: Mail,
      color: 'text-green-600'
    },
    {
      label: 'Response Rate',
      value: '34.2%',
      change: '+5.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      label: 'Time Saved',
      value: '127h',
      change: '+23h',
      changeType: 'increase',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const automationPerformance = [
    {
      name: 'Lead Follow-up Sequence',
      type: 'Email',
      sent: 456,
      opened: 234,
      clicked: 89,
      responded: 67,
      conversionRate: 14.7,
      roi: 340
    },
    {
      name: 'Demo Scheduling',
      type: 'Mixed',
      sent: 123,
      opened: 98,
      clicked: 67,
      responded: 45,
      conversionRate: 36.6,
      roi: 580
    },
    {
      name: 'Cold Outreach SMS',
      type: 'SMS',
      sent: 289,
      opened: 289,
      clicked: 0,
      responded: 43,
      conversionRate: 14.9,
      roi: 210
    },
    {
      name: 'Proposal Follow-up',
      type: 'Email',
      sent: 67,
      opened: 54,
      clicked: 32,
      responded: 28,
      conversionRate: 41.8,
      roi: 450
    }
  ];

  const topPerformingTemplates = [
    {
      name: 'Demo Follow-up Sequence',
      category: 'Follow-ups',
      responseRate: 41.8,
      avgTimeToResponse: '4.2h',
      totalUses: 892
    },
    {
      name: 'New Lead Welcome Series',
      category: 'Lead Nurturing',
      responseRate: 38.7,
      avgTimeToResponse: '6.1h',
      totalUses: 1247
    },
    {
      name: 'Meeting Scheduler',
      category: 'Scheduling',
      responseRate: 35.2,
      avgTimeToResponse: '2.8h',
      totalUses: 456
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'Mixed': return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Automation Analytics</h2>
          <p className="text-muted-foreground">Track performance and optimize your automation workflows</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="last90days">Last 90 days</option>
            <option value="lastyear">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(metric.changeType)}
                    <span className={`text-sm ${
                      metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Performance Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Automation Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automationPerformance.map((automation, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(automation.type)}
                      <h4 className="font-medium">{automation.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {automation.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {automation.conversionRate}% conversion
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${automation.roi} ROI
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p className="font-medium">{automation.sent}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Opened</p>
                      <p className="font-medium">{automation.opened}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Clicked</p>
                      <p className="font-medium">{automation.clicked}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Responded</p>
                      <p className="font-medium">{automation.responded}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Response Rate</span>
                      <span>{automation.conversionRate}%</span>
                    </div>
                    <Progress value={automation.conversionRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformingTemplates.map((template, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {template.responseRate}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {template.category}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Response Time</span>
                    <span className="font-medium">{template.avgTimeToResponse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Uses</span>
                    <span className="font-medium">{template.totalUses}</span>
                  </div>
                </div>
                <Progress value={template.responseRate} className="h-1 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optimization Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: 'Improve SMS Response Rate',
                description: 'Your Cold Outreach SMS has a 14.9% response rate. Try A/B testing different message lengths.',
                impact: 'Medium',
                effort: 'Low'
              },
              {
                title: 'Optimize Send Times',
                description: 'Email automations perform 23% better when sent between 10-11 AM.',
                impact: 'High',
                effort: 'Low'
              },
              {
                title: 'Update Follow-up Sequences',
                description: 'Add a 3rd follow-up email to increase conversion by an estimated 15%.',
                impact: 'High',
                effort: 'Medium'
              }
            ].map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <div className="flex space-x-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        rec.impact === 'High' ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      {rec.impact} Impact
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.effort} Effort
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {rec.description}
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Apply Recommendation
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomationAnalytics;
