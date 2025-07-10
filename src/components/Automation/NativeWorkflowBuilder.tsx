
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Save
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  title: string;
  description: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  connections: string[];
}

interface NativeWorkflowBuilderProps {
  onClose: () => void;
  onSave: (workflow: any) => void;
}

const NativeWorkflowBuilder: React.FC<NativeWorkflowBuilderProps> = ({ onClose, onSave }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [showNodeConfig, setShowNodeConfig] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const nodeTypes = [
    {
      type: 'trigger',
      title: 'Trigger',
      icon: <Zap className="h-4 w-4" />,
      description: 'Start workflow when...',
      color: 'bg-green-100 border-green-300'
    },
    {
      type: 'condition',
      title: 'Condition',
      icon: <Database className="h-4 w-4" />,
      description: 'If condition is met...',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      type: 'action',
      title: 'Action',
      icon: <Mail className="h-4 w-4" />,
      description: 'Perform action...',
      color: 'bg-blue-100 border-blue-300'
    },
    {
      type: 'delay',
      title: 'Delay',
      icon: <Clock className="h-4 w-4" />,
      description: 'Wait for...',
      color: 'bg-purple-100 border-purple-300'
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
      connections: []
    };

    setNodes(prev => [...prev, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
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
    setNodes(prev => prev.map(node => 
      node.id === fromId 
        ? { ...node, connections: [...node.connections, toId] }
        : node
    ));
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
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
        position: node.position
      })),
      connections: nodes.flatMap(node => 
        node.connections.map(targetId => ({
          id: `connection-${node.id}-${targetId}`,
          source: node.id,
          target: targetId
        }))
      ),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSave(workflow);
  };

  const renderNode = (node: WorkflowNode) => {
    const nodeType = nodeTypes.find(n => n.type === node.type);
    
    return (
      <div
        key={node.id}
        className={`absolute w-48 p-3 border-2 rounded-lg cursor-move ${nodeType?.color} ${
          selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={() => setSelectedNode(node.id)}
        onMouseDown={() => setDraggedNode(node.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {nodeType?.icon}
            <span className="font-medium text-sm">{node.title}</span>
          </div>
          <div className="flex gap-1">
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
        <p className="text-xs text-gray-600">{node.description}</p>
        
        {/* Connection points */}
        <div className="absolute -right-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute -left-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2"></div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Workflow Builder</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveWorkflow}>
                <Save className="h-4 w-4 mr-2" />
                Save Workflow
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <div className="mb-4">
              <Input
                placeholder="Workflow name..."
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="mb-3"
              />
            </div>
            
            <h3 className="font-medium mb-3">Add Steps</h3>
            <div className="space-y-2">
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
                  <p className="text-xs text-gray-600">{nodeType.description}</p>
                </button>
              ))}
            </div>
            
            {selectedNode && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-2">Node Settings</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNodeConfig(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            )}
          </div>
          
          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="flex-1 relative bg-white overflow-auto"
            style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {nodes.map(renderNode)}
            
            {/* Render connections */}
            <svg className="absolute inset-0 pointer-events-none">
              {nodes.flatMap(node => 
                node.connections.map(targetId => {
                  const targetNode = nodes.find(n => n.id === targetId);
                  if (!targetNode) return null;
                  
                  const startX = node.position.x + 192; // node width + connection point
                  const startY = node.position.y + 50; // node height / 2
                  const endX = targetNode.position.x;
                  const endY = targetNode.position.y + 50;
                  
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#6366f1"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })
              )}
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
                  <p>Start building your workflow</p>
                  <p className="text-sm">Add steps from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NativeWorkflowBuilder;
