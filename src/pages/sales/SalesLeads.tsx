
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Phone, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';

const SalesLeads = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock leads data for current sales rep
  const myLeads = [
    { id: 1, name: 'John Smith', company: 'Tech Corp', email: 'john@techcorp.com', phone: '+1234567890', status: 'new', priority: 'high', score: 85, likelihood: 78, nextAction: 'Initial call' },
    { id: 2, name: 'Jane Doe', company: 'StartupXYZ', email: 'jane@startup.com', phone: '+1234567891', status: 'contacted', priority: 'medium', score: 72, likelihood: 65, nextAction: 'Follow-up demo' },
    { id: 3, name: 'Bob Wilson', company: 'Enterprise Inc', email: 'bob@enterprise.com', phone: '+1234567892', status: 'qualified', priority: 'high', score: 91, likelihood: 88, nextAction: 'Send proposal' },
    { id: 4, name: 'Alice Brown', company: 'Growth Co', email: 'alice@growth.com', phone: '+1234567893', status: 'demo', priority: 'medium', score: 89, likelihood: 82, nextAction: 'Schedule follow-up' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'demo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
  };

  const filteredLeads = myLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SalesRepNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Leads</h1>
            <p className="text-gray-600">Manage your assigned leads and opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {filteredLeads.length} Active Leads
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your leads by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/sales/lead/${lead.id}`)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <p className="text-gray-600">{lead.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(lead.priority)}>
                      {lead.priority}
                    </Badge>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Contact Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </div>

                  {/* Scoring */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Lead Score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">{lead.score}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conversion Likelihood</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${lead.likelihood}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{lead.likelihood}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">Next: {lead.nextAction}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesLeads;
