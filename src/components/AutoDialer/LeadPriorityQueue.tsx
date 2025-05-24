
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Clock, Target, Zap } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadPriorityQueueProps {
  leads: Lead[];
  currentLead?: Lead | null;
  onLeadSelect: (lead: Lead) => void;
  hotLeads?: Lead[];
  speedToLeadCritical?: Lead[];
}

const LeadPriorityQueue: React.FC<LeadPriorityQueueProps> = ({
  leads,
  currentLead,
  onLeadSelect,
  hotLeads = [],
  speedToLeadCritical = []
}) => {
  // Separate leads into categories
  const criticalLeads = speedToLeadCritical.length > 0 ? speedToLeadCritical : 
    leads.filter(lead => (lead.speedToLead || 0) < 5);
  
  const urgentLeads = hotLeads.length > 0 ? hotLeads :
    leads.filter(lead => (lead.speedToLead || 0) >= 5 && (lead.speedToLead || 0) < 15);
  
  const normalLeads = leads.filter(lead => 
    (lead.speedToLead || 0) >= 15 && 
    !criticalLeads.includes(lead) && 
    !urgentLeads.includes(lead)
  );

  const renderLeadItem = (lead: Lead, category: string) => {
    const isSelected = currentLead?.id === lead.id;
    const getPriorityColor = () => {
      switch (category) {
        case 'critical': return 'border-red-500 bg-red-50';
        case 'urgent': return 'border-orange-500 bg-orange-50';
        default: return 'border-blue-500 bg-blue-50';
      }
    };

    return (
      <div
        key={lead.id}
        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        } ${getPriorityColor()}`}
        onClick={() => onLeadSelect(lead)}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium text-sm">{lead.name}</h4>
            <p className="text-xs text-gray-600">{lead.company}</p>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {lead.conversionLikelihood}%
            </Badge>
            {category === 'critical' && <Zap className="h-3 w-3 text-red-500" />}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {lead.speedToLead ? `${lead.speedToLead}m old` : 'New'}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onLeadSelect(lead);
            }}
          >
            <Phone className="h-3 w-3 mr-1" />
            Call
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          Lead Priority Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Critical Leads */}
        {criticalLeads.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Critical (0-5min)
            </h5>
            <div className="space-y-2">
              {criticalLeads.slice(0, 3).map(lead => renderLeadItem(lead, 'critical'))}
            </div>
          </div>
        )}

        {/* Urgent Leads */}
        {urgentLeads.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-orange-600 mb-2">
              Urgent (5-15min)
            </h5>
            <div className="space-y-2">
              {urgentLeads.slice(0, 3).map(lead => renderLeadItem(lead, 'urgent'))}
            </div>
          </div>
        )}

        {/* Normal Priority */}
        {normalLeads.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-blue-600 mb-2">
              Queue ({normalLeads.length})
            </h5>
            <div className="space-y-2">
              {normalLeads.slice(0, 5).map(lead => renderLeadItem(lead, 'normal'))}
            </div>
          </div>
        )}

        {leads.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No leads in queue</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadPriorityQueue;
