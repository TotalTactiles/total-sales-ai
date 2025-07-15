
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare, 
  Download, 
  Settings,
  FileText,
  BarChart3,
  Calendar,
  Brain,
  Target,
  DollarSign,
  Clock,
  Activity,
  Zap,
  Filter,
  Plus,
  Eye,
  PieChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StatCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  isDefault: boolean;
}

interface CustomReport {
  id: string;
  name: string;
  summary: string;
  conditions: string;
  goal: string;
  createdAt: string;
  autoRun?: string;
}

interface AIReport {
  id: string;
  title: string;
  category: string;
  data: any;
  summary: string;
  optimization: string;
  timestamp: string;
}

const Reports: React.FC = () => {
  const { user, profile } = useAuth();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [aiReports, setAIReports] = useState<AIReport[]>([]);
  const [activeAITab, setActiveAITab] = useState('ai-enhanced');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<string | null>(null);

  // Default stat cards data
  const defaultStatCards: StatCard[] = [
    {
      id: 'total-leads',
      title: 'Total Leads',
      value: '1,247',
      subtitle: '+12% from last month',
      icon: Users,
      color: 'text-blue-600',
      isDefault: true
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: '23.4%',
      subtitle: '+2.4% from last month',
      icon: TrendingUp,
      color: 'text-green-600',
      isDefault: true
    },
    {
      id: 'avg-deal-size',
      title: 'Average Deal Size',
      value: '$45,600',
      subtitle: '+8.2% from last month',
      icon: DollarSign,
      color: 'text-purple-600',
      isDefault: true
    },
    {
      id: 'calls-made',
      title: 'Calls Made',
      value: '2,891',
      subtitle: 'This Month',
      icon: Phone,
      color: 'text-orange-600',
      isDefault: true
    },
    {
      id: 'emails-sent',
      title: 'Emails Sent',
      value: '5,647',
      subtitle: 'This Month',
      icon: Mail,
      color: 'text-indigo-600',
      isDefault: true
    },
    {
      id: 'sms-sent',
      title: 'SMS Sent',
      value: '1,203',
      subtitle: 'This Month',
      icon: MessageSquare,
      color: 'text-pink-600',
      isDefault: true
    }
  ];

  // Additional stat cards for customization
  const additionalStatCards: StatCard[] = [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: '$2,346,249',
      subtitle: '+15% from last month',
      icon: DollarSign,
      color: 'text-emerald-600',
      isDefault: false
    },
    {
      id: 'avg-response-time',
      title: 'Avg. Response Time',
      value: '2.4 hours',
      subtitle: '-0.6 hours from last month',
      icon: Clock,
      color: 'text-yellow-600',
      isDefault: false
    },
    {
      id: 'lead-source-breakdown',
      title: 'Lead Source Breakdown',
      value: '8 sources',
      subtitle: 'Website: 45%, LinkedIn: 23%',
      icon: PieChart,
      color: 'text-cyan-600',
      isDefault: false
    },
    {
      id: 'deals-closed-month',
      title: 'Deals Closed This Month',
      value: '127',
      subtitle: '+18% from last month',
      icon: Target,
      color: 'text-red-600',
      isDefault: false
    },
    {
      id: 'followups-pending',
      title: 'Follow-ups Pending',
      value: '43',
      subtitle: '12 overdue',
      icon: Calendar,
      color: 'text-amber-600',
      isDefault: false
    },
    {
      id: 'ai-workflow-conversions',
      title: 'AI Workflow Conversions',
      value: '89%',
      subtitle: '+5% from last month',
      icon: Brain,
      color: 'text-violet-600',
      isDefault: false
    },
    {
      id: 'rep-activity-score',
      title: 'Rep Activity Score',
      value: '8.7/10',
      subtitle: 'Team average',
      icon: Activity,
      color: 'text-teal-600',
      isDefault: false
    },
    {
      id: 'campaign-roi',
      title: 'Campaign ROI',
      value: '340%',
      subtitle: '+23% from last month',
      icon: Zap,
      color: 'text-lime-600',
      isDefault: false
    }
  ];

  const allStatCards = [...defaultStatCards, ...additionalStatCards];

  useEffect(() => {
    // Initialize with default cards
    setSelectedCards(defaultStatCards.map(card => card.id));
    loadCustomReports();
    loadAIReports();
  }, []);

  const loadCustomReports = async () => {
    // Mock data for custom reports
    const mockReports: CustomReport[] = [
      {
        id: '1',
        name: 'Q4 Performance Analysis',
        summary: 'Comprehensive Q4 performance metrics',
        conditions: 'Date: Q4 2024, Status: All',
        goal: 'Identify top performing campaigns and areas for improvement',
        createdAt: '2024-01-15T10:00:00Z',
        autoRun: 'weekly'
      },
      {
        id: '2',
        name: 'Lead Source Effectiveness',
        summary: 'Analysis of lead source conversion rates',
        conditions: 'Source: All, Period: Last 30 days',
        goal: 'Determine which lead sources provide highest ROI',
        createdAt: '2024-01-14T14:30:00Z'
      }
    ];
    setCustomReports(mockReports);
  };

  const loadAIReports = async () => {
    // Mock data for AI reports
    const mockAIReports: AIReport[] = [
      {
        id: '1',
        title: 'Full Funnel Breakdown',
        category: 'ai-enhanced',
        data: { conversionRate: 23.4, dropOffPoints: ['Initial Contact', 'Proposal'] },
        summary: 'Your funnel shows strong initial engagement but drops significantly at proposal stage.',
        optimization: 'Consider improving proposal templates and follow-up timing.',
        timestamp: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Lead Quality Assessment',
        category: 'leads',
        data: { qualifiedLeads: 456, totalLeads: 1247 },
        summary: 'Lead quality has improved 15% this month with better targeting.',
        optimization: 'Focus on enterprise leads which show 2x higher conversion rates.',
        timestamp: '2024-01-15T09:30:00Z'
      },
      {
        id: '3',
        title: 'Sales Performance Trends',
        category: 'sales',
        data: { revenue: 2346249, deals: 127 },
        summary: 'Sales team is 18% ahead of monthly target with strong Q4 performance.',
        optimization: 'Maintain current momentum while focusing on larger deal sizes.',
        timestamp: '2024-01-15T09:00:00Z'
      }
    ];
    setAIReports(mockAIReports);
  };

  const handleCardToggle = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSaveCustomization = async () => {
    try {
      // Save user preferences to database
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          preference_type: 'reports_stat_cards',
          preferences: { selectedCards }
        });

      setShowCustomizeModal(false);
      toast.success('Card preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  const handleExportAll = async () => {
    try {
      const visibleCards = allStatCards.filter(card => selectedCards.includes(card.id));
      const exportData = {
        cards: visibleCards.map(card => ({
          title: card.title,
          value: card.value,
          timestamp: new Date().toISOString()
        })),
        companyName: profile?.company_id || 'Company',
        exportDate: new Date().toISOString()
      };

      // Log export to Company Brain
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'report_export',
          event_summary: 'Manager exported stat cards report',
          payload: exportData,
          company_id: profile?.company_id
        });

      // Trigger PDF generation (mock)
      const filename = `Manager_Report_Export_${profile?.company_id || 'Company'}_${new Date().toISOString().split('T')[0]}.pdf`;
      toast.success(`Report exported: ${filename}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const handleGenerateQuickReport = async (reportType: string) => {
    setIsGeneratingReport(reportType);
    try {
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const filename = `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      toast.success(`Report generated: ${filename}`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(null);
    }
  };

  const handleCreateCustomReport = async (reportData: Omit<CustomReport, 'id' | 'createdAt'>) => {
    try {
      const newReport: CustomReport = {
        ...reportData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      setCustomReports(prev => [...prev, newReport]);
      
      // Save to Company Brain
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'custom_report_created',
          event_summary: `Custom report created: ${reportData.name}`,
          payload: newReport,
          company_id: profile?.company_id
        });

      setShowCustomReportModal(false);
      toast.success('Custom report created successfully');
    } catch (error) {
      console.error('Error creating custom report:', error);
      toast.error('Failed to create custom report');
    }
  };

  const getVisibleCards = () => {
    return allStatCards.filter(card => selectedCards.includes(card.id));
  };

  const getAIReportsByCategory = (category: string) => {
    return aiReports.filter(report => report.category === category);
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
            <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customize Stat Cards</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {allStatCards.map((card) => (
                    <div key={card.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={card.id}
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={() => handleCardToggle(card.id)}
                      />
                      <Label htmlFor={card.id} className="flex items-center gap-2 cursor-pointer">
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                        {card.title}
                        {card.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCustomizeModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCustomization}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getVisibleCards().map((card) => {
            const IconComponent = card.icon;
            return (
              <Card key={card.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Performance Report', icon: BarChart3 },
                { title: 'Team Activity Report', icon: Activity },
                { title: 'Weekly Summary', icon: Calendar }
              ].map((report) => (
                <Button
                  key={report.title}
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => handleGenerateQuickReport(report.title)}
                  disabled={isGeneratingReport === report.title}
                >
                  <report.icon className="h-4 w-4 mr-2" />
                  {isGeneratingReport === report.title ? 'Generating...' : report.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Custom Reports</CardTitle>
              <Dialog open={showCustomReportModal} onOpenChange={setShowCustomReportModal}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Custom Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Custom Report</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleCreateCustomReport({
                      name: formData.get('name') as string,
                      summary: formData.get('summary') as string,
                      conditions: formData.get('conditions') as string,
                      goal: formData.get('goal') as string,
                      autoRun: formData.get('autoRun') as string
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Report Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="summary">Quick Summary</Label>
                        <Input id="summary" name="summary" required />
                      </div>
                      <div>
                        <Label htmlFor="conditions">Data Conditions</Label>
                        <Textarea id="conditions" name="conditions" required />
                      </div>
                      <div>
                        <Label htmlFor="goal">Goal/Question</Label>
                        <Textarea id="goal" name="goal" required />
                      </div>
                      <div>
                        <Label htmlFor="autoRun">Auto-run Schedule</Label>
                        <Select name="autoRun">
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button type="button" variant="outline" onClick={() => setShowCustomReportModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Report</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.summary}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(report.createdAt).toLocaleDateString()}
                      {report.autoRun && ` • Auto-run: ${report.autoRun}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI-Powered Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle>AI-Powered Reports</CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                AI Enhanced
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeAITab} onValueChange={setActiveAITab}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="ai-enhanced">AI-Enhanced</TabsTrigger>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              {['ai-enhanced', 'leads', 'sales', 'marketing', 'team', 'automation', 'performance'].map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {getAIReportsByCategory(category).length > 0 ? (
                    getAIReportsByCategory(category).map((report) => (
                      <div key={report.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{report.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.summary}</p>
                        {report.optimization && (
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-blue-800">
                              <strong>Optimization:</strong> {report.optimization}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No AI reports available for this category yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Reports will appear here as data is processed and analyzed.
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
