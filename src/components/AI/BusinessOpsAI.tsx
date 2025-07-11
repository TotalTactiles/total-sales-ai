
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  DollarSign 
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface KPIMetric {
  label: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

interface BusinessInsight {
  type: 'opportunity' | 'alert' | 'success';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const BusinessOpsAI: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Load initial KPI data
    setKpiMetrics([
      {
        label: 'Monthly ARR',
        value: '$2.4M',
        change: 18,
        status: 'good'
      },
      {
        label: 'CAC',
        value: '$1,240',
        change: -8,
        status: 'good'
      },
      {
        label: 'LTV',
        value: '$18,500',
        change: 15,
        status: 'good'
      },
      {
        label: 'Conversion Rate',
        value: '24.3%',
        change: 3,
        status: 'good'
      }
    ]);

    // Load business insights
    setInsights([
      {
        type: 'success',
        title: 'Strong Performance Indicator',
        description: 'Your team\'s LTV:CAC ratio of 14.9:1 exceeds industry standards (3:1), indicating highly efficient customer acquisition.',
        impact: 'high'
      },
      {
        type: 'opportunity',
        title: 'Optimization Opportunity',
        description: 'Email campaigns show 34% higher conversion than cold calls. Consider reallocating 20% of calling time to email sequences.',
        impact: 'medium'
      },
      {
        type: 'alert',
        title: 'Attention Required',
        description: 'Deal velocity has decreased by 12% this quarter. Consider implementing automated follow-up sequences.',
        impact: 'medium'
      }
    ]);

    // Set initial chart data
    setChartData({
      type: 'line' as const,
      data: [
        { month: 'Jan', revenue: 2000000, costs: 1500000 },
        { month: 'Feb', revenue: 2200000, costs: 1600000 },
        { month: 'Mar', revenue: 2500000, costs: 1800000 },
        { month: 'Apr', revenue: 2800000, costs: 1900000 },
        { month: 'May', revenue: 3200000, costs: 2100000 }
      ]
    });
  }, []);

  const generateRevenueAnalysis = async () => {
    try {
      const response = await askJarvis('Generate revenue trend analysis with projections', {
        includeChart: true,
        context: 'revenue_analysis',
        timeframe: 'quarterly'
      });

      if (response.chartData) {
        setChartData(response.chartData);
      }
    } catch (error) {
      console.error('Revenue analysis failed:', error);
    }
  };

  const runScenarioSimulation = async () => {
    try {
      const response = await askJarvis('Run scenario simulation for 25% increase in ad spend', {
        includeProjections: true,
        scenario: 'increased_ad_spend',
        percentage: 25
      });

      // Handle scenario results
      console.log('Scenario simulation results:', response);
    } catch (error) {
      console.error('Scenario simulation failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'opportunity': return <Zap className="h-5 w-5 text-blue-600" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <BarChart3 className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'opportunity': return 'bg-blue-50 border-blue-200';
      case 'alert': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Key Performance Indicators
            </CardTitle>
            <Button 
              onClick={generateRevenueAnalysis}
              disabled={isGenerating}
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Analyze Revenue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      {chartData && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AIChartRenderer 
              chartData={chartData.data}
              chartType={chartData.type}
              config={{ title: 'Revenue vs Costs Trend' }}
            />
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                  <Badge 
                    variant="outline" 
                    className="mt-2"
                  >
                    {insight.impact} impact
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scenario Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Scenario Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$3.1M</div>
              <p className="text-sm text-blue-800">Projected ARR Next Month</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">18 days</div>
              <p className="text-sm text-green-800">Avg Deal Velocity</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$45K</div>
              <p className="text-sm text-purple-800">Avg Deal Size</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={runScenarioSimulation}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              Run Scenario Simulation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Ops AI Chat Bubble */}
      <ChatBubble 
        assistantType="business-ops"
        enabled={true}
        className="business-ops-chat"
      />
    </div>
  );
};

export default BusinessOpsAI;
