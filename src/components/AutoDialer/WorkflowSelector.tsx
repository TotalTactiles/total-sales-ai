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
      name: 'Real Estate - Connected Call Follow-up',
      industry: 'Real Estate',
      aiOptimized: true,
      successRate: 73,
      isActive: true,
      steps: [
        { id: '1', type: 'email', action: 'email', timing: 'immediately', template: 'Thank you + property info', aiGenerated: true },
        { id: '2', type: 'sms', action: 'sms', timing: '2 hours', template: 'Quick check-in message', aiGenerated: true },
        { id: '3', type: 'call', action: 'call', timing: '1 day', template: 'Follow-up call script', aiGenerated: false },
        { id: '4', type: 'meeting', action: 'meeting', timing: '3 days', template: 'Property viewing invitation', aiGenerated: true }
      ]
    },
    {
      id: '2',
      name: 'Tech/SaaS - Demo Request Flow',
      industry: 'Technology',
      aiOptimized: true,
      successRate: 81,
      isActive: true,
      steps: [
        { id: '1', type: 'email', action: 'email', timing: 'immediately', template: 'Demo confirmation + calendar link', aiGenerated: true },
        { id: '2', type: 'email', action: 'email', timing: '1 day', template: 'Demo preparation guide', aiGenerated: true },
        { id: '3', type: 'sms', action: 'sms', timing: '1 hour', template: 'Demo reminder', aiGenerated: true },
        { id: '4', type: 'call', action: 'call', timing: '2 hours', template: 'Post-demo follow-up', aiGenerated: false }
      ]
    },
    {
      id: '3',
      name: 'Finance - Voicemail Recovery',
      industry: 'Finance',
      aiOptimized: true,
      successRate: 45,
      isActive: true,
      steps: [
        { id: '1', type: 'email', action: 'email', timing: 'immediately', template: 'Voice message follow-up', aiGenerated: true },
        { id: '2', type: 'wait', action: 'wait', timing: '2 days', template: '', aiGenerated: false },
        { id: '3', type: 'call', action: 'call', timing: '2 days', template: 'Second attempt call', aiGenerated: false },
        { id: '4', type: 'sms', action: 'sms', timing: '1 week', template: 'Alternative contact method', aiGenerated: true }
      ]
    }
  ];

  const getStepIcon = (action: string) => {
    switch (action) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
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
    w.name.toLowerCase().includes(callOutcome.toLowerCase())
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
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
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
                    Industry: {workflow.industry} • {workflow.steps.length} Steps
                  </div>
                  
                  <div className="grid gap-3">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {getStepIcon(step.action)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium capitalize">
                            {step.action} - {step.timing}
                          </div>
                          <div className="text-sm text-gray-600">{step.template}</div>
                        </div>
                        {step.aiGenerated && (
                          <Badge variant="outline" className="text-xs">
                            AI Generated
                          </Badge>
                        )}
                      </div>
                    ))}
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
