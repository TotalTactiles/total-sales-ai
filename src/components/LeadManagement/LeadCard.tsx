
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { 
  Phone, 
  Mail, 
  Building, 
  Calendar,
  ArrowRight,
  Star
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onLeadSelect?: (lead: Lead) => void;
  selected?: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onLeadSelect, selected }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onLeadSelect) {
      onLeadSelect(lead);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/leads/${lead.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {lead.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{lead.name}</h3>
              {lead.company && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-3 w-3 mr-1" />
                  {lead.company}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Star className={`h-4 w-4 ${getPriorityColor(lead.priority)}`} />
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {lead.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-3 w-3 mr-2" />
              {lead.email}
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-3 w-3 mr-2" />
              {lead.phone}
            </div>
          )}
          {lead.lastContact && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-3 w-3 mr-2" />
              Last contact: {new Date(lead.lastContact).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Score: {lead.score}/100
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleViewDetails}
          >
            View Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
