
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Eye,
  Brain,
  Clock,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '@/types/lead';

interface PipelinePulseProps {
  leads: Lead[];
  className?: string;
  onLeadClick?: (leadId: string) => void;
}

const PipelinePulse: React.FC<PipelinePulseProps> = ({ 
  leads, 
  className = '',
  onLeadClick 
}) => {
  const navigate = useNavigate();

  const handleLeadClick = (leadId: string) => {
    if (onLeadClick) {
      onLeadClick(leadId);
    }
    navigate(`/lead-workspace/${leadId}`);
  };

  const handleActionClick = (e: React.MouseEvent, actionType: string, lead: Lead) => {
    e.stopPropagation();
    
    switch (actionType) {
      case 'call':
        navigate(`/sales/dialer?leadId=${lead.id}`);
        break;
      case 'email':
        navigate(`/lead-workspace/${lead.id}?tab=email`);
        break;
      case 'calendar':
        navigate(`/lead-workspace/${lead.id}?tab=meetings`);
        break;
      default:
        console.log(`${actionType} action for lead ${lead.id}`);
    }
  };

  const handleViewAllLeads = () => {
    navigate('/lead-management');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '📊';
      case 'low': return '🧊';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed_won': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed_lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAIPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Show only top 5 leads
  const displayLeads = leads.slice(0, 5);

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Pipeline Pulse
          <Badge className="bg-white/20 text-white text-xs">
            AI Optimized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop View - Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Lead</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Status</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Value</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Last Activity</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">AI Priority</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Next Action</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">AI Insight</th>
                <th className="text-center p-4 font-medium text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayLeads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={`border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer ${
                    index === 0 ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => handleLeadClick(lead.id)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPriorityIcon(lead.priority)}</span>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">${lead.value?.toLocaleString() || '0'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{lead.lastActivity}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getAIPriorityColor(lead.aiPriority)}>
                      {lead.aiPriority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Brain className="h-3 w-3 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">{lead.nextAction}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 italic">{lead.lastAIInsight}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                        onClick={(e) => handleActionClick(e, 'call', lead)}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 transition-colors"
                        onClick={(e) => handleActionClick(e, 'email', lead)}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-purple-100 hover:border-purple-300 transition-colors"
                        onClick={(e) => handleActionClick(e, 'calendar', lead)}
                      >
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="lg:hidden space-y-3 p-4">
          {displayLeads.map((lead, index) => (
            <div
              key={lead.id}
              className={`p-4 border rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer ${
                index === 0 ? 'bg-blue-50/50' : ''
              }`}
              onClick={() => handleLeadClick(lead.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.company}</div>
                  </div>
                </div>
                <span className="font-medium text-gray-900">${lead.value?.toLocaleString() || '0'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Status:</span>
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">AI Priority:</span>
                  <Badge className={getAIPriorityColor(lead.aiPriority)}>{lead.aiPriority}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{lead.lastActivity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="h-3 w-3 text-purple-500" />
                  <span className="text-gray-700">{lead.nextAction}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 italic mb-3">{lead.lastAIInsight}</div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  onClick={(e) => handleActionClick(e, 'call', lead)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 hover:bg-green-100 hover:border-green-300 transition-colors"
                  onClick={(e) => handleActionClick(e, 'email', lead)}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 hover:bg-purple-100 hover:border-purple-300 transition-colors"
                  onClick={(e) => handleActionClick(e, 'calendar', lead)}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Book
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Leads Button */}
        <div className="p-4 border-t bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAllLeads}
            className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
            View All Leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelinePulse;
