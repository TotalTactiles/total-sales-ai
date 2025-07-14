
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Eye, 
  Download, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface AutomationTemplatesProps {
  hasNewTemplates: boolean;
}

const AutomationTemplates: React.FC<AutomationTemplatesProps> = ({ hasNewTemplates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    {
      id: '1',
      name: 'Welcome Email Sequence',
      type: 'email',
      status: hasNewTemplates ? 'new' : 'available',
      description: 'Multi-step welcome sequence for new leads',
      efficiency: 85,
      source: 'Manager OS',
      preview: 'Subject: Welcome to [Company Name]!\n\nHi [First Name],\n\nWelcome to our community! We\'re excited to have you on board...',
      deployCount: 12,
      successRate: 85
    },
    {
      id: '2',
      name: 'Follow-up Call Script',
      type: 'calling',
      status: 'updated',
      description: 'Optimized script for second follow-up calls',
      efficiency: 92,
      source: 'AI Generated',
      preview: 'Opening: Hi [Name], this is [Your Name] from [Company]. I wanted to follow up on our conversation about...',
      deployCount: 8,
      successRate: 92
    },
    {
      id: '3',
      name: 'Demo Booking SMS',
      type: 'sms',
      status: 'available',
      description: 'Short SMS sequence for demo scheduling',
      efficiency: 67,
      source: 'Template Library',
      preview: 'Hi [Name]! Ready to see how [Product] can save you 5+ hours per week? Book your demo: [Link]',
      deployCount: 15,
      successRate: 67
    }
  ];

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleDeploy = (template: any) => {
    toast.success(`"${template.name}" recommended to manager for deployment`);
  };

  const handleFeedback = (template: any, feedback: 'positive' | 'negative') => {
    toast.success(`Feedback submitted for "${template.name}"`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'calling': return <Phone className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800">New</Badge>;
      case 'updated':
        return <Badge className="bg-blue-100 text-blue-800">Updated</Badge>;
      case 'available':
        return <Badge className="bg-gray-100 text-gray-800">Available</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automation Templates</h3>
          <p className="text-sm text-gray-600">Ready-to-use templates synced from Manager OS</p>
        </div>
        {hasNewTemplates && (
          <Badge className="bg-green-100 text-green-800">
            <Sparkles className="h-3 w-3 mr-1" />
            New Templates Available
          </Badge>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <h4 className="font-medium">{template.name}</h4>
                </div>
                {getStatusBadge(template.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{template.description}</p>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Success Rate</p>
                  <p className="font-medium">{template.successRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Deployments</p>
                  <p className="font-medium">{template.deployCount}</p>
                </div>
              </div>

              {/* Source */}
              <div className="text-xs text-gray-500">
                Source: {template.source}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDeploy(template)}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Deploy
                </Button>
              </div>

              {/* Feedback */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-gray-500">Rate this template:</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback(template, 'positive')}
                    className="h-6 w-6 p-0"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback(template, 'negative')}
                    className="h-6 w-6 p-0"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && getTypeIcon(selectedTemplate.type)}
              {selectedTemplate?.name} Preview
            </DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Template Content:</h4>
                <pre className="text-sm whitespace-pre-wrap text-gray-700">
                  {selectedTemplate.preview}
                </pre>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Success Rate</p>
                  <p className="text-gray-600">{selectedTemplate.successRate}%</p>
                </div>
                <div>
                  <p className="font-medium">Total Deployments</p>
                  <p className="text-gray-600">{selectedTemplate.deployCount}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowPreview(false)} variant="outline">
                  Close
                </Button>
                <Button onClick={() => {
                  handleDeploy(selectedTemplate);
                  setShowPreview(false);
                }}>
                  <Send className="h-4 w-4 mr-1" />
                  Deploy Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationTemplates;
