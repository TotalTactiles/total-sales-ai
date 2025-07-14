
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { Phone, Mail, Building, Star, Clock, TrendingUp, Brain, Calendar } from 'lucide-react';

export interface LeadCardProps {
  lead: Lead;
  onLeadSelect?: (lead: Lead) => void;
  onCardClick?: (lead: Lead) => void;
  onQuickAction?: (action: string, lead: Lead) => void;
  selected?: boolean;
  aiSuggestion?: string;
  customizeSettings?: {
    showScore: boolean;
    showCompany: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showTags: boolean;
    showLastContact: boolean;
    showConversionLikelihood: boolean;
    showPriority: boolean;
  };
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  onLeadSelect, 
  onCardClick,
  onQuickAction,
  selected = false,
  aiSuggestion,
  customizeSettings
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'proposal': return 'bg-purple-500';
      case 'closed_won': return 'bg-emerald-500';
      case 'closed_lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(lead);
    } else if (onLeadSelect) {
      onLeadSelect(lead);
    }
  };

  const handleQuickAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAction) {
      onQuickAction(action, lead);
    }
  };

  // Use default settings if customizeSettings not provided
  const settings = customizeSettings || {
    showScore: true,
    showCompany: true,
    showEmail: true,
    showPhone: true,
    showTags: false,
    showLastContact: true,
    showConversionLikelihood: true,
    showPriority: true
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
        selected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{lead.name}</CardTitle>
            {settings.showCompany && (
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 truncate">{lead.company}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)}`} />
            {settings.showPriority && (
              <Badge variant="outline" className={`text-xs ${getPriorityColor(lead.priority)}`}>
                {lead.priority}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          {settings.showEmail && lead.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {settings.showPhone && lead.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {/* Lead Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {settings.showScore && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{lead.score}</span>
            </div>
          )}
          {settings.showConversionLikelihood && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">{lead.conversionLikelihood}%</span>
            </div>
          )}
        </div>

        {/* Last Contact */}
        {settings.showLastContact && lead.lastContact && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last contact: {lead.lastContact}</span>
          </div>
        )}

        {/* Tags */}
        {settings.showTags && lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {lead.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{lead.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
            <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-blue-700">{aiSuggestion}</span>
          </div>
        )}

        {/* Quick Actions - Enhanced with new buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => handleQuickAction('call', e)}
            className="w-full"
          >
            <Phone className="h-3 w-3 mr-1" />
            Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => handleQuickAction('email', e)}
            className="w-full"
          >
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => handleQuickAction('schedule', e)}
            className="w-full"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Schedule
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => handleQuickAction('reminder', e)}
            className="w-full"
          >
            <Clock className="h-3 w-3 mr-1" />
            Remind
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
