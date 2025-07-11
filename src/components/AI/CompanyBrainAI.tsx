
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Database, 
  Network, 
  Zap,
  Eye,
  Activity,
  Server,
  Share2
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import AIChartRenderer from './AIChartRenderer';

interface DataSource {
  id: string;
  name: string;
  type: 'sales' | 'marketing' | 'support' | 'product';
  status: 'active' | 'syncing' | 'error';
  lastSync: string;
  recordCount: number;
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'prediction' | 'correlation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  impact: 'low' | 'medium' | 'high';
}

interface CrossAIData {
  requestingAI: string;
  dataType: string;
  query: string;
  timestamp: string;
  fulfilled: boolean;
}

const CompanyBrainAI: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [crossAIRequests, setCrossAIRequests] = useState<CrossAIData[]>([]);
  const [orchestrationChart, setOrchestrationChart] = useState<any>(null);

  useEffect(() => {
    // Initialize data sources
    setDataSources([
      {
        id: '1',
        name: 'Sales CRM',
        type: 'sales',
        status: 'active',
        lastSync: '2 minutes ago',
        recordCount: 1250
      },
      {
        id: '2',
        name: 'Marketing Analytics',
        type: 'marketing',
        status: 'syncing',
        lastSync: '5 minutes ago',
        recordCount: 890
      },
      {
        id: '3',
        name: 'Support Tickets',
        type: 'support',
        status: 'active',
        lastSync: '1 minute ago',
        recordCount: 445
      }
    ]);

    // Initialize AI insights
    setInsights([
      {
        id: '1',
        type: 'pattern',
        title: 'Lead Conversion Pattern',
        description: 'Enterprise leads convert 40% better when contacted within 2 hours',
        confidence: 92,
        actionable: true,
        impact: 'high'
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Support Ticket Spike',
        description: 'Unusual increase in billing-related tickets (300% above normal)',
        confidence: 88,
        actionable: true,
        impact: 'medium'
      }
    ]);

    // Initialize cross-AI requests
    setCrossAIRequests([
      {
        requestingAI: 'Leads AI',
        dataType: 'conversion_rates',
        query: 'Get conversion rates by lead source',
        timestamp: '2 min ago',
        fulfilled: true
      },
      {
        requestingAI: 'Team AI',
        dataType: 'performance_metrics',
        query: 'Retrieve rep performance data for Q4',
        timestamp: '5 min ago',
        fulfilled: true
      }
    ]);

    // Set orchestration chart
    setOrchestrationChart({
      type: 'network',
      data: {
        nodes: [
          { id: 'brain', label: 'Company Brain', type: 'hub' },
          { id: 'leads', label: 'Leads AI', type: 'assistant' },
          { id: 'team', label: 'Team AI', type: 'assistant' },
          { id: 'ops', label: 'Business Ops AI', type: 'assistant' },
          { id: 'ceo', label: 'CEO EA AI', type: 'assistant' }
        ],
        edges: [
          { from: 'brain', to: 'leads', label: 'Data Flow' },
          { from: 'brain', to: 'team', label: 'Data Flow' },
          { from: 'brain', to: 'ops', label: 'Data Flow' },
          { from: 'brain', to: 'ceo', label: 'Data Flow' }
        ]
      }
    });
  }, []);

  const runDataOrchestration = async () => {
    try {
      const response = await askJarvis('Orchestrate data across all AI systems', {
        includeChart: true,
        orchestrationType: 'full_sync'
      });

      if (response.chartData) {
        setOrchestrationChart(response.chartData);
      }
    } catch (error) {
      console.error('Data orchestration failed:', error);
    }
  };

  const generateSystemInsights = async () => {
    try {
      const response = await askJarvis('Generate comprehensive system insights', {
        includePatterns: true,
        includeAnomalies: true,
        includePredictions: true
      });

      if (response.insights) {
        setInsights(response.insights);
      }
    } catch (error) {
      console.error('System insights generation failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <Network className="h-4 w-4" />;
      case 'anomaly': return <Activity className="h-4 w-4" />;
      case 'prediction': return <Eye className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Company Brain - Master AI Hub
            </CardTitle>
            <Button 
              onClick={runDataOrchestration}
              disabled={isGenerating}
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Orchestrate Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orchestrationChart && (
            <AIChartRenderer 
              data={orchestrationChart.data} 
              type={orchestrationChart.type}
              title="AI System Data Flow"
            />
          )}
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataSources.map((source) => (
              <div key={source.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{source.name}</div>
                  <Badge className={getStatusColor(source.status)}>
                    {source.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {source.recordCount.toLocaleString()} records
                </div>
                <div className="text-xs text-gray-500">
                  Last sync: {source.lastSync}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              System Insights
            </CardTitle>
            <Button 
              onClick={generateSystemInsights}
              disabled={isGenerating}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Generate Insights
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <span className="font-medium">{insight.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {insight.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getImpactColor(insight.impact)}>
                    {insight.impact} impact
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {insight.confidence}% confidence
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
              {insight.actionable && (
                <Button size="sm" variant="outline">
                  Take Action
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cross-AI Data Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-green-600" />
            Cross-AI Data Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {crossAIRequests.map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{request.requestingAI}</span>
                    <Badge variant="outline" className="text-xs">
                      {request.dataType}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{request.query}</p>
                  <div className="text-xs text-gray-500 mt-1">{request.timestamp}</div>
                </div>
                <Badge className={request.fulfilled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {request.fulfilled ? 'Fulfilled' : 'Processing'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyBrainAI;
