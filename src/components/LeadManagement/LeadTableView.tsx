
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';

interface LeadTableViewProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

const statusColors = {
  new: 'bg-blue-500 text-white',
  contacted: 'bg-yellow-500 text-white',
  qualified: 'bg-green-500 text-white',
  proposal: 'bg-purple-500 text-white',
  negotiation: 'bg-orange-500 text-white',
  'ai_handle': 'bg-cyan-500 text-white',
  closed_won: 'bg-emerald-500 text-white',
  closed_lost: 'bg-red-500 text-white'
};

const LeadTableView: React.FC<LeadTableViewProps> = ({ leads, onLeadSelect }) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>
                <Badge className={statusColors[lead.status]}>
                  {lead.status === 'ai_handle' ? 'AI Handle' : 
                   lead.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={lead.priority === 'high' ? 'destructive' : 
                              lead.priority === 'medium' ? 'default' : 'secondary'}>
                  {lead.priority}
                </Badge>
              </TableCell>
              <TableCell>{lead.score}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLeadSelect(lead)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTableView;
