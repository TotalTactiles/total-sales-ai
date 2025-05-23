
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, Phone, Calendar, ChevronDown, Brain } from "lucide-react";
import { Lead } from '@/types/lead';
import UsageTracker from '../AIBrain/UsageTracker';

interface LeadItemProps {
  lead: Lead;
  onLeadClick: (lead: Lead) => void;
}

const LeadItem: React.FC<LeadItemProps> = ({ lead, onLeadClick }) => {
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
    <UsageTracker 
      feature="lead_queue_item"
      context="dashboard_widget"
    >
      <div 
        className="p-4 border-b hover:bg-slate-50 transition-colors cursor-pointer"
        onClick={() => onLeadClick(lead)}
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
  );
};

export default LeadItem;
