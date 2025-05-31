import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { CallWorkflow, WorkflowStep } from '@/types/lead';

interface WorkflowSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  leadIndustry: string;
  callOutcome: string;
  onWorkflowSelect: (workflow: CallWorkflow) => void;
}

const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({
  isOpen,
  onClose,
  leadIndustry,
  callOutcome,
  onWorkflowSelect
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  // Mock AI-optimized workflows
  const workflows: CallWorkflow[] = [
    {
      id: '1',
      name: 'Real Estate Follow-up',
      steps: [{
        id: '1',
        order: 1,
        type: 'email',
        action: 'Real Estate - Connected Call Follow-up',
        timing: 'immediately',
        template: 'Thank you + property info',
        aiGenerated: true
      }],
      isActive: true,
      createdAt: new Date().toISOString(),
      industry: 'Real Estate',
      aiOptimized: true,
      successRate: 73,
      action: 'Real Estate - Connected Call Follow-up',
      type: 'email',
      timing: 'immediately',
      template: 'Thank you + property info',
      aiGenerated: true,
      order: 1
    },
    {
      id: '2',
      name: 'Tech Demo Flow',
      steps: [{
        id: '2',
        order: 2,
        type: 'call',
        action: 'Tech/SaaS - Demo Request Flow',
        timing: '1 day',
        template: 'Demo confirmation + calendar link',
        aiGenerated: true
      }],
      isActive: true,
      createdAt: new Date().toISOString(),
      industry: 'Technology',
      aiOptimized: true,
      successRate: 81,
      action: 'Tech/SaaS - Demo Request Flow',
      type: 'call',
      timing: '1 day',
      template: 'Demo confirmation + calendar link',
      aiGenerated: true,
      order: 2
    },
    {
      id: '3',
      name: 'Finance Recovery',
      steps: [{
        id: '3',
        order: 3,
        type: 'email',
        action: 'Finance - Voicemail Recovery',
        timing: 'immediately',
        template: 'Voice message follow-up',
        aiGenerated: true
      }],
      isActive: true,
      createdAt: new Date().toISOString(),
      industry: 'Finance',
      aiOptimized: true,
      successRate: 45,
      action: 'Finance - Voicemail Recovery',
      type: 'email',
      timing: 'immediately',
      template: 'Voice message follow-up',
      aiGenerated: true,
      order: 3
    }
  ];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'wait': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredWorkflows = workflows.filter(w => 
    w.industry?.toLowerCase().includes(leadIndustry.toLowerCase()) ||
    w.action.toLowerCase().includes(callOutcome.toLowerCase())
  );

  const handleSelectWorkflow = (workflow: CallWorkflow) => {
    onWorkflowSelect(workflow);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI-Optimized Workflows for {callOutcome}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Based on your call outcome and lead industry, here are the most effective next-step workflows:
          </div>

          {filteredWorkflows.map((workflow) => (
            <Card 
              key={workflow.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedWorkflow === workflow.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{workflow.action}</CardTitle>
                  <div className="flex items-center gap-2">
                    {workflow.aiOptimized && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Zap className="h-3 w-3 mr-1" />
                        AI Optimized
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className={getSuccessRateColor(workflow.successRate || 0)}>
                        {workflow.successRate}% Success
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-4">
                    Industry: {workflow.industry} • {workflow.type} workflow
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border">
                      {workflow.order}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {getStepIcon(workflow.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {workflow.type} - {workflow.timing}
                      </div>
                      <div className="text-sm text-gray-600">{workflow.template}</div>
                    </div>
                    {workflow.aiGenerated && (
                      <Badge variant="outline" className="text-xs">
                        AI Generated
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium mb-2">No optimized workflows found</h3>
              <p className="text-sm">We'll create a custom workflow based on your preferences.</p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Skip Workflow
            </Button>
            <Button 
              onClick={() => {
                const selected = filteredWorkflows.find(w => w.id === selectedWorkflow);
                if (selected) handleSelectWorkflow(selected);
              }}
              disabled={!selectedWorkflow}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Start Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowSelector;
