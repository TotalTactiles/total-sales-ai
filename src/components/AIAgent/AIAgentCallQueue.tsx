
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter,
  ChevronDown, 
  Phone,
  Calendar,
  Clock,
  Play, 
  Pause,
  SkipForward,
  Download,
  ArrowDownUp
} from 'lucide-react';

const AIAgentCallQueue = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // Sample queued leads
  const queuedLeads = [
    { 
      id: 'lead1', 
      name: 'Alpha Technologies', 
      contact: 'John Miller',
      phone: '(555) 123-4567', 
      priority: 'High',
      status: 'Cold Lead',
      source: 'Website Inquiry',
      scheduledTime: '10:30 AM',
      assignedRep: 'David Scott',
      tags: ['Tech', 'Enterprise', '$50k+ Potential']
    },
    { 
      id: 'lead2', 
      name: 'Beta Solutions', 
      contact: 'Sarah Johnson',
      phone: '(555) 234-5678', 
      priority: 'Medium',
      status: 'No Answer (3 attempts)',
      source: 'Trade Show',
      scheduledTime: '11:15 AM',
      assignedRep: 'Sam Smith',
      tags: ['Healthcare', 'Mid-Market']
    },
    { 
      id: 'lead3', 
      name: 'Delta Systems', 
      contact: 'Mike Roberts',
      phone: '(555) 345-6789', 
      priority: 'Low',
      status: 'Reception Only',
      source: 'Referral',
      scheduledTime: '1:30 PM',
      assignedRep: 'Sam Smith',
      tags: ['Manufacturing', 'SMB']
    },
    { 
      id: 'lead4', 
      name: 'Gamma Enterprises', 
      contact: 'Lisa Wong',
      phone: '(555) 456-7890', 
      priority: 'Medium',
      status: 'Cold Lead',
      source: 'LinkedIn',
      scheduledTime: '2:45 PM',
      assignedRep: 'David Scott',
      tags: ['Finance', 'Enterprise']
    },
    { 
      id: 'lead5', 
      name: 'Theta Corp', 
      contact: 'Robert Chen',
      phone: '(555) 567-8901', 
      priority: 'High',
      status: 'No Answer (5 attempts)',
      source: 'Marketing Campaign',
      scheduledTime: '3:30 PM',
      assignedRep: 'Sam Smith',
      tags: ['Retail', 'Enterprise', 'International']
    },
  ];
  
  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId) 
        : [...prev, leadId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedLeads.length === queuedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(queuedLeads.map(lead => lead.id));
    }
  };
  
  const handleBulkAction = (action: string) => {
    if (selectedLeads.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: `${action} Successfully`,
      description: `Action applied to ${selectedLeads.length} selected leads.`,
    });
    
    // In a real app, you would make API calls here
    if (action === "Remove from Queue") {
      setSelectedLeads([]);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-500">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge className="bg-slate-500">{priority}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Call Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search leads..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-10">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-10">
                  <ArrowDownUp className="h-4 w-4" />
                  Sort
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </div>
            </div>
            
            {/* Bulk Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("Prioritize")}>
                <Play className="h-3 w-3 mr-1" />
                Prioritize
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("Pause")}>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("Skip")}>
                <SkipForward className="h-3 w-3 mr-1" />
                Skip
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("Assign to Human")}>
                Assign to Human
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBulkAction("Remove from Queue")}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Remove from Queue
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("Export")}>
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
            
            {/* Queue Table */}
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedLeads.length === queuedLeads.length && queuedLeads.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        Lead
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Priority</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Scheduled</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Assigned Rep</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queuedLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={() => handleSelectLead(lead.id)}
                          />
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-slate-500">{lead.contact}</p>
                            <p className="text-xs text-slate-400">{lead.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getPriorityBadge(lead.priority)}
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm">{lead.status}</p>
                          <p className="text-xs text-slate-500">{lead.source}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-sm">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                          {lead.scheduledTime}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm">{lead.assignedRep}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => {
                            toast({
                              title: "Call Prioritized",
                              description: `${lead.name} will be called next by the AI agent.`
                            });
                          }}>
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => {
                            toast({
                              title: "Call Scheduled",
                              description: `Call to ${lead.name} has been scheduled.`
                            });
                          }}>
                            <Calendar className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => {
                            toast({
                              title: "Manual Call Initiated",
                              description: `Starting manual call to ${lead.name}.`
                            });
                          }}>
                            <Phone className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">Showing 5 of 24 queued leads</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAgentCallQueue;
