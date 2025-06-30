
import React, { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { toast } from 'sonner';
import TSAMDialerLayout from '@/components/AutoDialer/TSAMDialerLayout';

const Dialer = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  
  const hasRealData = leads && leads.length > 0;
  const displayLeads = hasRealData 
    ? leads.map(convertDatabaseLeadToLead) 
    : mockLeads.map(convertMockLeadToLead);

  return <TSAMDialerLayout leads={displayLeads} onLeadSelect={setSelectedLead} />;
};

export default Dialer;
