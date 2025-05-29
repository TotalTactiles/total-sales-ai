import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Settings, 
  Zap,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { workflowService, Workflow, WorkflowAction, WorkflowTrigger } from '@/services/automation/workflowService';
import { mockWorkflows } from '@/data/enhancedMockData';
import { toast } from 'sonner';

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: { type: 'lead_status_change', conditions: {} } as WorkflowTrigger,
    actions: [] as WorkflowAction[]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, use mock data
      setWorkflows(mockWorkflows as Workflow[]);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name || newWorkflow.actions.length === 0) {
      toast.error('Please provide a name and at least one action');
      return;
    }

    try {
      // For demo purposes, simulate creation
      const workflowId = `workflow-${Date.now()}`;
      const workflow: Workflow = {
        ...newWorkflow,
        id: workflowId,
        isActive: true,
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        runCount: 0
      };

      setWorkflows(prev => [...prev, workflow]);
      setIsCreating(false);
      setNewWorkflow({
        name: '',
        description: '',
        trigger: { type: 'lead_status_change', conditions: {} },
        actions: []
      });
      toast.success('Workflow created successfully');
    } catch (error) {
      console.error('Failed to create workflow:', error);
      toast.error('Failed to create workflow');
    }
  };

  const handleToggleWorkflow = async (workflowId: string, isActive: boolean) => {
    try {
      setWorkflows(prev =>
        prev.map(w => w.id === workflowId ? { ...w, isActive } : w)
      );
      toast.success(`Workflow ${isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
      toast.error('Failed to toggle workflow');
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      toast.success('Workflow deleted successfully');
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      toast.error('Failed to delete workflow');
    }
  };

  const addAction = () => {
    if (newWorkflow.actions.length >= 10) {
      toast.error('Maximum 10 actions allowed per workflow');
      return;
    }

    setNewWorkflow(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'send_email', parameters: {} }]
    }));
  };

  const updateAction = (index: number, action: WorkflowAction) => {
    setNewWorkflow(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) => i === index ? action : a)
    }));
  };

  const removeAction = (index: number) => {
    setNewWorkflow(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email': return <Mail className="h-4 w-4" />;
      case 'make_call': return <Phone className="h-4 w-4" />;
      case 'send_sms': return <MessageSquare className="h-4 w-4" />;
      case 'create_task': return <CheckCircle className="h-4 w-4" />;
      case 'update_lead': return <Settings className="h-4 w-4" />;
      case 'ai_analysis': return <Zap className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'voice_command': return <MessageSquare className="h-4 w-4" />;
      case 'lead_status_change': return <Settings className="h-4 w-4" />;
      case 'time_based': return <Clock className="h-4 w-4" />;
      case 'email_received': return <Mail className="h-4 w-4" />;
      case 'call_completed': return <Phone className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Automation Workflows</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Existing Workflows */}
      <div className="grid gap-4">
        {workflows.map(workflow => (
          <Card key={workflow.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                {getTriggerIcon(workflow.trigger.type)}
                <div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                  {workflow.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Run {workflow.runCount} times
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Trigger</p>
                    <p className="font-medium capitalize">{workflow.trigger.type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Actions</p>
                    <p className="font-medium">{workflow.actions.length} actions</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Last Run</p>
                    <p className="font-medium">
                      {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleToggleWorkflow(workflow.id, !workflow.isActive)}
                    size="sm"
                    variant="outline"
                  >
                    {workflow.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Workflow Modal */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  id="workflow-name"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does"
                />
              </div>

              <div className="space-y-2">
                <Label>Trigger</Label>
                <select
                  className="w-full p-2 border border-input rounded-md"
                  value={newWorkflow.trigger.type}
                  onChange={(e) => setNewWorkflow(prev => ({
                    ...prev,
                    trigger: { ...prev.trigger, type: e.target.value as any }
                  }))}
                >
                  <option value="lead_status_change">Lead Status Change</option>
                  <option value="voice_command">Voice Command</option>
                  <option value="time_based">Time Based</option>
                  <option value="email_received">Email Received</option>
                  <option value="call_completed">Call Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Actions ({newWorkflow.actions.length}/10)</Label>
                <Button onClick={addAction} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </div>
              
              {newWorkflow.actions.map((action, index) => (
                <div key={index} className="border border-border rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(action.type)}
                      <span className="font-medium">Action {index + 1}</span>
                    </div>
                    <Button
                      onClick={() => removeAction(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Action Type</Label>
                    <select
                      className="w-full p-2 border border-input rounded-md"
                      value={action.type}
                      onChange={(e) => updateAction(index, { ...action, type: e.target.value as any })}
                    >
                      <option value="send_email">Send Email</option>
                      <option value="make_call">Make Call</option>
                      <option value="send_sms">Send SMS</option>
                      <option value="create_task">Create Task</option>
                      <option value="update_lead">Update Lead</option>
                      <option value="ai_analysis">AI Analysis</option>
                    </select>
                  </div>

                  {action.type === 'send_email' && (
                    <div className="space-y-2">
                      <Label>Email Template</Label>
                      <Input
                        placeholder="Email template name"
                        onChange={(e) => updateAction(index, {
                          ...action,
                          parameters: { ...action.parameters, template: e.target.value }
                        })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Delay (seconds)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={action.delay || ''}
                      onChange={(e) => updateAction(index, {
                        ...action,
                        delay: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreateWorkflow} disabled={isLoading}>
                Create Workflow
              </Button>
              <Button 
                onClick={() => setIsCreating(false)} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {workflows.length === 0 && !isCreating && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Workflows Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create automated workflows to streamline your sales process.
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowBuilder;
