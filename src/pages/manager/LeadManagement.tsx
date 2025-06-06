
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useDemoData } from '@/contexts/DemoDataContext';
import { useAuth } from '@/contexts/AuthContext';

const ManagerLeadManagement = () => {
  const { leads } = useLeads();
  const { leads: demoLeads } = useDemoData();
  const { isDemoMode } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const displayLeads = isDemoMode() ? demoLeads : leads;

  const teamLeads = displayLeads.map(lead => ({
    ...lead,
    assignedTo: ['Sarah Chen', 'Mike Johnson', 'Emma Davis', 'James Wilson'][Math.floor(Math.random() * 4)],
    lastActivity: ['Called', 'Emailed', 'Demo scheduled', 'Proposal sent'][Math.floor(Math.random() * 4)],
    daysInPipeline: Math.floor(Math.random() * 30) + 1
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Lead Management</h1>
          <p className="text-gray-600">Monitor and manage your team's lead pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            AI Insights Active
          </Badge>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.filter(l => l.priority === 'high').length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stalled Deals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.filter(l => l.daysInPipeline > 20).length}</div>
            <p className="text-xs text-muted-foreground">
              20+ days in pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Avg Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(teamLeads.reduce((acc, lead) => acc + lead.score, 0) / teamLeads.length)}%</div>
            <p className="text-xs text-muted-foreground">
              +5% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Manager Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Manager Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800">High Performer Alert</h4>
              <p className="text-sm text-green-700 mt-1">
                Sarah Chen has the highest lead conversion rate (31%) this month. Consider having her mentor other team members.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800">Pipeline Bottleneck</h4>
              <p className="text-sm text-yellow-700 mt-1">
                8 high-value leads have been stalled for 15+ days. AI suggests scheduling manager review calls.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800">Opportunity Distribution</h4>
              <p className="text-sm text-blue-700 mt-1">
                Enterprise leads ($50K+) are concentrated with 2 reps. Consider redistributing for better coverage.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800">Follow-up Optimization</h4>
              <p className="text-sm text-purple-700 mt-1">
                Email sequences outperforming calls by 23%. Recommend increasing email automation usage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Management Tabs */}
      <Tabs defaultValue="all-leads" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all-leads">All Leads</TabsTrigger>
            <TabsTrigger value="by-rep">By Rep</TabsTrigger>
            <TabsTrigger value="hot-leads">Hot Leads</TabsTrigger>
            <TabsTrigger value="stalled">Stalled</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>

        <TabsContent value="all-leads">
          <Card>
            <CardHeader>
              <CardTitle>All Team Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamLeads.slice(0, 10).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(lead.priority)}
                      </div>
                      <div>
                        <h4 className="font-medium">{lead.name}</h4>
                        <p className="text-sm text-gray-600">{lead.company} • {lead.email}</p>
                        <p className="text-xs text-gray-500">Assigned to: {lead.assignedTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Score: {lead.score}%</p>
                        <p className="text-xs text-gray-500">{lead.daysInPipeline} days in pipeline</p>
                        <p className="text-xs text-gray-500">Last: {lead.lastActivity}</p>
                      </div>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-rep">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {['Sarah Chen', 'Mike Johnson', 'Emma Davis', 'James Wilson'].map((rep) => {
              const repLeads = teamLeads.filter(lead => lead.assignedTo === rep);
              return (
                <Card key={rep}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{rep}</span>
                      <Badge variant="secondary">{repLeads.length} leads</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {repLeads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{lead.name}</p>
                            <p className="text-xs text-gray-600">{lead.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{lead.score}%</span>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="hot-leads">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                High Priority Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamLeads.filter(lead => lead.priority === 'high').map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border-l-4 border-red-400 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-gray-600">{lead.company} • Assigned to: {lead.assignedTo}</p>
                      <p className="text-xs text-gray-500">Score: {lead.score}% • {lead.daysInPipeline} days in pipeline</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">High Priority</Badge>
                      <Button variant="outline">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stalled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Stalled Deals (20+ days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamLeads.filter(lead => lead.daysInPipeline > 20).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-gray-600">{lead.company} • Assigned to: {lead.assignedTo}</p>
                      <p className="text-xs text-gray-500">Last activity: {lead.lastActivity} • {lead.daysInPipeline} days ago</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Stalled</Badge>
                      <Button variant="outline">Escalate</Button>
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

export default ManagerLeadManagement;
