
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  TrendingUp, 
  Phone, 
  AlertTriangle,
  Zap,
  Shield
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadPriorityQueueProps {
  leads: Lead[];
  currentLead?: Lead | null;
  onLeadSelect: (lead: Lead) => void;
  hotLeads: Lead[];
  speedToLeadCritical: Lead[];
}

const LeadPriorityQueue: React.FC<LeadPriorityQueueProps> = ({
  leads,
  currentLead,
  onLeadSelect,
  hotLeads,
  speedToLeadCritical
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-3 w-3 text-red-600" />;
      case 'medium': return <Clock className="h-3 w-3 text-yellow-600" />;
      case 'low': return <TrendingUp className="h-3 w-3 text-green-600" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Speed-to-Lead Critical Section */}
      {speedToLeadCritical.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="font-medium text-red-800">Fresh Leads (Call Now!)</h3>
          </div>
          <div className="space-y-2">
            {speedToLeadCritical.slice(0, 3).map((lead) => (
              <div
                key={lead.id}
                className={`p-3 border-l-4 border-l-red-500 bg-red-50 rounded-r-lg cursor-pointer hover:bg-red-100 transition-colors ${
                  currentLead?.id === lead.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onLeadSelect(lead)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{lead.name}</span>
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    {lead.speedToLead}min
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">{lead.company}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    {lead.autopilotEnabled && <Zap className="h-3 w-3 text-blue-600" />}
                    {lead.isSensitive && <Shield className="h-3 w-3 text-orange-600" />}
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    {lead.conversionLikelihood}% likely
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hot Leads Section */}
      {hotLeads.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="font-medium text-red-800">Hot Leads</h3>
            <Badge className="bg-red-100 text-red-800">{hotLeads.length}</Badge>
          </div>
          <div className="space-y-2">
            {hotLeads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className={`p-3 border-l-4 ${getPriorityColor(lead.priority)} rounded-r-lg cursor-pointer hover:opacity-80 transition-colors ${
                  currentLead?.id === lead.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onLeadSelect(lead)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{lead.name}</span>
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(lead.priority)}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-1">{lead.company}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {lead.speedToLead !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-2 w-2 mr-1" />
                        {lead.speedToLead}min
                      </Badge>
                    )}
                    {lead.autopilotEnabled && <Zap className="h-3 w-3 text-blue-600" />}
                    {lead.isSensitive && <Shield className="h-3 w-3 text-orange-600" />}
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    {lead.conversionLikelihood}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Leads Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Phone className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-800">All Leads</h3>
          <Badge variant="outline">{leads.length}</Badge>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`p-3 border-l-4 ${getPriorityColor(lead.priority)} rounded-r-lg cursor-pointer hover:opacity-80 transition-colors ${
                currentLead?.id === lead.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onLeadSelect(lead)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{lead.name}</span>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(lead.priority)}
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-1">{lead.company}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {lead.speedToLead !== undefined && lead.speedToLead < 60 && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-2 w-2 mr-1" />
                      {lead.speedToLead}min
                    </Badge>
                  )}
                  {lead.autopilotEnabled && <Zap className="h-3 w-3 text-blue-600" />}
                  {lead.isSensitive && <Shield className="h-3 w-3 text-orange-600" />}
                  {lead.doNotCall && <Shield className="h-3 w-3 text-red-600" />}
                </div>
                <span className="text-xs font-medium text-green-600">
                  {lead.conversionLikelihood}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadPriorityQueue;
