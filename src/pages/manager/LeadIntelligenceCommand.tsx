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
  Eye,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  UserCheck,
  BarChart3,
  Share
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Demo Scheduled': return 'bg-purple-100 text-purple-800';
      case 'Qualification': return 'bg-blue-100 text-blue-800';
      case 'Executive Review': return 'bg-orange-100 text-orange-800';
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

  // Analytics data
  const leadSourceData = [
    { source: 'Meta Ads', percentage: '20%', leads: 8 },
    { source: 'Google Ads', percentage: '20%', leads: 6 },
    { source: 'Referral', percentage: '20%', leads: 4 },
    { source: 'LinkedIn', percentage: '40%', leads: 2 }
  ];

  const sourceQualityData = [
    { source: 'Referrals', quality: '48%', color: 'text-green-600' },
    { source: 'Organic', quality: '31%', color: 'text-blue-600' },
    { source: 'Meta Ads', quality: '12%', color: 'text-orange-600' }
  ];

  const costPerLeadData = [
    { source: 'Meta Ads', cost: '$42' },
    { source: 'Google Ads', cost: '$68' },
    { source: 'Referral', cost: '$15' },
    { source: 'LinkedIn', cost: '$89' }
  ];

  const stalledLeadsData = [
    { source: 'Meta Ads', count: 1 },
    { source: 'Google Ads', count: 0 },
    { source: 'Referral', count: 0 },
    { source: 'LinkedIn', count: 1 },
    { source: 'Organic', count: 0 }
  ];

  const leadDistributionData = [
    { rep: 'James', leads: 5 },
    { rep: 'Sarah', leads: 2 },
    { rep: 'Mike', leads: 1 }
  ];

  const handleWeeklyDigest = () => {
    // Mock export functionality
    alert('Weekly Digest exported successfully! (Demo mode)');
  };

  const handleDistributeLeads = () => {
    // Mock lead distribution functionality
    alert('Lead Distribution modal opened (Demo mode)');
  };

  const calculateDaysInStage = (updatedAt: string) => {
    const daysDiff = Math.floor((new Date().getTime() - new Date(updatedAt).getTime()) / (1000 * 3600 * 24));
    return Math.max(1, daysDiff);
  };

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
      <td className="p-4 text-sm text-gray-600">{lead.rep || 'Unassigned'}</td>
      <td className="p-4">
        <Badge className={getStatusColor(lead.status)}>
          {lead.status}
        </Badge>
      </td>
      <td className="p-4 text-sm text-gray-600">{lead.source}</td>
      <td className="p-4">
        <Badge className={getStageColor(lead.stage || 'New')}>
          {lead.stage || 'New'}
        </Badge>
      </td>
      <td className="p-4 text-sm text-gray-600">{calculateDaysInStage(lead.updatedAt)} days</td>
      <td className="p-4 text-sm text-gray-600">{lead.lastActivity}</td>
      <td className="p-4 text-sm text-gray-600">${lead.value?.toLocaleString() || '0'}</td>
      <td className="p-4 text-sm font-medium">{lead.roas || '0'}x</td>
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
              <p className="text-gray-600">Oversee pipeline quality, lead sources, and rep outcomes — all in one dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleWeeklyDigest}>
                <Download className="h-4 w-4 mr-2" />
                Weekly Digest
              </Button>
              <Button variant="outline" size="sm" onClick={handleDistributeLeads}>
                <Share className="h-4 w-4 mr-2" />
                Distribute Leads
              </Button>
            </div>
          </div>

          {/* Manager Lead Insights Overview - 5 Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Top Lead Sources</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {leadSourceData.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.source}</span>
                      <span className="font-medium">{item.percentage}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Source-to-Close Quality</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {sourceQualityData.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.source}</span>
                      <span className={`font-medium ${item.color}`}>{item.quality}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Cost-Per-Lead</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {costPerLeadData.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.source}</span>
                      <span className="font-medium">{item.cost}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Stalled Leads</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {stalledLeadsData.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.source}</span>
                      <span className={`font-medium ${item.count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Lead Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {leadDistributionData.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.rep}</span>
                      <span className="font-medium">{item.leads}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Manager Insights */}
          <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                AI Manager Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <h4 className="font-medium text-orange-800">Source Saturation Alert</h4>
                  </div>
                  <p className="text-sm text-orange-700">
                    75% of Meta leads assigned to 2 reps — suggest redistribution.
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-green-800">Performance Boost Alert</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Referral leads converting 48% faster — prioritize to new reps.
                  </p>
                </div>
                
                <div className="bg-white/60 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Top ROAS Pairing</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Mike Johnson closing referral leads 3.3x faster than average.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                      Lead Outcome Tracker
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
                          <th className="text-left p-4 font-medium text-gray-600">Lead Name</th>
                          <th className="text-left p-4 font-medium text-gray-600">Assigned Rep</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Source</th>
                          <th className="text-left p-4 font-medium text-gray-600">Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Time in Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Last Activity</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">ROAS</th>
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
                          <th className="text-left p-4 font-medium text-gray-600">Lead Name</th>
                          <th className="text-left p-4 font-medium text-gray-600">Assigned Rep</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Source</th>
                          <th className="text-left p-4 font-medium text-gray-600">Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Time in Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Last Activity</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">ROAS</th>
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
                          <th className="text-left p-4 font-medium text-gray-600">Lead Name</th>
                          <th className="text-left p-4 font-medium text-gray-600">Assigned Rep</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Source</th>
                          <th className="text-left p-4 font-medium text-gray-600">Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Time in Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Last Activity</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">ROAS</th>
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
                          <th className="text-left p-4 font-medium text-gray-600">Lead Name</th>
                          <th className="text-left p-4 font-medium text-gray-600">Assigned Rep</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Source</th>
                          <th className="text-left p-4 font-medium text-gray-600">Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Time in Stage</th>
                          <th className="text-left p-4 font-medium text-gray-600">Last Activity</th>
                          <th className="text-left p-4 font-medium text-gray-600">Value</th>
                          <th className="text-left p-4 font-medium text-gray-600">ROAS</th>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LeadIntelligenceCommand;
