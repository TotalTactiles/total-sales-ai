
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Users,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const PerformanceOverview: React.FC = () => {
  // Mock performance data - in a real app this would come from props or API
  const performanceData = {
    totalRevenue: 125000,
    revenueGrowth: 12.5,
    conversionRate: 23.4,
    conversionChange: 5.2,
    activeLeads: 47,
    leadsChange: 8,
    callsMade: 89,
    emailsSent: 156,
    meetingsScheduled: 12
  };

  return (
    <div className="space-y-6">
      {/* Revenue & Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${performanceData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+{performanceData.revenueGrowth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.conversionRate}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+{performanceData.conversionChange}% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Active Leads</p>
                <p className="text-2xl font-bold">{performanceData.activeLeads}</p>
                <Badge variant="outline" className="text-xs">
                  +{performanceData.leadsChange} this week
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Calls Made</p>
                <p className="text-2xl font-bold">{performanceData.callsMade}</p>
                <Badge variant="outline" className="text-xs">This week</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Emails Sent</p>
                <p className="text-2xl font-bold">{performanceData.emailsSent}</p>
                <Badge variant="outline" className="text-xs">This week</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Meetings</p>
                <p className="text-2xl font-bold">{performanceData.meetingsScheduled}</p>
                <Badge variant="outline" className="text-xs">Scheduled</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lead Response Time</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">2.3 hours</span>
                <TrendingDown className="h-3 w-3 text-green-500" />
                <Badge variant="outline" className="text-xs text-green-600">
                  Improved
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Call Success Rate</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">67%</span>
                <TrendingUp className="h-3 w-3 text-green-500" />
                <Badge variant="outline" className="text-xs text-green-600">
                  +5%
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Open Rate</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">34%</span>
                <TrendingUp className="h-3 w-3 text-green-500" />
                <Badge variant="outline" className="text-xs text-green-600">
                  +2%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOverview;
