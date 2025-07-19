
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Target,
  DollarSign,
  BarChart3
} from 'lucide-react';

const ManagerReports: React.FC = () => {
  const reports = [
    {
      id: '1',
      title: 'Monthly Sales Performance',
      description: 'Comprehensive sales metrics and team performance analysis',
      type: 'Sales',
      lastGenerated: '2 hours ago',
      status: 'Ready'
    },
    {
      id: '2',
      title: 'Lead Conversion Analysis',
      description: 'Lead funnel performance and conversion optimization insights',
      type: 'Marketing',
      lastGenerated: '1 day ago',
      status: 'Ready'
    },
    {
      id: '3',
      title: 'Team Productivity Report',
      description: 'Individual and team productivity metrics with recommendations',
      type: 'HR',
      lastGenerated: '3 days ago',
      status: 'Ready'
    },
    {
      id: '4',
      title: 'Revenue Forecast',
      description: 'Quarterly revenue projections and growth analysis',
      type: 'Finance',
      lastGenerated: 'Generating...',
      status: 'Processing'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and manage business reports</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$547,890</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.6%</div>
            <p className="text-xs text-muted-foreground">+2.3% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">284 hot leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Last generated: {report.lastGenerated}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {report.status === 'Ready' ? (
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                  )}
                  
                  {report.status === 'Ready' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Sales Performance</h4>
              </div>
              <p className="text-sm text-gray-600">Weekly and monthly sales metrics</p>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Team Analytics</h4>
              </div>
              <p className="text-sm text-gray-600">Individual and team performance insights</p>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Lead Analysis</h4>
              </div>
              <p className="text-sm text-gray-600">Lead funnel and conversion tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerReports;
