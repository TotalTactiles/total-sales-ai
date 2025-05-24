
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap, Phone } from 'lucide-react';
import { Lead } from '@/types/lead';

interface SpeedToLeadAlertProps {
  freshLeads: Lead[];
  onCallLead: (lead: Lead) => void;
  onSelectLead: (lead: Lead) => void;
}

const SpeedToLeadAlert: React.FC<SpeedToLeadAlertProps> = ({
  freshLeads,
  onCallLead,
  onSelectLead
}) => {
  if (freshLeads.length === 0) return null;

  const criticalLeads = freshLeads.filter(lead => (lead.speedToLead || 0) < 5);
  const urgentLeads = freshLeads.filter(lead => (lead.speedToLead || 0) >= 5 && (lead.speedToLead || 0) < 15);

  return (
    <div className="space-y-4">
      {/* Critical Speed-to-Lead (0-5 minutes) */}
      {criticalLeads.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              CRITICAL: Call Now!
              <Badge className="bg-red-600 text-white">
                {criticalLeads.length} leads
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalLeads.slice(0, 3).map((lead) => (
              <div
                key={lead.id}
                className="p-3 bg-white border border-red-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{lead.name}</h4>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {lead.speedToLead}min ago
                    </Badge>
                    <Badge variant="outline">
                      {lead.conversionLikelihood}% likely
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => onCallLead(lead)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call Now
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onSelectLead(lead)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Urgent Speed-to-Lead (5-15 minutes) */}
      {urgentLeads.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Zap className="h-5 w-5 text-orange-600" />
              Fresh Leads - High Priority
              <Badge className="bg-orange-600 text-white">
                {urgentLeads.length} leads
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentLeads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="p-3 bg-white border border-orange-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{lead.name}</h4>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {lead.speedToLead}min ago
                    </Badge>
                    <Badge variant="outline">
                      {lead.conversionLikelihood}% likely
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => onCallLead(lead)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onSelectLead(lead)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpeedToLeadAlert;
