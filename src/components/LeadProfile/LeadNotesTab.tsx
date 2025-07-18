
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';

interface LeadNotesTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate: (field: string, value: any) => void;
}

const LeadNotesTab: React.FC<LeadNotesTabProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={lead.notes || ''}
            onChange={(e) => onUpdate('notes', e.target.value)}
            placeholder="Add notes about this lead..."
            className="min-h-[200px]"
            disabled={aiDelegationMode}
          />
          <Button className="mt-2" disabled={aiDelegationMode}>
            Save Notes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadNotesTab;
