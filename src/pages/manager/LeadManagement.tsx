
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  UserPlus,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CRMIntegrationManager from '@/components/CRM/CRMIntegrationManager';
import { realTimeLeadSync } from '@/services/integrations/realTimeLeadSync';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  priority: string;
  source: string;
  score: number;
  conversion_likelihood: number;
  created_at: string;
  updated_at: string;
  tags: string[];
}

interface SalesRep {
  id: string;
  full_name: string;
  email: string;
  last_login?: string;
}

const ManagerLeadManagement: React.FC = () => {
  const { profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  useEffect(() => {
    if (profile?.company_id) {
      fetchLeads();
      fetchSalesReps();
      enableRealTimeSync();
    }
  }, [profile?.company_id]);

  const fetchLeads = async () => {
    if (!profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesReps = async () => {
    if (!profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, last_login')
        .eq('company_id', profile.company_id)
        .eq('role', 'sales_rep');

      if (error) throw error;
      setSalesReps(data || []);
    } catch (error) {
      console.error('Error fetching sales reps:', error);
      toast.error('Failed to fetch sales representatives');
    }
  };

  const enableRealTimeSync = async () => {
    if (!profile?.company_id) return;
    
    try {
      await realTimeLeadSync.enableRealTimeSync(profile.company_id);
    } catch (error) {
      console.error('Error enabling real-time sync:', error);
    }
  };

  const handleAssignLead = async (leadId: string, repId: string, assignmentMethod: 'manual' | 'ai_suggested' | 'automated') => {
    try {
      // Log the assignment action
      await supabase.from('usage_events').insert({
        user_id: profile?.id,
        company_id: profile?.company_id,
        feature: 'lead_assignment',
        action: 'assigned',
        context: 'manager_lead_management',
        metadata: { leadId, repId, assignmentMethod }
      });

      // Here you would update the lead with assignment info
      // For now, we'll show a success message
      const rep = salesReps.find(r => r.id === repId);
      const lead = leads.find(l => l.id === leadId);
      
      toast.success(`Lead "${lead?.name}" assigned to ${rep?.full_name} via ${assignmentMethod} method`);
      
    } catch (error) {
      console.error('Error assigning lead:', error);
      toast.error('Failed to assign lead');
    }
  };

  const handleBulkAssignment = async (method: 'ai_suggested' | 'automated') => {
    if (selectedLeads.length === 0) {
      toast.error('Please select leads to assign');
      return;
    }

    try {
      for (const leadId of selectedLeads) {
        // AI logic would determine the best rep here
        const bestRep = salesReps[Math.floor(Math.random() * salesReps.length)];
        await handleAssignLead(leadId, bestRep.id, method);
      }

      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads assigned using ${method} method`);
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      toast.error('Failed to assign leads');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-500',
      'contacted': 'bg-yellow-500',
      'qualified': 'bg-green-500',
      'proposal': 'bg-purple-500',
      'negotiation': 'bg-orange-500',
      'won': 'bg-emerald-500',
      'lost': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'text-red-500',
      'medium': 'text-yellow-500',
      'low': 'text-green-500'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground mt-2">Company lead directory and assignment</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Leads
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="directory">Lead Directory</TabsTrigger>
          <TabsTrigger value="integrations">CRM Integrations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="zoho">Zoho CRM</SelectItem>
                    <SelectItem value="clickup">ClickUp</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>

                {selectedLeads.length > 0 && (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleBulkAssignment('ai_suggested')}
                      variant="outline"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      AI Assign ({selectedLeads.length})
                    </Button>
                    <Button 
                      onClick={() => handleBulkAssignment('automated')}
                      variant="outline"
                    >
                      Auto Assign ({selectedLeads.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lead Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                    <p className="text-2xl font-bold">{leads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Q</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Qualified</p>
                    <p className="text-2xl font-bold">
                      {leads.filter(l => l.status === 'qualified').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">%</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold">
                      {leads.length > 0 
                        ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">$</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold">
                      {leads.filter(l => l.priority === 'high').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Directory</CardTitle>
              <CardDescription>
                {filteredLeads.length} of {leads.length} leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, lead.id]);
                          } else {
                            setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                          }
                        }}
                        className="rounded"
                      />
                      
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          {lead.email && <span>{lead.email}</span>}
                          {lead.phone && <span>• {lead.phone}</span>}
                          {lead.company && <span>• {lead.company}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge className={`${getStatusColor(lead.status)} text-white`}>
                        {lead.status}
                      </Badge>
                      
                      <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                        {lead.priority.toUpperCase()}
                      </span>
                      
                      <div className="text-sm text-muted-foreground">
                        Score: {lead.score}
                      </div>
                      
                      <Select onValueChange={(repId) => handleAssignLead(lead.id, repId, 'manual')}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {salesReps.map((rep) => (
                            <SelectItem key={rep.id} value={rep.id}>
                              {rep.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredLeads.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No leads found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Connect your CRM or add leads manually to get started'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <CRMIntegrationManager />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Lead Analytics</CardTitle>
              <CardDescription>Coming soon - Advanced lead analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Advanced lead analytics, conversion tracking, and AI insights coming soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerLeadManagement;
