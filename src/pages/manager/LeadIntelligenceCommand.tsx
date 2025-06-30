
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign,
  Users,
  BarChart3,
  Brain,
  Shuffle,
  Star,
  PieChart,
  Clock,
  Activity
} from 'lucide-react';

interface LeadData {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  assignedRep: string;
  stage: string;
  timeInStage: number;
  lastActivity: string;
  resultScore: number;
  roas?: number;
  cpl?: number;
  outcomeNotes: string;
  tags: string[];
}

interface SourceStats {
  source: string;
  percentage: number;
  leads: number;
  closeRate: number;
  cpl: number;
  stalledLeads: number;
}

interface RepDistribution {
  repName: string;
  leadsCount: number;
  performanceScore: number;
}

const LeadIntelligenceCommand: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showDistributionPanel, setShowDistributionPanel] = useState(false);

  // Mock data for leads
  const mockLeads: LeadData[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechStartup Inc',
      email: 'sarah@techstartup.com',
      source: 'Meta Ads',
      assignedRep: 'James Wilson',
      stage: 'Demo Scheduled',
      timeInStage: 3,
      lastActivity: 'Demo booked',
      resultScore: 85,
      roas: 2.4,
      cpl: 42,
      outcomeNotes: 'High intent, budget confirmed',
      tags: ['enterprise', 'hot']
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      company: 'RetailCorp',
      email: 'marcus@retailcorp.com',
      source: 'Google Ads',
      assignedRep: 'Sarah Johnson',
      stage: 'Proposal',
      timeInStage: 7,
      lastActivity: 'Proposal sent',
      resultScore: 72,
      roas: 1.8,
      cpl: 68,
      outcomeNotes: 'Evaluating competitors',
      tags: ['mid-market', 'price-sensitive']
    },
    {
      id: '3',
      name: 'Dr. Emily Watson',
      company: 'HealthPlus Medical',
      email: 'e.watson@healthplus.com',
      source: 'Referral',
      assignedRep: 'Mike Johnson',
      stage: 'Negotiation',
      timeInStage: 12,
      lastActivity: 'Contract review',
      resultScore: 91,
      roas: 4.2,
      cpl: 15,
      outcomeNotes: 'Ready to close, legal review pending',
      tags: ['enterprise', 'compliance']
    },
    {
      id: '4',
      name: 'David Kim',
      company: 'Enterprise Solutions',
      email: 'd.kim@enterprise.com',
      source: 'LinkedIn',
      assignedRep: 'James Wilson',
      stage: 'Qualified',
      timeInStage: 21,
      lastActivity: 'Follow-up call',
      resultScore: 45,
      roas: 0.9,
      cpl: 89,
      outcomeNotes: 'Budget uncertain, needs nurturing',
      tags: ['stalled', 'budget-unclear']
    },
    {
      id: '5',
      name: 'Lisa Park',
      company: 'Innovation Labs',
      email: 'lisa@innovlabs.com',
      source: 'Organic',
      assignedRep: 'Sarah Johnson',
      stage: 'Discovery',
      timeInStage: 5,
      lastActivity: 'Initial call',
      resultScore: 67,
      roas: 3.1,
      cpl: 0,
      outcomeNotes: 'Strong fit, exploring requirements',
      tags: ['warm', 'technical']
    }
  ];

  // Calculate source statistics
  const sourceStats: SourceStats[] = useMemo(() => {
    const sourceGroups = mockLeads.reduce((acc, lead) => {
      if (!acc[lead.source]) {
        acc[lead.source] = { leads: [], totalCPL: 0, stalledCount: 0 };
      }
      acc[lead.source].leads.push(lead);
      acc[lead.source].totalCPL += lead.cpl || 0;
      if (lead.timeInStage > 15) acc[lead.source].stalledCount++;
      return acc;
    }, {} as any);

    return Object.entries(sourceGroups).map(([source, data]: [string, any]) => ({
      source,
      percentage: Math.round((data.leads.length / mockLeads.length) * 100),
      leads: data.leads.length,
      closeRate: Math.round(Math.random() * 50 + 10), // Mock close rate
      cpl: Math.round(data.totalCPL / data.leads.length) || 0,
      stalledLeads: data.stalledCount
    }));
  }, [mockLeads]);

  // Calculate rep distribution
  const repDistribution: RepDistribution[] = useMemo(() => {
    const repGroups = mockLeads.reduce((acc, lead) => {
      if (!acc[lead.assignedRep]) {
        acc[lead.assignedRep] = { count: 0, totalScore: 0 };
      }
      acc[lead.assignedRep].count++;
      acc[lead.assignedRep].totalScore += lead.resultScore;
      return acc;
    }, {} as any);

    return Object.entries(repGroups).map(([repName, data]: [string, any]) => ({
      repName,
      leadsCount: data.count,
      performanceScore: Math.round(data.totalScore / data.count)
    }));
  }, [mockLeads]);

  const aiInsights = [
    {
      type: 'warning',
      title: 'Source Saturation Alert',
      message: '75% of Meta leads assigned to 2 reps — suggest redistribution.',
      icon: <AlertTriangle className="h-4 w-4 text-orange-600" />
    },
    {
      type: 'success',
      title: 'Performance Boost Alert',
      message: 'Referral leads converting 48% faster — prioritize to new reps.',
      icon: <TrendingUp className="h-4 w-4 text-green-600" />
    },
    {
      type: 'info',
      title: 'Top ROAS Pairing',
      message: 'Mike Johnson closing referral leads 3.3x faster than average.',
      icon: <Target className="h-4 w-4 text-blue-600" />
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'discovery': return 'bg-blue-100 text-blue-800';
      case 'demo scheduled': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Intelligence Command</h1>
          <p className="text-gray-600">Oversee pipeline quality, lead sources, and rep outcomes — all in one dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Weekly Digest
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDistributionPanel(true)}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Distribute Leads
          </Button>
        </div>
      </div>

      {/* Source Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Lead Sources</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sourceStats.slice(0, 3).map((source, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-xs">{source.source}</span>
                  <span className="text-xs font-medium">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Source-to-Close Quality</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs">Referrals</span>
                <span className="text-xs font-medium text-green-600">48%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Organic</span>
                <span className="text-xs font-medium text-blue-600">31%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Meta Ads</span>
                <span className="text-xs font-medium text-orange-600">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost-Per-Lead</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sourceStats.filter(s => s.cpl > 0).map((source, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-xs">{source.source}</span>
                  <span className="text-xs font-medium">${source.cpl}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stalled Leads</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sourceStats.map((source, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-xs">{source.source}</span>
                  <span className="text-xs font-medium text-red-600">{source.stalledLeads}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Distribution</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {repDistribution.map((rep, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-xs">{rep.repName.split(' ')[0]}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">{rep.leadsCount}</span>
                    {rep.performanceScore > 80 && <Star className="h-3 w-3 text-yellow-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Manager Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">AI Manager Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {insight.icon}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-700">{insight.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lead Outcome Tracker */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="by-source">By Source</TabsTrigger>
            <TabsTrigger value="by-rep">By Rep</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Lead Outcome Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Lead Name</th>
                      <th className="text-left p-3">Assigned Rep</th>
                      <th className="text-left p-3">Source</th>
                      <th className="text-left p-3">Stage</th>
                      <th className="text-left p-3">Time in Stage</th>
                      <th className="text-left p-3">Last Activity</th>
                      <th className="text-left p-3">Result Score</th>
                      <th className="text-left p-3">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLeads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-gray-600">{lead.company}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span>{lead.assignedRep}</span>
                            {repDistribution.find(r => r.repName === lead.assignedRep)?.performanceScore > 80 && (
                              <Star className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{lead.source}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>
                        </td>
                        <td className="p-3">
                          <span className={lead.timeInStage > 15 ? 'text-red-600 font-medium' : ''}>
                            {lead.timeInStage} days
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{lead.lastActivity}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              lead.resultScore >= 80 ? 'bg-green-500' : 
                              lead.resultScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className="font-medium">{lead.resultScore}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {lead.roas && (
                            <span className={lead.roas > 2 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                              {lead.roas}x
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Distribution Panel */}
      {showDistributionPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96 overflow-auto">
            <CardHeader>
              <CardTitle>Distribute Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                AI Recommend Distribution
              </Button>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bulk Assign By:</label>
                <select className="w-full p-2 border rounded">
                  <option>Source Type</option>
                  <option>Lead Score</option>
                  <option>Rep Bandwidth</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowDistributionPanel(false)}>
                  Apply Changes
                </Button>
                <Button variant="outline" onClick={() => setShowDistributionPanel(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeadIntelligenceCommand;
