
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Brain, 
  Phone, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Star,
  TrendingUp
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface DialerQueueProps {
  repQueue: Lead[];
  aiQueue: Lead[];
  currentLead: Lead | null;
  onMoveLeadBetweenQueues: (leadId: string, fromQueue: 'rep' | 'ai', toQueue: 'rep' | 'ai') => void;
  onLeadSelect: (lead: Lead) => void;
}

const DialerQueue: React.FC<DialerQueueProps> = ({
  repQueue,
  aiQueue,
  currentLead,
  onMoveLeadBetweenQueues,
  onLeadSelect
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const LeadItem = ({ 
    lead, 
    queueType, 
    isActive = false 
  }: { 
    lead: Lead; 
    queueType: 'rep' | 'ai'; 
    isActive?: boolean 
  }) => (
    <div 
      className={`p-3 border rounded-lg transition-all cursor-pointer hover:shadow-sm ${
        isActive ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-gray-200'
      }`}
      onClick={() => onLeadSelect(lead)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{lead.name}</span>
          {lead.priority === 'high' && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
        </div>
        <div className="flex gap-1">
            {queueType === 'rep' ? (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                data-testid="move-to-ai"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLeadBetweenQueues(lead.id, 'rep', 'ai');
                }}
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                data-testid="move-to-rep"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveLeadBetweenQueues(lead.id, 'ai', 'rep');
                }}
              >
                <ArrowLeft className="h-3 w-3" />
              </Button>
            )}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{lead.company}</span>
          <Badge className={`text-xs px-1.5 py-0 ${getPriorityColor(lead.priority)}`}>
            {lead.priority}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>{lead.score}% score</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{lead.speedToLead}m</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Rep Queue */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flat-heading-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Rep Queue ({repQueue.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {repQueue.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              No leads in rep queue
            </div>
          ) : (
            repQueue.map((lead, index) => (
              <LeadItem 
                key={lead.id} 
                lead={lead} 
                queueType="rep"
                isActive={currentLead?.id === lead.id}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* AI Queue */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flat-heading-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            AI Queue ({aiQueue.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {aiQueue.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              No leads in AI queue
            </div>
          ) : (
            aiQueue.map((lead, index) => (
              <LeadItem 
                key={lead.id} 
                lead={lead} 
                queueType="ai"
              />
            ))
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Drag leads between queues or use arrow buttons
        </p>
      </div>
    </div>
  );
};

export default DialerQueue;
