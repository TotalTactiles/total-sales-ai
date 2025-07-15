
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Filter, Plus, Megaphone } from 'lucide-react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import AdPlatformIntegration from '@/components/LeadManagement/AdPlatformIntegration';

const ManagerLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock leads data
  const leads = [
    { id: 1, name: 'John Smith', company: 'Tech Corp', email: 'john@techcorp.com', phone: '+1234567890', status: 'new', assignedTo: 'Sarah Johnson', score: 85, likelihood: 78 },
    { id: 2, name: 'Jane Doe', company: 'StartupXYZ', email: 'jane@startup.com', phone: '+1234567891', status: 'contacted', assignedTo: 'Mike Chen', score: 72, likelihood: 65 },
    { id: 3, name: 'Bob Wilson', company: 'Enterprise Inc', email: 'bob@enterprise.com', phone: '+1234567892', status: 'qualified', assignedTo: 'Lisa Park', score: 91, likelihood: 88 },
    { id: 4, name: 'Alice Brown', company: 'Growth Co', email: 'alice@growth.com', phone: '+1234567893', status: 'proposal', assignedTo: 'Sarah Johnson', score: 89, likelihood: 82 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600">Manage and assign leads to your team</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>

        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Leads
            </TabsTrigger>
            <TabsTrigger value="ad-platforms" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Ad Platform Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            {/* Search and Filter */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Leads ({filteredLeads.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search leads by name or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                  </select>
                </div>

                {/* Leads Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Lead</th>
                        <th className="text-left py-3 px-4">Company</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Assigned To</th>
                        <th className="text-left py-3 px-4">Score</th>
                        <th className="text-left py-3 px-4">Likelihood</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-sm text-gray-600">{lead.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{lead.company}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{lead.assignedTo}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-800">{lead.score}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${lead.likelihood}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{lead.likelihood}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">Reassign</Button>
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

          <TabsContent value="ad-platforms">
            <AdPlatformIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerLeads;
