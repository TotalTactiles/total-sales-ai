
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';

const ManagerLeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const leads = [
    {
      id: '1',
      name: 'TechCorp Inc.',
      contact: 'John Smith',
      email: 'john@techcorp.com',
      phone: '+1 555-0123',
      status: 'qualified',
      value: 125000,
      assignedTo: 'Sarah Johnson',
      lastContact: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Global Solutions',
      contact: 'Maria Rodriguez',
      email: 'maria@globalsol.com',
      phone: '+1 555-0124',
      status: 'proposal',
      value: 85000,
      assignedTo: 'Michael Chen',
      lastContact: '2024-01-14',
      priority: 'high'
    },
    {
      id: '3',
      name: 'StartupXYZ',
      contact: 'Alex Kim',
      email: 'alex@startupxyz.com',
      phone: '+1 555-0125',
      status: 'contacted',
      value: 45000,
      assignedTo: 'Jasmine Lee',
      lastContact: '2024-01-13',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Enterprise Corp',
      contact: 'David Wilson',
      email: 'david@enterprise.com',
      phone: '+1 555-0126',
      status: 'new',
      value: 200000,
      assignedTo: 'David Park',
      lastContact: '2024-01-12',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'proposal': return 'bg-purple-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Manage and track all team leads</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">Active pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Badge className="bg-red-500 text-white">!</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.priority === 'high').length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total potential</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <Badge className="bg-green-500 text-white">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.status === 'qualified' || l.status === 'proposal').length}</div>
            <p className="text-xs text-muted-foreground">Ready to close</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>Track and manage all team leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.contact}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{lead.email}</p>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(lead.status)} text-white capitalize`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(lead.priority)} text-white capitalize`}>
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${lead.value.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{lead.assignedTo}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{lead.lastContact}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerLeadManagement;
