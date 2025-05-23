
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadCardGrid from '@/components/LeadManagement/LeadCardGrid';
import LeadSlidePanel from '@/components/LeadManagement/LeadSlidePanel';
import LeadIntelligencePanel from '@/components/LeadIntelligence/LeadIntelligencePanel';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

const LeadManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);
  
  // Mock data for leads
  const leads: Lead[] = [
    {
      id: '1',
      name: 'Michael Scott',
      company: 'Dunder Mifflin',
      source: 'LinkedIn',
      email: 'michael@dundermifflin.com',
      phone: '(570) 555-1234',
      status: 'new',
      priority: 'high',
      lastContact: '2 days ago',
      score: 87,
      tags: ['Budget Approved', 'Q1 Implementation'],
      isSensitive: false,
      conversionLikelihood: 78
    },
    {
      id: '2',
      name: 'Jim Halpert',
      company: 'Athlead',
      source: 'Website',
      email: 'jim@athlead.com',
      phone: '(570) 555-5678',
      status: 'contacted',
      priority: 'medium',
      lastContact: '5 days ago',
      score: 74,
      tags: ['Price Sensitive'],
      isSensitive: false,
      conversionLikelihood: 62
    },
    {
      id: '3',
      name: 'Pam Beesly',
      company: 'Pratt Institute',
      source: 'Referral',
      email: 'pam@pratt.edu',
      phone: '(570) 555-9012',
      status: 'qualified',
      priority: 'high',
      lastContact: '1 day ago',
      score: 91,
      tags: ['Hot Lead', 'Demo Scheduled'],
      isSensitive: false,
      conversionLikelihood: 89
    },
    {
      id: '4',
      name: 'Dwight Schrute',
      company: 'Schrute Farms',
      source: 'Website',
      email: 'dwight@schrutefarms.com',
      phone: '(570) 555-3456',
      status: 'new',
      priority: 'low',
      lastContact: '1 week ago',
      score: 65,
      tags: [],
      isSensitive: false,
      conversionLikelihood: 45
    },
    {
      id: '5',
      name: 'Angela Martin',
      company: 'Dunder Mifflin',
      source: 'Website',
      email: 'angela@dundermifflin.com',
      phone: '(570) 555-7890',
      status: 'closed',
      priority: 'medium',
      lastContact: '3 days ago',
      score: 83,
      tags: [],
      isSensitive: false,
      conversionLikelihood: 65
    },
  ];
  
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsSlidePanelOpen(true);
  };

  const handleQuickAction = (action: string, lead: Lead) => {
    switch (action) {
      case 'call':
        toast.success(`Initiating call to ${lead.name}`);
        break;
      case 'email':
        toast.success(`Opening email composer for ${lead.name}`);
        break;
      case 'chat':
        toast.success(`Starting chat with ${lead.name}`);
        break;
      case 'notes':
        toast.success(`Opening notes for ${lead.name}`);
        break;
      case 'ai_assist':
        setSelectedLead(lead);
        setIsIntelligencePanelOpen(true);
        break;
      case 'help':
        toast.success(`Requesting team help for ${lead.name}`);
        break;
      default:
        break;
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
          
          {/* Status Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveFilter('all')}
              >
                All Leads ({leads.length})
              </TabsTrigger>
              <TabsTrigger 
                value="new" 
                onClick={() => setActiveFilter('new')}
              >
                New ({leads.filter(l => l.status === 'new').length})
              </TabsTrigger>
              <TabsTrigger 
                value="contacted" 
                onClick={() => setActiveFilter('contacted')}
              >
                Contacted ({leads.filter(l => l.status === 'contacted').length})
              </TabsTrigger>
              <TabsTrigger 
                value="qualified" 
                onClick={() => setActiveFilter('qualified')}
              >
                Qualified ({leads.filter(l => l.status === 'qualified').length})
              </TabsTrigger>
              <TabsTrigger 
                value="closed" 
                onClick={() => setActiveFilter('closed')}
              >
                Closed ({leads.filter(l => l.status === 'closed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <LeadCardGrid
                leads={filteredLeads}
                onLeadClick={handleLeadClick}
                onQuickAction={handleQuickAction}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Lead Slide Panel */}
      <LeadSlidePanel
        lead={selectedLead}
        isOpen={isSlidePanelOpen}
        onClose={() => {
          setIsSlidePanelOpen(false);
          setSelectedLead(null);
        }}
      />

      {/* Lead Intelligence Panel */}
      <LeadIntelligencePanel
        lead={selectedLead}
        isOpen={isIntelligencePanelOpen}
        onClose={() => {
          setIsIntelligencePanelOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
};

export default LeadManagement;
