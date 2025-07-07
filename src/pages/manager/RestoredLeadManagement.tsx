
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Download,
  Distribute,
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Eye,
  Phone,
  Mail
} from 'lucide-react';

const RestoredLeadManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data matching Image 2 structure
  const summaryCards = [
    { title: 'New Leads', value: '47', icon: Users, color: 'blue' },
    { title: 'Conversion Rate', value: '23.5%', icon: TrendingUp, color: 'green' },
    { title: 'Avg Response Time', value: '12m', icon: Target, color: 'purple' },
    { title: 'Contact Rate', value: '89%', icon: Phone, color: 'orange' }
  ];

  const leadSources = [
    { name: 'Meta Ads', percentage: 20, quality: 48 },
    { name: 'Google Ads', percentage: 20, quality: 33 },
    { name: 'Referral', percentage: 30, quality: 82 },
    { name: 'LinkedIn', percentage: 40, quality: 92 }
  ];

  const costPerLead = [
    { source: 'Meta Ads', cost: 42 },
    { source: 'Google Ads', cost: 68 },
    { source: 'Referral', cost: 15 },
    { source: 'LinkedIn', cost: 89 }
  ];

  const stalledLeads = [
    { source: 'Meta Ads', count: 12 },
    { source: 'Google Ads', count: 0 },
    { source: 'Referral', count: 8 },
    { source: 'LinkedIn', count: 3 },
    { source: 'Organic', count: 0 }
  ];

  const leadDistribution = [
    { rep: 'James', count: 5 },
    { rep: 'Sarah', count: 2 },
    { rep: 'Mike', count: 1 }
  ];

  const aiInsights = [
    {
      type: 'Source Saturation Alert',
      message: '75% of Meta leads assigned to 2 reps — suggest redistribution.',
      color: 'yellow'
    },
    {
      type: 'Performance Boost Alert',
      message: 'Referral leads converting 48% faster — prioritize to new reps.',
      color: 'green'
    },
    {
      type: 'Top ROAS Pairing',
      message: 'Mike Johnson closing referral leads 3.3x faster than average.',
      color: 'blue'
    }
  ];

  const metricsBlocks = [
    { label: 'Total Leads', value: '3', icon: Users },
    { label: 'Qualified', value: '1', icon: Target },
    { label: 'Avg Conversion', value: '68%', icon: TrendingUp },
    { label: 'Total Pipeline Value', value: '$83,000', icon: DollarSign }
  ];

  const leadOutcomes = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechCorp Solutions',
      assignedRep: 'Mike Johnson',
      status: 'qualified',
      source: 'Meta Ads',
      stage: 'Demo Scheduled',
      timeInStage: '544 days',
      lastActivity: 'Demo booked for next week',
      value: '$25,000',
      roas: '2.4x',
      avatar: 'SC'
    },
    {
      id: '2',
      name: 'Marcus Williams',
      company: 'Startup Inc',
      assignedRep: 'Sarah Johnson',
      status: 'new',
      source: 'Google Ads',
      stage: 'Qualification',
      timeInStage: '545 days',
      lastActivity: 'Email follow-up sent',
      value: '$8,000',
      roas: '1.8x',
      avatar: 'MW'
    },
    {
      id: '3',
      name: 'Jennifer Liu',
      company: 'GlobalTech Networks',
      assignedRep: 'Emily Rodriguez',
      status: 'contacted',
      source: 'LinkedIn',
      stage: 'Executive Review',
      timeInStage: '543 days',
      lastActivity: 'Meeting scheduled',
      value: '$50,000',
      roas: '3.2x',
      avatar: 'JL'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Intelligence Command</h1>
            <p className="text-sm text-gray-600">Oversee pipeline quality, lead sources, and rep outcomes — all in one dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Weekly Digest
            </Button>
            <Button variant="outline" size="sm">
              <Distribute className="h-4 w-4 mr-2" />
              Distribute Leads
            </Button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-${card.color}-600`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Top Lead Sources */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Top Lead Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leadSources.map((source, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{source.name}</span>
                    <span className="font-semibold">{source.percentage}%</span>
                  </div>
                  <Progress value={source.percentage} className="h-1" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Source-to-Close Quality */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Source-to-Close Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Referral</span>
                  <span className="font-semibold text-green-600">48%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Organic</span>
                  <span className="font-semibold text-blue-600">33%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meta Ads</span>
                  <span className="font-semibold text-orange-600">15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost-Per-Lead */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Cost-Per-Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {costPerLead.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.source}</span>
                  <span className="font-semibold">${item.cost}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stalled Leads */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Stalled Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stalledLeads.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.source}</span>
                  <span className={`font-semibold ${item.count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Lead Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Lead Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {leadDistribution.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.rep}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Manager Insights */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">AI Manager Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg bg-${insight.color}-50 border border-${insight.color}-200`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`h-4 w-4 text-${insight.color}-600 mt-0.5 flex-shrink-0`} />
                    <div>
                      <h4 className={`font-semibold text-${insight.color}-800 text-sm`}>{insight.type}</h4>
                      <p className={`text-${insight.color}-700 text-sm mt-1`}>{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metricsBlocks.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-6 border-b border-gray-200">
          <Button variant="ghost" className="text-blue-600 border-b-2 border-blue-600 rounded-none">
            Overview
          </Button>
          <Button variant="ghost" className="text-gray-600">By Source</Button>
          <Button variant="ghost" className="text-gray-600">By Rep</Button>
          <Button variant="ghost" className="text-gray-600">Outcomes</Button>
        </div>

        {/* Lead Outcome Tracker */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle>Lead Outcome Tracker</CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadOutcomes.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">
                        {lead.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <div className="text-gray-600">Assigned Rep</div>
                      <div className="font-medium">{lead.assignedRep}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Status</div>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-gray-600">Source</div>
                      <div className="font-medium">{lead.source}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Stage</div>
                      <Badge className={getStageColor(lead.stage)}>
                        {lead.stage}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-gray-600">Time in Stage</div>
                      <div className="font-medium">{lead.timeInStage}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Last Activity</div>
                      <div className="font-medium">{lead.lastActivity}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Value</div>
                      <div className="font-semibold text-green-600">{lead.value}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">ROAS</div>
                      <div className="font-semibold">{lead.roas}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestoredLeadManagement;
