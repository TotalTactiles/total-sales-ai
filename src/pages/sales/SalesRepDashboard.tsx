
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TopNavigation from '@/components/Navigation/TopNavigation';
import StatsCard from '@/components/Dashboard/StatsCard';
import { 
  Users, 
  Phone, 
  Target, 
  TrendingUp,
  Calendar,
  Brain,
  Activity,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { preloadSalesOSData, getCachedSession } from '@/utils/salesDataOptimizer';

interface SalesData {
  leads: any[];
  activityLogs: any[];
  metrics: any;
  notifications: any[];
}

const SalesRepDashboard = () => {
  const { profile, user } = useAuth();
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSalesData = async () => {
      if (!user?.id || !profile?.company_id) return;
      
      try {
        // Check cache first
        const cachedSession = getCachedSession();
        if (cachedSession && cachedSession.userId === user.id) {
          console.log('Using cached session data for faster load');
        }

        const data = await preloadSalesOSData(user.id, profile.company_id);
        setSalesData(data);
      } catch (error) {
        console.error('Failed to load sales data:', error);
        // Set empty data to prevent infinite loading
        setSalesData({
          leads: [],
          activityLogs: [],
          metrics: null,
          notifications: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadSalesData();
  }, [user?.id, profile?.company_id]);

  const mockStats = [
    {
      title: "Active Leads",
      value: salesData?.leads?.length || 23,
      change: "+5 this week",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-blue-600"
    },
    {
      title: "Calls Today",
      value: salesData?.activityLogs?.filter(log => 
        log.created_at && new Date(log.created_at).toDateString() === new Date().toDateString()
      )?.length || 12,
      change: "Target: 15",
      changeType: "neutral" as const,
      icon: Phone,
      iconColor: "text-green-600"
    },
    {
      title: "Conversion Rate",
      value: salesData?.metrics?.conversion_rate || "28%",
      change: "+3% this month",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-purple-600"
    },
    {
      title: "Revenue Goal",
      value: `$${((salesData?.metrics?.monthly_revenue || 45000) / 1000).toFixed(0)}k`,
      change: "67% of target",
      changeType: "positive" as const,
      icon: Target,
      iconColor: "text-orange-600"
    }
  ];

  const todaysKillList = [
    { name: "Acme Corp", priority: "high", value: "$25K", status: "pending" },
    { name: "TechStart Inc", priority: "medium", value: "$18K", status: "follow-up" },
    { name: "Global Solutions", priority: "high", value: "$35K", status: "demo" },
    { name: "Modern Co", priority: "low", value: "$12K", status: "qualified" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopNavigation />
      
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || 'Sales Rep'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Brain className="h-3 w-3 mr-1" />
              AI Coach Active
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
          {/* Today's Kill List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                Today's Kill List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysKillList.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        lead.priority === 'high' ? 'bg-red-500' :
                        lead.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{lead.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-green-600">{lead.value}</span>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
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
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">Best Time to Call</p>
                      <p className="text-xs text-purple-700 mt-1">TechStart Inc responds best around 2-4 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Trend Alert</p>
                      <p className="text-xs text-blue-700 mt-1">Enterprise deals are converting 40% faster this month</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Success Pattern</p>
                      <p className="text-xs text-green-700 mt-1">Your follow-up emails have 85% open rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Start Calling</h3>
              <p className="text-sm text-gray-600">Begin your call session</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Schedule Demo</h3>
              <p className="text-sm text-gray-600">Book meetings</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Log Activity</h3>
              <p className="text-sm text-gray-600">Update lead status</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">AI Coach</h3>
              <p className="text-sm text-gray-600">Get recommendations</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Message */}
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-green-600">✅ Sales OS Active</h2>
          <p className="text-gray-600 mt-2">All systems operational - TSAM Sales Rep OS loaded successfully</p>
          {salesData?.notifications && salesData.notifications.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {salesData.notifications.length} new notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
