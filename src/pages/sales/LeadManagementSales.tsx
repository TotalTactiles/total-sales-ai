
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Phone, Mail, Calendar } from 'lucide-react';

const LeadManagementSales = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockLeads = [
    {
      id: 1,
      name: 'John Smith',
      company: 'ABC Corp',
      email: 'john@abccorp.com',
      phone: '+1 (555) 123-4567',
      status: 'hot',
      score: 85,
      lastContact: '2024-01-15',
      source: 'Website'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'XYZ Inc',
      email: 'sarah@xyzinc.com',
      phone: '+1 (555) 987-6543',
      status: 'warm',
      score: 72,
      lastContact: '2024-01-14',
      source: 'Referral'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      company: 'Tech Solutions',
      email: 'mike@techsol.com',
      phone: '+1 (555) 456-7890',
      status: 'cold',
      score: 45,
      lastContact: '2024-01-10',
      source: 'Cold Call'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal lead pipeline
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <CardDescription>{lead.company}</CardDescription>
                </div>
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Score: <strong>{lead.score}</strong></span>
                  <span>Source: {lead.source}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last contact: {lead.lastContact}</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadManagementSales;
