
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Zap, Play, Pause, Settings, Plus, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

const AutomationTab: React.FC = () => {
  const [automations, setAutomations] = useState([
    {
      id: 'lead-nurture',
      name: 'Lead Nurturing Sequence',
      description: 'Automatically follow up with new leads',
      status: 'active',
      enabled: true,
      triggers: 156,
      successRate: 68,
      lastRun: '2 hours ago'
    },
    {
      id: 'proposal-followup',
      name: 'Proposal Follow-up',
      description: 'Chase proposal responses after 3 days',
      status: 'active',
      enabled: true,
      triggers: 23,
      successRate: 84,
      lastRun: '30 minutes ago'
    },
    {
      id: 'meeting-reminder',
      name: 'Meeting Reminders',
      description: 'Send reminders 24h before meetings',
      status: 'paused',
      enabled: false,
      triggers: 89,
      successRate: 92,
      lastRun: '1 day ago'
    }
  ]);

  const handleToggleAutomation = (id: string) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === id 
          ? { 
              ...automation, 
              enabled: !automation.enabled,
              status: !automation.enabled ? 'active' : 'paused'
            }
          : automation
      )
    );
    toast.success('Automation updated');
  };

  const workflows = [
    {
      name: 'Cold Email Sequence',
      description: 'Multi-touch email campaign for cold leads',
      category: 'Email Marketing'
    },
    {
      name: 'Deal Stage Progression',
      description: 'Automatic actions when deals move stages',
      category: 'Sales Process'
    },
    {
      name: 'Lead Scoring Update',
      description: 'Update lead scores based on activities',
      category: 'Lead Management'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sales Automation</h3>
          <p className="text-sm text-gray-600">Automate repetitive tasks and workflows</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Active Automations */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Active Automations</h4>
        {automations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className={`h-4 w-4 ${automation.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div>
                    <CardTitle className="text-lg">{automation.name}</CardTitle>
                    <p className="text-sm text-gray-600">{automation.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    className={automation.status === 'active' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                    }
                  >
                    {automation.status === 'active' ? 'Active' : 'Paused'}
                  </Badge>
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={() => handleToggleAutomation(automation.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{automation.triggers}</div>
                    <div className="text-gray-600">Triggers</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div>
                    <div className="font-medium">{automation.successRate}%</div>
                    <div className="text-gray-600">Success Rate</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="font-medium">{automation.lastRun}</div>
                    <div className="text-gray-600">Last Run</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Templates */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Workflow Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                  </div>
                  <Plus className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-xs">
                  {workflow.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automation Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">268</div>
              <div className="text-sm text-gray-600">Total Triggers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">74%</div>
              <div className="text-sm text-gray-600">Avg Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Active Workflows</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">12h</div>
              <div className="text-sm text-gray-600">Time Saved/Week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationTab;
