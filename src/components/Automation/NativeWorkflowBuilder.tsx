
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
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  title: string;
  description: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  connections: string[];
  isConfigured: boolean;
  isExpanded?: boolean;
}

interface NodeConnection {
  id: string;
  fromNode: string;
  toNode: string;
  fromHandle: string;
  toHandle: string;
}

interface NativeWorkflowBuilderProps {
  onClose: () => void;
  onSave: (workflow: any) => void;
}

const NativeWorkflowBuilder: React.FC<NativeWorkflowBuilderProps> = ({ onClose, onSave }) => {
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
  const canvasRef = useRef<HTMLDivElement>(null);

  // Configuration options for each node type
  const triggerOptions = [
    { value: 'form_submitted', label: 'Form Submitted', description: 'When a lead form is submitted' },
    { value: 'button_clicked', label: 'Button Clicked', description: 'When a specific button is clicked' },
    { value: 'new_lead_added', label: 'New Lead Added', description: 'When a new lead is created' },
    { value: 'task_completed', label: 'Task Marked Complete', description: 'When a task is completed' },
    { value: 'tag_applied', label: 'Tag Applied', description: 'When a tag is applied to a lead' },
    { value: 'ai_assistant_triggered', label: 'AI Assistant Triggered', description: 'When AI assistant is activated' }
  ];

  const conditionOptions = [
    { value: 'has_tag', label: 'Contact Has Tag', description: 'Check if contact has specific tag' },
    { value: 'field_equals', label: 'Field Equals Value', description: 'Check if field matches value' },
    { value: 'lead_score_above', label: 'Lead Score Above', description: 'Check if lead score is above threshold' },
    { value: 'lead_score_below', label: 'Lead Score Below', description: 'Check if lead score is below threshold' },
    { value: 'email_opened', label: 'Email Opened', description: 'Check if email was opened' },
    { value: 'email_not_clicked', label: 'Email Not Clicked', description: 'Check if email link was not clicked' }
  ];

  const actionOptions = [
    { value: 'send_email', label: 'Send Email', description: 'Send an email to the contact' },
    { value: 'assign_user', label: 'Assign User', description: 'Assign contact to a user' },
    { value: 'change_stage', label: 'Change Stage', description: 'Update lead stage' },
    { value: 'trigger_notification', label: 'Trigger Notification', description: 'Send notification to user' },
    { value: 'apply_tag', label: 'Apply Tag', description: 'Add tag to contact' },
    { value: 'remove_tag', label: 'Remove Tag', description: 'Remove tag from contact' }
  ];

  const delayOptions = [
    { value: 'minutes', label: 'Minutes', description: 'Wait for X minutes' },
    { value: 'hours', label: 'Hours', description: 'Wait for X hours' },
    { value: 'days', label: 'Days', description: 'Wait for X days' },
    { value: 'specific_time', label: 'Specific Time', description: 'Wait until specific time' }
  ];

  const nodeTypes = [
    {
      type: 'trigger',
      title: 'Trigger',
      icon: <Zap className="h-4 w-4" />,
      description: 'Start workflow when...',
      color: 'bg-green-100 border-green-300 text-green-800',
      options: triggerOptions
    },
    {
      type: 'condition',
      title: 'Condition',
      icon: <Database className="h-4 w-4" />,
      description: 'If condition is met...',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      options: conditionOptions
    },
    {
      type: 'action',
      title: 'Action',
      icon: <Mail className="h-4 w-4" />,
      description: 'Perform action...',
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      options: actionOptions
    },
    {
      type: 'delay',
      title: 'Delay',
      icon: <Clock className="h-4 w-4" />,
      description: 'Wait for...',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      options: delayOptions
    }
  ];

  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      title: nodeTypes.find(n => n.type === type)?.title || 'Node',
      description: nodeTypes.find(n => n.type === type)?.description || '',
      position: { x: 100 + nodes.length * 200, y: 100 },
      config: {},
      connections: [],
      isConfigured: false,
      isExpanded: false
    };

    setNodes(prev => [...prev, newNode]);
  };

  const updateNodeConfig = (nodeId: string, config: Record<string, any>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, config, isConfigured: Object.keys(config).length > 0 }
        : node
    ));
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, isExpanded: !node.isExpanded }
        : node
    ));
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.fromNode !== nodeId && conn.toNode !== nodeId
    ));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
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
  };

  const connectNodes = (fromId: string, toId: string) => {
    if (fromId === toId) return; // Prevent self-connection
    
    const connectionExists = connections.some(conn => 
      conn.fromNode === fromId && conn.toNode === toId
    );
    
    if (!connectionExists) {
      const newConnection: NodeConnection = {
        id: `connection-${fromId}-${toId}`,
        fromNode: fromId,
        toNode: toId,
        fromHandle: 'output',
        toHandle: 'input'
      };
      setConnections(prev => [...prev, newConnection]);
    }
    
    setConnectingFrom(null);
  };

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
    
    // Check for disconnected nodes (except trigger nodes)
    const connectedNodes = new Set();
    connections.forEach(conn => {
      connectedNodes.add(conn.fromNode);
      connectedNodes.add(conn.toNode);
    });
    
    const disconnectedNodes = nodes.filter(n => 
      n.type !== 'trigger' && !connectedNodes.has(n.id)
    );
    
    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} node(s) are not connected`);
    }
    
    return errors;
  };

  const testWorkflow = async () => {
    setIsTestMode(true);
    const mockData = {
      leadId: 'test-lead-123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      score: 75,
      tags: ['interested', 'demo-requested']
    };

    const results: any[] = [];
    
    // Simulate workflow execution
    for (const node of nodes) {
      const result = {
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: node.title,
        status: 'success',
        message: '',
        data: mockData
      };

      // Simulate different outcomes based on node type and config
      switch (node.type) {
        case 'trigger':
          result.message = `Trigger activated: ${node.config.triggerType || 'form_submitted'}`;
          break;
        case 'condition':
          const conditionMet = Math.random() > 0.3; // 70% success rate
          result.status = conditionMet ? 'success' : 'failed';
          result.message = conditionMet 
            ? `Condition met: ${node.config.conditionType || 'has_tag'}`
            : `Condition not met: ${node.config.conditionType || 'has_tag'}`;
          break;
        case 'action':
          result.message = `Action executed: ${node.config.actionType || 'send_email'}`;
          break;
        case 'delay':
          result.message = `Delay applied: ${node.config.delayAmount || '30'} ${node.config.delayUnit || 'minutes'}`;
          break;
      }
      
      results.push(result);
      
      // Stop execution if condition fails
      if (result.status === 'failed') break;
    }

    setTestResults(results);
    
    setTimeout(() => {
      setIsTestMode(false);
      toast.success('Workflow test completed');
    }, 2000);
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

  const renderNodeConfig = (node: WorkflowNode) => {
    const nodeType = nodeTypes.find(n => n.type === node.type);
    if (!nodeType) return null;

    return (
      <div className="mt-2 space-y-2">
        <Select
          value={node.config[`${node.type}Type`] || ''}
          onValueChange={(value) => {
            const option = nodeType.options.find(opt => opt.value === value);
            updateNodeConfig(node.id, {
              ...node.config,
              [`${node.type}Type`]: value,
              [`${node.type}Label`]: option?.label
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${node.type}...`} />
          </SelectTrigger>
          <SelectContent>
            {nodeType.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Additional config fields based on node type */}
        {node.type === 'condition' && node.config.conditionType && (
          <Input
            placeholder="Enter value to compare..."
            value={node.config.conditionValue || ''}
            onChange={(e) => updateNodeConfig(node.id, {
              ...node.config,
              conditionValue: e.target.value
            })}
          />
        )}

        {node.type === 'action' && node.config.actionType === 'send_email' && (
          <Textarea
            placeholder="Email content..."
            value={node.config.emailContent || ''}
            onChange={(e) => updateNodeConfig(node.id, {
              ...node.config,
              emailContent: e.target.value
            })}
          />
        )}

        {node.type === 'delay' && node.config.delayUnit && (
          <Input
            type="number"
            placeholder="Amount"
            value={node.config.delayAmount || ''}
            onChange={(e) => updateNodeConfig(node.id, {
              ...node.config,
              delayAmount: e.target.value
            })}
          />
        )}
      </div>
    );
  };

  const renderNode = (node: WorkflowNode) => {
    const nodeType = nodeTypes.find(n => n.type === node.type);
    const isConnecting = connectingFrom === node.id;
    
    return (
      <div
        key={node.id}
        className={`absolute min-w-48 p-3 border-2 rounded-lg cursor-move transition-all ${nodeType?.color} ${
          selectedNode === node.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
        } ${!node.isConfigured ? 'border-dashed border-red-400' : ''} ${
          isConnecting ? 'ring-2 ring-green-400' : ''
        }`}
        style={{ 
          left: node.position.x * zoom, 
          top: node.position.y * zoom,
          transform: `scale(${zoom})`
        }}
        onClick={() => setSelectedNode(node.id)}
        onMouseDown={() => setDraggedNode(node.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {nodeType?.icon}
            <span className="font-medium text-sm">{node.title}</span>
            {node.isConfigured && <CheckCircle className="h-3 w-3 text-green-600" />}
            {!node.isConfigured && <AlertCircle className="h-3 w-3 text-red-600" />}
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
              className="p-1 hover:bg-white/50 rounded"
            >
              {node.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
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
              className={`p-1 hover:bg-white/50 rounded ${connectingFrom === node.id ? 'bg-green-200' : ''}`}
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(node.id);
              }}
              className="p-1 hover:bg-white/50 rounded"
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="p-1 hover:bg-white/50 rounded text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-2">{node.description}</p>
        
        {node.config[`${node.type}Label`] && (
          <Badge variant="secondary" className="text-xs mb-2">
            {node.config[`${node.type}Label`]}
          </Badge>
        )}

        {node.isExpanded && renderNodeConfig(node)}
        
        {/* Connection points */}
        <div className="absolute -right-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2 cursor-pointer hover:border-blue-500"></div>
        <div className="absolute -left-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2 cursor-pointer hover:border-blue-500"></div>
      </div>
    );
  };

  const renderTestResults = () => {
    if (testResults.length === 0) return null;

    return (
      <div className="absolute top-4 right-4 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Test Results
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index} className={`p-2 rounded text-sm ${
              result.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="font-medium">{result.nodeTitle}</div>
              <div className="text-xs text-gray-600">{result.message}</div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={() => setTestResults([])}
        >
          Close
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Workflow Builder</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={testWorkflow}
                disabled={isTestMode || nodes.length === 0}
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
              >
                <Save className="h-4 w-4 mr-2" />
                Save Workflow
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="mb-4">
              <Input
                placeholder="Workflow name..."
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="mb-3"
              />
              {connectingFrom && (
                <div className="mb-3 p-2 bg-green-100 border border-green-300 rounded text-sm">
                  Click another node to connect, or click the + button again to cancel
                </div>
              )}
            </div>
            
            <h3 className="font-medium mb-3">Add Steps</h3>
            <div className="space-y-2 mb-6">
              {nodeTypes.map((nodeType) => (
                <button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type as WorkflowNode['type'])}
                  className={`w-full p-3 text-left rounded-lg border-2 hover:shadow-sm transition-all ${nodeType.color}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {nodeType.icon}
                    <span className="font-medium text-sm">{nodeType.title}</span>
                  </div>
                  <p className="text-xs opacity-75">{nodeType.description}</p>
                </button>
              ))}
            </div>

            {/* Smart Suggestions */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 text-sm">💡 Smart Suggestions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Add common lead nurturing sequence
                    addNode('trigger');
                    setTimeout(() => addNode('delay'), 100);
                    setTimeout(() => addNode('action'), 200);
                  }}
                  className="w-full p-2 text-left bg-blue-50 border border-blue-200 rounded text-sm hover:bg-blue-100"
                >
                  🚀 Quick Lead Nurturing
                </button>
                <button
                  onClick={() => {
                    // Add condition-based flow
                    addNode('trigger');
                    setTimeout(() => addNode('condition'), 100);
                    setTimeout(() => addNode('action'), 200);
                  }}
                  className="w-full p-2 text-left bg-yellow-50 border border-yellow-200 rounded text-sm hover:bg-yellow-100"
                >
                  🎯 Conditional Logic
                </button>
              </div>
            </div>
            
            {/* Validation Status */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2 text-sm">Validation Status</h4>
              <div className="space-y-1">
                {validateWorkflow().map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                  </div>
                ))}
                {validateWorkflow().length === 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Workflow is valid
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Canvas */}
          <div className="flex-1 relative">
            <div 
              ref={canvasRef}
              className="w-full h-full bg-white overflow-auto relative"
              style={{ 
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', 
                backgroundSize: `${20 * zoom}px ${20 * zoom}px` 
              }}
            >
              {nodes.map(renderNode)}
              
              {/* Render connections */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {connections.map(connection => {
                  const fromNode = nodes.find(n => n.id === connection.fromNode);
                  const toNode = nodes.find(n => n.id === connection.toNode);
                  if (!fromNode || !toNode) return null;
                  
                  const startX = (fromNode.position.x + 192) * zoom;
                  const startY = (fromNode.position.y + 50) * zoom;
                  const endX = toNode.position.x * zoom;
                  const endY = (toNode.position.y + 50) * zoom;
                  
                  return (
                    <line
                      key={connection.id}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#6366f1"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
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
              
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Start building your workflow</p>
                    <p className="text-sm">Add steps from the sidebar to get started</p>
                  </div>
                </div>
              )}

              {renderTestResults()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NativeWorkflowBuilder;
