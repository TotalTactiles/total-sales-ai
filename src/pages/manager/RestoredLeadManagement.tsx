
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  UserPlus,
  BarChart3,
  TrendingUp,
  Database,
  Brain,
  Zap
} from 'lucide-react';

const RestoredLeadManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const leads = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      email: 'sarah@techcorp.com',
      phone: '+1 555-0123',
      status: 'qualified',
      source: 'Website Form',
      score: 85,
      assignedTo: 'Mike Chen',
      lastContact: '2 days ago',
      value: '$12,500'
    },
    {
      id: 2,
      name: 'Robert Davis',
      company: 'StartupXYZ',
      email: 'robert@startupxyz.com',
      phone: '+1 555-0124',
      status: 'new',
      source: 'LinkedIn',
      score: 72,
      assignedTo: 'Lisa Park',
      lastContact: '1 hour ago',
      value: '$8,900'
    },
    {
      id: 3,
      name: 'Emily Wilson',
      company: 'Enterprise Solutions',
      email: 'emily@enterprise.com',
      phone: '+1 555-0125',
      status: 'contacted',
      source: 'Google Ads',
      score: 91,
      assignedTo: 'Alex Torres',
      lastContact: '5 days ago',
      value: '$25,000'
    }
  ];

  const integrationSources = [
    { name: 'Website Forms', connected: true, leads: 145, status: 'active' },
    { name: 'LinkedIn Ads', connected: true, leads: 87, status: 'active' },
    { name: 'Google Ads', connected: true, leads: 123, status: 'syncing' },
    { name: 'Facebook Ads', connected: false, leads: 0, status: 'disconnected' },
    { name: 'Salesforce', connected: true, leads: 234, status: 'active' }
  ];

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

  const getSourceStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-orange-100 text-orange-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600">Manage leads with AI-powered insights and automation</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads">Lead Database</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lead Database ({leads.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search leads by name, company, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-md bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Lead</th>
                      <th className="text-left py-3 px-4">Company</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Source</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Assigned To</th>
                      <th className="text-left py-3 px-4">Value</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-gray-600">{lead.email}</p>
                            <p className="text-xs text-gray-500">Last contact: {lead.lastContact}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{lead.company}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm">{lead.source}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-800">{lead.score}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{lead.assignedTo}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{lead.value}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Lead Source Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrationSources.map((source) => (
                  <div key={source.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{source.name}</h4>
                      <Badge className={getSourceStatusColor(source.status)}>
                        {source.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Leads:</span>
                        <span className="font-medium">{source.leads}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium capitalize">{source.status}</span>
                      </div>
                    </div>
                    <Button 
                      variant={source.connected ? "outline" : "default"} 
                      size="sm" 
                      className="w-full mt-3"
                    >
                      {source.connected ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Internal AI Routing</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• All connected lead sources automatically route to:</p>
                  <div className="ml-4 space-y-1">
                    <p>→ Lead Intelligence Command (scoring & analysis)</p>
                    <p>→ Company Brain (knowledge integration)</p>
                    <p>→ TSAM Master Brain (internal optimization)</p>
                  </div>
                  <p>• Developer OS logs all audit trails for monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Lead Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Lead Intelligence Command</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    AI-powered lead scoring and behavioral analysis
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Leads Analyzed Today:</span>
                      <span className="font-medium">147</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High-Priority Identified:</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy Score:</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Company Brain Integration</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Contextual lead insights from company knowledge
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Knowledge Articles:</span>
                      <span className="font-medium">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contextual Matches:</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Relevance Score:</span>
                      <span className="font-medium">91%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <h4 className="font-medium">TSAM Master Brain</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Internal optimization and predictive modeling
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Optimization Rules:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Predictions Made:</span>
                      <span className="font-medium">78</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-medium">87%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Recent AI Insights</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">High-value lead pattern detected</span>
                      <Badge className="bg-purple-100 text-purple-800">Intelligence</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Enterprise leads from Technology sector showing 73% higher conversion rate
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Optimal contact timing identified</span>
                      <Badge className="bg-green-100 text-green-800">Optimization</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tuesday 10-11 AM shows 45% better response rates for qualified leads
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Lead source performance shift</span>
                      <Badge className="bg-orange-100 text-orange-800">Alert</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      LinkedIn Ads quality declining - suggest budget reallocation to Google Ads
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestoredLeadManagement;
