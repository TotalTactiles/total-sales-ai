
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Target, Phone, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <p className="text-gray-600">Performance insights and metrics</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <BarChart3 className="h-3 w-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">$125,430</p>
                <p className="text-xs text-green-600">+12% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Deals Closed</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-blue-600">+8% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-purple-600">+15% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calls Made</p>
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-orange-600">+5% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Revenue chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Leads</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-sm font-medium">156</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Qualified</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-sm font-medium">117</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Proposals</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: '50%'}}></div>
                  </div>
                  <span className="text-sm font-medium">78</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Closed Won</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <span className="text-sm font-medium">24</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Deal closed with TechCorp Solutions</p>
                <p className="text-sm text-gray-600">$45,000 • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">15 calls completed</p>
                <p className="text-sm text-gray-600">Connect rate: 78% • Today</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">12 new leads added</p>
                <p className="text-sm text-gray-600">From LinkedIn campaign • Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
