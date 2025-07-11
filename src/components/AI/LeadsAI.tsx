
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Target, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Brain,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  likelihood: number;
  status: 'new' | 'contacted' | 'qualified' | 'stalled';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  daysStalled?: number;
}

interface ReassignmentSuggestion {
  leadId: string;
  leadName: string;
  currentAgent: string;
  suggestedAgent: string;
  reason: string;
  confidenceScore: number;
  expectedImprovement: number;
}

const LeadsAI: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reassignments, setReassignments] = useState<ReassignmentSuggestion[]>([]);
  const [leadChart, setLeadChart] = useState<any>(null);
  const [stalledLeads, setStalledLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Load leads data
    const leadsData: Lead[] = [
      {
        id: '1',
        name: 'John Smith',
        company: 'Tech Corp',
        score: 85,
        likelihood: 78,
        status: 'qualified',
        assignedTo: 'Sarah Johnson',
        priority: 'high'
      },
      {
        id: '2',
        name: 'Jane Doe',
        company: 'StartupXYZ',
        score: 72,
        likelihood: 65,
        status: 'stalled',
        assignedTo: 'Mike Chen',
        priority: 'medium',
        daysStalled: 8
      },
      {
        id: '3',
        name: 'Bob Wilson',
        company: 'Enterprise Inc',
        score: 91,
        likelihood: 88,
        status: 'contacted',
        assignedTo: 'Lisa Park',
        priority: 'high'
      }
    ];

    setLeads(leadsData);
    setStalledLeads(leadsData.filter(lead => lead.status === 'stalled'));

    // Load reassignment suggestions
    setReassignments([
      {
        leadId: '2',
        leadName: 'Jane Doe',
        currentAgent: 'Mike Chen',
        suggestedAgent: 'Sarah Johnson',
        reason: 'Sarah has 87% close rate with similar leads',
        confidenceScore: 82,
        expectedImprovement: 23
      }
    ]);

    // Set lead distribution chart
    setLeadChart({
      type: 'bar',
      data: {
        labels: ['New', 'Contacted', 'Qualified', 'Stalled'],
        datasets: [{
          label: 'Lead Count',
          data: [12, 8, 15, 3],
          backgroundColor: [
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // yellow
            '#ef4444'  // red
          ]
        }]
      }
    });
  }, []);

  const runLeadScoring = async () => {
    try {
      const response = await askJarvis('Analyze lead scoring and provide predictions', {
        includeChart: true,
        leadData: leads
      });

      if (response.chartData) {
        setLeadChart(response.chartData);
      }
    } catch (error) {
      console.error('Lead scoring failed:', error);
    }
  };

  const executeReassignment = async (suggestionId: string) => {
    const suggestion = reassignments.find(r => r.leadId === suggestionId);
    if (!suggestion) return;

    // Update lead assignment
    setLeads(prev => 
      prev.map(lead => 
        lead.id === suggestion.leadId 
          ? { ...lead, assignedTo: suggestion.suggestedAgent }
          : lead
      )
    );

    // Remove from suggestions
    setReassignments(prev => 
      prev.filter(r => r.leadId !== suggestionId)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      case 'qualified': return 'bg-yellow-100 text-yellow-800';
      case 'stalled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lead Pipeline Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Lead Pipeline Analysis
            </CardTitle>
            <Button 
              onClick={runLeadScoring}
              disabled={isGenerating}
              size="sm"
            >
              <Brain className="h-4 w-4 mr-1" />
              Analyze Scoring
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {leadChart && (
            <AIChartRenderer 
              data={leadChart.data} 
              type={leadChart.type}
              title="Lead Distribution by Status"
            />
          )}
        </CardContent>
      </Card>

      {/* Stalled Leads Alert */}
      {stalledLeads.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Stalled Leads Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stalledLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">
                        {lead.company} • Stalled {lead.daysStalled} days
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">
                      {lead.score}% score
                    </Badge>
                    <Button size="sm" variant="outline">
                      Follow Up
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Reassignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Smart Reassignment Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reassignments.map((suggestion) => (
            <div key={suggestion.leadId} className="p-4 border rounded-lg bg-purple-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{suggestion.leadName}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-purple-600">
                      {suggestion.suggestedAgent}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{suggestion.reason}</p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-purple-100 text-purple-800">
                      {suggestion.confidenceScore}% confidence
                    </Badge>
                    <span className="text-sm text-green-600">
                      +{suggestion.expectedImprovement}% improvement expected
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => executeReassignment(suggestion.leadId)}
                >
                  Execute
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Lead Performance Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Lead Performance Grid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <div 
                key={lead.id} 
                className={`p-4 border rounded-lg ${getPriorityColor(lead.priority)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{lead.name}</div>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-3">{lead.company}</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score:</span>
                    <span className="font-medium">{lead.score}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Likelihood:</span>
                    <span className="font-medium text-green-600">{lead.likelihood}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Assigned to:</span>
                    <span className="font-medium">{lead.assignedTo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leads AI Chat Bubble */}
      <ChatBubble 
        assistantType="leads"
        enabled={true}
        position="bottom-right"
      />
    </div>
  );
};

export default LeadsAI;
