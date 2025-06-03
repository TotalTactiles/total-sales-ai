
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  Users
} from 'lucide-react';

const AutomationDashboard = () => {
  const activeAutomations = [
    {
      id: 1,
      name: 'Lead Follow-up Sequence',
      type: 'Email',
      status: 'active',
      leads: 45,
      responseRate: 28,
      lastRun: '2 hours ago',
      nextRun: 'In 4 hours'
    },
    {
      id: 2,
      name: 'Demo Scheduling',
      type: 'Meeting',
      status: 'active',
      leads: 12,
      responseRate: 67,
      lastRun: '30 minutes ago',
      nextRun: 'In 2 hours'
    },
    {
      id: 3,
      name: 'Cold Outreach SMS',
      type: 'SMS',
      status: 'paused',
      leads: 89,
      responseRate: 15,
      lastRun: '1 day ago',
      nextRun: 'Paused'
    }
  ];

  const quickStats = [
    { label: 'Active Automations', value: '8', icon: Zap, color: 'text-blue-600' },
    { label: 'Leads in Queue', value: '156', icon: Users, color: 'text-green-600' },
    { label: 'Avg Response Rate', value: '32%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Time Saved Today', value: '4.2h', icon: Clock, color: 'text-orange-600' }
  ];

  const recommendedAutomations = [
    {
      title: 'LinkedIn Connection Follow-up',
      description: 'Automatically follow up with new LinkedIn connections',
      estimatedImpact: 'High',
      timeToSetup: '5 min'
    },
    {
      title: 'Meeting No-show Recovery',
      description: 'Re-engage leads who missed scheduled meetings',
      estimatedImpact: 'Medium',
      timeToSetup: '3 min'
    },
    {
      title: 'Proposal Follow-up',
      description: 'Automated follow-up sequence after sending proposals',
      estimatedImpact: 'High',
      timeToSetup: '7 min'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'Meeting': return <Clock className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-4">
              <stat.icon className={`h-8 w-8 ${stat.color} mr-3`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Automations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Automations
              <Badge variant="secondary">{activeAutomations.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAutomations.map((automation) => (
              <div key={automation.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(automation.type)}
                    <h4 className="font-medium">{automation.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={automation.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {automation.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      {automation.status === 'active' ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Leads</p>
                    <p className="font-medium">{automation.leads}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Response Rate</p>
                    <p className="font-medium">{automation.responseRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Run</p>
                    <p className="font-medium">{automation.nextRun}</p>
                  </div>
                </div>
                
                <Progress value={automation.responseRate} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Automations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedAutomations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {rec.estimatedImpact} Impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Setup time: {rec.timeToSetup}
                  </span>
                  <Button size="sm" variant="outline">
                    Set Up Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Lead Follow-up email sent', time: '5 minutes ago', status: 'success' },
              { action: 'Demo reminder scheduled', time: '15 minutes ago', status: 'success' },
              { action: 'SMS sequence paused (low response)', time: '2 hours ago', status: 'warning' },
              { action: 'New lead added to nurture sequence', time: '3 hours ago', status: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2">
                {activity.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;
