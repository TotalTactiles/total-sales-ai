
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Send,
  Eye,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface AutomationCard {
  id: string;
  title: string;
  description: string;
  category: 'email' | 'calling' | 'lead_scoring' | 'task_management';
  efficiency: number;
  status: 'available' | 'pending_manager' | 'active';
  aiReason: string;
  managerReview?: {
    requestedBy: string;
    requestedAt: string;
    reason: string;
  };
}

const AutomationDashboard: React.FC = () => {
  const { trackEvent } = useUsageTracking();
  
  const [automations, setAutomations] = useState<AutomationCard[]>([
    {
      id: '1',
      title: 'Email Follow-up Sequence',
      description: 'Automatically send personalized follow-up emails based on lead behavior',
      category: 'email',
      efficiency: 85,
      status: 'available',
      aiReason: 'You\'ve sent 37 similar follow-up emails in the past 6 days. This automation could save you 2.5 hours weekly.'
    },
    {
      id: '2',
      title: 'Lead Scoring Automation',
      description: 'Automatically score leads based on engagement and demographics',
      category: 'lead_scoring',
      efficiency: 92,
      status: 'active',
      aiReason: 'Currently processing 150+ leads weekly with 92% accuracy vs manual scoring.'
    },
    {
      id: '3',
      title: 'Call Reminder System',
      description: 'Smart reminders for follow-up calls based on lead priority',
      category: 'calling',
      efficiency: 78,
      status: 'pending_manager',
      aiReason: 'Detected pattern: 23% of high-priority leads not contacted within 24 hours.',
      managerReview: {
        requestedBy: 'Sarah Johnson',
        requestedAt: '2024-01-15T10:30:00Z',
        reason: 'Could significantly improve response times and lead conversion rates.'
      }
    }
  ]);

  const [templates] = useState([
    {
      id: '1',
      name: 'Welcome Email Sequence',
      type: 'email',
      status: 'new',
      description: 'Multi-step welcome sequence for new leads'
    },
    {
      id: '2',
      name: 'Follow-up Call Script',
      type: 'calling',
      status: 'updated',
      description: 'Optimized script for second follow-up calls'
    }
  ]);

  const [optimizations] = useState([
    {
      id: '1',
      title: 'Email Response Rate Optimization',
      description: 'Suggested improvements to increase email open rates by 15%',
      impact: 'High',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Call Timing Optimization',
      description: 'Best times to call leads based on historical data',
      impact: 'Medium',
      status: 'pending'
    }
  ]);

  const handleRecommendToManager = (automationId: string) => {
    const automation = automations.find(a => a.id === automationId);
    if (!automation) return;

    setAutomations(prev => prev.map(a => 
      a.id === automationId 
        ? { 
            ...a, 
            status: 'pending_manager',
            managerReview: {
              requestedBy: 'Current User',
              requestedAt: new Date().toISOString(),
              reason: automation.aiReason
            }
          }
        : a
    ));

    trackEvent({
      feature: 'automation_recommendation',
      action: 'recommend_to_manager',
      context: 'agent_missions',
      metadata: {
        automationId,
        automationTitle: automation.title,
        category: automation.category
      }
    });

    toast.success(`Automation recommended to manager for review`);
  };

  const handleTemplatePreview = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    trackEvent({
      feature: 'template_preview',
      action: 'open',
      context: 'agent_missions',
      metadata: { templateId, templateName: template.name }
    });

    toast.info(`Opening preview for ${template.name}`);
    // This would open a preview modal
  };

  const handleOptimizationAccept = (optimizationId: string) => {
    const optimization = optimizations.find(o => o.id === optimizationId);
    if (!optimization) return;

    trackEvent({
      feature: 'optimization_acceptance',
      action: 'accept',
      context: 'agent_missions',
      metadata: {
        optimizationId,
        optimizationTitle: optimization.title,
        impact: optimization.impact
      }
    });

    toast.success('Optimization accepted and applied');
  };

  const handleExportAnalytics = (format: 'pdf' | 'excel') => {
    trackEvent({
      feature: 'analytics_export',
      action: 'export',
      context: 'agent_missions',
      metadata: { format }
    });

    toast.success(`Exporting analytics as ${format.toUpperCase()}...`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'email': return '📧';
      case 'calling': return '📞';
      case 'lead_scoring': return '⭐';
      case 'task_management': return '✅';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_manager': return 'bg-yellow-100 text-yellow-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">AI Agent Automation</h2>
          <p className="text-sm text-gray-600">Streamline your workflow with intelligent automation</p>
        </div>
      </div>

      {/* Available Automations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Available Automations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {automations.map((automation) => (
            <div key={automation.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getCategoryIcon(automation.category)}</span>
                  <div>
                    <h3 className="font-medium">{automation.title}</h3>
                    <p className="text-sm text-gray-600">{automation.description}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(automation.status)}>
                  {automation.status === 'pending_manager' ? 'Pending Manager Review' : 
                   automation.status === 'active' ? 'Active' : 'Available'}
                </Badge>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">AI Insight</p>
                    <p className="text-xs text-blue-600">{automation.aiReason}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{automation.efficiency}% Efficiency</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {automation.status === 'available' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecommendToManager(automation.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Recommend to Manager
                    </Button>
                  )}
                  {automation.status === 'pending_manager' && automation.managerReview && (
                    <div className="text-xs text-gray-500">
                      Requested by {automation.managerReview.requestedBy}
                    </div>
                  )}
                  {automation.status === 'active' && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Running
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getCategoryIcon(template.type)}</span>
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                {template.status === 'new' && (
                  <Badge className="bg-green-100 text-green-800">New</Badge>
                )}
                {template.status === 'updated' && (
                  <Badge className="bg-blue-100 text-blue-800">Updated</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTemplatePreview(template.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {optimizations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-medium text-gray-600 mb-2">No current optimization recommendations</h3>
              <p className="text-sm text-gray-500">Your automation is running optimally!</p>
            </div>
          ) : (
            optimizations.map((optimization) => (
              <div key={optimization.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{optimization.title}</h4>
                    <p className="text-sm text-gray-600">{optimization.description}</p>
                  </div>
                  <Badge className={
                    optimization.impact === 'High' ? 'bg-red-100 text-red-800' :
                    optimization.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {optimization.impact} Impact
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOptimizationAccept(optimization.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Analytics Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Analytics Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Performance Data</p>
              <p className="text-sm text-gray-600">Download detailed analytics and performance reports</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportAnalytics('pdf')}
              >
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportAnalytics('excel')}
              >
                <Download className="h-4 w-4 mr-1" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;
