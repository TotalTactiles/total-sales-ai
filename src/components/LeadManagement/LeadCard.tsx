
import { logger } from '@/utils/logger';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  Brain,
  HelpCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import UsageTracker from '@/components/AIBrain/UsageTracker';

interface LeadCardProps {
  lead: Lead;
  onCardClick: (lead: Lead) => void;
  onQuickAction: (action: string, lead: Lead) => void;
  aiSuggestion?: string;
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  onCardClick, 
  onQuickAction,
  aiSuggestion 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { trackClick } = useUsageTracking();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleQuickAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    trackClick(`lead_card_${action}`, 'lead_management');
    onQuickAction(action, lead);
  };

  const handleCardClick = () => {
    logger.info('LeadCard clicked - Lead ID:', lead.id, 'Lead Name:', lead.name);
    onCardClick(lead);
  };

  const needsAttention = !lead.lastContact || lead.score < 60;

  return (
    <UsageTracker feature="lead_card" context="lead_management">
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
          needsAttention ? 'ring-2 ring-amber-200' : ''
        } ${isHovered ? 'shadow-lg' : 'shadow-sm'}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          {/* Header with Avatar and Status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{lead.name}</h3>
                <p className="text-xs text-slate-500">{lead.company}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {needsAttention && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                {lead.status}
              </Badge>
            </div>
          </div>

          {/* Score and Priority */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${getScoreColor(lead.score)}`} />
              <span className={`font-bold ${getScoreColor(lead.score)}`}>
                {lead.score}%
              </span>
            </div>
            <Badge variant="outline" className={`text-xs ${getPriorityColor(lead.priority)}`}>
              {lead.priority} priority
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-1 mb-3">
            <p className="text-xs text-slate-600 truncate">{lead.email}</p>
            <p className="text-xs text-slate-600">{lead.phone}</p>
            {lead.lastContact && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                Last: {lead.lastContact}
              </div>
            )}
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-3">
              <div className="flex items-center gap-2">
                <Brain className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">AI Suggests:</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">{aiSuggestion}</p>
            </div>
          )}

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {lead.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {lead.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{lead.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={(e) => handleQuickAction('call', e)}
              >
                <Phone className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={(e) => handleQuickAction('email', e)}
              >
                <Mail className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={(e) => handleQuickAction('chat', e)}
              >
                <MessageSquare className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={(e) => handleQuickAction('notes', e)}
              >
                <FileText className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => handleQuickAction('help', e)}
                title="Get help with this lead"
              >
                <HelpCircle className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100"
                onClick={(e) => handleQuickAction('ai_assist', e)}
              >
                <Brain className="h-3 w-3 text-blue-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </UsageTracker>
  );
};

export default LeadCard;
