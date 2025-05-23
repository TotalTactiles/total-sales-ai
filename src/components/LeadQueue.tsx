import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Calendar, ChevronDown, Brain } from "lucide-react";
import LeadIntelligencePanel from './LeadIntelligence/LeadIntelligencePanel';
import UsageTracker from './AIBrain/UsageTracker';

interface Lead {
  id: string;
  name: string;
  company: string;
  source: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  lastContact?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  objection?: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  tags: string[];
  isSensitive: boolean;
  conversionLikelihood: number;
}

const LeadQueue = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);

  const leads: Lead[] = [
    { 
      id: '1', 
      name: "Michael Scott", 
      company: "Dunder Mifflin", 
      source: "LinkedIn", 
      score: 85, 
      priority: 'high',
      sentiment: 'positive',
      objection: 'Needs approval',
      email: 'michael@dundermifflin.com',
      phone: '(570) 555-1234',
      status: 'new',
      tags: ['Budget Approved'],
      isSensitive: false,
      conversionLikelihood: 78
    },
    { 
      id: '2', 
      name: "Jim Halpert", 
      company: "Athlead", 
      source: "Facebook", 
      score: 72, 
      priority: 'medium', 
      lastContact: '2 days ago',
      sentiment: 'neutral',
      objection: 'Price concern',
      email: 'jim@athlead.com',
      phone: '(570) 555-5678',
      status: 'contacted',
      tags: ['Price Sensitive'],
      isSensitive: false,
      conversionLikelihood: 62
    },
    { 
      id: '3', 
      name: "Pam Beesly", 
      company: "Pratt Institute", 
      source: "Referral", 
      score: 93, 
      priority: 'high',
      sentiment: 'positive',
      email: 'pam@pratt.edu',
      phone: '(570) 555-9012',
      status: 'qualified',
      tags: ['Hot Lead', 'Demo Scheduled'],
      isSensitive: false,
      conversionLikelihood: 89
    },
    { 
      id: '4', 
      name: "Dwight Schrute", 
      company: "Schrute Farms", 
      source: "Website", 
      score: 68, 
      priority: 'medium', 
      lastContact: '1 week ago',
      sentiment: 'negative',
      objection: 'Current provider',
      email: 'dwight@schrutefarms.com',
      phone: '(570) 555-3456',
      status: 'new',
      tags: ['Existing Provider'],
      isSensitive: false,
      conversionLikelihood: 45
    },
    { 
      id: '5', 
      name: "Ryan Howard", 
      company: "WUPHF.com", 
      source: "LinkedIn", 
      score: 64, 
      priority: 'low', 
      lastContact: '3 days ago',
      sentiment: 'neutral',
      objection: 'No budget',
      email: 'ryan@wuphf.com',
      phone: '(570) 555-7890',
      status: 'contacted',
      tags: ['Budget Constraints'],
      isSensitive: false,
      conversionLikelihood: 32
    },
  ];
  
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsIntelligencePanelOpen(true);
  };
  
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-salesRed text-white';
      case 'medium':
        return 'bg-amber-400 text-slate-800';
      case 'low':
        return 'bg-slate-200 text-slate-600';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  };
  
  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '😀';
      case 'neutral':
        return '😐';
      case 'negative':
        return '😕';
      default:
        return null;
    }
  };
  
  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex justify-between items-center">
            <span>Lead Queue</span>
            <Badge variant="outline" className="text-salesRed border-salesRed/30 bg-salesRed/10">
              {leads.filter(lead => lead.priority === 'high').length} High Priority
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="max-h-[350px] overflow-y-auto">
            {leads.map((lead) => (
              <UsageTracker 
                key={lead.id}
                feature="lead_queue_item"
                context="dashboard_widget"
              >
                <div 
                  className="p-4 border-b hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleLeadClick(lead)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium flex items-center gap-2">
                          {lead.name}
                          <Brain className="h-3 w-3 text-blue-500 opacity-50" />
                        </div>
                        {lead.sentiment && (
                          <span className="text-sm">{getSentimentIcon(lead.sentiment)}</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">{lead.company}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(lead.priority)}`}>
                        {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="bg-slate-100 text-xs font-normal">
                      {lead.source}
                    </Badge>
                    <Badge variant="outline" className="bg-salesCyan-light text-salesBlue border-salesCyan/20 text-xs font-normal">
                      {lead.score}% Match
                    </Badge>
                    {lead.lastContact && (
                      <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 text-xs font-normal">
                        Last: {lead.lastContact}
                      </Badge>
                    )}
                    {lead.objection && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-normal cursor-help">
                            {lead.objection}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">AI detected objection during last call</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                    <UsageTracker feature="quick_call" context="lead_queue">
                      <Button size="sm" className="bg-salesGreen hover:bg-salesGreen-dark h-8 rounded-full px-3">
                        <Phone className="h-3.5 w-3.5 mr-1.5" />
                        Call
                      </Button>
                    </UsageTracker>
                    <UsageTracker feature="quick_message" context="lead_queue">
                      <Button size="sm" variant="outline" className="h-8 rounded-full px-3 border-slate-300">
                        <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                        Message
                      </Button>
                    </UsageTracker>
                    <UsageTracker feature="quick_schedule" context="lead_queue">
                      <Button size="sm" variant="outline" className="h-8 rounded-full px-3 border-slate-300">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        Schedule
                      </Button>
                    </UsageTracker>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 ml-auto">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">More actions</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </UsageTracker>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" className="text-salesBlue">View All Leads</Button>
          <Button variant="default" size="sm" className="bg-salesCyan hover:bg-salesCyan-dark">
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Auto-Dial Queue
          </Button>
        </CardFooter>
      </Card>

      {/* Lead Intelligence Panel */}
      {selectedLead && (
        <LeadIntelligencePanel
          lead={selectedLead}
          isOpen={isIntelligencePanelOpen}
          onClose={() => setIsIntelligencePanelOpen(false)}
        />
      )}
    </>
  );
};

export default LeadQueue;
