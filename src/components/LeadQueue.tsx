
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Lead {
  id: number;
  name: string;
  company: string;
  source: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  lastContact?: string;
}

const LeadQueue = () => {
  const leads: Lead[] = [
    { id: 1, name: "Michael Scott", company: "Dunder Mifflin", source: "LinkedIn", score: 85, priority: 'high' },
    { id: 2, name: "Jim Halpert", company: "Athlead", source: "Facebook", score: 72, priority: 'medium', lastContact: '2 days ago' },
    { id: 3, name: "Pam Beesly", company: "Pratt Institute", source: "Referral", score: 93, priority: 'high' },
    { id: 4, name: "Dwight Schrute", company: "Schrute Farms", source: "Website", score: 68, priority: 'medium', lastContact: '1 week ago' },
    { id: 5, name: "Ryan Howard", company: "WUPHF.com", source: "LinkedIn", score: 64, priority: 'low', lastContact: '3 days ago' },
  ];
  
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
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Lead Queue</span>
          <span className="text-salesRed text-sm font-bold">
            {leads.filter(lead => lead.priority === 'high').length} High Priority
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="max-h-96 overflow-y-auto">
          {leads.map((lead) => (
            <div key={lead.id} className="p-4 border-b hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div>
                <div className="font-medium">{lead.name}</div>
                <div className="text-sm text-slate-500">{lead.company}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {lead.source}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-salesCyan-light text-salesBlue">
                    {lead.score}% Match
                  </span>
                  {lead.lastContact && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      Last: {lead.lastContact}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(lead.priority)}`}>
                  {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                </span>
                <Button size="sm" className="bg-salesGreen hover:bg-salesGreen-dark h-8">
                  Call
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm">View All Leads</Button>
        <Button variant="outline" size="sm" className="text-salesBlue">Auto-Dial Queue</Button>
      </CardFooter>
    </Card>
  );
};

export default LeadQueue;
