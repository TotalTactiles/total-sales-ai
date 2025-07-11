
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  Zap,
  Globe,
  MessageSquare,
  Settings,
  Activity
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface DataSource {
  id: string;
  name: string;
  type: 'CRM' | 'Email' | 'Social' | 'Website' | 'Analytics';
  status: 'active' | 'inactive' | 'syncing';
  lastSync: string;
  recordCount: number;
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'prediction' | 'optimization' | 'alert';
  title: string;
  description: string;
  confidence: number;
  source: string;
  timestamp: string;
}

interface KnowledgeGraph {
  nodes: Array<{ id: string; label: string; type: string; connections: number }>;
  totalConnections: number;
  lastUpdated: string;
}

const CompanyBrainAI: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph | null>(null);
  const [activityChart, setActivityChart] = useState<any>(null);

  useEffect(() => {
    // Load data sources
    setDataSources([
      {
        id: '1',
        name: 'Salesforce CRM',
        type: 'CRM',
        status: 'active',
        lastSync: '5 minutes ago',
        recordCount: 1247
      },
      {
        id: '2',
        name: 'HubSpot Email',
        type: 'Email',
        status: 'active',
        lastSync: '2 minutes ago',
        recordCount: 892
      },
      {
        id: '3',
        name: 'LinkedIn Sales Navigator',
        type: 'Social',
        status: 'syncing',
        lastSync: '1 hour ago',
        recordCount: 534
      },
      {
        id: '4',
        name: 'Google Analytics',
        type: 'Analytics',
        status: 'active',
        lastSync: '10 minutes ago',
        recordCount: 2156
      }
    ]);

    // Load AI insights
    setInsights([
      {
        id: '1',
        type: 'pattern',
        title: 'Lead Conversion Pattern Detected',
        description: 'AI identified a 23% increase in response rates for emails sent between 2-4 PM',
        confidence: 94,
        source: 'Email Analytics',
        timestamp: '15 minutes ago'
      },
      {
        id: '2',
        type: 'prediction',
        title: 'Revenue Forecast Updated',
        description: 'Q4 revenue projection increased to $3.2M based on current pipeline velocity',
        confidence: 87,
        source: 'CRM Data',
        timestamp: '1 hour ago'
      },
      {
        id: '3',
        type: 'optimization',
        title: 'Lead Scoring Optimization',
        description: 'New scoring model improves qualification accuracy by 18%',
        confidence: 91,
        source: 'Cross-Platform Analysis',
        timestamp: '2 hours ago'
      }
    ]);

    // Set knowledge graph data
    setKnowledgeGraph({
      nodes: [
        { id: '1', label: 'Enterprise Leads', type: 'lead_segment', connections: 45 },
        { id: '2', label: 'Email Campaigns', type: 'marketing', connections: 38 },
        { id: '3', label: 'Sales Scripts', type: 'content', connections: 28 },
        { id: '4', label: 'Team Performance', type: 'analytics', connections: 52 }
      ],
      totalConnections: 163,
      lastUpdated: '5 minutes ago'
    });

    // Set activity chart
    setActivityChart({
      type: 'line' as const,
      data: [
        { hour: '9 AM', insights: 12, queries: 34, connections: 23 },
        { hour: '10 AM', insights: 18, queries: 45, connections: 31 },
        { hour: '11 AM', insights: 15, queries: 52, connections: 28 },
        { hour: '12 PM', insights: 22, queries: 38, connections: 35 },
        { hour: '1 PM', insights: 19, queries: 41, connections: 29 },
        { hour: '2 PM', insights: 25, queries: 48, connections: 42 }
      ]
    });
  }, []);

  const generateSystemInsights = async () => {
    try {
      const response = await askJarvis('Generate comprehensive system insights across all data sources', {
        includeChart: true,
        context: 'system_analysis',
        dataSources: dataSources
      });

      if (response.insights) {
        setInsights(prev => [...response.insights, ...prev]);
      }
    } catch (error) {
      console.error('System insights generation failed:', error);
    }
  };

  const optimizeDataConnections = async () => {
    try {
      const response = await askJarvis('Optimize data connections and suggest new integrations', {
        context: 'data_optimization',
        currentSources: dataSources
      });

      console.log('Data optimization suggestions:', response);
    } catch (error) {
      console.error('Data optimization failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'prediction': return <Zap className="h-4 w-4 text-purple-600" />;
      case 'optimization': return <Settings className="h-4 w-4 text-green-600" />;
      case 'alert': return <Activity className="h-4 w-4 text-red-600" />;
      default: return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Company Brain Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Company Brain Status
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={generateSystemInsights}
                disabled={isGenerating}
                size="sm"
              >
                <Brain className="h-4 w-4 mr-1" />
                Generate Insights
              </Button>
              <Button 
                onClick={optimizeDataConnections}
                disabled={isGenerating}
                size="sm"
                variant="outline"
              >
                <Database className="h-4 w-4 mr-1" />
                Optimize
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dataSources.length}</div>
              <div className="text-sm text-gray-600">Active Data Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dataSources.reduce((acc, source) => acc + source.recordCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{insights.length}</div>
              <div className="text-sm text-gray-600">AI Insights Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {knowledgeGraph?.totalConnections || 0}
              </div>
              <div className="text-sm text-gray-600">Knowledge Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Activity Chart */}
      {activityChart && (
        <Card>
          <CardHeader>
            <CardTitle>AI Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AIChartRenderer 
              chartData={activityChart.data}
              chartType={activityChart.type}
              config={{ title: 'Hourly AI Activity Metrics' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Data Sources Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSources.map((source) => (
              <div key={source.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-gray-600">{source.type}</p>
                  </div>
                  <Badge className={getStatusColor(source.status)}>
                    {source.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Records:</span>
                    <span className="font-medium">{source.recordCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Sync:</span>
                    <span className="text-gray-600">{source.lastSync}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Latest AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-start gap-3">
                {getInsightTypeIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">Source: {insight.source}</span>
                      <span className="text-gray-500">{insight.timestamp}</span>
                    </div>
                    <div className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}% confidence
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Knowledge Graph Overview */}
      {knowledgeGraph && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Knowledge Graph
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeGraph.nodes.map((node) => (
                <div key={node.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{node.label}</p>
                      <p className="text-sm text-gray-600 capitalize">{node.type.replace('_', ' ')}</p>
                    </div>
                    <Badge variant="outline">
                      {node.connections} connections
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Last updated: {knowledgeGraph.lastUpdated} • Total connections: {knowledgeGraph.totalConnections}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Brain AI Chat Bubble */}
      <ChatBubble 
        assistantType="company-brain"
        enabled={true}
        className="company-brain-chat"
      />
    </div>
  );
};

export default CompanyBrainAI;
