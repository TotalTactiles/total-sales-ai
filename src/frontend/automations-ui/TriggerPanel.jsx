
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Play, Pause, Settings, Zap, Mail, MessageSquare, Phone, Calendar } from 'lucide-react';
import { TriggerHandlers } from '@/automations/native/triggerHandlers';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

const TriggerPanel = ({ leadId, leadData, onTriggerExecuted }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTriggers, setActiveTriggers] = useState([]);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [triggerConfig, setTriggerConfig] = useState({});
  const [manualMode, setManualMode] = useState(true);

  const triggerTypes = [
    { 
      id: 'lead_tag', 
      name: 'Lead Tag Trigger', 
      icon: Zap,
      description: 'Trigger automation when lead is tagged',
      fields: ['tag', 'followUpDelay']
    },
    { 
      id: 'email_sequence', 
      name: 'Email Sequence', 
      icon: Mail,
      description: 'Start automated email nurture sequence',
      fields: ['sequenceType', 'personalization']
    },
    { 
      id: 'sms_sequence', 
      name: 'SMS Sequence', 
      icon: MessageSquare,
      description: 'Start automated SMS follow-up sequence',
      fields: ['sequenceType', 'timing']
    },
    { 
      id: 'contract_flow', 
      name: 'Contract Flow', 
      icon: Calendar,
      description: 'Trigger contract and payment automation',
      fields: ['contractType', 'paymentTerms']
    },
    { 
      id: 'cold_lead_retarget', 
      name: 'Cold Lead Retargeting', 
      icon: Phone,
      description: 'Reactivate cold leads with multi-channel approach',
      fields: ['inactivityThreshold', 'channels']
    }
  ];

  useEffect(() => {
    loadActiveTriggers();
  }, [leadId]);

  const loadActiveTriggers = async () => {
    try {
      // Load active triggers for this lead
      const { data, error } = await supabase
        .from('active_triggers')
        .select('*')
        .eq('lead_id', leadId)
        .eq('status', 'active');

      if (error) throw error;
      setActiveTriggers(data || []);
    } catch (error) {
      logger.error('Failed to load active triggers', error, 'automation');
    }
  };

  const handleTriggerExecution = async () => {
    if (!selectedTrigger || !user?.id || !profile?.company_id) {
      toast.error('Please select a trigger and ensure you are logged in');
      return;
    }

    setLoading(true);
    
    try {
      let result;
      
      switch (selectedTrigger) {
        case 'lead_tag':
          result = await TriggerHandlers.handleLeadTagTrigger({
            leadId,
            tag: triggerConfig.tag,
            leadData,
            userId: user.id,
            companyId: profile.company_id
          });
          break;
          
        case 'email_sequence':
          const { emailSequences } = await import('@/automations/native/emailSequences.js');
          result = await emailSequences.startNurtureSequence({
            leadId,
            leadData,
            sequenceType: triggerConfig.sequenceType,
            userId: user.id,
            companyId: profile.company_id
          });
          break;
          
        case 'sms_sequence':
          const { smsSequences } = await import('@/automations/native/smsSequences.js');
          result = await smsSequences.sendSMSSequence({
            leadId,
            leadData,
            sequenceType: triggerConfig.sequenceType,
            userId: user.id,
            companyId: profile.company_id
          });
          break;
          
        case 'contract_flow':
          result = await TriggerHandlers.handleContractSentTrigger({
            leadId,
            contractData: triggerConfig,
            userId: user.id,
            companyId: profile.company_id
          });
          break;
          
        case 'cold_lead_retarget':
          const { retargeting } = await import('@/automations/native/retargeting.js');
          result = await retargeting.startRewarming({
            leadId,
            leadData,
            inactivityDays: triggerConfig.inactivityThreshold || 30,
            userId: user.id,
            companyId: profile.company_id
          });
          break;
          
        default:
          throw new Error(`Unknown trigger type: ${selectedTrigger}`);
      }

      if (result.success) {
        toast.success(`${selectedTrigger.replace('_', ' ')} triggered successfully`);
        await loadActiveTriggers();
        if (onTriggerExecuted) onTriggerExecuted(result);
      } else {
        toast.error(`Failed to trigger automation: ${result.error}`);
      }
    } catch (error) {
      logger.error('Trigger execution failed', error, 'automation');
      toast.error('Failed to execute trigger');
    } finally {
      setLoading(false);
    }
  };

  const handleAITrigger = async () => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Please ensure you are logged in');
      return;
    }

    setLoading(true);
    
    try {
      const { salesAgentConfig } = await import('@/ai-agents/salesAgentConfig.js');
      
      const result = await salesAgentConfig.triggerLeadAutomation({
        leadId,
        automationType: selectedTrigger,
        context: {
          leadData,
          triggerConfig,
          userPreferences: profile
        },
        userId: user.id,
        companyId: profile.company_id
      });

      if (result.success) {
        toast.success('AI Agent triggered automation successfully');
        await loadActiveTriggers();
        if (onTriggerExecuted) onTriggerExecuted(result);
      } else {
        toast.error(`AI trigger failed: ${result.error}`);
      }
    } catch (error) {
      logger.error('AI trigger execution failed', error, 'automation');
      toast.error('Failed to execute AI trigger');
    } finally {
      setLoading(false);
    }
  };

  const renderTriggerFields = () => {
    const trigger = triggerTypes.find(t => t.id === selectedTrigger);
    if (!trigger) return null;

    return (
      <div className="space-y-4">
        {trigger.fields.map(field => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
            {renderFieldInput(field)}
          </div>
        ))}
      </div>
    );
  };

  const renderFieldInput = (field) => {
    switch (field) {
      case 'tag':
        return (
          <Select onValueChange={(value) => setTriggerConfig({...triggerConfig, tag: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot_lead">Hot Lead</SelectItem>
              <SelectItem value="warm_lead">Warm Lead</SelectItem>
              <SelectItem value="cold_lead">Cold Lead</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="demo_requested">Demo Requested</SelectItem>
              <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
            </SelectContent>
          </Select>
        );
        
      case 'sequenceType':
        return (
          <Select onValueChange={(value) => setTriggerConfig({...triggerConfig, sequenceType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select sequence type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome_sequence">Welcome Sequence</SelectItem>
              <SelectItem value="nurture_sequence">Nurture Sequence</SelectItem>
              <SelectItem value="follow_up_sequence">Follow-up Sequence</SelectItem>
              <SelectItem value="reengagement_sequence">Re-engagement Sequence</SelectItem>
            </SelectContent>
          </Select>
        );
        
      case 'followUpDelay':
      case 'inactivityThreshold':
        return (
          <Input
            type="number"
            placeholder={field === 'followUpDelay' ? 'Hours' : 'Days'}
            value={triggerConfig[field] || ''}
            onChange={(e) => setTriggerConfig({...triggerConfig, [field]: parseInt(e.target.value)})}
          />
        );
        
      case 'channels':
        return (
          <div className="space-y-2">
            {['email', 'sms', 'social'].map(channel => (
              <div key={channel} className="flex items-center space-x-2">
                <Switch
                  id={channel}
                  checked={triggerConfig.channels?.[channel] || false}
                  onCheckedChange={(checked) => setTriggerConfig({
                    ...triggerConfig,
                    channels: { ...triggerConfig.channels, [channel]: checked }
                  })}
                />
                <Label htmlFor={channel} className="capitalize">{channel}</Label>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <Input
            value={triggerConfig[field] || ''}
            onChange={(e) => setTriggerConfig({...triggerConfig, [field]: e.target.value})}
            placeholder={`Enter ${field}`}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Automation Trigger Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Trigger</TabsTrigger>
            <TabsTrigger value="ai">AI Trigger</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="triggerType">Trigger Type</Label>
                <Select onValueChange={setSelectedTrigger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select automation trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map(trigger => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        <div className="flex items-center gap-2">
                          <trigger.icon className="h-4 w-4" />
                          {trigger.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTrigger && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-4">
                    {triggerTypes.find(t => t.id === selectedTrigger)?.description}
                  </p>
                  {renderTriggerFields()}
                </div>
              )}
              
              <Button 
                onClick={handleTriggerExecution}
                disabled={!selectedTrigger || loading}
                className="w-full"
              >
                {loading ? 'Executing...' : 'Execute Trigger'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">AI-Powered Automation</h4>
                <p className="text-sm text-blue-700">
                  Let the AI agent analyze the lead and determine the best automation strategy based on behavior patterns and conversion probability.
                </p>
              </div>
              
              <div>
                <Label htmlFor="aiTriggerType">AI Trigger Type</Label>
                <Select onValueChange={setSelectedTrigger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI automation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map(trigger => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        <div className="flex items-center gap-2">
                          <trigger.icon className="h-4 w-4" />
                          AI {trigger.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAITrigger}
                disabled={!selectedTrigger || loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'AI Processing...' : 'Trigger AI Automation'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Active Triggers */}
        {activeTriggers.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Active Triggers</h4>
            <div className="space-y-2">
              {activeTriggers.map(trigger => (
                <div key={trigger.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <span className="font-medium">{trigger.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(trigger.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TriggerPanel;
