
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/Dashboard/StatsCard';
import { 
  Target, 
  Phone, 
  TrendingUp, 
  DollarSign,
  Clock,
  Users,
  Brain,
  Activity,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoData } from '@/contexts/DemoDataContext';
import { preloadSalesOSData } from '@/utils/salesDataOptimizer';

const SalesRepDashboard = () => {
  const { profile, user } = useAuth();
  const { salesRepDashboardData } = useDemoData();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user && profile) {
        try {
          // Use consistent demo data for all Sales Rep instances
          setDashboardData(salesRepDashboardData);
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
          // Fallback to demo data
          setDashboardData(salesRepDashboardData);
        }
      }
      // Always set loading to false after a short delay to show loading state
      setTimeout(() => setLoading(false), 300);
    };

    loadDashboardData();
  }, [user, profile, salesRepDashboardData]);

  const mockStats = [
    {
      title: "Active Leads",
      value: "47",
      change: "+12 this week",
      changeType: "positive" as const,
      icon: Target,
      iconColor: "text-blue-600"
    },
    {
      title: "Calls Today",
      value: "23",
      change: "8 connected",
      changeType: "positive" as const,
      icon: Phone,
      iconColor: "text-green-600"
    },
    {
      title: "Revenue Pipeline",
      value: "$89K",
      change: "+15% this month",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-purple-600"
    },
    {
      title: "Conversion Rate",
      value: "34%",
      change: "+5% improvement",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-orange-600"
    }
  ];

  if (loading || !dashboardData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || 'Sales Rep'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            AI Assistant Active
          </Badge>
        </div>
      </div>

      {/* AI Daily Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2">🤖</span>AI Daily Summary
          </h3>
          <span className="text-blue-200 text-sm">⚡ Live</span>
        </div>
        <p className="text-blue-100 mb-3">
          {dashboardData.aiSummary}
        </p>
        <button className="text-blue-200 hover:text-white text-sm transition-colors">
          Read more ▼
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Smart Suggested Schedule Panel */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📅</span>Suggested Schedule
          </h3>
          <span className="text-blue-600 text-sm font-medium">2h 15m total</span>
        </div>
        
        <div className="space-y-3">
          {dashboardData.suggestedSchedule.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center">
                <span className={`mr-3 text-${item.color}-600`}>🕘 {item.time}</span>
                <div>
                  <span className="font-medium text-gray-900">{item.activity}</span>
                  <div className="flex items-center mt-1">
                    <span className={`w-2 h-2 bg-${item.color}-500 rounded-full mr-2`}></span>
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </div>
                </div>
              </div>
              <span className="text-gray-500 text-sm">{item.duration}</span>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-blue-600 mt-3 flex items-center">
          <span className="mr-1">💡</span>
          Suggested based on your activity patterns and optimal contact times
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Pipeline Pulse */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="mr-2">🔄</span>Pipeline Pulse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">
                    <th className="pb-3">Lead</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {dashboardData.pipelineData.map((lead, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 bg-${lead.color}-100 rounded-full flex items-center justify-center mr-3`}>
                            <span className={`text-${lead.color}-600 font-medium text-sm`}>{lead.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lead.company}</p>
                            <p className="text-sm text-gray-500">{lead.contact}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 bg-${lead.status === 'qualified' ? 'green' : lead.status === 'proposal' ? 'blue' : lead.status === 'negotiation' ? 'purple' : 'yellow'}-100 text-${lead.status === 'qualified' ? 'green' : lead.status === 'proposal' ? 'blue' : lead.status === 'negotiation' ? 'purple' : 'yellow'}-700 rounded-full text-xs`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`w-3 h-3 bg-${lead.priority === 'high' ? 'red' : lead.priority === 'medium' ? 'yellow' : 'green'}-500 rounded-full inline-block`}></span>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-gray-900">{lead.value}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded">📞</button>
                          <button className="p-1 hover:bg-gray-100 rounded">📧</button>
                          <button className="p-1 hover:bg-gray-100 rounded">📅</button>
                          <button className="p-1 hover:bg-gray-100 rounded">📋</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced AI Assistant Performance Hub */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="mr-2">🤖</span>AI Assistant Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span className="text-gray-600">Emails Drafted</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{dashboardData.aiAssistant.emailsDrafted}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span className="text-gray-600">Calls Scheduled</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{dashboardData.aiAssistant.callsScheduled}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">📋</span>
                  <span className="text-gray-600">Proposals Generated</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{dashboardData.aiAssistant.proposalsGenerated}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Performance Improvement</span>
                  <span className="text-green-600 font-semibold">+{dashboardData.aiAssistant.performanceImprovement}% ↗</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Compared to previous period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Action Items Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">⚡</span>Suggested Tasks
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm">View All</button>
        </div>
        
        <div className="space-y-3">
          {dashboardData.priorityTasks.map((task, index) => (
            <div key={index} className={`flex items-center justify-between p-4 border-l-4 border-${task.priority === 'high' ? 'red' : 'yellow'}-500 bg-${task.priority === 'high' ? 'red' : 'yellow'}-50 rounded-r-lg`}>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="mr-2">{task.type === 'call' ? '📞' : '📧'}</span>
                  <span className="font-medium text-gray-900">{task.title}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className={`px-2 py-1 bg-${task.priority === 'high' ? 'red' : 'yellow'}-100 text-${task.priority === 'high' ? 'red' : 'yellow'}-700 rounded text-xs mr-2`}>
                    {task.priority} priority
                  </span>
                  <span>Suggested: {task.suggestedTime}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              </div>
              <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Start
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-blue-600">🎯 Sales Rep OS Active</h2>
        <p className="text-gray-600 mt-2">Your AI-powered sales dashboard is ready to accelerate your performance</p>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
