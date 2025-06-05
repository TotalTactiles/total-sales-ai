import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

const LeadAssignment: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Lead Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Automatically distribute new leads to your team.</p>
        <Button size="sm">
          Assign Leads
          <UserPlus className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default LeadAssignment;
