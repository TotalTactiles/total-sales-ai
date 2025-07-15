
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  BarChart, 
  FileText, 
  Download, 
  Settings, 
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Target,
  Activity,
  Brain
} from 'lucide-react';

interface QuickStat {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  visible: boolean;
}

const Reports: React.FC = () => {
  const [quickStats, setQuickStats] = useState<QuickStat[]>([
    { id: '1', title: 'Total Revenue', value: '$124,580', change: '+12%', icon: TrendingUp, visible: true },
    { id: '2', title: 'New Leads', value: '47', change: '+8%', icon: Users, visible: true },
    { id: '3', title: 'Conversion Rate', value: '23.4%', change: '+2.1%', icon: Target, visible: true },
    { id: '4', title: 'Team Activity', value: '89%', change: '+5%', icon: Activity, visible: true },
    { id: '5', title: 'Pipeline Value', value: '$890K', change: '+15%', icon: BarChart, visible: false },
    { id: '6', title: 'Customer Satisfaction', value: '94%', change: '+3%', icon: Users, visible: false }
  ]);

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
  const [customReport, setCustomReport] = useState({
    name: '',
    summary: '',
    conditions: '',
    question: '',
    autoRun: false
  });

  const quickReports = [
    { name: 'Performance Report', description: 'Team and individual performance metrics' },
    { name: 'Team Activity Report', description: 'Daily activity and engagement summary' },
    { name: 'Weekly Summary', description: 'Comprehensive weekly business overview' }
  ];

  const aiReports = [
    { 
      category: 'Leads', 
      reports: [
        { name: 'Lead Quality Analysis', summary: 'AI analysis of lead sources and conversion patterns' },
        { name: 'Pipeline Optimization', summary: 'Recommendations for improving lead flow' }
      ]
    },
    { 
      category: 'Sales', 
      reports: [
        { name: 'Sales Performance Insights', summary: 'Individual and team sales performance with AI recommendations' },
        { name: 'Revenue Forecasting', summary: 'AI-powered revenue predictions and growth opportunities' }
      ]
    },
    { 
      category: 'Team', 
      reports: [
        { name: 'Team Productivity Analysis', summary: 'Comprehensive team efficiency and engagement metrics' },
        { name: 'Coaching Recommendations', summary: 'AI-generated coaching insights for each team member' }
      ]
    }
  ];

  const handleToggleStatVisibility = (statId: string) => {
    setQuickStats(prev => prev.map(stat => 
      stat.id === statId ? { ...stat, visible: !stat.visible } : stat
    ));
  };

  const handleExportAll = () => {
    // Generate PDF with all visible cards
    console.log('Exporting all visible cards as PDF');
  };

  const handleQuickReport = (reportName: string) => {
    // Generate quick report
    console.log('Generating quick report:', reportName);
  };

  const handleCreateCustomReport = () => {
    console.log('Creating custom report:', customReport);
    setIsCustomReportOpen(false);
    setCustomReport({ name: '', summary: '', conditions: '', question: '', autoRun: false });
  };

  const visibleStats = quickStats.filter(stat => stat.visible);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track performance and generate insights</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customize Dashboard Cards</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {quickStats.map((stat) => (
                    <div key={stat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <stat.icon className="h-4 w-4" />
                        <span>{stat.title}</span>
                      </div>
                      <Switch
                        checked={stat.visible}
                        onCheckedChange={() => handleToggleStatVisibility(stat.id)}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={() => setIsCustomizeOpen(false)} className="w-full">
                  Save Changes
                </Button>
              </DialogContent>
            </Dialog>
            <Button onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleStats.map((stat) => (
            <Card key={stat.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <stat.icon className="h-5 w-5" />
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <Badge className="bg-green-100 text-green-800">{stat.change}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickReports.map((report) => (
                <Button
                  key={report.name}
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => handleQuickReport(report.name)}
                >
                  <div>
                    <div className="font-medium mb-1">{report.name}</div>
                    <div className="text-sm text-muted-foreground">{report.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Custom Reports</CardTitle>
            <Dialog open={isCustomReportOpen} onOpenChange={setIsCustomReportOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Name</label>
                    <Input
                      value={customReport.name}
                      onChange={(e) => setCustomReport(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Monthly Sales Analysis"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Summary</label>
                    <Input
                      value={customReport.summary}
                      onChange={(e) => setCustomReport(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Brief description of the report"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data Conditions</label>
                    <Textarea
                      value={customReport.conditions}
                      onChange={(e) => setCustomReport(prev => ({ ...prev, conditions: e.target.value }))}
                      placeholder="Specify filters, date ranges, and data criteria..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Key Question</label>
                    <Input
                      value={customReport.question}
                      onChange={(e) => setCustomReport(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="What specific question should this report answer?"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto-run Weekly</label>
                    <Switch
                      checked={customReport.autoRun}
                      onCheckedChange={(checked) => setCustomReport(prev => ({ ...prev, autoRun: checked }))}
                    />
                  </div>
                  <Button onClick={handleCreateCustomReport} className="w-full">
                    Create Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No custom reports created yet</p>
              <p className="text-sm">Create your first custom report to get started</p>
            </div>
          </CardContent>
        </Card>

        {/* AI-Powered Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Powered Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {aiReports.map((category) => (
                <div key={category.category}>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    {category.category === 'Leads' && <Users className="h-4 w-4" />}
                    {category.category === 'Sales' && <TrendingUp className="h-4 w-4" />}
                    {category.category === 'Team' && <Activity className="h-4 w-4" />}
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.reports.map((report) => (
                      <Card key={report.name} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{report.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{report.summary}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
