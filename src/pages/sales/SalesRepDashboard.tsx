
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  Mail, 
  Users, 
  TrendingUp, 
  Target, 
  Clock, 
  DollarSign,
  Star,
  Brain,
  Mic
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import VoiceAIAssistant from '@/components/AI/VoiceAIAssistant';

interface SalesMetrics {
  callsToday: number;
  callsThisWeek: number;
  leadsConverted: number;
  revenue: number;
  quota: number;
  quotaProgress: number;
  nextCall: string;
  topLead: string;
}

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<SalesMetrics>({
    callsToday: 12,
    callsThisWeek: 47,
    leadsConverted: 8,
    revenue: 25000,
    quota: 50000,
    quotaProgress: 50,
    nextCall: '2:30 PM - John Smith',
    topLead: 'TechCorp Inc.'
  });
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    loadSalesMetrics();
  }, []);

  const loadSalesMetrics = async () => {
    // In production, this would fetch real metrics
    setMetrics({
      callsToday: Math.floor(Math.random() * 20) + 10,
      callsThisWeek: Math.floor(Math.random() * 50) + 40,
      leadsConverted: Math.floor(Math.random() * 10) + 5,
      revenue: Math.floor(Math.random() * 30000) + 20000,
      quota: 50000,
      quotaProgress: Math.floor(Math.random() * 40) + 40,
      nextCall: '2:30 PM - John Smith',
      topLead: 'TechCorp Inc.'
    });
  };

  const recentActivities = [
    { type: 'call', contact: 'Sarah Johnson', time: '10:30 AM', status: 'completed' },
    { type: 'email', contact: 'Mike Brown', time: '9:45 AM', status: 'sent' },
    { type: 'call', contact: 'Lisa Davis', time: '9:15 AM', status: 'missed' },
    { type: 'meeting', contact: 'TechCorp Inc.', time: '8:30 AM', status: 'scheduled' }
  ];

  const topLeads = [
    { name: 'TechCorp Inc.', score: 95, value: '$15,000', stage: 'Proposal' },
    { name: 'DataSoft LLC', score: 87, value: '$8,500', stage: 'Demo' },
    { name: 'CloudNet Systems', score: 82, value: '$12,000', stage: 'Discovery' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good morning, {profile?.full_name || 'Sales Rep'}!
          </h1>
          <p className="text-gray-600">Here's your sales performance today</p>
        </div>
        <VoiceAIAssistant 
          isActive={isVoiceActive}
          onToggle={setIsVoiceActive}
          context={{ workspace: 'dashboard' }}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.callsToday}</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Week Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.callsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Calls this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.leadsConverted}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Month to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Quota Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Quota Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>${metrics.revenue.toLocaleString()} / ${metrics.quota.toLocaleString()}</span>
            </div>
            <Progress value={metrics.quotaProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {metrics.quotaProgress}% complete • ${(metrics.quota - metrics.revenue).toLocaleString()} remaining
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top Priority Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground">{lead.stage} • {lead.value}</p>
                  </div>
                  <Badge 
                    className={`${
                      lead.score >= 90 ? 'bg-green-100 text-green-800' :
                      lead.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {lead.score}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'sent' ? 'bg-blue-500' :
                    activity.status === 'missed' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.contact}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type} • {activity.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Start Calling Session
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Follow-up Email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Update Lead Status
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Call Script
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesRepDashboard;
