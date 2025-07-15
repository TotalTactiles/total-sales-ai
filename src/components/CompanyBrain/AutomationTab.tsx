import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Send, 
  Users, 
  Clock, 
  Zap,
  Settings,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'lead_followup' | 'nurturing' | 'onboarding' | 'qualification';
  steps: number;
  usage: number;
  lastUsed: Date | null;
  status: 'active' | 'draft' | 'paused';
  assignedReps: string[];
}

interface WorkflowBuilder {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused';
  steps: Array<{
    id: string;
    type: 'action' | 'condition' | 'delay' | 'ai_action';
    name: string;
    config: any;
  }>;
  triggers: string[];
  assignedTo: string[];
}

const AutomationTab: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReps, setSelectedReps] = useState<string[]>([]);

  const [templates] = useState<WorkflowTemplate[]>([
    {
      id: '1',
      name: 'New Lead Welcome Sequence',
      description: 'Automated welcome email series for new leads with personalized content',
      category: 'lead_followup',
      steps: 5,
      usage: 143,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      assignedReps: ['Sarah J.', 'Mike R.', 'Lisa K.']
    },
    {
      id: '2',
      name: 'Demo Follow-up Sequence',
      description: 'Post-demo follow-up workflow with case studies and trial offers',
      category: 'nurturing',
      steps: 3,
      usage: 89,
      lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'active',
      assignedReps: ['John D.', 'Emma W.']
    },
    {
      id: '3',
      name: 'Cold Lead Reactivation',
      description: 'Re-engagement campaign for leads that have gone cold',
      category: 'qualification',
      steps: 4,
      usage: 56,
      lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'paused',
      assignedReps: []
    }
  ]);

  const [workflows] = useState<WorkflowBuilder[]>([
    {
      id: '1',
      name: 'Lead Scoring Automation',
      status: 'active',
      steps: [
        { id: '1', type: 'condition', name: 'Check lead source', config: {} },
        { id: '2', type: 'ai_action', name: 'AI scoring analysis', config: {} },
        { id: '3', type: 'action', name: 'Update lead score', config: {} }
      ],
      triggers: ['New Lead', 'Lead Update'],
      assignedTo: ['Team Alpha', 'Team Beta']
    }
  ]);

  const availableReps = [
    'Sarah Johnson', 'Mike Rodriguez', 'Lisa Kim', 'John Davis', 
    'Emma Wilson', 'Alex Chen', 'Rachel Brown', 'Tom Anderson'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lead_followup': return 'bg-blue-100 text-blue-700';
      case 'nurturing': return 'bg-purple-100 text-purple-700';
      case 'onboarding': return 'bg-green-100 text-green-700';
      case 'qualification': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
  };

  const handleAssignToReps = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setSelectedReps(template.assignedReps);
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (selectedReps.length === 0) {
      toast.error('Please select at least one rep');
      return;
    }
    
    toast.success(`Workflow assigned to ${selectedReps.length} reps - They will receive notifications`);
    setIsAssignModalOpen(false);
    setSelectedReps([]);
  };

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    toast.success(`Deleted template: ${templateName}`);
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Less than 1h ago';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Workflow Templates</TabsTrigger>
          <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Workflow Templates</h3>
              <p className="text-sm text-gray-600">
                Pre-built automation sequences ready to assign to your sales reps
              </p>
            </div>
            <Button onClick={() => setIsBuilderOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Template Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
                <div className="text-sm text-gray-600">Total Templates</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {templates.filter(t => t.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {templates.reduce((sum, t) => sum + t.usage, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Usage</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {templates.reduce((sum, t) => sum + t.assignedReps.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Rep Assignments</div>
              </CardContent>
            </Card>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                        <Badge variant="outline" className={getCategoryColor(template.category)}>
                          {template.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-gray-400" />
                      <span>{template.steps} steps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{template.usage} uses</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Last used:</span>
                      <span>{formatTimeAgo(template.lastUsed)}</span>
                    </div>
                  </div>

                  {template.assignedReps.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Assigned to:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.assignedReps.slice(0, 2).map((rep) => (
                          <Badge key={rep} variant="secondary" className="text-xs">
                            {rep}
                          </Badge>
                        ))}
                        {template.assignedReps.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.assignedReps.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewTemplate(template)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAssignToReps(template)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id, template.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          {/* Builder Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Workflow Builder</h3>
              <p className="text-sm text-gray-600">
                Create custom automation workflows with actions, conditions, and AI integration
              </p>
            </div>
            <Button onClick={() => toast.info('Workflow Builder - Feature disabled for demo')}>
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>

          {/* Existing Workflows */}
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{workflow.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {workflow.steps.length} steps • {workflow.triggers.length} triggers
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Triggers: </span>
                      {workflow.triggers.map((trigger) => (
                        <Badge key={trigger} variant="outline" className="mr-1">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Assigned to: </span>
                      {workflow.assignedTo.map((assignee) => (
                        <Badge key={assignee} variant="secondary" className="mr-1">
                          {assignee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Builder Placeholder */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Workflow Builder</h3>
              <p className="text-gray-600 mb-6">
                Drag-and-drop workflow builder with live preview, AI actions, and conditional logic
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => toast.info('Live Preview - Feature disabled for demo')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Live Preview
                </Button>
                <Button variant="outline" onClick={() => toast.info('AI Actions - Feature disabled for demo')}>
                  <Zap className="h-4 w-4 mr-2" />
                  AI Actions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Detail Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedTemplate.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{selectedTemplate.steps}</div>
                  <div className="text-sm text-gray-600">Steps</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{selectedTemplate.usage}</div>
                  <div className="text-sm text-gray-600">Uses</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{selectedTemplate.assignedReps.length}</div>
                  <div className="text-sm text-gray-600">Assigned Reps</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Workflow Sequence:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                    <span>Initial contact email (personalized)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                    <span>Wait 2 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
                    <span>Follow-up with case study</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</div>
                    <span>Wait 3 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">5</div>
                    <span>Final follow-up with demo offer</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Close
                </Button>
                <Button onClick={() => handleAssignToReps(selectedTemplate)}>
                  <Send className="h-4 w-4 mr-2" />
                  Assign to Reps
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign to Reps Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Workflow to Reps</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select sales reps to assign this workflow. They'll receive notifications and 
              can see it in their Rep OS under Automation → "New/Assigned".
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableReps.map((rep) => (
                <label key={rep} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedReps.includes(rep)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReps(prev => [...prev, rep]);
                      } else {
                        setSelectedReps(prev => prev.filter(r => r !== rep));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{rep}</span>
                </label>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              Selected: {selectedReps.length} reps
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAssignment}>
                <Send className="h-4 w-4 mr-2" />
                Assign Workflow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationTab;
