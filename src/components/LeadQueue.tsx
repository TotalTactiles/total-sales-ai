
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Lead } from '@/types/lead';
import LeadIntelligencePanel from './LeadIntelligence/LeadIntelligencePanel';
import LeadQueueHeader from './LeadQueue/LeadQueueHeader';
import LeadQueueFooter from './LeadQueue/LeadQueueFooter';
import LeadItem from './LeadQueue/LeadItem';
import { useLeadData } from '@/hooks/useLeadData';

const LeadQueue = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);
  const { leads } = useLeadData();
  
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsIntelligencePanelOpen(true);
  };
  
  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <LeadQueueHeader leads={leads} />
        <CardContent className="px-0">
          <div className="max-h-[350px] overflow-y-auto">
            {leads.map((lead) => (
              <LeadItem
                key={lead.id}
                lead={lead}
                onLeadClick={handleLeadClick}
              />
            ))}
          </div>
        </CardContent>
        <LeadQueueFooter />
      </Card>

      {/* Lead Intelligence Panel */}
      {selectedLead && (
        <LeadIntelligencePanel
          lead={selectedLead}
          isOpen={isIntelligencePanelOpen}
          onClose={() => setIsIntelligencePanelOpen(false)}
        />
      )}
    </>
  );
};

export default LeadQueue;
