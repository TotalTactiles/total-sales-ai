
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Zap,
  Download,
  Send,
  FileText,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const AutomationAnalytics = () => {
  const handleExportPDF = () => {
    toast.success('Exporting PDF report...');
    // Simulate PDF generation
    setTimeout(() => {
      toast.success('PDF report downloaded successfully');
    }, 2000);
  };

  const handleExportExcel = () => {
    toast.success('Exporting Excel data...');
    // Simulate Excel generation
    setTimeout(() => {
      toast.success('Excel file downloaded successfully');
    }, 2000);
  };

  const handleSendToManager = () => {
    toast.success('Analytics report sent to manager');
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47.3h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Processed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automation Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Email Follow-up', performance: 85, trend: '+5%' },
              { name: 'Demo Scheduling', performance: 92, trend: '+12%' },
              { name: 'Lead Scoring', performance: 78, trend: '-2%' },
              { name: 'SMS Outreach', performance: 65, trend: '+8%' }
            ].map((automation, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{automation.name}</p>
                  <p className="text-sm text-gray-500">{automation.performance}% success rate</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={automation.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}
                >
                  {automation.trend}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Email automations sent</span>
                <span className="font-medium">2,847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Calls scheduled</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>SMS messages sent</span>
                <span className="font-medium">892</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Leads processed</span>
                <span className="font-medium">1,234</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Export Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Download detailed performance reports and usage analytics
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleExportPDF} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button variant="outline" onClick={handleExportExcel} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Excel Data
            </Button>
            <Button variant="outline" onClick={handleSendToManager} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send to Manager
            </Button>
          </div>

          {/* Additional Analytics Options */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Advanced Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium">Performance Metrics</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Response rate trends</li>
                  <li>• Conversion analytics</li>
                  <li>• Time-based performance</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Usage Statistics</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Automation deployment frequency</li>
                  <li>• Lead processing volume</li>
                  <li>• Time savings calculations</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationAnalytics;
