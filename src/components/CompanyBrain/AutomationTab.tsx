
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  Eye,
  MoreVertical,
  Send,
  Zap,
  Clock,
  Bot
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: number;
  usage: number;
  active: boolean;
}

const AutomationTab: React.FC = () => {
  const [templates] = useState<WorkflowTemplate[]>([
    {
      id: '1',
      name: 'Lead Follow-up Sequence',
      description: 'Automated email sequence for new leads',
      category: 'Lead Management',
      steps: 5,
      usage: 23,
      active: true
    },
    {
      id: '2',
      name: 'Welcome Email Series',
      description: 'Onboarding sequence for new customers',
      category: 'Customer Success',
      steps: 7,
      usage: 12,
      active: true
    },
    {
      id: '3',
      name: 'Re-engagement Campaign',
      description: 'Win back inactive leads',
      category: 'Marketing',
      steps: 4,
      usage: 8,
      active: false
    }
  ]);

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const workflowActions = [
    { name: 'Send Email', icon: Send, color: 'blue' },
    { name: 'Add Delay', icon: Clock, color: 'orange' },
    { name: 'Add Condition', icon: Zap, color: 'purple' },
    { name: 'AI Action', icon: Bot, color: 'green' }
  ];

  const handleSendToReps = (templateId: string) => {
    console.log('Sending template to reps:', templateId);
    // Logic to assign workflow to selected reps
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Deleting template:', templateId);
    // Logic to delete workflow template
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automation</h2>
          <p className="text-muted-foreground">Create and manage workflow templates</p>
        </div>
        <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Workflow Builder</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {workflowActions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                      {action.name}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Live Preview
                  </Button>
                  <Button size="sm">Save Workflow</Button>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Build Your Workflow</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop actions to create your automation sequence
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Action
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Workflow Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {template.category}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendToReps(template.id)}>
                        <Users className="h-4 w-4 mr-2" />
                        Send to Reps
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{template.description}</p>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Steps: {template.steps}</span>
                  <span className="text-muted-foreground">Used by: {template.usage} reps</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsTemplateModalOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant={template.active ? "default" : "outline"}
                    size="sm"
                  >
                    {template.active ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Template Details Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedTemplate.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Workflow Sequence:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Send className="h-4 w-4 text-blue-600" />
                    <span>Send welcome email</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Wait 2 days</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Send className="h-4 w-4 text-blue-600" />
                    <span>Send follow-up email</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Usage Notes:</h4>
                <p className="text-sm text-muted-foreground">
                  This workflow is automatically triggered when a new lead is added to the system.
                  Currently used by {selectedTemplate.usage} team members.
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleSendToReps(selectedTemplate.id)}>
                  <Users className="h-4 w-4 mr-2" />
                  Assign to Reps
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationTab;
