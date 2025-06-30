
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
import { preloadSalesOSData } from '@/utils/salesDataOptimizer';

const SalesRepDashboard = () => {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user && profile) {
        try {
          const data = await preloadSalesOSData(user.id, profile.company_id || user.id);
          setDashboardData(data);
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
        }
      }
      // Always set loading to false after a short delay to show loading state
      setTimeout(() => setLoading(false), 500);
    };

    loadDashboardData();
  }, [user, profile]);

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

  const recentLeads = [
    { name: "Acme Corp", contact: "John Smith", status: "hot", value: "$12K", lastContact: "2 hours ago" },
    { name: "TechStart Inc", contact: "Sarah Jones", status: "warm", value: "$8K", lastContact: "1 day ago" },
    { name: "Global Solutions", contact: "Mike Chen", status: "cold", value: "$15K", lastContact: "3 days ago" },
    { name: "Innovation Labs", contact: "Lisa Brown", status: "hot", value: "$20K", lastContact: "4 hours ago" },
  ];

  const aiInsights = [
    {
      type: "opportunity",
      title: "Follow-up Opportunity",
      message: "3 leads haven't been contacted in 48+ hours",
      priority: "high"
    },
    {
      type: "performance",
      title: "Call Performance",
      message: "Your conversion rate increased by 12% this week!",
      priority: "low"
    },
    {
      type: "strategy",
      title: "Best Time to Call",
      message: "Tuesday 2-4 PM shows highest connection rates",
      priority: "medium"
    }
  ];

  if (loading) {
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.contact}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{lead.value}</p>
                    <p className="text-sm text-gray-600">{lead.lastContact}</p>
                  </div>
                  <Badge variant={lead.status === 'hot' ? 'default' : lead.status === 'warm' ? 'secondary' : 'outline'}>
                    {lead.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  insight.priority === 'high' ? 'bg-red-50 border-red-200' :
                  insight.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      insight.priority === 'high' ? 'bg-red-500' :
                      insight.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Start Dialing</h3>
            <p className="text-sm text-gray-600">Begin your call session</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Manage Leads</h3>
            <p className="text-sm text-gray-600">Update lead status</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Schedule Follow-up</h3>
            <p className="text-sm text-gray-600">Book meetings</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600">Track performance</p>
          </CardContent>
        </Card>
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
