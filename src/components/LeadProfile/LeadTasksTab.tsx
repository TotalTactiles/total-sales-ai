
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { Plus, CheckCircle, Clock } from 'lucide-react';

interface LeadTasksTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate: (field: string, value: any) => void;
}

const LeadTasksTab: React.FC<LeadTasksTabProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  const mockTasks = [
    { id: 1, title: 'Follow up call', status: 'pending', dueDate: '2024-01-20' },
    { id: 2, title: 'Send proposal', status: 'completed', dueDate: '2024-01-18' },
    { id: 3, title: 'Schedule demo', status: 'pending', dueDate: '2024-01-22' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button size="sm" disabled={aiDelegationMode}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="space-y-3">
        {mockTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                  {task.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadTasksTab;
