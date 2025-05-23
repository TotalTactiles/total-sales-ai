
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lead } from '@/types/lead';

interface LeadQueueHeaderProps {
  leads: Lead[];
}

const LeadQueueHeader: React.FC<LeadQueueHeaderProps> = ({ leads }) => {
  const highPriorityCount = leads.filter(lead => lead.priority === 'high').length;

  return (
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold flex justify-between items-center">
        <span>Lead Queue</span>
        <Badge variant="outline" className="text-salesRed border-salesRed/30 bg-salesRed/10">
          {highPriorityCount} High Priority
        </Badge>
      </CardTitle>
    </CardHeader>
  );
};

export default LeadQueueHeader;
