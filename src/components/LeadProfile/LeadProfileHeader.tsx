
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Bot } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadProfileHeaderProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onClose: () => void;
  onAIDelegation: () => void;
}

const LeadProfileHeader: React.FC<LeadProfileHeaderProps> = ({
  lead,
  aiDelegationMode,
  onClose,
  onAIDelegation
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-lg">
            {lead.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{lead.name}</h2>
          <p className="text-slate-600">{lead.company}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge className={`${
          lead.priority === 'high' ? 'bg-red-100 text-red-800' :
          lead.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
          'bg-slate-100 text-slate-800'
        }`}>
          {lead.priority} priority
        </Badge>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAIDelegation}
          disabled={aiDelegationMode}
        >
          <Bot className="h-4 w-4 mr-2" />
          {aiDelegationMode ? 'AI Delegated' : 'Delegate to AI'}
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LeadProfileHeader;
