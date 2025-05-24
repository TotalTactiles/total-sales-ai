
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadPriorityQueueProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  currentLead?: Lead | null;
}

const LeadPriorityQueue: React.FC<LeadPriorityQueueProps> = ({
  leads,
  onLeadSelect,
  currentLead
}) => {
  // Sort leads by priority and speed-to-lead
  const sortedLeads = [...leads].sort((a, b) => {
    // Speed-to-lead takes priority (fresher leads first)
    const aSpeed = a.speedToLead || 9999;
    const bSpeed = b.speedToLead || 9999;
    
    if (aSpeed !== bSpeed) {
      return aSpeed - bSpeed;
    }
    
    // Then by conversion likelihood
    const aConversion = a.conversionLikelihood || 0;
    const bConversion = b.conversionLikelihood || 0;
    
    return bConversion - aConversion;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSpeedToLeadBadge = (minutes?: number) => {
    if (!minutes) return null;
    
    if (minutes < 5) {
      return <Badge className="bg-red-600 text-white">🔥 {minutes}m</Badge>;
    } else if (minutes < 15) {
      return <Badge className="bg-orange-600 text-white">⚡ {minutes}m</Badge>;
    } else if (minutes < 60) {
      return <Badge className="bg-yellow-600 text-white">⏰ {minutes}m</Badge>;
    }
    
    return <Badge variant="secondary">{Math.floor(minutes / 60)}h</Badge>;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Lead Priority Queue
          <Badge variant="outline">{leads.length} leads</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {sortedLeads.map((lead) => (
          <div
            key={lead.id}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              currentLead?.id === lead.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onLeadSelect(lead)}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-sm">{lead.name}</h4>
                <p className="text-xs text-gray-600">{lead.company}</p>
              </div>
              <div className="flex items-center gap-1">
                {getSpeedToLeadBadge(lead.speedToLead)}
                <Badge className={getPriorityColor(lead.priority)}>
                  {lead.priority}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{lead.lastContact}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 font-medium">
                  {lead.conversionLikelihood}%
                </span>
                <Button 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLeadSelect(lead);
                  }}
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {leads.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No leads in queue</p>
            <p className="text-sm">Fresh leads will appear here automatically</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadPriorityQueue;
