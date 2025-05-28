
import React from 'react';
import { Upload, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LeadManagementHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Management Center</h1>
        <p className="text-muted-foreground mt-2">
          Oversee lead distribution, quality, and team performance
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Leads
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>
    </div>
  );
};

export default LeadManagementHeader;
