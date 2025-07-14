import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Brain,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Zap,
  Activity,
  Calendar,
  Settings,
  Phone,
  PieChart,
  RefreshCw
} from 'lucide-react';
import FunnelChart from '@/components/Manager/FunnelChart';
import AIFunnelInsights from '@/components/Manager/AIFunnelInsights';
import RetentionIntelligencePanel from '@/components/Manager/RetentionIntelligencePanel';
import ProcessInReview from '@/components/Manager/ProcessInReview';
import BusinessOpsCardModal from '@/components/Manager/BusinessOpsCardModal';
import ProcessInReviewActions from '@/components/Manager/ProcessInReviewActions';
import RetentionActions from '@/components/Manager/RetentionActions';
import { toast } from 'sonner';

const BusinessOps = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [aiAnalyticsActive, setAiAnalyticsActive] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Updated ops metrics with revenue-facing system cards
  const opsMetrics = [
    {
      id: 'revenue-trend',
      title: 'Revenue Trends',
      value: '+15.2%',
      subtitle: 'vs last month',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      trend: 'up',
      insights: [
        'Q4 trending 23% above target',
        'Enterprise deals driving growth',
        'Upsell opportunities identified'
      ]
    },
    {
      id: 'customer-acquisition',
      title: 'Customer Acquisition Cost',
      value: '$1,240',
      subtitle: '8% improvement',
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      trend: 'up',
      insights: [
        'CAC reduced by 8% this quarter',
        'Digital channels performing well',
        'ROI optimization working'
      ]
    },
    {
      id: 'customer-lifetime-value',
      title: 'Customer Lifetime Value',
      value: '$18,500',
      subtitle: 'LTV:CAC ratio 14.9:1',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      trend: 'up',
      insights: [
        'LTV increased by 12% YoY',
        'Retention programs effective',
        'Premium tier adoption growing'
      ]
    },
    {
      id: 'churn-prevention',
      title: 'Churn Rate',
      value: '2.3%',
      subtitle: 'Monthly churn rate',
      icon: RefreshCw,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      trend: 'down',
      insights: [
        'Churn reduced by 0.5% this month',
        'Early warning system active',
        'Customer success interventions working'
      ]
    },
    {
      id: 'market-share',
      title: 'Market Share',
      value: '12.8%',
      subtitle: 'Regional market position',
      icon: PieChart,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      trend: 'up',
      insights: [
        'Market share grew 1.2% this quarter',
        'Competitive positioning strong',
        'New market segments identified'
      ]
    },
    {
      id: 'revenue-per-employee',
      title: 'Revenue per Employee',
      value: '$145K',
      subtitle: 'Annual productivity metric',
      icon: Users,
      color: 'teal',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      trend: 'up',
      insights: [
        'Productivity up 8% this year',
        'Automation initiatives paying off',
        'Team efficiency optimized'
      ]
    }
  ];

  // Expanded Business Ops actions
  const businessOpsActions = [
    { id: 'forecast-analysis', label: 'Revenue Forecast Analysis', icon: TrendingUp },
    { id: 'pipeline-audit', label: 'Pipeline Health Audit', icon: BarChart3 },
    { id: 'competitive-analysis', label: 'Competitive Analysis', icon: Target },
    { id: 'market-research', label: 'Market Research Report', icon: Brain },
    { id: 'customer-segmentation', label: 'Customer Segmentation', icon: Users },
    { id: 'pricing-optimization', label: 'Pricing Optimization', icon: DollarSign },
    { id: 'churn-analysis', label: 'Churn Risk Analysis', icon: AlertTriangle },
    { id: 'roi-calculator', label: 'ROI Calculator', icon: Calculator },
    { id: 'territory-planning', label: 'Territory Planning', icon: Settings },
    { id: 'performance-benchmarking', label: 'Performance Benchmarking', icon: Activity },
    { id: 'campaign-analysis', label: 'Campaign Effectiveness', icon: Zap },
    { id: 'lead-scoring', label: 'Lead Scoring Model', icon: Target }
  ];

  const handleCardClick = (metric: any) => {
    setSelectedCard(metric);
    setIsModalOpen(true);
  };

  const handleExportPDF = () => {
    toast.success('Exporting Business Operations report as PDF with embedded notes and charts');
  };

  const handleActionClick = (actionId: string) => {
    const action = businessOpsActions.find(a => a.id === actionId);
    toast.success(`Launching ${action?.label} tool`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Operations</h1>
          <p className="text-muted-foreground">Real-time team performance & revenue intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`${aiAnalyticsActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600'}`}
            onClick={() => setAiAnalyticsActive(!aiAnalyticsActive)}
          >
            <Brain className="h-3 w-3 mr-1" />
            AI Analytics {aiAnalyticsActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Business Operations Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="process-review">PIV (Process in Review)</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Clickable Ops Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opsMetrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <Card 
                  key={metric.id}
                  className={`${metric.bgColor} ${metric.borderColor} border-2 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105`}
                  onClick={() => handleCardClick(metric)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <IconComponent className={`h-6 w-6 ${metric.textColor}`} />
                      <Badge className={`${metric.textColor} bg-white/20`}>
                        Active
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      {metric.title}
                    </h3>
                    <div className={`text-2xl font-bold ${metric.textColor} mb-1`}>
                      {metric.value}
                    </div>
                    <p className="text-xs text-gray-600">
                      {metric.subtitle}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Expanded All Actions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                All Business Operations Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {businessOpsActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-16 flex flex-col items-center justify-center gap-2 text-xs"
                      onClick={() => handleActionClick(action.id)}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-center leading-tight">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Interpretation Blocks */}
          {aiAnalyticsActive && (
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Data Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">🔥 Strong Performance Indicator</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Your team's LTV:CAC ratio of 14.9:1 exceeds industry standards (3:1), indicating highly efficient customer acquisition and strong unit economics.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">📈 Optimization Opportunity</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Email campaigns show 34% higher conversion than cold calls. Consider reallocating 20% of calling time to email sequences for improved ROI.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">⚠️ Attention Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Deal velocity has decreased by 12% this quarter. AI recommends implementing automated follow-up sequences and proposal templates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Forecast Section */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Forecast & Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$3.1M</div>
                  <p className="text-sm text-blue-800">Projected ARR Next Month</p>
                  <p className="text-xs text-blue-600">Based on current velocity</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">18 days</div>
                  <p className="text-sm text-green-800">Avg Deal Velocity</p>
                  <p className="text-xs text-green-600">Qualified to close</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$45K</div>
                  <p className="text-sm text-purple-800">Avg Deal Size</p>
                  <p className="text-xs text-purple-600">This quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick AI Actions Bar */}
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Actions Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Activity className="h-5 w-5 mb-1" />
                  <span className="text-xs">Auto-Generate Weekly Insights</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <TrendingUp className="h-5 w-5 mb-1" />
                  <span className="text-xs">Reallocate Call Time</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Performance Review</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-xs">Schedule Team 1-on-1s</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process-review" className="space-y-6">
          <ProcessInReviewActions />
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <RetentionActions />
        </TabsContent>
      </Tabs>

      {/* Business Ops Card Modal */}
      <BusinessOpsCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cardData={selectedCard}
      />
    </div>
  );
};

export default BusinessOps;
