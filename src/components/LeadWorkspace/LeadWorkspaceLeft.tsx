
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadWorkspaceLeftProps {
  lead: Lead;
  onQuickAction: (action: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const LeadWorkspaceLeft: React.FC<LeadWorkspaceLeftProps> = ({
  lead,
  onQuickAction,
  collapsed,
  onToggleCollapse
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-slate-600 bg-slate-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  if (collapsed) {
    return (
      <div className="h-full p-4 flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-12 w-12 mb-4">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {lead.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0"
            onClick={() => onQuickAction('call')}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0"
            onClick={() => onQuickAction('email')}
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0"
            onClick={() => onQuickAction('sms')}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0"
            onClick={() => onQuickAction('meeting')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Lead Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{lead.name}</h3>
            <p className="text-slate-600">{lead.company}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(lead.status)}>
                {lead.status}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                {lead.priority}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span>{lead.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-slate-400" />
            <span>{lead.phone}</span>
          </div>
          {lead.lastContact && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>Last contact: {lead.lastContact}</span>
            </div>
          )}
        </div>

        {/* Score and Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
              {lead.score}%
            </div>
            <div className="text-xs text-slate-500">Lead Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {lead.conversionLikelihood}%
            </div>
            <div className="text-xs text-slate-500">Conversion</div>
          </div>
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-6">
        <label className="text-sm font-medium text-slate-700 mb-3 block">Quick Actions</label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('call')}
            className="flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('email')}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('sms')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            SMS
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('meeting')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Meeting
          </Button>
        </div>

        {/* Lead Source */}
        <div className="mt-6 pt-6 border-t">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Lead Source</label>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">{lead.source}</span>
          </div>
        </div>

        {/* Lead Owner */}
        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Lead Owner</label>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                You
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">You</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadWorkspaceLeft;
