
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Play, 
  Settings, 
  Clock, 
  Zap,
  Mail,
  User,
  Filter,
  Brain,
  Eye,
  Save,
  X,
  ChevronRight,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: any) => void;
}

const WorkflowBuilderModal: React.FC<WorkflowBuilderModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const actionTypes = [
    {
      id: 'trigger',
      name: 'Trigger',
      icon: Zap,
      color: 'bg-green-100 text-green-700',
      options: [
        'New Lead Added',
        'Lead Score Changed',
        'Email Opened',
        'Meeting Scheduled',
        'Deal Stage Changed'
      ]
    },
    {
      id: 'action',
      name: 'Action',
      icon: Settings,
      color: 'bg-blue-100 text-blue-700',
      options: [
        'Send Email',
        'Update CRM Field',
        'Assign to Rep',
        'Add Tag',
        'Create Task',
        'Send Notification'
      ]
    },
    {
      id: 'condition',
      name: 'Condition',
      icon: Filter,
      color: 'bg-purple-100 text-purple-700',
      options: [
        'If Lead Score > 70',
        'If Source = "Website"',
        'If Rep = Specific Person',
        'If Time = Business Hours',
        'If Tag Contains'
      ]
    },
    {
      id: 'delay',
      name: 'Delay',
      icon: Clock,
      color: 'bg-orange-100 text-orange-700',
      options: [
        'Wait 1 Hour',
        'Wait 1 Day',
        'Wait 1 Week',
        'Wait Until Business Hours',
        'Custom Delay'
      ]
    },
    {
      id: 'ai',
      name: 'AI Action',
      icon: Brain,
      color: 'bg-indigo-100 text-indigo-700',
      options: [
        'AI Lead Analysis',
        'AI Email Response',
        'AI Rep Summary',
        'AI Recommendation',
        'AI Score Calculation'
      ]
    }
  ];

  const addStep = (type: string, option: string) => {
    const newStep = {
      id: Date.now().toString(),
      type,
      action: option,
      configured: false,
      position: workflowSteps.length
    };
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };

  const handleSave = () => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    if (workflowSteps.length === 0) {
      toast.error('Please add at least one step to your workflow');
      return;
    }

    const workflow = {
      id: Date.now().toString(),
      name: workflowName,
      steps: workflowSteps,
      isActive: false,
      created: new Date().toISOString()
    };

    onSave(workflow);
    toast.success('Workflow saved successfully!');
    
    // Reset form
    setWorkflowName('');
    setWorkflowSteps([]);
    onClose();
  };

  const renderPreview = () => {
    if (!showPreview || workflowSteps.length === 0) return null;

    return (
      <div className="border-l-2 border-gray-200 pl-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-4 w-4" />
          <h4 className="font-medium">Live Preview</h4>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium text-sm mb-3">Simulation with Mock Data:</h5>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Mock Lead: John Smith from Acme Corp</span>
            </div>
            
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 pl-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  Step {index + 1}: {step.action}
                </span>
                {step.type === 'delay' && (
                  <Badge variant="outline" className="text-xs">
                    <Timer className="h-3 w-3 mr-1" />
                    1 day
                  </Badge>
                )}
              </div>
            ))}
            
            <div className="mt-3 p-2 bg-green-50 rounded text-green-800 text-xs">
              ✓ Workflow would complete successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Workflow Builder
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm">Preview</span>
              <Switch 
                checked={showPreview} 
                onCheckedChange={setShowPreview} 
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left Sidebar - Actions */}
            <div className="col-span-3 border-r pr-4 overflow-y-auto">
              <div className="space-y-4">
                <Input
                  placeholder="Workflow name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Available Actions</h4>
                  
                  {actionTypes.map((actionType) => {
                    const IconComponent = actionType.icon;
                    return (
                      <Card key={actionType.id} className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`h-4 w-4 ${actionType.color}`} />
                          <span className="font-medium text-sm">{actionType.name}</span>
                        </div>
                        <div className="space-y-1">
                          {actionType.options.map((option) => (
                            <Button
                              key={option}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-8 text-xs"
                              onClick={() => addStep(actionType.id, option)}
                            >
                              <Plus className="h-3 w-3 mr-2" />
                              {option}
                            </Button>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Canvas */}
            <div className={`${showPreview ? 'col-span-6' : 'col-span-9'} overflow-y-auto`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Workflow Steps</h4>
                  <Badge variant="outline">
                    {workflowSteps.length} steps
                  </Badge>
                </div>

                {workflowSteps.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Zap className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Add actions from the left sidebar to build your workflow
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workflowSteps.map((step, index) => {
                      const actionType = actionTypes.find(at => at.id === step.type);
                      const IconComponent = actionType?.icon || Settings;
                      
                      return (
                        <div key={step.id}>
                          <Card className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${actionType?.color}`}>
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{step.action}</div>
                                  <div className="text-xs text-gray-600">
                                    {actionType?.name} • Step {index + 1}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeStep(step.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                          
                          {index < workflowSteps.length - 1 && (
                            <div className="flex justify-center py-2">
                              <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Preview */}
            {showPreview && (
              <div className="col-span-3 overflow-y-auto">
                {renderPreview()}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSave}>
              <Play className="h-4 w-4 mr-2" />
              Save & Activate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowBuilderModal;
