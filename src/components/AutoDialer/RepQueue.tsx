
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, TrendingUp } from 'lucide-react';
import { Lead } from '@/types/lead';

interface RepQueueProps {
  leads: Lead[];
  currentLead: Lead | null;
  onLeadSelect: (lead: Lead) => void;
}

const RepQueue: React.FC<RepQueueProps> = ({ leads, currentLead, onLeadSelect }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          Rep Queue ({leads.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {leads.map((lead, index) => (
          <div
            key={lead.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              currentLead?.id === lead.id 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
            onClick={() => onLeadSelect(lead)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{lead.name}</span>
                  <Badge className={`text-xs ${getPriorityColor(lead.priority)}`}>
                    {lead.priority}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 truncate">{lead.company}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium">{lead.score}%</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last: {lead.lastContact || 'Never'}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        ))}
        
        {leads.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No leads in queue
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepQueue;
