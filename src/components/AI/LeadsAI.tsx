
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  UserPlus,
  Clock,
  Target
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  assignedTo: string;
  score: number;
  likelihood: number;
  daysSinceContact: number;
}

interface LeadInsight {
  type: 'stalled' | 'hot' | 'reassignment' | 'scoring';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  affectedLeads: number;
}

const LeadsAI: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [insights, setInsights] = useState<LeadInsight[]>([]);
  const [pipelineChart, setPipelineChart] = useState<any>(null);

  useEffect(() => {
    // Load leads data
    setLeads([
      {
        id: '1',
        name: 'John Smith',
        company: 'Tech Corp',
        email: 'john@techcorp.com',
        phone: '+1234567890',
        status: 'new',
        assignedTo: 'Sarah Johnson',
        score: 85,
        likelihood: 78,
        daysSinceContact: 1
      },
      {
        id: '2',
        name: 'Jane Doe',
        company: 'StartupXYZ',
        email: 'jane@startup.com',
        phone: '+1234567891',
        status: 'contacted',
        assignedTo: 'Mike Chen',
        score: 72,
        likelihood: 65,
        daysSinceContact: 3
      },
      {
        id: '3',
        name: 'Bob Wilson',
        company: 'Enterprise Inc',
        email: 'bob@enterprise.com',
        phone: '+1234567892',
        status: 'qualified',
        assignedTo: 'Lisa Park',
        score: 91,
        likelihood: 88,
        daysSinceContact: 2
      },
      {
        id: '4',
        name: 'Alice Brown',
        company: 'Growth Co',
        email: 'alice@growth.com',
        phone: '+1234567893',
        status: 'proposal',
        assignedTo: 'Sarah Johnson',
        score: 89,
        likelihood: 82,
        daysSinceContact: 7
      }
    ]);

    // Load insights
    setInsights([
      {
        type: 'stalled',
        title: 'Stalled Leads Alert',
        description: '3 high-value leads have been inactive for 5+ days',
        priority: 'high',
        affectedLeads: 3
      },
      {
        type: 'reassignment',
        title: 'Optimal Reassignment',
        description: 'Sarah Johnson has 67% higher close rate for enterprise leads',
        priority: 'medium',
        affectedLeads: 5
      },
      {
        type: 'scoring',
        title: 'Lead Scoring Update',
        description: 'AI detected new patterns - 24 leads need rescoring',
        priority: 'medium',
        affectedLeads: 24
      }
    ]);

    // Set pipeline chart
    setPipelineChart({
      type: 'bar' as const,
      data: [
        { stage: 'New', count: 45, value: 2250000 },
        { stage: 'Contacted', count: 32, value: 1600000 },
        { stage: 'Qualified', count: 18, value: 900000 },
        { stage: 'Proposal', count: 12, value: 600000 },
        { stage: 'Closed', count: 8, value: 400000 }
      ]
    });
  }, []);

  const analyzeLeadDistribution = async () => {
    try {
      const response = await askJarvis('Analyze lead distribution and suggest reassignments', {
        includeChart: true,
        context: 'lead_distribution',
        leads: leads
      });

      if (response.chartData) {
        setPipelineChart(response.chartData);
      }
    } catch (error) {
      console.error('Lead distribution analysis failed:', error);
    }
  };

  const identifyStalledLeads = async () => {
    try {
      const response = await askJarvis('Identify and prioritize stalled leads for follow-up', {
        context: 'stalled_leads',
        threshold: 5
      });

      console.log('Stalled leads identified:', response);
    } catch (error) {
      console.error('Stalled leads identification failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'stalled': return <Clock className="h-5 w-5 text-red-600" />;
      case 'hot': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'reassignment': return <UserPlus className="h-5 w-5 text-blue-600" />;
      case 'scoring': return <Target className="h-5 w-5 text-purple-600" />;
      default: return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lead Pipeline Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Lead Pipeline Analysis
            </CardTitle>
            <Button 
              onClick={analyzeLeadDistribution}
              disabled={isGenerating}
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Analyze Distribution
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pipelineChart && (
            <AIChartRenderer 
              chartData={pipelineChart.data}
              chartType={pipelineChart.type}
              config={{ title: 'Lead Pipeline Distribution' }}
            />
          )}
        </CardContent>
      </Card>

      {/* AI Lead Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              AI Lead Insights
            </CardTitle>
            <Button 
              onClick={identifyStalledLeads}
              disabled={isGenerating}
              size="sm"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-1" />
              Check Stalled
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}>
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.affectedLeads} leads
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                  <Badge className={`mt-2 text-xs ${getPriorityColor(insight.priority)}`}>
                    {insight.priority} priority
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Lead Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
              <div className="text-sm text-gray-600">Total Active Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(leads.reduce((acc, lead) => acc + lead.likelihood, 0) / leads.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Conversion Likelihood</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {leads.filter(lead => lead.daysSinceContact > 5).length}
              </div>
              <div className="text-sm text-gray-600">Stalled Leads (5+ days)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Lead Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>High-Priority Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Lead</th>
                  <th className="text-left py-3 px-4">Company</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Assigned To</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Likelihood</th>
                </tr>
              </thead>
              <tbody>
                {leads
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 4)
                  .map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{lead.company}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{lead.assignedTo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-800">{lead.score}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${lead.likelihood}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{lead.likelihood}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Leads AI Chat Bubble */}
      <ChatBubble 
        assistantType="leads"
        enabled={true}
        className="leads-ai-chat"
      />
    </div>
  );
};

export default LeadsAI;
