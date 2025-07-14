
import React from 'react';
import LeadTimelineEnhanced from './LeadTimelineEnhanced';
import { Lead } from '@/types/lead';

interface LeadTimelineProps {
  lead: Lead;
  rationaleMode: boolean;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({ lead, rationaleMode }) => {
  return (
    <LeadTimelineEnhanced
      lead={lead}
      rationaleMode={rationaleMode}
    />
  );
};

export default LeadTimeline;
