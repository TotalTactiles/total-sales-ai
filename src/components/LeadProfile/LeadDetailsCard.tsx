
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { Phone, Mail, Building, Calendar } from 'lucide-react';

interface LeadDetailsCardProps {
  lead: Lead;
  onUpdate: (field: string, value: any) => void;
}

const LeadDetailsCard: React.FC<LeadDetailsCardProps> = ({ lead, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lead Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Company</span>
          </div>
          <p className="text-sm">{lead.company}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email</span>
          </div>
          <p className="text-sm">{lead.email}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Phone</span>
          </div>
          <p className="text-sm">{lead.phone}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last Contact</span>
          </div>
          <p className="text-sm">{lead.lastContact}</p>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">Priority</span>
          <Badge variant={lead.priority === 'high' ? 'destructive' : 
                          lead.priority === 'medium' ? 'default' : 'secondary'}>
            {lead.priority}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">Score</span>
          <p className="text-sm">{lead.score}/100</p>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">Conversion Likelihood</span>
          <p className="text-sm">{lead.conversionLikelihood}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadDetailsCard;
