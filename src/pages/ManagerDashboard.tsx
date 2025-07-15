
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, TrendingUp, DollarSign, Target, Clock, AlertTriangle } from 'lucide-react';

const ManagerDashboard = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role !== 'manager' && profile?.role !== 'developer') {
    return <Navigate to="/" replace />;
  }

  const stats = [
    { title: 'Total Revenue', value: '$847K', change: '+12%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Deals', value: '127', change: '+8%', icon: Target, color: 'text-blue-600' },
    { title: 'Team Performance', value: '89%', change: '+5%', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Lead Conversion', value: '24%', change: '+3%', icon: Users, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { action: 'Sarah closed deal with TechCorp', time: '2 hours ago', type: 'success' },
    { action: 'Michael needs coaching on objection handling', time: '4 hours ago', type: 'warning' },
    { action: 'New lead assigned to Jennifer', time: '6 hours ago', type: 'info' },
    { action: 'Team meeting scheduled for tomorrow', time: '1 day ago', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Overview of your team's performance and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm">{activity.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Team Coaching</CardTitle>
            <CardDescription>Review and coach your team members</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Lead Management</CardTitle>
            <CardDescription>Manage leads and pipeline</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
            <CardDescription>View detailed analytics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
