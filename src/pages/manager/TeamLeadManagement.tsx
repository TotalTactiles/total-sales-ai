
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Filter,
  Download,
  Search,
  Brain,
  Flame,
  Clock,
  Award
} from 'lucide-react';

interface TeamLead {
  id: string;
  name: string;
  company: string;
  email: string;
  stage: string;
  score: number;
  daysInPipeline: number;
  lastAction: string;
  assignedTo: string;
  status: 'qualified' | 'proposal' | 'contacted' | 'stalled';
  priority: 'high' | 'medium' | 'low';
}

interface AIInsight {
  type: 'high-performer' | 'bottleneck' | 'opportunity' | 'optimization';
  title: string;
  message: string;
  action?: string;
  repName?: string;
}

const TeamLeadManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-leads');
  const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  // Mock data - in real implementation, this would come from your data service
  useEffect(() => {
    const mockLeads: TeamLead[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        company: 'TechStartup Inc',
        email: 'sarah.chen@techstartup.com',
        stage: 'Demo scheduled',
        score: 85,
        daysInPipeline: 11,
        lastAction: 'Demo scheduled',
        assignedTo: 'Mike Johnson',
        status: 'qualified',
        priority: 'high'
      },
      {
        id: '2',
        name: 'Marcus Rodriguez',
        company: 'RetailCorp',
        email: 'marcus@retailcorp.com',
        stage: 'Called',
        score: 72,
        daysInPipeline: 2,
        lastAction: 'Called',
        assignedTo: 'James Wilson',
        status: 'contacted',
        priority: 'medium'
      },
      {
        id: '3',
        name: 'Dr. Emily Watson',
        company: 'HealthPlus Medical',
        email: 'e.watson@healthplus.com',
        stage: 'Proposal sent',
        score: 91,
        daysInPipeline: 27,
        lastAction: 'Proposal sent',
        assignedTo: 'Sarah Chen',
        status: 'proposal',
        priority: 'high'
      },
      {
        id: '4',
        name: 'David Kim',
        company: 'Enterprise Solutions',
        email: 'd.kim@enterprise.com',
        stage: 'Follow-up needed',
        score: 68,
        daysInPipeline: 18,
        lastAction: 'Email sent',
        assignedTo: 'Mike Johnson',
        status: 'stalled',
        priority: 'medium'
      },
      {
        id: '5',
        name: 'Lisa Thompson',
        company: 'Innovation Labs',
        email: 'lisa.t@innovlabs.com',
        stage: 'Negotiation',
        score: 88,
        daysInPipeline: 6,
        lastAction: 'Contract review',
        assignedTo: 'James Wilson',
        status: 'proposal',
        priority: 'high'
      }
    ];

    const mockInsights: AIInsight[] = [
      {
        type: 'high-performer',
        title: 'High Performer Alert',
        message: 'Sarah Chen has the highest lead conversion rate (31%) this month. Consider having her mentor other team members.',
        repName: 'Sarah Chen'
      },
      {
        type: 'bottleneck',
        title: 'Pipeline Bottleneck',
        message: '8 high-value leads have been stalled for 15+ days. AI suggests scheduling manager review calls.',
        action: 'Schedule Review'
      },
      {
        type: 'opportunity',
        title: 'Opportunity Distribution',
        message: 'Enterprise leads ($50K+) are concentrated with 2 reps. Consider redistributing for better coverage.',
        action: 'Redistribute'
      },
      {
        type: 'optimization',
        title: 'Follow-up Optimization',
        message: 'Email sequences outperforming calls by 23%. Recommend increasing email automation usage.',
        action: 'Optimize'
      }
    ];

    setTeamLeads(mockLeads);
    setAiInsights(mockInsights);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'high-performer':
        return <Flame className="h-4 w-4 text-green-600" />;
      case 'bottleneck':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'opportunity':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'optimization':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'high-performer':
        return 'bg-green-50 border-green-200';
      case 'bottleneck':
        return 'bg-orange-50 border-orange-200';
      case 'opportunity':
        return 'bg-blue-50 border-blue-200';
      case 'optimization':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'proposal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stalled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (score: number) => {
    if (score >= 80) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (score >= 60) return <Clock className="h-4 w-4 text-yellow-500" />;
    return null;
  };

  const filteredLeads = teamLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'hot-leads':
        return matchesSearch && lead.score >= 80;
      case 'stalled':
        return matchesSearch && lead.daysInPipeline > 20;
      case 'by-rep':
        return matchesSearch; // In real implementation, this would group by rep
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Lead Management</h1>
          <p className="text-gray-600">Monitor and manage your team's lead pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Brain className="h-3 w-3 mr-1" />
            AI Insights Active
          </Badge>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.length}</div>
            <p className="text-xs text-green-600">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.filter(l => l.score >= 80).length}</div>
            <p className="text-xs text-orange-600">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stalled Deals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.filter(l => l.daysInPipeline > 20).length}</div>
            <p className="text-xs text-red-600">20+ days in pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Avg Score</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(teamLeads.reduce((acc, l) => acc + l.score, 0) / teamLeads.length)}%</div>
            <p className="text-xs text-green-600">+5% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Manager Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">AI Manager Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight, index) => (
            <Card key={index} className={`border ${getInsightBgColor(insight.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                    {insight.action && (
                      <Button size="sm" variant="outline" className="text-xs">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs and Lead List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="all-leads">All Leads</TabsTrigger>
            <TabsTrigger value="by-rep">By Rep</TabsTrigger>
            <TabsTrigger value="hot-leads">Hot Leads</TabsTrigger>
            <TabsTrigger value="stalled">Stalled</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>All Team Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(lead.score)}
                        <div>
                          <h3 className="font-medium">{lead.name}</h3>
                          <p className="text-sm text-gray-600">
                            {lead.company} • {lead.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            Assigned to {lead.assignedTo}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold">Score: {lead.score}%</div>
                        <div className="text-sm text-gray-600">
                          {lead.daysInPipeline} days in pipeline
                        </div>
                        <div className="text-xs text-gray-500">
                          Last: {lead.lastAction}
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(lead.status)}
                      >
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamLeadManagement;
