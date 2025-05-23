
import React from 'react';
import { DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Brain,
  Shield
} from 'lucide-react';
import VoiceControls from './VoiceControls';
import { Lead } from '@/types/lead';

interface LeadIntelligenceHeaderProps {
  lead: Lead;
  isSensitive: boolean;
  voiceEnabled: boolean;
  aiDelegationMode: boolean;
  onClose: () => void;
  onVoiceToggle: () => void;
  onSensitiveToggle: () => void;
  onAIDelegation: () => void;
}

const LeadIntelligenceHeader: React.FC<LeadIntelligenceHeaderProps> = ({
  lead,
  isSensitive,
  voiceEnabled,
  aiDelegationMode,
  onClose,
  onVoiceToggle,
  onSensitiveToggle,
  onAIDelegation
}) => {
  return (
    <div className="flex items-center justify-between">
      <DialogTitle className="text-xl font-bold flex items-center gap-3">
        <Brain className="h-6 w-6 text-blue-600" />
        Lead Intelligence: {lead.name}
        {isSensitive && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Shield className="h-3 w-3 mr-1" />
            Sensitive
          </Badge>
        )}
      </DialogTitle>
      <div className="flex items-center gap-2">
        <VoiceControls 
          enabled={voiceEnabled} 
          onToggle={onVoiceToggle}
          leadName={lead.name}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onSensitiveToggle}
          className={`${isSensitive ? 'border-red-300 text-red-700' : 'border-gray-300'}`}
        >
          <Shield className="h-4 w-4 mr-1" />
          {isSensitive ? 'Remove Sensitive' : 'Mark Sensitive'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAIDelegation}
          disabled={isSensitive || aiDelegationMode}
          className="border-blue-300 text-blue-700"
        >
          <Brain className="h-4 w-4 mr-1" />
          {aiDelegationMode ? 'AI Handling' : 'Delegate to AI'}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LeadIntelligenceHeader;
