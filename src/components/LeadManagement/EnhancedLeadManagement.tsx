
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Settings, 
  Phone, 
  Mail, 
  Calendar, 
  FileText,
  Upload,
  ArrowUpDown,
  MoreHorizontal,
  Star,
  TrendingUp,
  Eye,
  Clock,
  Target,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedLeadManagementProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  isDemo?: boolean;
}

const EnhancedLeadManagement: React.FC<EnhancedLeadManagementProps> = ({
  leads,
  onLeadSelect,
  isDemo = false
}) => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ai_optimized');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Calculate stats for tabs
  const getLeadStats = () => {
    return {
      all: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      proposal: leads.filter(l => l.status === 'proposal').length,
      negotiation: leads.filter(l => l.status === 'negotiation').length,
      closed_won: leads.filter(l => l.status === 'closed_won').length,
      highPriority: leads.filter(l => l.priority === 'high').length,
      highScore: leads.filter(l => l.score > 80).length
    };
  };

  const stats = getLeadStats();

  // Filter and sort leads based on active tab and filters
  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      // Tab-based filtering
      if (activeTab !== 'all') {
        switch (activeTab) {
          case 'new':
            if (lead.status !== 'new') return false;
            break;
          case 'contacted':
            if (lead.status !== 'contacted') return false;
            break;
          case 'qualified':
            if (lead.status !== 'qualified') return false;
            break;
          case 'proposal':
            if (lead.status !== 'proposal') return false;
            break;
          case 'negotiation':
            if (lead.status !== 'negotiation') return false;
            break;
          case 'closed_won':
            if (lead.status !== 'closed_won') return false;
            break;
          case 'high_priority':
            if (lead.priority !== 'high') return false;
            break;
          case 'high_score':
            if (lead.score <= 80) return false;
            break;
        }
      }

      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort leads
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ai_optimized':
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          const aScore = (a.score || 0) * (priorityWeight[a.priority] || 1);
          const bScore = (b.score || 0) * (priorityWeight[b.priority] || 1);
          return bScore - aScore;
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'last_contacted':
          const aDate = a.lastContact ? new Date(a.lastContact).getTime() : 0;
          const bDate = b.lastContact ? new Date(b.lastContact).getTime() : 0;
          return bDate - aDate;
        case 'value':
          return (b.value || 0) - (a.value || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [leads, searchTerm, statusFilter, priorityFilter, sortBy, activeTab]);

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      qualified: 'bg-green-100 text-green-800 border-green-200',
      proposal: 'bg-purple-100 text-purple-800 border-purple-200',
      negotiation: 'bg-orange-100 text-orange-800 border-orange-200',
      closed_won: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      closed_lost: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleQuickAction = (action: string, lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`${action} action for lead:`, lead.name);
    // Implement quick actions here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">
            {isDemo 
              ? "Exploring with demo data – see how your leads would appear in the system"
              : `Welcome back, ${profile?.full_name || 'Sales Rep'}. Manage your pipeline effectively.`
            }
          </p>
        </div>

        {/* Stats Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-white border border-gray-200">
            <TabsTrigger value="all" className="flex flex-col items-center gap-1 py-3 px-2">
              <Target className="h-4 w-4" />
              <span className="text-xs font-medium">All Leads</span>
              <Badge variant="secondary" className="text-xs">{stats.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex flex-col items-center gap-1 py-3 px-2">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium">New</span>
              <Badge variant="secondary" className="text-xs">{stats.new}</Badge>
            </TabsTrigger>
            <TabsTrigger value="contacted" className="flex flex-col items-center gap-1 py-3 px-2">
              <Phone className="h-4 w-4" />
              <span className="text-xs font-medium">Contacted</span>
              <Badge variant="secondary" className="text-xs">{stats.contacted}</Badge>
            </TabsTrigger>
            <TabsTrigger value="qualified" className="flex flex-col items-center gap-1 py-3 px-2">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Qualified</span>
              <Badge variant="secondary" className="text-xs">{stats.qualified}</Badge>
            </TabsTrigger>
            <TabsTrigger value="proposal" className="flex flex-col items-center gap-1 py-3 px-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium">Proposal</span>
              <Badge variant="secondary" className="text-xs">{stats.proposal}</Badge>
            </TabsTrigger>
            <TabsTrigger value="negotiation" className="flex flex-col items-center gap-1 py-3 px-2">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Negotiation</span>
              <Badge variant="secondary" className="text-xs">{stats.negotiation}</Badge>
            </TabsTrigger>
            <TabsTrigger value="closed_won" className="flex flex-col items-center gap-1 py-3 px-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Won</span>
              <Badge variant="secondary" className="text-xs">{stats.closed_won}</Badge>
            </TabsTrigger>
            <TabsTrigger value="high_score" className="flex flex-col items-center gap-1 py-3 px-2">
              <Star className="h-4 w-4" />
              <span className="text-xs font-medium">High Score</span>
              <Badge variant="secondary" className="text-xs">{stats.highScore}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Search + Filter Row */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed_won">Won</SelectItem>
                      <SelectItem value="closed_lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Smart Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai_optimized">🤖 AI Optimized</SelectItem>
                      <SelectItem value="score">Sort by Score</SelectItem>
                      <SelectItem value="last_contacted">Last Contacted</SelectItem>
                      <SelectItem value="value">Deal Value</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomize(!showCustomize)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600">AI sync: 2m ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Cards Content for each tab */}
          <TabsContent value={activeTab} className="mt-6">
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredAndSortedLeads.map((lead) => (
                <Card 
                  key={lead.id} 
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 bg-white"
                  onClick={() => onLeadSelect(lead)}
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{lead.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{lead.company}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{lead.score}</span>
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">{lead.conversionLikelihood}%</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    {/* Tags Row */}
                    <div className="flex flex-wrap gap-2">
                      {lead.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                          {tag}
                        </Badge>
                      ))}
                      <Badge className={`text-xs border ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`text-xs border ${getPriorityColor(lead.priority)}`}>
                        {lead.priority} priority
                      </Badge>
                    </div>

                    {/* Last Contact */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Last contact: {lead.lastContact || 'Never'}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleQuickAction('call', lead, e)}
                          className="flex items-center gap-1 hover:bg-blue-50"
                        >
                          <Phone className="h-3 w-3" />
                          <span className="hidden sm:inline">Call</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleQuickAction('email', lead, e)}
                          className="flex items-center gap-1 hover:bg-green-50"
                        >
                          <Mail className="h-3 w-3" />
                          <span className="hidden sm:inline">Email</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleQuickAction('calendar', lead, e)}
                          className="flex items-center gap-1 hover:bg-purple-50"
                        >
                          <Calendar className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleQuickAction('more', lead, e)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Results Summary */}
            <div className="text-center text-sm text-gray-500 py-4">
              Showing {filteredAndSortedLeads.length} of {leads.length} leads
              {sortBy === 'ai_optimized' && (
                <span className="ml-2 text-blue-600">• Sorted by AI optimization for highest conversion probability</span>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedLeadManagement;
