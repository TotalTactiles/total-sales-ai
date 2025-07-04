
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import { mockLeads, MockLead } from '@/mock/leads';

const LeadIntelligenceCommand: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedRep, setSelectedRep] = useState<string>('all');

  const handleLeadClick = (leadId: string) => {
    navigate(`/manager/leads/${leadId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    const matchesRep = selectedRep === 'all' || lead.rep === selectedRep;
    
    return matchesSearch && matchesSource && matchesRep;
  });

  const leadsBySource = mockLeads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leadsByRep = mockLeads.reduce((acc, lead) => {
    if (lead.rep) {
      acc[lead.rep] = (acc[lead.rep] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const LeadRow: React.FC<{ lead: MockLead }> = ({ lead }) => (
    <tr 
      key={lead.id} 
      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => handleLeadClick(lead.id)}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{lead.name}</div>
            <div className="text-sm text-gray-600">{lead.company}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <Badge className={getStatusColor(lead.status)}>
          {lead.status}
        </Badge>
      </td>
      <td className="p-4">
        <Badge className={getPriorityColor(lead.priority)}>
          {lead.priority}
        </Badge>
      </td>
      <td className="p-4 text-sm text-gray-600">{lead.source}</td>
      <td className="p-4 font-medium">{lead.score}</td>
      <td className="p-4 text-sm text-gray-600">{lead.rep || 'Unassigned'}</td>
      <td className="p-4 text-sm text-gray-600">${lead.value?.toLocaleString() || '0'}</td>
      <td className="p-4">
        <Button size="sm" variant="outline" onClick={(e) => {
          e.stopPropagation();
          handleLeadClick(lead.id);
        }}>
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-blue-50">
      <ManagerNavigation />
      
      <div className="pt-[60px] px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Intelligence Command</h1>
              <p className="text-gray-600">Comprehensive lead management and analytics</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{mockLeads.length}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {mockLeads.filter(l => l.status === 'qualified').length}
                </div>
                <div className="text-sm text-gray-600">Qualified</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(mockLeads.reduce((sum, l) => sum + l.conversionLikelihood, 0) / mockLeads.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Conversion</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${mockLeads.reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Pipeline Value</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="by-source">By Source</TabsTrigger>
              <TabsTrigger value="by-rep">By Rep</TabsTrigger>
              <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      All Leads
                    </CardTitle>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search leads..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-600">Lead</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Priority</th>
                          <th className="text-left p-4 font-medium text-gray-600">Source</th>
                          <th className="text-left p-4 font-medium text-gray-600">Score</th>
                          <th className="text-left p-4 font-medium text-gray-600">Rep</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <LeadRow key={lead.id} lead={lead} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-source" className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Leads by Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(leadsBySource).map(([source, count]) => (
                      <Card key={source} className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{count}</div>
                          <div className="text-sm text-gray-600">{source}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-600">Lead</th>
                          <th className="text-left p-4 font-medium text-gray-600">Source</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Score</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <LeadRow key={lead.id} lead={lead} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-rep" className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Leads by Rep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(leadsByRep).map(([rep, count]) => (
                      <Card key={rep} className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{count}</div>
                          <div className="text-sm text-gray-600">{rep}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-600">Lead</th>
                          <th className="text-left p-4 font-medium text-gray-600">Rep</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Score</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <LeadRow key={lead.id} lead={lead} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-6">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Lead Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {mockLeads.filter(l => l.status === 'qualified').length}
                      </div>
                      <div className="text-sm text-gray-600">Qualified</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {mockLeads.filter(l => l.status === 'contacted').length}
                      </div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {mockLeads.filter(l => l.status === 'new').length}
                      </div>
                      <div className="text-sm text-gray-600">New</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(mockLeads.reduce((sum, l) => sum + l.conversionLikelihood, 0) / mockLeads.length)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Conversion</div>
                    </Card>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-600">Lead</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Conversion %</th>
                          <th className="text-left p-4 font-medium text-gray-600">Last Activity</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr 
                            key={lead.id} 
                            className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleLeadClick(lead.id)}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                                    {lead.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900">{lead.name}</div>
                                  <div className="text-sm text-gray-600">{lead.company}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium">{lead.conversionLikelihood}%</td>
                            <td className="p-4 text-sm text-gray-600">{lead.lastActivity}</td>
                            <td className="p-4 text-sm text-gray-600">${lead.value?.toLocaleString() || '0'}</td>
                            <td className="p-4">
                              <Button size="sm" variant="outline" onClick={(e) => {
                                e.stopPropagation();
                                handleLeadClick(lead.id);
                              }}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
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
        </div>
      </div>
    </div>
  );
};

export default LeadIntelligenceCommand;
