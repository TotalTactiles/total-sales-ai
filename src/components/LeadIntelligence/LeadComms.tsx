
import React from 'react';
import LeadCommsEnhanced from './LeadCommsEnhanced';
import { Lead } from '@/types/lead';

interface LeadCommsProps {
  lead: Lead;
  aiDelegationMode: boolean;
  isSensitive: boolean;
  rationaleMode: boolean;
}

const LeadComms: React.FC<LeadCommsProps> = ({
  lead,
  aiDelegationMode,
  isSensitive,
  rationaleMode
}) => {
  return (
    <LeadCommsEnhanced
      lead={lead}
      aiDelegationMode={aiDelegationMode}
      isSensitive={isSensitive}
      rationaleMode={rationaleMode}
    />
  );
};

export default LeadComms;
