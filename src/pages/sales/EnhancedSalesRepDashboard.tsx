import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Cart, CheckCircle, CreditCard, LineChart, Mail, MessageSquare, Shield, User, Zap, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner';
import { useMockData } from '@/hooks/useMockData';

const EnhancedSalesRepDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { leads } = useMockData();

  const [performanceMetrics, setPerformanceMetrics] = useState({
    leadsGenerated: 125,
    dealsClosed: 32,
    conversionRate: 26,
    averageDealSize: 15000,
    revenueGenerated: 480000,
  });

  const [activityOverview, setActivityOverview] = useState([
    { type: 'email', description: 'Sent proposal to Acme Corp', time: '2 hours ago' },
    { type: 'call', description: 'Followed up with John Doe', time: '4 hours ago' },
    { type: 'meeting', description: 'Scheduled demo with Beta Inc', time: 'Yesterday' },
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    { task: 'Send follow-up email to potential client', due: 'Tomorrow' },
    { task: 'Prepare presentation for next week meeting', due: 'Next Week' },
  ]);

  const [recentLeads, setRecentLeads] = useState(leads.slice(0, 5));
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLeadClick = (leadId: string) => {
    navigate(`/sales/leads/${leadId}`);
  };

  const handleTaskComplete = (taskIndex: number) => {
    setUpcomingTasks(prevTasks => prevTasks.filter((_, index) => index !== taskIndex));
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div className="dashboard-content">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="responsive-text-2xl font-bold text-gray-900">Sales Rep Dashboard</h1>
          <p className="text-gray-600 mt-1 responsive-text-base">Track performance, manage leads, and automate tasks</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Account: {profile?.email || 'N/A'}
          </Badge>
          <Button onClick={handleLogout} size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="space-y-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-green-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-green-100">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{performanceMetrics.leadsGenerated}</div>
                <div className="text-sm text-gray-500">Leads Generated</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{performanceMetrics.dealsClosed}</div>
                <div className="text-sm text-gray-500">Deals Closed</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-yellow-100">
                <Cart className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{performanceMetrics.conversionRate}%</div>
                <div className="text-sm text-gray-500">Conversion Rate</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-purple-100">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${performanceMetrics.averageDealSize}</div>
                <div className="text-sm text-gray-500">Avg. Deal Size</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-red-100">
                <CalendarDays className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${performanceMetrics.revenueGenerated}</div>
                <div className="text-sm text-gray-500">Revenue Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Automation Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Automation Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setActiveModal('bulk_automation')}
              >
                <Mail className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Bulk Email Automation</div>
                  <div className="text-sm text-gray-500">Tag leads for automated sequences</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setActiveModal('sms_automation')}
              >
                <MessageSquare className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">SMS Follow-ups</div>
                  <div className="text-sm text-gray-500">Automated SMS sequences</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setActiveModal('ai_automation')}
              >
                <Bot className="h-6 w-6 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">AI Automations</div>
                  <div className="text-sm text-gray-500">Smart AI-driven workflows</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity and Upcoming Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activityOverview.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="rounded-full p-1.5 bg-gray-100">
                    {activity.type === 'email' && <Mail className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'call' && <Phone className="h-4 w-4 text-green-500" />}
                    {activity.type === 'meeting' && <CalendarDays className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{activity.description}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{task.task}</div>
                    <div className="text-xs text-gray-500">Due: {task.due}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleTaskComplete(index)}>
                    Complete
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.map(lead => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleLeadClick(lead.id)}
              >
                <div>
                  <div className="text-sm font-medium">{lead.name}</div>
                  <div className="text-xs text-gray-500">{lead.company}</div>
                </div>
                <Badge variant="secondary">{lead.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSalesRepDashboard;
