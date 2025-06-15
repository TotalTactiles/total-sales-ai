
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  AlertTriangle,
  Lightbulb,
  Grid,
  List
} from 'lucide-react';
import { useDemoData } from '@/contexts/DemoDataContext';
import { useNavigate } from 'react-router-dom';

const SalesLeadManagement: React.FC = () => {
  const { leads } = useDemoData();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTab, setSelectedTab] = useState('All Leads');

  const tabs = [
    { name: 'All Leads', count: 25 },
    { name: 'New', count: 4 },
    { name: 'Contacted', count: 5 },
    { name: 'Qualified', count: 6 }
  ];

  const leadData = [
    {
      id: 'C1',
      name: 'Contact 15',
      company: 'GlobalSoft',
      status: 'new',
      priority: 'medium',
      score: '97%',
      email: 'contact15@globalsoft.com',
      phone: '+1-555-766-7288',
      lastContact: '2025-06-04T22:00:08.063Z',
      tags: ['Demo Lead']
    },
    {
      id: 'C1',
      name: 'Contact 14', 
      company: 'InnovateCo',
      status: 'contacted',
      priority: 'high',
      score: '81%',
      email: 'contact14@innovateco.com',
      phone: '+1-555-505-2138',
      lastContact: 'Never',
      tags: ['Demo Lead', 'High Value', '+1']
    },
    {
      id: 'C3',
      name: 'Contact 3',
      company: 'GlobalSoft', 
      status: 'new',
      priority: 'medium',
      score: '72%',
      email: 'contact3@globalsoft.com',
      phone: '+1-555-575-7502',
      lastContact: '2025-06-07T07:04:53.327Z',
      tags: ['Demo Lead']
    },
    {
      id: 'C2',
      name: 'Contact 22',
      company: 'DataDriven',
      status: 'proposal',
      priority: 'low',
      score: '82%',
      email: 'contact22@datadriven.com',
      phone: '+1-555-417-3195',
      lastContact: '2025-06-08T06:47:27.667Z',
      tags: ['Demo Lead']
    },
    {
      id: 'C2',
      name: 'Contact 21',
      company: 'GlobalSoft',
      status: 'negotiation',
      priority: 'medium',
      score: '74%',
      email: 'contact21@globalsoft.com',
      phone: '+1-555-766-7185',
      lastContact: '2025-06-23T19:49:72',
      tags: ['Demo Lead']
    },
    {
      id: 'C2',
      name: 'Contact 20',
      company: 'InnovateCo',
      status: 'contacted',
      priority: 'high',
      score: '96%',
      email: 'contact20@innovateco.com',
      phone: '+1-555-797-5949',
      lastContact: 'Never',
      tags: ['Demo Lead', 'High Value', '+1']
    },
    {
      id: 'C2',
      name: 'Contact 2',
      company: 'InnovateCo',
      status: 'proposal',
      priority: 'high',
      score: '37%',
      email: 'contact2@innovateco.com',
      phone: '+1-555-823-1076',
      lastContact: '2025-06-24T20:32:15.491Z',
      tags: ['Demo Lead', 'High Value', '+1']
    },
    {
      id: 'C3',
      name: 'Contact 9',
      company: 'GlobalSoft',
      status: 'qualified',
      priority: 'low',
      score: '44%',
      email: 'contact9@globalsoft.com',
      phone: '+1-555-238-9446',
      lastContact: '2025-06-29T11:37:48.732Z',
      tags: ['Demo Lead']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Demo Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white">Demo Mode</Badge>
              <div>
                <h3 className="font-semibold text-blue-800">Exploring the Lead Management Workspace</h3>
                <p className="text-blue-600 text-sm">This is mock data showing how your lead management workflow would look with real leads and activities.</p>
              </div>
            </div>
            <Button variant="outline" className="text-blue-600 border-blue-300">
              Interactive Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">Exploring with demo data - see how your leads would appear in the system</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Import Leads
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setSelectedTab(tab.name)}
            className={`pb-2 font-medium transition-colors ${
              selectedTab === tab.name
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Lead Pipeline Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Lead Pipeline</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">1 need attention</Badge>
                <Button variant="ghost" size="sm">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  AI Insights
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  className="pl-10 w-64"
                />
              </div>
              <select className="px-3 py-2 border rounded-lg">
                <option>All Status</option>
              </select>
              <select className="px-3 py-2 border rounded-lg">
                <option>All Priority</option>
              </select>
              <select className="px-3 py-2 border rounded-lg">
                <option>AI Optimized</option>
              </select>
              <div className="flex border rounded-lg p-1">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline">
                Customize
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leadData.map((lead, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{lead.id}</span>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  lead.priority === 'high' ? 'bg-red-500' :
                  lead.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                }`}></div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="font-semibold">{lead.name}</h3>
                <p className="text-sm text-muted-foreground">{lead.company}</p>
                
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getPriorityColor(lead.priority)}`}>
                    {lead.score}
                  </span>
                  <span className="text-sm text-muted-foreground">{lead.priority} priority</span>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>{lead.email}</p>
                  <p>{lead.phone}</p>
                  <p>Last: {lead.lastContact === 'Never' ? 'Never' : 'Never'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {lead.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Calendar className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SalesLeadManagement;
