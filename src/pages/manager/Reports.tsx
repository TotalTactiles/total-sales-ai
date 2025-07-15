
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  Download, 
  Filter,
  FileText,
  Calendar,
  BarChart3,
  Brain,
  AlertTriangle,
  Clock,
  DollarSign,
  Target,
  Zap,
  RefreshCw,
  BookOpen,
  PieChart,
  Activity,
  Settings
} from 'lucide-react';

const Reports = () => {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const reportData = {
    totalLeads: 1247,
    conversionRate: 23.4,
    avgDealSize: 45600,
    callsMade: 2891,
    emailsSent: 5647,
    smssSent: 1203
  };

  const aiReportButtons = [
    { id: 'funnel', title: 'Full Funnel Breakdown', icon: BarChart3, description: 'Complete pipeline analysis with conversion rates' },
    { id: 'objections', title: 'Objection & Drop-Off Heatmap', icon: AlertTriangle, description: 'Identify where deals are getting stuck' },
    { id: 'experiments', title: 'Experiment Outcome Tracker', icon: Target, description: 'A/B test results and performance metrics' },
    { id: 'lost-deals', title: 'Lost Deal Analysis', icon: TrendingUp, description: 'Why deals failed and prevention strategies' },
    { id: 'time-to-close', title: 'Time-to-Close Efficiency Report', icon: Clock, description: 'Deal velocity and optimization opportunities' },
    { id: 'lead-recycle', title: 'Lead Recycle Audit', icon: RefreshCw, description: 'Re-engagement opportunities analysis' },
    { id: 'ai-coach', title: 'AI Coach Impact Summary', icon: Brain, description: 'Performance improvements from AI coaching' },
    { id: 'outreach', title: 'Call & Outreach Effectiveness Report', icon: Phone, description: 'Channel performance and recommendations' },
    { id: 'deal-flow', title: 'Weekly Deal Flow Recap', icon: Activity, description: 'Pipeline movement and velocity trends' },
    { id: 'pipeline-hygiene', title: 'Pipeline Hygiene Report', icon: Settings, description: 'Data quality and cleanup recommendations' },
    { id: 'top-offers', title: 'Top Performing Offers by Segment', icon: PieChart, description: 'Product-market fit analysis' },
    { id: 'forecast', title: 'Forecast vs Actual (Variance Tracker)', icon: BarChart, description: 'Prediction accuracy and adjustments' },
    { id: 'deal-velocity', title: 'Deal Velocity vs Market Average', icon: Zap, description: 'Competitive benchmarking analysis' },
    { id: 'team-structure', title: 'Team Structure Efficiency Analysis', icon: Users, description: 'Organizational optimization insights' },
    { id: 'sales-market', title: 'Sales-Market Ops Sync Report', icon: BookOpen, description: 'Alignment between sales and marketing' },
    { id: 'attribution', title: 'Deal Attribution & Assist Tracking', icon: Target, description: 'Multi-touch attribution analysis' }
  ];

  const handleGenerateReport = async (reportId: string, title: string) => {
    setGeneratingReport(reportId);
    
    // Simulate AI report generation
    setTimeout(() => {
      setGeneratingReport(null);
      // In a real implementation, this would trigger the actual AI report generation
      console.log(`Generating AI report: ${title}`);
      
      // Mock success notification
      alert(`${title} has been generated successfully! It will be available for download shortly.`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track performance and optimize your sales process</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalLeads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.4%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${reportData.avgDealSize.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Calls Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{reportData.callsMade.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">This Month</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Emails Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{reportData.emailsSent.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">This Month</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{reportData.smssSent.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">This Month</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Reports & Custom Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Sales Performance Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Team Activity Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Weekly Summary
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-gray-400 mb-4">
                Create custom reports with specific metrics and date ranges.
              </p>
              <Button className="w-full bg-indigo-700 hover:bg-indigo-600">
                Create Custom Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Reports Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <CardTitle>Generate AI-Powered Reports</CardTitle>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  AI Enhanced
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Instantly generate detailed analytics with AI insights
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {aiReportButtons.map((report) => {
                const IconComponent = report.icon;
                const isGenerating = generatingReport === report.id;
                
                return (
                  <Button
                    key={report.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                    onClick={() => handleGenerateReport(report.id, report.title)}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''} text-purple-600`} />
                      <span className="font-medium text-sm">{report.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                    {isGenerating && (
                      <Badge variant="secondary" className="text-xs">
                        Generating...
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">AI Report Features</h4>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• PDF-exportable with professional formatting</li>
                    <li>• Interactive graphs with toggle views</li>
                    <li>• 2-3 sentence insight summaries per chart</li>
                    <li>• Presentation-ready for stakeholder reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: 'Website', leads: 456, conversion: 28.5 },
                { source: 'LinkedIn', leads: 234, conversion: 31.2 },
                { source: 'Referrals', leads: 189, conversion: 45.6 },
                { source: 'Cold Outreach', leads: 368, conversion: 15.3 }
              ].map((item) => (
                <div key={item.source} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.source}</div>
                    <div className="text-sm text-muted-foreground">{item.leads} leads</div>
                  </div>
                  <Badge variant={item.conversion > 30 ? "default" : "secondary"}>
                    {item.conversion}% conversion
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
