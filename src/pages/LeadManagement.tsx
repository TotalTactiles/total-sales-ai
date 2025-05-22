
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Phone,
  MessageCircle,
  Mail,
  ArrowUp,
  ArrowDown,
  User
} from 'lucide-react';

const LeadManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Mock data for leads
  const leads = [
    {
      id: 1,
      name: 'Michael Scott',
      company: 'Dunder Mifflin',
      position: 'Regional Manager',
      email: 'michael@dundermifflin.com',
      phone: '(570) 555-1234',
      status: 'new',
      priority: 'high',
      lastContact: '2 days ago',
      score: 87
    },
    {
      id: 2,
      name: 'Jim Halpert',
      company: 'Athlead',
      position: 'Sales Manager',
      email: 'jim@athlead.com',
      phone: '(570) 555-5678',
      status: 'contacted',
      priority: 'medium',
      lastContact: '5 days ago',
      score: 74
    },
    {
      id: 3,
      name: 'Pam Beesly',
      company: 'Pratt Institute',
      position: 'Art Director',
      email: 'pam@pratt.edu',
      phone: '(570) 555-9012',
      status: 'qualified',
      priority: 'high',
      lastContact: '1 day ago',
      score: 91
    },
    {
      id: 4,
      name: 'Dwight Schrute',
      company: 'Schrute Farms',
      position: 'Owner',
      email: 'dwight@schrutefarms.com',
      phone: '(570) 555-3456',
      status: 'new',
      priority: 'low',
      lastContact: '1 week ago',
      score: 65
    },
    {
      id: 5,
      name: 'Angela Martin',
      company: 'Dunder Mifflin',
      position: 'Accountant',
      email: 'angela@dundermifflin.com',
      phone: '(570) 555-7890',
      status: 'closed',
      priority: 'medium',
      lastContact: '3 days ago',
      score: 83
    },
  ];
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-salesRed';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-slate-500';
      default:
        return 'text-slate-500';
    }
  };
  
  const filteredLeads = activeFilter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === activeFilter);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-salesBlue">Lead Management</h1>
            <Button className="bg-salesGreen hover:bg-salesGreen-dark">
              + Add New Lead
            </Button>
          </div>
          
          {/* Search and filters section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search leads..." 
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex gap-2">
                Sort
                {sortDirection === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Tabs for lead status */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-2">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveFilter('all')}
              >
                All Leads
              </TabsTrigger>
              <TabsTrigger 
                value="new" 
                onClick={() => setActiveFilter('new')}
              >
                New
              </TabsTrigger>
              <TabsTrigger 
                value="contacted" 
                onClick={() => setActiveFilter('contacted')}
              >
                Contacted
              </TabsTrigger>
              <TabsTrigger 
                value="qualified" 
                onClick={() => setActiveFilter('qualified')}
              >
                Qualified
              </TabsTrigger>
              <TabsTrigger 
                value="closed" 
                onClick={() => setActiveFilter('closed')}
              >
                Closed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">All Leads ({filteredLeads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Company</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Priority</th>
                          <th className="pb-2">Score</th>
                          <th className="pb-2">Last Contact</th>
                          <th className="pb-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="border-b hover:bg-slate-50">
                            <td className="py-4">
                              <div className="font-medium">{lead.name}</div>
                              <div className="text-sm text-slate-500">{lead.position}</div>
                            </td>
                            <td className="py-4">{lead.company}</td>
                            <td className="py-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(lead.status)}`}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`font-medium ${getPriorityClass(lead.priority)}`}>
                                {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                              </span>
                            </td>
                            <td className="py-4">{lead.score}%</td>
                            <td className="py-4">{lead.lastContact}</td>
                            <td className="py-4">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <User className="h-4 w-4" />
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
            
            <TabsContent value="new" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">New Leads ({filteredLeads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Same table structure as "all" tab */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Company</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Priority</th>
                          <th className="pb-2">Score</th>
                          <th className="pb-2">Last Contact</th>
                          <th className="pb-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="border-b hover:bg-slate-50">
                            <td className="py-4">
                              <div className="font-medium">{lead.name}</div>
                              <div className="text-sm text-slate-500">{lead.position}</div>
                            </td>
                            <td className="py-4">{lead.company}</td>
                            <td className="py-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(lead.status)}`}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`font-medium ${getPriorityClass(lead.priority)}`}>
                                {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                              </span>
                            </td>
                            <td className="py-4">{lead.score}%</td>
                            <td className="py-4">{lead.lastContact}</td>
                            <td className="py-4">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <User className="h-4 w-4" />
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
            
            {/* Additional tab contents would be similar */}
            <TabsContent value="contacted" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Contacted Leads ({filteredLeads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 text-center text-slate-500">
                    Similar table structure as the "all" tab, filtered for contacted leads
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qualified" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Qualified Leads ({filteredLeads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 text-center text-slate-500">
                    Similar table structure as the "all" tab, filtered for qualified leads
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="closed" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Closed Leads ({filteredLeads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 text-center text-slate-500">
                    Similar table structure as the "all" tab, filtered for closed leads
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

export default LeadManagement;
