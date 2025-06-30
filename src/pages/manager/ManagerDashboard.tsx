
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TopNavigation from '@/components/Navigation/TopNavigation';
import StatsCard from '@/components/Dashboard/StatsCard';
import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign,
  Phone,
  Calendar,
  Award,
  AlertCircle,
  Activity,
  Brain,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ManagerDashboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const mockStats = [
    {
      title: "Team Performance",
      value: "94%",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-blue-600"
    },
    {
      title: "Revenue This Month",
      value: "$284K",
      change: "+18% from target",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-green-600"
    },
    {
      title: "Active Leads",
      value: "1,247",
      change: "+156 this week",
      changeType: "positive" as const,
      icon: Target,
      iconColor: "text-orange-600"
    },
    {
      title: "Conversion Rate",
      value: "32%",
      change: "+5% improvement",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-purple-600"
    }
  ];

  const teamMembers = [
    { name: "Sarah Johnson", role: "Senior Sales Rep", deals: 23, revenue: "$89K", status: "active" },
    { name: "Mike Chen", role: "Sales Rep", deals: 18, revenue: "$67K", status: "active" },
    { name: "Lisa Rodriguez", role: "Junior Sales Rep", deals: 12, revenue: "$34K", status: "training" },
    { name: "David Kim", role: "Sales Rep", deals: 20, revenue: "$78K", status: "active" },
  ];

  const insights = [
    {
      type: "success",
      title: "Team Exceeding Targets",
      message: "Your team is 18% above monthly targets",
      priority: "high"
    },
    {
      type: "opportunity",
      title: "New Lead Surge",
      message: "156 new leads this week - consider scaling calls",
      priority: "medium"
    },
    {
      type: "alert",
      title: "Follow-up Required",
      message: "12 high-value leads need immediate attention",
      priority: "high"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || 'Manager'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Team Performance: Excellent
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
          {/* Team Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{member.revenue}</p>
                      <p className="text-sm text-gray-600">{member.deals} deals</p>
                    </div>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
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
                Manager Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    insight.priority === 'high' && insight.type === 'alert' ? 'bg-red-50 border-red-200' :
                    insight.priority === 'high' && insight.type === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        insight.type === 'alert' ? 'bg-red-500' :
                        insight.type === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Schedule Team Meeting</h3>
              <p className="text-sm text-gray-600">Plan your next team sync</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Review Performance</h3>
              <p className="text-sm text-gray-600">Check team metrics</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Address Issues</h3>
              <p className="text-sm text-gray-600">Handle urgent matters</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Message */}
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-blue-600">🎯 Manager OS Active</h2>
          <p className="text-gray-600 mt-2">Your AI-powered management dashboard is optimizing team performance</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
