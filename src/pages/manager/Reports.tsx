
import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, BarChart3, PieChart, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerReports = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore comprehensive reporting and analytics capabilities.');
  };

  // Mock reports data
  const mockReportsData = {
    executiveSummary: {
      totalRevenue: 2847500,
      revenueGrowth: 23.4,
      teamSize: 8,
      avgDealSize: 54250,
      conversionRate: 28.5,
      pipelineValue: 3850000,
      forecastAccuracy: 89.2
    },
    teamPerformance: [
      {
        rep: 'Sarah Johnson',
        revenue: 645000,
        quota: 500000,
        attainment: 129,
        deals: 23,
        activities: 342,
        efficiency: 'High'
      },
      {
        rep: 'Michael Chen',
        revenue: 423000,
        quota: 450000,
        attainment: 94,
        deals: 18,
        activities: 289,
        efficiency: 'Medium'
      },
      {
        rep: 'Jennifer Park',
        revenue: 487000,
        quota: 400000,
        attainment: 122,
        deals: 19,
        activities: 356,
        efficiency: 'High'
      },
      {
        rep: 'David Rodriguez',
        revenue: 198000,
        quota: 300000,
        attainment: 66,
        deals: 8,
        activities: 156,
        efficiency: 'Low'
      }
    ],
    revenueBySegment: [
      { segment: 'Enterprise', revenue: 1520000, percentage: 53.4, deals: 12 },
      { segment: 'Mid-Market', revenue: 897000, percentage: 31.5, deals: 28 },
      { segment: 'SMB', revenue: 430500, percentage: 15.1, deals: 45 }
    ],
    leadSourceROI: [
      { source: 'LinkedIn', cost: 25000, revenue: 890000, roi: 3460, leads: 89 },
      { source: 'Referrals', cost: 8000, revenue: 567000, roi: 6987, leads: 34 },
      { source: 'Trade Shows', cost: 45000, revenue: 234000, roi: 420, leads: 23 },
      { source: 'Website', cost: 12000, revenue: 156000, roi: 1200, leads: 67 }
    ],
    monthlyTrends: [
      { month: 'Oct', revenue: 234000, deals: 8, activities: 445 },
      { month: 'Nov', revenue: 289000, deals: 12, activities: 567 },
      { month: 'Dec', revenue: 356000, deals: 15, activities: 623 },
      { month: 'Jan', revenue: 423000, deals: 18, activities: 678 },
      { month: 'Feb', revenue: 467000, deals: 21, activities: 712 },
      { month: 'Mar', revenue: 534000, deals: 24, activities: 789 }
    ],
    automatedReports: [
      {
        name: 'Weekly Team Performance',
        frequency: 'Weekly',
        recipients: ['manager@company.com', 'vp-sales@company.com'],
        lastSent: '2 days ago',
        status: 'active'
      },
      {
        name: 'Monthly Revenue Summary',
        frequency: 'Monthly',
        recipients: ['executives@company.com'],
        lastSent: '1 week ago',
        status: 'active'
      },
      {
        name: 'Pipeline Health Check',
        frequency: 'Bi-weekly',
        recipients: ['sales-team@company.com'],
        lastSent: '3 days ago',
        status: 'active'
      }
    ]
  };

  const handleGenerateReport = (reportType: string) => {
    toast.success(`${reportType} report generated successfully!`);
  };

  const handleExportData = (format: string) => {
    toast.success(`Data exported as ${format} format`);
  };

  const handleScheduleReport = () => {
    toast.success('Report scheduled successfully');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Advanced Reporting & Analytics" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Demo Mode Indicator */}
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Advanced Reporting & Business Intelligence System" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive business intelligence and performance reporting
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockReportsData.executiveSummary.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">
              +{mockReportsData.executiveSummary.revenueGrowth}% vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockReportsData.executiveSummary.avgDealSize.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Per closed deal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportsData.executiveSummary.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Lead to customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportsData.executiveSummary.forecastAccuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Prediction accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="team-performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="team-performance">Team Performance</TabsTrigger>
          <TabsTrigger value="revenue-analysis">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="lead-sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="automated">Automated Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="team-performance" className="space-y-6">
          {/* Team Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Performance Report</CardTitle>
              <CardDescription>Detailed breakdown of team member performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReportsData.teamPerformance.map((rep, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 p-4 border rounded-lg items-center">
                    <div>
                      <h4 className="font-semibold">{rep.rep}</h4>
                      <Badge variant={rep.efficiency === 'High' ? 'default' : 
                                     rep.efficiency === 'Medium' ? 'secondary' : 'outline'}>
                        {rep.efficiency}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">${rep.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{rep.attainment}%</div>
                      <div className="text-xs text-muted-foreground">Quota Attainment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{rep.deals}</div>
                      <div className="text-xs text-muted-foreground">Deals Closed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{rep.activities}</div>
                      <div className="text-xs text-muted-foreground">Activities</div>
                    </div>
                    <div className="text-center">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quota Attainment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportsData.teamPerformance.map((rep, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{rep.rep}</span>
                        <span>{rep.attainment}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            rep.attainment >= 100 ? 'bg-green-500' : 
                            rep.attainment >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(rep.attainment, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {mockReportsData.monthlyTrends.map((month, index) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-muted-foreground mb-2">
                        ${(month.revenue / 1000).toFixed(0)}k
                      </div>
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all"
                        style={{ 
                          height: `${(month.revenue / Math.max(...mockReportsData.monthlyTrends.map(t => t.revenue))) * 200}px` 
                        }}
                      />
                      <div className="text-xs mt-2">{month.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue-analysis" className="space-y-6">
          {/* Revenue by Segment */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Market Segment</CardTitle>
              <CardDescription>Breakdown of revenue contribution by customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReportsData.revenueBySegment.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{segment.segment}</h4>
                      <p className="text-sm text-muted-foreground">{segment.deals} deals closed</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${segment.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{segment.percentage}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trends and Forecasting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      ${mockReportsData.executiveSummary.pipelineValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Pipeline Value</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">$1.2M</div>
                      <div className="text-xs text-muted-foreground">Early Stage</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">$1.8M</div>
                      <div className="text-xs text-muted-foreground">Mid Stage</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">$850K</div>
                      <div className="text-xs text-muted-foreground">Late Stage</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Q1 Forecast</span>
                      <span className="font-semibold">$3.2M</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Confidence Level</span>
                      <span className="font-semibold text-green-600">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Case</span>
                      <span className="font-semibold text-blue-600">$3.8M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lead-sources" className="space-y-6">
          {/* Lead Source ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Source ROI Analysis</CardTitle>
              <CardDescription>Performance and return on investment by lead generation channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReportsData.leadSourceROI.map((source, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded-lg items-center">
                    <div>
                      <h4 className="font-semibold">{source.source}</h4>
                      <p className="text-sm text-muted-foreground">{source.leads} leads</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">${source.cost.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Investment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">${source.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{source.roi}%</div>
                      <div className="text-xs text-muted-foreground">ROI</div>
                    </div>
                    <div className="text-center">
                      <Badge variant={source.roi > 1000 ? 'default' : source.roi > 500 ? 'secondary' : 'outline'}>
                        {source.roi > 1000 ? 'Excellent' : source.roi > 500 ? 'Good' : 'Review'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Source Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Data-driven suggestions for lead generation optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">🎯 Top Performer</h4>
                  <p className="text-green-700 text-sm">Referrals show highest ROI (6,987%). Consider expanding referral program.</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Expand Program
                  </Button>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">⚡ Optimization Opportunity</h4>
                  <p className="text-yellow-700 text-sm">Trade shows have lowest ROI (420%). Consider reallocating budget.</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Review Budget
                  </Button>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">📈 Growth Potential</h4>
                  <p className="text-blue-700 text-sm">LinkedIn shows strong performance. Increase investment by 25%.</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Increase Investment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automated" className="space-y-6">
          {/* Automated Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report delivery and scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReportsData.automatedReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.frequency} • {report.recipients.length} recipients
                      </p>
                      <p className="text-xs text-muted-foreground">Last sent: {report.lastSent}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Report Generation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create custom reports on demand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleGenerateReport('Executive Summary')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Executive Summary
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleGenerateReport('Team Performance')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Team Performance
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleGenerateReport('Pipeline Analysis')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Pipeline Analysis
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleGenerateReport('Revenue Forecast')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Revenue Forecast
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Download data in various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('PDF')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('Excel')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('CSV')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button 
                  onClick={handleScheduleReport}
                  className="w-full justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerReports;
