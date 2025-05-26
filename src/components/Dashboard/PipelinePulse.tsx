
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, Mail, Calendar } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  priority: 'high' | 'medium' | 'low';
  lastContact: string;
  value: string;
}

interface PipelinePulseProps {
  leads: Lead[];
  onLeadClick: (leadId: string) => void;
}

const PipelinePulse: React.FC<PipelinePulseProps> = ({ leads, onLeadClick }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚠️';
      case 'low': return '📥';
      default: return '📥';
    }
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Pipeline Pulse</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Lead</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Priority</th>
                <th className="text-left p-4 font-medium">Value</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => onLeadClick(lead.id)}
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.lastContact}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-lg">{getPriorityIcon(lead.priority)}</span>
                  </td>
                  <td className="p-4 font-medium">{lead.value}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <PhoneCall className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelinePulse;
