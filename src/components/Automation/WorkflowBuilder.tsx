
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Zap,
  Mail,
  Phone,
  Database,
  Clock,
  Filter,
  Send,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { workflowService, Workflow, WorkflowStep } from '@/services/automation/workflowService';

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const workflowTemplates = [
    {
      name: 'Lead Follow-up Sequence',
      description: 'Automated email sequence for new leads',
      icon: <Mail className="h-5 w-5" />,
      steps: 3,
      category: 'Email'
    },
    {
      name: 'Call Reminder System',
      description: 'Automated reminders for scheduled calls',
      icon: <Phone className="h-5 w-5" />,
      steps: 2,
      category: 'Calls'
    },
    {
      name: 'Lead Scoring Automation',
      description: 'Automatically score leads based on behavior',
      icon: <Database className="h-5 w-5" />,
      steps: 4,
      category: 'Data'
    },
    {
      name: 'Nurture Campaign',
      description: 'Long-term nurturing for warm leads',
      icon: <Zap className="h-5 w-5" />,
      steps: 5,
      category: 'Nurture'
    }
  ];

  const handleCreateWorkflow = async (template?: any) => {
    try {
      const name = template ? template.name : newWorkflowName;
      if (!name.trim()) {
        toast.error('Please enter a workflow name');
        return;
      }

      const newWorkflow = await workflowService.createWorkflow({
        name,
        description: template?.description || 'Custom workflow',
        isActive: false,
        steps: template ? generateTemplateSteps(template) : [],
        connections: []
      });

      setWorkflows(prev => [...prev, newWorkflow]);
      setSelectedWorkflow(newWorkflow);
      setIsCreating(false);
      setNewWorkflowName('');
      
      toast.success('Workflow created successfully');
    } catch (error) {
      toast.error('Failed to create workflow');
    }
  };

  const generateTemplateSteps = (template: any): WorkflowStep[] => {
    const baseSteps: WorkflowStep[] = [
      {
        id: '1',
        type: 'trigger',
        name: 'Lead Created',
        config: { event: 'lead_created' },
        position: { x: 100, y: 100 }
      }
    ];

    switch (template.name) {
      case 'Lead Follow-up Sequence':
        return [
          ...baseSteps,
          {
            id: '2',
            type: 'action',
            name: 'Send Welcome Email',
            config: { template: 'welcome_email', delay: 0 },
            position: { x: 300, y: 100 }
          },
          {
            id: '3',
            type: 'action',
            name: 'Send Follow-up Email',
            config: { template: 'followup_email', delay: 24 },
            position: { x: 500, y: 100 }
          }
        ];
      default:
        return baseSteps;
    }
  };

  const toggleWorkflow = async (workflow: Workflow) => {
    try {
      // In a real implementation, this would update the workflow status
      setWorkflows(prev => 
        prev.map(w => 
          w.id === workflow.id 
            ? { ...w, isActive: !w.isActive }
            : w
        )
      );
      
      toast.success(`Workflow ${workflow.isActive ? 'paused' : 'activated'}`);
    } catch (error) {
      toast.error('Failed to update workflow');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
          <p className="text-gray-600 mt-1">Create and manage automated workflows</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflowTemplates.map((template, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleCreateWorkflow(template)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {template.steps} steps
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No workflows created yet</p>
              <p className="text-sm">Start by creating a workflow from a template above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${workflow.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Zap className={`h-4 w-4 ${workflow.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? 'Active' : 'Paused'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWorkflow(workflow)}
                    >
                      {workflow.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Workflow Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Workflow name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleCreateWorkflow()} className="flex-1">
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setNewWorkflowName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
