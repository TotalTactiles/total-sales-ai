
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2,
  Clock,
  Filter,
  Send,
  Database,
  MessageSquare,
  Users,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  nodes: WorkflowNode[];
  triggers: number;
  lastRun?: Date;
}

const AdvancedWorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: '1',
      name: 'Lead Follow-up Sequence',
      description: 'Automated follow-up emails for new leads',
      status: 'active',
      nodes: [],
      triggers: 42,
      lastRun: new Date('2024-01-12')
    },
    {
      id: '2',
      name: 'High-Value Customer Alert',
      description: 'Notify team when high-value prospects engage',
      status: 'active',
      nodes: [],
      triggers: 18,
      lastRun: new Date('2024-01-11')
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const nodeTypes = [
    {
      type: 'trigger',
      name: 'New Lead Created',
      icon: <Users className="h-4 w-4" />,
      description: 'Triggers when a new lead is added to the system'
    },
    {
      type: 'trigger',
      name: 'Email Opened',
      icon: <Send className="h-4 w-4" />,
      description: 'Triggers when a lead opens an email'
    },
    {
      type: 'condition',
      name: 'Lead Score Check',
      icon: <Filter className="h-4 w-4" />,
      description: 'Check if lead score meets criteria'
    },
    {
      type: 'condition',
      name: 'Time-based Condition',
      icon: <Clock className="h-4 w-4" />,
      description: 'Check time since last interaction'
    },
    {
      type: 'action',
      name: 'Send Email',
      icon: <Send className="h-4 w-4" />,
      description: 'Send personalized email to lead'
    },
    {
      type: 'action',
      name: 'Create Task',
      icon: <Database className="h-4 w-4" />,
      description: 'Create a follow-up task for sales rep'
    },
    {
      type: 'action',
      name: 'Send Slack Message',
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Notify team via Slack'
    },
    {
      type: 'delay',
      name: 'Wait Period',
      icon: <Clock className="h-4 w-4" />,
      description: 'Add delay before next action'
    }
  ];

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    const newWorkflow: AutomationWorkflow = {
      id: crypto.randomUUID(),
      name: newWorkflowName,
      description: 'New automation workflow',
      status: 'draft',
      nodes: [],
      triggers: 0
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow.id);
    setNewWorkflowName('');
    setIsCreatingWorkflow(false);
    toast.success('Workflow created successfully');
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
    toast.success('Workflow status updated');
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (selectedWorkflow === id) {
      setSelectedWorkflow(null);
    }
    toast.success('Workflow deleted');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Advanced Automation Workflows
            </CardTitle>
            <Button 
              onClick={() => setIsCreatingWorkflow(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value="workflows" className="w-full">
            <TabsList>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="space-y-4">
              {/* Create New Workflow */}
              {isCreatingWorkflow && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex gap-2">
                      <Input
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                        placeholder="Enter workflow name..."
                        className="flex-1"
                      />
                      <Button onClick={createWorkflow}>Create</Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreatingWorkflow(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Workflows List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map((workflow) => (
                  <Card 
                    key={workflow.id} 
                    className={`cursor-pointer transition-all ${
                      selectedWorkflow === workflow.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedWorkflow(workflow.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{workflow.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {workflow.description}
                          </p>
                        </div>
                        {getStatusBadge(workflow.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Triggers:</span>
                          <span className="font-medium">{workflow.triggers}</span>
                        </div>
                        {workflow.lastRun && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Last run:</span>
                            <span className="font-medium">
                              {workflow.lastRun.toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWorkflowStatus(workflow.id);
                            }}
                          >
                            {workflow.status === 'active' ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Open settings
                            }}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteWorkflow(workflow.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Workflow Builder */}
              {selectedWorkflowData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Builder: {selectedWorkflowData.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Node Palette */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Available Nodes</h4>
                        <div className="space-y-2">
                          {nodeTypes.map((node, index) => (
                            <div
                              key={index}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toast.info(`Added ${node.name} node`)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {node.icon}
                                <span className="text-sm font-medium">{node.name}</span>
                              </div>
                              <p className="text-xs text-gray-600">{node.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Canvas */}
                      <div className="lg:col-span-3">
                        <div className="border rounded-lg h-96 bg-gray-50 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <Workflow className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Drag nodes here to build your workflow</p>
                            <p className="text-sm mt-1">
                              Start by adding a trigger from the left panel
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Lead Nurture Campaign',
                    description: 'Automated email sequence for new leads',
                    steps: 5
                  },
                  {
                    name: 'Re-engagement Flow',
                    description: 'Win back inactive prospects',
                    steps: 3
                  },
                  {
                    name: 'Onboarding Sequence',
                    description: 'Welcome new customers',
                    steps: 7
                  },
                  {
                    name: 'Upsell Campaign',
                    description: 'Promote additional products',
                    steps: 4
                  }
                ].map((template, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{template.steps} steps</Badge>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Total Workflows</span>
                    </div>
                    <div className="text-2xl font-bold">{workflows.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Active Workflows</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {workflows.filter(w => w.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Total Triggers</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {workflows.reduce((sum, w) => sum + w.triggers, 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedWorkflowBuilder;
