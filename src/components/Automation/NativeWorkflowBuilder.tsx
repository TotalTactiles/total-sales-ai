

import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, Node, Edge, Connection, BackgroundVariant } from '@xyflow/react';
import { ReactFlow, Controls, Background, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';
import { Workflow, WorkflowStep, WorkflowConnection } from '@/services/automation/workflowService';
import { Brain } from 'lucide-react';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Trigger' }, position: { x: 100, y: 100 } },
];

const initialEdges: Edge[] = [];

const NativeWorkflowBuilder = ({ onClose, onSave }: { onClose: () => void, onSave: (workflow: Workflow) => void }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [userRole, setUserRole] = useState('sales_rep'); // Default role
  const [isValid, setIsValid] = useState(false);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  useEffect(() => {
    // Simulate fetching user role
    setTimeout(() => {
      setUserRole('manager');
    }, 500);
  }, []);

  useEffect(() => {
    setIsValid(nodes.every(node => {
      const step = node.data as any;
      return step?.isConfigured;
    }));
  }, [nodes]);

  const onSaveWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      toast.error('Workflow name is required');
      return;
    }

    if (!isValid) {
      toast.error('Please configure all steps before saving');
      return;
    }

    const workflowToSave: Workflow = {
      id: uuidv4(),
      name: workflowName,
      description: workflowDescription,
      isActive: false,
      steps: nodes.map(node => node.data as WorkflowStep),
      connections: edges.map(edge => ({
        id: edge.id,
        fromNode: edge.source,
        toNode: edge.target,
        fromHandle: edge.sourceHandle || '',
        targetHandle: edge.targetHandle || ''
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      isValid: isValid
    };

    onSave(workflowToSave);
    onClose();
    toast.success('Workflow saved successfully');
  }, [workflowName, workflowDescription, nodes, edges, onClose, onSave, isValid]);

  const addNode = useCallback((type: string) => {
    const id = uuidv4();
    const newNode: Node = {
      id,
      position: { x: 200, y: 200 },
      data: {
        id,
        type,
        name: `New ${type}`,
        config: {},
        position: { x: 200, y: 200 },
        isConfigured: false
      } as WorkflowStep,
      type: 'default'
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const updateStepConfig = useCallback((stepId: string, config: Record<string, any>) => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id === stepId) {
          const currentData = node.data as WorkflowStep;
          const updatedData: WorkflowStep = {
            ...currentData,
            config: { ...currentData.config, ...config },
            isConfigured: true
          };
          return {
            ...node,
            data: updatedData,
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleNodeClick = useCallback((event: any, node: Node) => {
    setSelectedStep(node.data as WorkflowStep);
  }, []);

  const getTriggerOptions = () => {
    const baseOptions = [
      { 
        value: 'form_submitted', 
        label: 'Form Submitted', 
        description: 'When a form is submitted',
        osElements: ['contact_form', 'lead_form', 'demo_request']
      },
      { 
        value: 'button_clicked', 
        label: 'Button Clicked', 
        description: 'When a specific button is clicked',
        osElements: ['cta_button', 'demo_button', 'contact_button']
      },
      { 
        value: 'new_lead_added', 
        label: 'New Lead Added', 
        description: 'When a new lead is created',
        osElements: []
      },
      { 
        value: 'tag_applied', 
        label: 'Tag Applied', 
        description: 'When a tag is applied to a lead',
        osElements: []
      },
      { 
        value: 'ai_assistant_triggered', 
        label: 'AI Assistant Triggered', 
        description: 'When AI Assistant is activated',
        osElements: []
      }
    ];

    // Role-specific options
    if (userRole === 'manager') {
      baseOptions.push(
        { 
          value: 'team_goal_reached', 
          label: 'Team Goal Reached', 
          description: 'When team reaches a milestone',
          osElements: []
        },
        { 
          value: 'rep_performance_alert', 
          label: 'Rep Performance Alert', 
          description: 'When rep performance needs attention',
          osElements: []
        }
      );
    }

    return baseOptions;
  };

  const getConditionOptions = () => [
    { 
      value: 'has_tag', 
      label: 'Has Tag', 
      description: 'Check if lead has specific tag',
      osElements: []
    },
    { 
      value: 'field_equals', 
      label: 'Field Equals', 
      description: 'Check if field equals value',
      osElements: []
    },
    { 
      value: 'lead_score_above', 
      label: 'Lead Score Above', 
      description: 'Check if lead score is above threshold',
      osElements: []
    },
    { 
      value: 'ai_sentiment', 
      label: 'AI Sentiment Analysis', 
      description: 'Check message sentiment',
      osElements: []
    },
    { 
      value: 'message_contains', 
      label: 'Message Contains', 
      description: 'Check if message contains text',
      osElements: []
    }
  ];

  const getActionOptions = () => {
    const baseActions = [
      { 
        value: 'send_email', 
        label: 'Send Email', 
        description: 'Send an email to the lead',
        aiSupported: false
      },
      { 
        value: 'assign_user', 
        label: 'Assign User', 
        description: 'Assign lead to a user',
        aiSupported: false
      },
      { 
        value: 'change_stage', 
        label: 'Change Stage', 
        description: 'Move lead to different stage',
        aiSupported: false
      },
      { 
        value: 'apply_tag', 
        label: 'Apply Tag', 
        description: 'Add tag to lead',
        aiSupported: false
      },
      { 
        value: 'create_task', 
        label: 'Create Task', 
        description: 'Create a follow-up task',
        aiSupported: false
      },
      { 
        value: 'trigger_notification', 
        label: 'Send Notification', 
        description: 'Send notification to user',
        aiSupported: false
      },
      { 
        value: 'ai_auto_reply', 
        label: 'AI Auto Reply', 
        description: 'Generate AI response',
        aiSupported: true
      },
      { 
        value: 'schedule_call', 
        label: 'Schedule Call', 
        description: 'Schedule a call',
        aiSupported: false
      },
      { 
        value: 'send_sms', 
        label: 'Send SMS', 
        description: 'Send SMS message',
        aiSupported: false
      },
      { 
        value: 'webhook', 
        label: 'Webhook', 
        description: 'Call external webhook',
        aiSupported: false
      },
      { 
        value: 'crm_sync', 
        label: 'CRM Sync', 
        description: 'Sync to CRM system',
        aiSupported: false
      }
    ];

    return baseActions;
  };

  const getAIActionOptions = () => [
    { 
      value: 'ai_draft_reply', 
      label: 'AI Draft Reply', 
      description: 'Generate AI draft response',
      aiSupported: true
    },
    { 
      value: 'ai_call_summary', 
      label: 'AI Call Summary', 
      description: 'Generate call summary',
      aiSupported: true
    },
    { 
      value: 'ai_objection_handler', 
      label: 'AI Objection Handler', 
      description: 'Handle objections with AI',
      aiSupported: true
    },
    { 
      value: 'ai_lead_insights', 
      label: 'AI Lead Insights', 
      description: 'Generate lead insights',
      aiSupported: true
    },
    { 
      value: 'ai_next_best_action', 
      label: 'AI Next Best Action', 
      description: 'Suggest next best action',
      aiSupported: true
    },
    { 
      value: 'ai_lead_scoring', 
      label: 'AI Lead Scoring', 
      description: 'Update lead score with AI',
      aiSupported: true
    }
  ];

  const renderStepConfiguration = () => {
    if (!selectedStep) return <div className="text-gray-500">Select a step to configure it.</div>;

    switch (selectedStep.type) {
      case 'trigger':
        return renderTriggerConfig(selectedStep);
      case 'condition':
        return renderConditionConfig(selectedStep);
      case 'action':
      case 'ai_action':
        return renderActionConfig(selectedStep);
      case 'delay':
        return renderDelayConfig(selectedStep);
      default:
        return <div className="text-red-500">Unknown step type</div>;
    }
  };

  const renderTriggerConfig = (step: WorkflowStep) => {
    const triggerOptions = getTriggerOptions();
    return (
      <div className="space-y-4">
        <div>
          <Label>Trigger Event</Label>
          <Select
            value={step.config.triggerType || ''}
            onValueChange={(value) => updateStepConfig(step.id, { triggerType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              {triggerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {step.config.triggerType === 'button_clicked' && (
          <div className="space-y-2">
            <Label>Button ID</Label>
            <Input
              placeholder="Enter button ID"
              value={step.config.buttonId || ''}
              onChange={(e) => updateStepConfig(step.id, { buttonId: e.target.value })}
            />
          </div>
        )}

        {step.config.triggerType === 'tag_applied' && (
          <div className="space-y-2">
            <Label>Tag Name</Label>
            <Input
              placeholder="Enter tag name"
              value={step.config.tagName || ''}
              onChange={(e) => updateStepConfig(step.id, { tagName: e.target.value })}
            />
          </div>
        )}
      </div>
    );
  };

  const renderConditionConfig = (step: WorkflowStep) => {
    const conditionOptions = getConditionOptions();

    return (
      <div className="space-y-4">
        <div>
          <Label>Condition Type</Label>
          <Select
            value={step.config.conditionType || ''}
            onValueChange={(value) => updateStepConfig(step.id, { conditionType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {step.config.conditionType === 'has_tag' && (
          <div className="space-y-2">
            <Label>Tag Name</Label>
            <Input
              placeholder="Enter tag name"
              value={step.config.tagName || ''}
              onChange={(e) => updateStepConfig(step.id, { tagName: e.target.value })}
            />
          </div>
        )}

        {step.config.conditionType === 'field_equals' && (
          <div className="space-y-2">
            <Label>Field Name</Label>
            <Input
              placeholder="Enter field name"
              value={step.config.fieldName || ''}
              onChange={(e) => updateStepConfig(step.id, { fieldName: e.target.value })}
            />
            <Label>Expected Value</Label>
            <Input
              placeholder="Enter expected value"
              value={step.config.conditionValue || ''}
              onChange={(e) => updateStepConfig(step.id, { conditionValue: e.target.value })}
            />
          </div>
        )}
      </div>
    );
  };

  const renderActionConfig = (step: WorkflowStep) => {
    const actionOptions = step.type === 'ai_action' ? getAIActionOptions() : getActionOptions();
    const selectedAction = actionOptions.find(opt => opt.value === step.config.actionType);

    return (
      <div className="space-y-4">
        <div>
          <Label>Action Type</Label>
          <Select
            value={step.config.actionType || ''}
            onValueChange={(value) => updateStepConfig(step.id, { actionType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select action type" />
            </SelectTrigger>
            <SelectContent>
              {actionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.aiSupported && <Brain className="h-4 w-4 text-purple-500" />}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {step.config.actionType === 'send_email' && (
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Input
              placeholder="Select or create email template"
              value={step.config.emailTemplate || ''}
              onChange={(e) => updateStepConfig(step.id, { emailTemplate: e.target.value })}
            />
          </div>
        )}

        {step.config.actionType === 'apply_tag' && (
          <div className="space-y-2">
            <Label>Tag Name</Label>
            <Input
              placeholder="Enter tag name"
              value={step.config.tagName || ''}
              onChange={(e) => updateStepConfig(step.id, { tagName: e.target.value })}
            />
          </div>
        )}

        {step.config.actionType === 'assign_user' && (
          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select
              value={step.config.assigneeId || ''}
              onValueChange={(value) => updateStepConfig(step.id, { assigneeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_user">Current User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="next_available">Next Available Rep</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  const renderDelayConfig = (step: WorkflowStep) => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Delay Amount</Label>
          <Input
            type="number"
            placeholder="Enter delay amount"
            value={step.config.delayAmount || ''}
            onChange={(e) => updateStepConfig(step.id, { delayAmount: e.target.value })}
          />
        </div>
        <div>
          <Label>Delay Unit</Label>
          <Select
            value={step.config.delayUnit || 'minutes'}
            onValueChange={(value) => updateStepConfig(step.id, { delayUnit: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Workflow Area */}
      <div className="w-3/4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              {workflowName}
              <Input
                placeholder="Workflow Name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="ml-4 w-auto inline-block"
              />
            </CardTitle>
            <Textarea
              placeholder="Workflow Description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="mt-2"
            />
          </CardHeader>
          <CardContent className="h-[calc(100%-100px)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </CardContent>
          <div className="p-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSaveWorkflow} disabled={!isValid}>Save Workflow</Button>
          </div>
        </Card>
      </div>

      {/* Configuration Sidebar */}
      <div className="w-1/4 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Step Configuration</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto h-[calc(100%-100px)]">
            {renderStepConfiguration()}
          </CardContent>
          <div className="p-4 flex flex-col gap-2">
            <Button variant="secondary" onClick={() => addNode('action')}>Add Action</Button>
            <Button variant="secondary" onClick={() => addNode('condition')}>Add Condition</Button>
            <Button variant="secondary" onClick={() => addNode('delay')}>Add Delay</Button>
            <Button variant="secondary" onClick={() => addNode('ai_action')}>Add AI Action</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NativeWorkflowBuilder;

