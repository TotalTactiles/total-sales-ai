
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Workflow,
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  Play,
  Users,
  Clock,
  Zap,
  Settings
} from 'lucide-react';

const AutomationTab: React.FC = () => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  const workflowTemplates = [
    {
      id: 1,
      name: 'New Lead Welcome Sequence',
      description: 'Automated welcome email sequence for new leads',
      usage: 24,
      status: 'active'
    },
    {
      id: 2,
      name: 'Follow-up Reminder Chain',
      description: 'Reminds reps to follow up with prospects',
      usage: 18,
      status: 'active'
    },
    {
      id: 3,
      name: 'Demo No-Show Recovery',
      description: 'Re-engagement sequence for missed demos',
      usage: 12,
      status: 'paused'
    }
  ];

  const customWorkflows = [
    {
      id: 1,
      name: 'Q4 Pipeline Acceleration',
      steps: 5,
      assigned: 3,
      lastRun: '2 hours ago',
      status: 'running'
    },
    {
      id: 2,
      name: 'High-Value Lead Nurture',
      steps: 8,
      assigned: 7,
      lastRun: '1 day ago',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Workflow Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Workflow Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Workflow className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-500">{template.description}</p>
                    <p className="text-xs text-gray-400">Used by {template.usage} reps</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                  <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{template.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Sequence Steps</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">1</div>
                              <span className="text-sm">Send welcome email immediately</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">2</div>
                              <span className="text-sm">Wait 2 days, send product overview</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">3</div>
                              <span className="text-sm">Wait 1 week, schedule demo call</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                          <Button>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Reps
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Builder Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Custom Workflows
            </CardTitle>
            <Dialog open={showBuilderModal} onOpenChange={setShowBuilderModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Workflow Builder</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Zap className="h-6 w-6" />
                      <span className="text-sm">Add Action</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">Add Condition</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Clock className="h-6 w-6" />
                      <span className="text-sm">Add Delay</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Workflow className="h-6 w-6" />
                      <span className="text-sm">AI Action</span>
                    </Button>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Workflow className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Drag and drop workflow elements here</p>
                    <p className="text-sm text-gray-400">Use Live Preview to test your workflow</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Live Preview
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Workflow</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customWorkflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Workflow className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{workflow.name}</h4>
                    <p className="text-sm text-gray-500">
                      {workflow.steps} steps • Assigned to {workflow.assigned} reps
                    </p>
                    <p className="text-xs text-gray-400">Last run: {workflow.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
                    {workflow.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationTab;
