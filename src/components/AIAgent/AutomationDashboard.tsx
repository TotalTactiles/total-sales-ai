
import React, { useState } from 'react';
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
  Users,
  Send,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

const AutomationDashboard = () => {
  const [activeAutomations, setActiveAutomations] = useState([
    {
      id: 1,
      name: 'Lead Follow-up Sequence',
      type: 'Email',
      status: 'active',
      leads: 45,
      responseRate: 28,
      lastRun: '2 hours ago',
      nextRun: 'In 4 hours',
      aiInsight: 'Response rate increased 12% after AI optimization of subject lines'
    },
    {
      id: 2,
      name: 'Demo Scheduling',
      type: 'Meeting',
      status: 'active',
      leads: 12,
      responseRate: 67,
      lastRun: '30 minutes ago',
      nextRun: 'In 2 hours',
      aiInsight: 'Best performance on Tuesday-Thursday between 10-11 AM'
    },
    {
      id: 3,
      name: 'Cold Outreach SMS',
      type: 'SMS',
      status: 'available',
      leads: 89,
      responseRate: 15,
      lastRun: '1 day ago',
      nextRun: 'Ready to deploy',
      aiInsight: 'Low response rate suggests need for message personalization'
    }
  ]);

  const quickStats = [
    { label: 'Active Automations', value: '5', icon: Zap, color: 'text-blue-600' },
    { label: 'Leads in Queue', value: '156', icon: Users, color: 'text-green-600' },
    { label: 'Avg Response Rate', value: '32%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Time Saved Today', value: '4.2h', icon: Clock, color: 'text-orange-600' }
  ];

  const recommendedAutomations = [
    {
      title: 'LinkedIn Connection Follow-up',
      description: 'Automatically follow up with new LinkedIn connections',
      estimatedImpact: 'High',
      timeToSetup: '5 min',
      efficiency: 89
    },
    {
      title: 'Meeting No-show Recovery',
      description: 'Re-engage leads who missed scheduled meetings',
      estimatedImpact: 'Medium',
      timeToSetup: '3 min',
      efficiency: 76
    },
    {
      title: 'Proposal Follow-up',
      description: 'Automated follow-up sequence after sending proposals',
      estimatedImpact: 'High',
      timeToSetup: '7 min',
      efficiency: 85
    }
  ];

  const handleRecommendToManager = (automationTitle: string) => {
    // Update automation status to pending manager review
    setActiveAutomations(prev => prev.map(automation => 
      automation.name === automationTitle 
        ? { ...automation, status: 'pending_manager' }
        : automation
    ));
    
    toast.success(`"${automationTitle}" recommended to manager for review`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'Meeting': return <Clock className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_manager': return 'bg-yellow-100 text-yellow-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending_manager': return 'Pending Manager Review';
      case 'available': return 'Available';
      default: return status;
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
                    <Badge className={getStatusColor(automation.status)}>
                      {getStatusText(automation.status)}
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

                {/* AI Insight */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">AI Insight</p>
                      <p className="text-xs text-blue-600">{automation.aiInsight}</p>
                    </div>
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

                {/* Action Buttons */}
                <div className="flex justify-end">
                  {automation.status === 'available' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecommendToManager(automation.name)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Recommend to Manager
                    </Button>
                  )}
                  {automation.status === 'pending_manager' && (
                    <div className="text-xs text-gray-500">
                      Awaiting manager approval
                    </div>
                  )}
                  {automation.status === 'active' && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Running
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Automations */}
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
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
                
                {/* Efficiency Score */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Efficiency Score</span>
                    <span className="font-medium">{rec.efficiency}%</span>
                  </div>
                  <Progress value={rec.efficiency} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Setup time: {rec.timeToSetup}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRecommendToManager(rec.title)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Recommend
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
              { action: 'SMS sequence recommended for manager review', time: '2 hours ago', status: 'pending' },
              { action: 'New lead added to nurture sequence', time: '3 hours ago', status: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2">
                {activity.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : activity.status === 'pending' ? (
                  <Clock className="h-4 w-4 text-yellow-500" />
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
