
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Plus, Send } from 'lucide-react';
import { toast } from 'sonner';

const ProcessInReviewActions: React.FC = () => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  const processes = [
    {
      id: 'sales-pipeline',
      title: 'Sales Pipeline Review',
      status: 'In Progress',
      priority: 'High',
      notes: 'Quarterly pipeline analysis and optimization review'
    },
    {
      id: 'lead-qualification',
      title: 'Lead Qualification Process',
      status: 'Pending Review',
      priority: 'Medium',
      notes: 'Updated qualification criteria for Q4'
    },
    {
      id: 'customer-onboarding',
      title: 'Customer Onboarding',
      status: 'Completed',
      priority: 'Low',
      notes: 'Streamlined onboarding process implementation'
    }
  ];

  const handleExport = (processId: string) => {
    toast.success(`Exporting ${processes.find(p => p.id === processId)?.title} as PDF with notes and results`);
  };

  const handleImport = () => {
    toast.success('Import functionality ready - select DOC/PDF to auto-fill notes/results');
  };

  const handleAddToTasks = (processId: string) => {
    const process = processes.find(p => p.id === processId);
    toast.success(`Added "${process?.title}" to tasks and sent notification to Slack`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending Review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={handleImport} variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import DOC/PDF
        </Button>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          New Process Review
        </Button>
      </div>

      {/* Process List */}
      <div className="grid gap-4">
        {processes.map((process) => (
          <Card key={process.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{process.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(process.priority)}>
                    {process.priority}
                  </Badge>
                  <Badge className={getStatusColor(process.status)}>
                    {process.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{process.notes}</p>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleExport(process.id)}
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button 
                    onClick={() => handleAddToTasks(process.id)}
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Tasks
                  </Button>
                  <Button 
                    onClick={() => handleAddToTasks(process.id)}
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send to Slack
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProcessInReviewActions;
