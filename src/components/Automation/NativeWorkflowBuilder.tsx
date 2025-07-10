
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Plus, 
  Mail, 
  Phone, 
  Clock, 
  Database, 
  Zap, 
  Settings,
  Trash2,
  Copy,
  Play,
  Pause,
  ArrowRight,
  Save,
  TestTube,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Move,
  MoreVertical,
  GitBranch,
  Bot,
  Target,
  MessageSquare,
  Users,
  Tag,
  FileText,
  Bell,
  Calendar,
  MousePointer
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'ai_action';
  title: string;
  description: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  connections: string[];
  isConfigured: boolean;
  isExpanded?: boolean;
  branchType?: 'yes' | 'no' | 'default';
}

interface NodeConnection {
  id: string;
  fromNode: string;
  toNode: string;
  fromHandle: string;
  toHandle: string;
  branchType?: 'yes' | 'no' | 'default';
}

interface NativeWorkflowBuilderProps {
  onClose: () => void;
  onSave: (workflow: any) => void;
}

const NativeWorkflowBuilder: React.FC<NativeWorkflowBuilderProps> = ({ onClose, onSave }) => {
  const { profile } = useAuth();
  const [workflowName, setWorkflowName] = useState('');
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<NodeConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [showNodeConfig, setShowNodeConfig] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const [showOSSelector, setShowOSSelector] = useState<{ nodeId: string; type: string } | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // OS-specific configuration options based on user role
  const getOSSpecificOptions = (nodeType: string, triggerType?: string) => {
    const isManager = profile?.role === 'manager';
    const isSalesRep = profile?.role === 'sales_rep';

    if (nodeType === 'trigger') {
      const baseTriggers = [
        { value: 'form_submitted', label: 'Form Submitted', description: 'When a lead form is submitted', osElements: ['Contact Form', 'Demo Request', 'Pricing Form'] },
        { value: 'button_clicked', label: 'Button Clicked', description: 'When a specific button is clicked', osElements: ['Call Button', 'Email Button', 'Schedule Meeting', 'Mark Complete'] },
        { value: 'new_lead_added', label: 'New Lead Added', description: 'When a new lead is created', osElements: [] },
        { value: 'task_completed', label: 'Task Marked Complete', description: 'When a task is completed', osElements: [] },
        { value: 'tag_applied', label: 'Tag Applied', description: 'When a tag is applied to a lead', osElements: ['Hot Lead', 'Qualified', 'Demo Scheduled', 'Follow-up'] },
        { value: 'ai_assistant_triggered', label: 'AI Assistant Triggered', description: 'When AI assistant is activated', osElements: [] }
      ];

      if (isSalesRep) {
        baseTriggers.push(
          { value: 'call_scheduled', label: 'Call Scheduled', description: 'When a call is scheduled', osElements: [] },
          { value: 'call_completed', label: 'Call Completed', description: 'When a call is finished', osElements: [] },
          { value: 'email_opened', label: 'Email Opened', description: 'When recipient opens email', osElements: [] },
          { value: 'email_clicked', label: 'Email Link Clicked', description: 'When email link is clicked', osElements: [] }
        );
      }

      if (isManager) {
        baseTriggers.push(
          { value: 'team_performance', label: 'Team Performance Alert', description: 'Based on team metrics', osElements: [] },
          { value: 'pipeline_stage_change', label: 'Pipeline Stage Changed', description: 'When lead moves between stages', osElements: ['New', 'Qualified', 'Demo', 'Proposal', 'Closed Won', 'Closed Lost'] }
        );
      }

      return baseTriggers;
    }

    if (nodeType === 'condition') {
      return [
        { value: 'has_tag', label: 'Contact Has Tag', description: 'Check if contact has specific tag', variables: ['lead.tags', 'lead.source'] },
        { value: 'field_equals', label: 'Field Equals Value', description: 'Check if field matches value', variables: ['lead.name', 'lead.email', 'lead.company', 'lead.status'] },
        { value: 'lead_score_above', label: 'Lead Score Above', description: 'Check if lead score is above threshold', variables: ['lead.score'] },
        { value: 'ai_sentiment', label: 'AI Sentiment Analysis', description: 'AI determines sentiment', variables: ['message.content', 'call.transcript'] },
        { value: 'time_condition', label: 'Time-Based Condition', description: 'Check time/date conditions', variables: ['current.time', 'lead.created_at', 'task.due_date'] },
        { value: 'message_contains', label: 'Message Contains', description: 'Check if message contains keywords', variables: ['email.content', 'sms.content'] }
      ];
    }

    if (nodeType === 'action') {
      const baseActions = [
        { value: 'send_email', label: 'Send Email', description: 'Send an email to the contact', aiSupported: true },
        { value: 'assign_user', label: 'Assign User', description: 'Assign contact to a user', aiSupported: false },
        { value: 'change_stage', label: 'Change Stage', description: 'Update lead stage', aiSupported: false },
        { value: 'apply_tag', label: 'Apply Tag', description: 'Add tag to contact', aiSupported: true },
        { value: 'create_task', label: 'Create Task', description: 'Create a new task', aiSupported: true },
        { value: 'trigger_notification', label: 'Send Notification', description: 'Notify user or team', aiSupported: false },
        { value: 'ai_auto_reply', label: 'AI Auto-Reply', description: 'Generate AI reply to message', aiSupported: true },
        { value: 'ai_lead_scoring', label: 'AI Lead Scoring', description: 'Score lead using AI', aiSupported: true },
        { value: 'webhook', label: 'Send Webhook', description: 'Send data to external URL', aiSupported: false },
        { value: 'crm_sync', label: 'CRM Sync', description: 'Sync with external CRM', aiSupported: false }
      ];

      if (isSalesRep) {
        baseActions.push(
          { value: 'schedule_call', label: 'Schedule Call', description: 'Book a call with lead', aiSupported: true },
          { value: 'send_sms', label: 'Send SMS', description: 'Send text message', aiSupported: true }
        );
      }

      if (isManager) {
        baseActions.push(
          { value: 'team_notify', label: 'Notify Team', description: 'Send notification to team', aiSupported: false },
          { value: 'update_deal_value', label: 'Update Deal Value', description: 'Change deal amount', aiSupported: true }
        );
      }

      return baseActions;
    }

    if (nodeType === 'ai_action') {
      return [
        { value: 'ai_draft_reply', label: 'AI Draft Reply', description: 'Generate response draft' },
        { value: 'ai_call_summary', label: 'AI Call Summary', description: 'Summarize call transcript' },
        { value: 'ai_objection_handler', label: 'AI Objection Classification', description: 'Classify and suggest responses' },
        { value: 'ai_lead_insights', label: 'AI Lead Insights', description: 'Generate lead analysis' },
        { value: 'ai_next_best_action', label: 'AI Next Best Action', description: 'Suggest optimal next step' }
      ];
    }

    return [];
  };

  // Dynamic variables based on context
  const getAvailableVariables = () => {
    return [
      { name: 'lead.name', description: 'Lead full name' },
      { name: 'lead.email', description: 'Lead email address' },
      { name: 'lead.phone', description: 'Lead phone number' },
      { name: 'lead.company', description: 'Lead company name' },
      { name: 'lead.source', description: 'Lead source' },
      { name: 'lead.score', description: 'Lead score (0-100)' },
      { name: 'lead.tags', description: 'Lead tags array' },
      { name: 'lead.status', description: 'Current lead status' },
      { name: 'user.name', description: 'Current user name' },
      { name: 'user.email', description: 'Current user email' },
      { name: 'current.time', description: 'Current timestamp' },
      { name: 'current.date', description: 'Current date' },
      { name: 'message.content', description: 'Message content' },
      { name: 'call.duration', description: 'Call duration in minutes' },
      { name: 'ai.sentiment', description: 'AI-detected sentiment' }
    ];
  };

  const nodeTypes = [
    {
      type: 'trigger',
      title: 'Trigger',
      icon: <Zap className="h-4 w-4" />,
      description: 'Start workflow when...',
      color: 'bg-green-100 border-green-300 text-green-800',
      options: getOSSpecificOptions('trigger')
    },
    {
      type: 'condition',
      title: 'Condition',
      icon: <GitBranch className="h-4 w-4" />,
      description: 'If condition is met...',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      options: getOSSpecificOptions('condition')
    },
    {
      type: 'action',
      title: 'Action',
      icon: <Target className="h-4 w-4" />,
      description: 'Perform action...',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      options: getOSSpecificOptions('action')
    },
    {
      type: 'ai_action',
      title: 'AI Action',
      icon: <Bot className="h-4 w-4" />,
      description: 'AI-powered action...',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      options: getOSSpecificOptions('ai_action')
    },
    {
      type: 'delay',
      title: 'Delay',
      icon: <Clock className="h-4 w-4" />,
      description: 'Wait for...',
      color: 'bg-gray-100 border-gray-300 text-gray-800',
      options: [
        { value: 'minutes', label: 'Minutes', description: 'Wait for X minutes' },
        { value: 'hours', label: 'Hours', description: 'Wait for X hours' },
        { value: 'days', label: 'Days', description: 'Wait for X days' },
        { value: 'specific_time', label: 'Specific Time', description: 'Wait until specific time' }
      ]
    }
  ];

  // AI-suggested workflows based on user behavior
  const getAISuggestedWorkflows = () => {
    if (profile?.role === 'sales_rep') {
      return [
        {
          name: 'Lead Response Automation',
          description: 'Auto-respond to new leads with personalized messages',
          nodes: [
            { type: 'trigger', config: { triggerType: 'new_lead_added' } },
            { type: 'ai_action', config: { actionType: 'ai_draft_reply' } },
            { type: 'action', config: { actionType: 'send_email' } }
          ]
        },
        {
          name: 'Follow-up Reminder System',
          description: 'Automatically create follow-up tasks',
          nodes: [
            { type: 'trigger', config: { triggerType: 'email_opened' } },
            { type: 'delay', config: { delayUnit: 'hours', delayAmount: '24' } },
            { type: 'action', config: { actionType: 'create_task' } }
          ]
        }
      ];
    }

    if (profile?.role === 'manager') {
      return [
        {
          name: 'Team Performance Alerts',
          description: 'Get notified when team metrics change',
          nodes: [
            { type: 'trigger', config: { triggerType: 'team_performance' } },
            { type: 'condition', config: { conditionType: 'lead_score_above' } },
            { type: 'action', config: { actionType: 'team_notify' } }
          ]
        },
        {
          name: 'Pipeline Stage Monitoring',
          description: 'Track and optimize pipeline flow',
          nodes: [
            { type: 'trigger', config: { triggerType: 'pipeline_stage_change' } },
            { type: 'ai_action', config: { actionType: 'ai_lead_insights' } },
            { type: 'action', config: { actionType: 'trigger_notification' } }
          ]
        }
      ];
    }

    return [];
  };

  // Mouse event handlers for canvas interaction
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      setShowContextMenu(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  // Node manipulation functions
  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      title: nodeTypes.find(n => n.type === type)?.title || 'Node',
      description: nodeTypes.find(n => n.type === type)?.description || '',
      position: { 
        x: (300 + nodes.length * 50 - canvasOffset.x) / zoom, 
        y: (200 - canvasOffset.y) / zoom 
      },
      config: {},
      connections: [],
      isConfigured: false,
      isExpanded: false
    };

    setNodes(prev => [...prev, newNode]);
  };

  const updateNodePosition = (nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position } : node
    ));
  };

  const updateNodeConfig = (nodeId: string, config: Record<string, any>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, config, isConfigured: Object.keys(config).length > 0 }
        : node
    ));
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.fromNode !== nodeId && conn.toNode !== nodeId
    ));
    setShowContextMenu(null);
  };

  const duplicateNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const duplicatedNode: WorkflowNode = {
        ...node,
        id: `node-${Date.now()}`,
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        connections: []
      };
      setNodes(prev => [...prev, duplicatedNode]);
    }
    setShowContextMenu(null);
  };

  const connectNodes = (fromId: string, toId: string, branchType: 'yes' | 'no' | 'default' = 'default') => {
    if (fromId === toId) return;
    
    const connectionExists = connections.some(conn => 
      conn.fromNode === fromId && conn.toNode === toId
    );
    
    if (!connectionExists) {
      const newConnection: NodeConnection = {
        id: `connection-${fromId}-${toId}-${Date.now()}`,
        fromNode: fromId,
        toNode: toId,
        fromHandle: 'output',
        toHandle: 'input',
        branchType
      };
      setConnections(prev => [...prev, newConnection]);
    }
    
    setConnectingFrom(null);
  };

  // Validation and testing
  const validateWorkflow = () => {
    const errors: string[] = [];
    
    if (!workflowName.trim()) {
      errors.push('Workflow name is required');
    }
    
    if (nodes.length === 0) {
      errors.push('At least one node is required');
    }
    
    const triggerNodes = nodes.filter(n => n.type === 'trigger');
    if (triggerNodes.length === 0) {
      errors.push('At least one trigger node is required');
    }
    
    const unconfiguredNodes = nodes.filter(n => !n.isConfigured);
    if (unconfiguredNodes.length > 0) {
      errors.push(`${unconfiguredNodes.length} node(s) need configuration`);
    }
    
    return errors;
  };

  const testWorkflow = async () => {
    setIsTestMode(true);
    setTestResults([]);
    
    const mockData = {
      leadId: 'test-lead-123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      score: 75,
      tags: ['interested', 'demo-requested'],
      source: 'website',
      company: 'Test Company'
    };

    const results: any[] = [];
    
    // Simulate workflow execution with more realistic logic
    for (const node of nodes) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      
      const result = {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: node.title,
        status: 'success',
        message: '',
        data: mockData,
        timestamp: new Date().toISOString()
      };

      switch (node.type) {
        case 'trigger':
          result.message = `✅ Trigger activated: ${node.config.triggerType || 'new_lead_added'}`;
          if (node.config.triggerType === 'ai_assistant_triggered') {
            result.message += ' - AI Assistant ready for processing';
          }
          break;
          
        case 'condition':
          const conditionMet = node.config.conditionType === 'ai_sentiment' 
            ? Math.random() > 0.3 
            : Math.random() > 0.2; // 80% success rate for most conditions
          result.status = conditionMet ? 'success' : 'failed';
          result.message = conditionMet 
            ? `✅ Condition passed: ${node.config.conditionType || 'has_tag'}`
            : `❌ Condition failed: ${node.config.conditionType || 'has_tag'}`;
          
          if (node.config.conditionType === 'ai_sentiment') {
            result.message += conditionMet ? ' (Sentiment: Positive)' : ' (Sentiment: Neutral)';
          }
          break;
          
        case 'action':
          if (node.config.actionType === 'ai_auto_reply') {
            result.message = `✅ AI generated personalized reply for ${mockData.name}`;
          } else if (node.config.actionType === 'send_email') {
            result.message = `✅ Email sent to ${mockData.email}`;
          } else {
            result.message = `✅ Action executed: ${node.config.actionType || 'send_email'}`;
          }
          break;
          
        case 'ai_action':
          result.message = `🤖 AI Action completed: ${node.config.actionType || 'ai_draft_reply'}`;
          if (node.config.actionType === 'ai_lead_scoring') {
            result.message += ` - New score: ${Math.floor(Math.random() * 40) + 60}`;
          }
          break;
          
        case 'delay':
          result.message = `⏱️ Delay applied: ${node.config.delayAmount || '30'} ${node.config.delayUnit || 'minutes'}`;
          break;
      }
      
      results.push(result);
      setTestResults([...results]);
      
      // Stop execution if condition fails
      if (result.status === 'failed') break;
    }

    setTimeout(() => {
      setIsTestMode(false);
      toast.success('Workflow test completed');
    }, 1000);
  };

  const handleSaveWorkflow = () => {
    const errors = validateWorkflow();
    
    if (errors.length > 0) {
      toast.error(`Cannot save workflow: ${errors.join(', ')}`);
      return;
    }

    const workflow = {
      id: `workflow-${Date.now()}`,
      name: workflowName,
      description: `Custom workflow with ${nodes.length} steps`,
      isActive: false,
      steps: nodes.map(node => ({
        id: node.id,
        type: node.type,
        name: node.title,
        config: node.config,
        position: node.position,
        isConfigured: node.isConfigured
      })),
      connections: connections,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSave(workflow);
    toast.success('Workflow saved successfully');
  };

  // Context menu handlers
  const handleRightClick = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setShowContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId
    });
  };

  // OS Element selector modal
  const OSElementSelector = ({ nodeId, type, onClose }: { nodeId: string; type: string; onClose: () => void }) => {
    const node = nodes.find(n => n.id === nodeId);
    const options = getOSSpecificOptions(type, node?.config[`${type}Type`]);
    const selectedOption = options.find(opt => opt.value === node?.config[`${type}Type`]);

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Select
              value={node?.config[`${type}Type`] || ''}
              onValueChange={(value) => {
                const option = options.find(opt => opt.value === value);
                updateNodeConfig(nodeId, {
                  ...node?.config,
                  [`${type}Type`]: value,
                  [`${type}Label`]: option?.label
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${type}...`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      {option.aiSupported && <Bot className="h-4 w-4 text-purple-600" />}
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* OS Element Selection */}
            {selectedOption?.osElements && selectedOption.osElements.length > 0 && (
              <div>
                <label className="text-sm font-medium">Select OS Element:</label>
                <Select
                  value={node?.config.osElement || ''}
                  onValueChange={(value) => {
                    updateNodeConfig(nodeId, {
                      ...node?.config,
                      osElement: value
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose element..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedOption.osElements.map((element: string) => (
                      <SelectItem key={element} value={element}>
                        {element}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Variable insertion for conditions and actions */}
            {(type === 'condition' || type === 'action') && (
              <div>
                <label className="text-sm font-medium">Available Variables:</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getAvailableVariables().map((variable) => (
                    <Badge 
                      key={variable.name}
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => {
                        const currentValue = node?.config.customText || '';
                        updateNodeConfig(nodeId, {
                          ...node?.config,
                          customText: currentValue + `{{${variable.name}}}`
                        });
                      }}
                    >
                      {variable.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Custom text input with variable support */}
            <div>
              <label className="text-sm font-medium">Custom Configuration:</label>
              <Textarea
                placeholder="Enter custom text or conditions... Use {{variable.name}} for dynamic values"
                value={node?.config.customText || ''}
                onChange={(e) => updateNodeConfig(nodeId, {
                  ...node?.config,
                  customText: e.target.value
                })}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={onClose} className="flex-1">
                Save Configuration
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Render workflow node
  const renderNode = (node: WorkflowNode) => {
    const nodeType = nodeTypes.find(n => n.type === node.type);
    const isConnecting = connectingFrom === node.id;
    const hasErrors = !node.isConfigured;
    
    return (
      <div
        key={node.id}
        className={`absolute min-w-56 p-4 border-2 rounded-lg cursor-move transition-all shadow-sm ${nodeType?.color} ${
          selectedNode === node.id ? 'ring-2 ring-blue-500 scale-105' : ''
        } ${hasErrors ? 'border-dashed border-red-400 bg-red-50' : ''} ${
          isConnecting ? 'ring-2 ring-green-400' : ''
        }`}
        style={{ 
          left: (node.position.x * zoom) + canvasOffset.x, 
          top: (node.position.y * zoom) + canvasOffset.y,
          transform: `scale(${zoom})`
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNode(node.id);
        }}
        onContextMenu={(e) => handleRightClick(e, node.id)}
        onMouseDown={(e) => {
          if (e.button === 0) { // Left click
            setDraggedNode(node.id);
          }
        }}
      >
        {/* Node Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {nodeType?.icon}
            <span className="font-semibold text-sm">{node.title}</span>
            {node.isConfigured ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOSSelector({ nodeId: node.id, type: node.type });
              }}
              className="p-1 hover:bg-white/70 rounded transition-colors"
              title="Configure"
            >
              <Settings className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (connectingFrom) {
                  connectNodes(connectingFrom, node.id);
                } else {
                  setConnectingFrom(node.id);
                }
              }}
              className={`p-1 hover:bg-white/70 rounded transition-colors ${
                connectingFrom === node.id ? 'bg-green-200' : ''
              }`}
              title={connectingFrom ? 'Connect here' : 'Start connection'}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        {/* Node Content */}
        <div className="space-y-2">
          <p className="text-xs text-gray-700">{node.description}</p>
          
          {/* Configuration Display */}
          {node.config[`${node.type}Label`] && (
            <Badge variant="secondary" className="text-xs">
              {node.config[`${node.type}Label`]}
            </Badge>
          )}
          
          {node.config.osElement && (
            <Badge variant="outline" className="text-xs">
              🎯 {node.config.osElement}
            </Badge>
          )}

          {/* AI indicator */}
          {(node.type === 'ai_action' || (node.config.actionType && getOSSpecificOptions('action').find((opt: any) => opt.value === node.config.actionType)?.aiSupported)) && (
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <Bot className="h-3 w-3" />
              AI-Powered
            </div>
          )}
        </div>

        {/* Connection Points */}
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white border-2 border-blue-300 rounded-full transform -translate-y-1/2 cursor-pointer hover:border-blue-500 flex items-center justify-center">
          <ArrowRight className="h-3 w-3 text-blue-500" />
        </div>
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2 cursor-pointer hover:border-gray-500 flex items-center justify-center">
          <ArrowRight className="h-3 w-3 text-gray-500 rotate-180" />
        </div>

        {/* Conditional branch points for condition nodes */}
        {node.type === 'condition' && (
          <>
            <div className="absolute -right-3 top-1/4 w-5 h-5 bg-green-100 border-2 border-green-400 rounded-full transform -translate-y-1/2 cursor-pointer hover:border-green-600 flex items-center justify-center text-xs">
              ✓
            </div>
            <div className="absolute -right-3 top-3/4 w-5 h-5 bg-red-100 border-2 border-red-400 rounded-full transform -translate-y-1/2 cursor-pointer hover:border-red-600 flex items-center justify-center text-xs">
              ✕
            </div>
          </>
        )}
      </div>
    );
  };

  // Context Menu Component
  const ContextMenu = ({ x, y, nodeId, onClose }: { x: number; y: number; nodeId: string; onClose: () => void }) => (
    <div 
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => {
          setShowOSSelector({ nodeId, type: nodes.find(n => n.id === nodeId)?.type || 'trigger' });
          onClose();
        }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Configure
      </button>
      <button
        onClick={() => duplicateNode(nodeId)}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </button>
      <button
        onClick={() => deleteNode(nodeId)}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );

  // Test Results Component
  const TestResults = () => {
    if (testResults.length === 0) return null;

    return (
      <div className="absolute top-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test Results {isTestMode && <span className="text-blue-600">Running...</span>}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setTestResults([])}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className={`p-3 rounded border-l-4 ${
              result.status === 'success' 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="font-medium text-sm">{result.nodeTitle}</div>
              <div className="text-xs text-gray-600 mt-1">{result.message}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(result.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>AI Workflow Builder</span>
              {profile?.role && (
                <Badge variant="outline">{profile.role.replace('_', ' ')}</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={testWorkflow}
                disabled={isTestMode || nodes.length === 0 || validateWorkflow().length > 0}
                title="Test Workflow"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTestMode ? 'Testing...' : 'Test Workflow'}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveWorkflow}
                disabled={validateWorkflow().length > 0}
                title="Save & Deploy Workflow"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Workflow
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="mb-4">
              <Input
                placeholder="Workflow name..."
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="mb-3"
              />
              
              {connectingFrom && (
                <div className="mb-3 p-3 bg-blue-100 border border-blue-300 rounded text-sm">
                  <div className="font-medium">Connection Mode Active</div>
                  <div className="text-xs text-blue-700 mt-1">
                    Click another node to connect, or click + again to cancel
                  </div>
                </div>
              )}
            </div>
            
            {/* Node Types */}
            <h3 className="font-medium mb-3">Add Workflow Steps</h3>
            <div className="space-y-3 mb-6">
              {nodeTypes.map((nodeType) => (
                <button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type as WorkflowNode['type'])}
                  className={`w-full p-3 text-left rounded-lg border-2 hover:shadow-sm transition-all ${nodeType.color} hover:scale-105`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {nodeType.icon}
                    <span className="font-medium text-sm">{nodeType.title}</span>
                  </div>
                  <p className="text-xs opacity-75">{nodeType.description}</p>
                </button>
              ))}
            </div>

            {/* AI Suggested Workflows */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Suggested Workflows
              </h4>
              <div className="space-y-2">
                {getAISuggestedWorkflows().map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // Add suggested workflow nodes
                      let yOffset = 100;
                      suggestion.nodes.forEach((nodeConfig, i) => {
                        const newNode: WorkflowNode = {
                          id: `node-${Date.now()}-${i}`,
                          type: nodeConfig.type as WorkflowNode['type'],
                          title: nodeTypes.find(n => n.type === nodeConfig.type)?.title || 'Node',
                          description: nodeTypes.find(n => n.type === nodeConfig.type)?.description || '',
                          position: { x: 200 + (i * 250), y: yOffset },
                          config: nodeConfig.config,
                          connections: [],
                          isConfigured: true
                        };
                        setNodes(prev => [...prev, newNode]);
                      });
                      setWorkflowName(suggestion.name);
                      toast.success(`Added "${suggestion.name}" template`);
                    }}
                    className="w-full p-3 text-left bg-purple-50 border border-purple-200 rounded text-sm hover:bg-purple-100 transition-colors"
                  >
                    <div className="font-medium text-purple-900">{suggestion.name}</div>
                    <div className="text-xs text-purple-700 mt-1">{suggestion.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Validation Status */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2 text-sm">Workflow Status</h4>
              <div className="space-y-2">
                {validateWorkflow().map((error, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
                {validateWorkflow().length === 0 && nodes.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Workflow is ready to test & save
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <div 
              ref={canvasRef}
              className="w-full h-full bg-gray-50 relative cursor-grab active:cursor-grabbing"
              style={{ 
                backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`, 
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onClick={() => {
                setSelectedNode(null);
                setShowContextMenu(null);
              }}
            >
              {/* Render Nodes */}
              {nodes.map(renderNode)}
              
              {/* Render Connections */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {connections.map(connection => {
                  const fromNode = nodes.find(n => n.id === connection.fromNode);
                  const toNode = nodes.find(n => n.id === connection.toNode);
                  if (!fromNode || !toNode) return null;
                  
                  const startX = (fromNode.position.x * zoom) + canvasOffset.x + (224 * zoom); // Node width consideration
                  const startY = (fromNode.position.y * zoom) + canvasOffset.y + (60 * zoom); // Node height consideration
                  const endX = (toNode.position.x * zoom) + canvasOffset.x;
                  const endY = (toNode.position.y * zoom) + canvasOffset.y + (60 * zoom);
                  
                  const strokeColor = connection.branchType === 'yes' ? '#22c55e' 
                                    : connection.branchType === 'no' ? '#ef4444' 
                                    : '#6366f1';
                  
                  return (
                    <g key={connection.id}>
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={strokeColor}
                        strokeWidth="3"
                        strokeDasharray={connection.branchType !== 'default' ? '5,5' : undefined}
                        markerEnd="url(#arrowhead)"
                      />
                      {connection.branchType !== 'default' && (
                        <text
                          x={(startX + endX) / 2}
                          y={(startY + endY) / 2 - 10}
                          fill={strokeColor}
                          fontSize="12"
                          textAnchor="middle"
                          className="font-medium"
                        >
                          {connection.branchType === 'yes' ? 'YES' : 'NO'}
                        </text>
                      )}
                    </g>
                  );
                })}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6366f1"
                    />
                  </marker>
                </defs>
              </svg>
              
              {/* Empty State */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-sm border-2 border-dashed border-gray-300">
                    <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Start Building Your AI Workflow</p>
                    <p className="text-sm mb-4">Add steps from the sidebar or try an AI-suggested template</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <MousePointer className="h-4 w-4" />
                      Drag & Drop • Right-click for options • Scroll to zoom
                    </div>
                  </div>
                </div>
              )}

              {/* Test Results */}
              <TestResults />

              {/* Context Menu */}
              {showContextMenu && (
                <ContextMenu
                  x={showContextMenu.x}
                  y={showContextMenu.y}
                  nodeId={showContextMenu.nodeId}
                  onClose={() => setShowContextMenu(null)}
                />
              )}
            </div>
          </div>
        </div>

        {/* OS Element Selector Modal */}
        {showOSSelector && (
          <OSElementSelector
            nodeId={showOSSelector.nodeId}
            type={showOSSelector.type}
            onClose={() => setShowOSSelector(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NativeWorkflowBuilder;
