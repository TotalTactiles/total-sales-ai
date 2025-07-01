
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAgentInitialization } from '@/hooks/useAgentInitialization';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AgentInitializationPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const { initializeAgentsForRep, checkAgentStatus, isInitializing, lastResult } = useAgentInitialization();
  
  const [repData, setRepData] = useState({
    repName: profile?.full_name || '',
    crmRepID: '',
    repCalendar: profile?.email || '',
    repTone: profile?.sales_personality || 'professional'
  });

  const handleInitializeAgents = async () => {
    if (!repData.repName.trim()) {
      toast.error('Please enter a rep name');
      return;
    }

    await initializeAgentsForRep(repData);
  };

  const handleCheckStatus = async () => {
    if (!repData.repName.trim()) {
      toast.error('Please enter a rep name to check status');
      return;
    }

    const status = await checkAgentStatus(repData.repName);
    if (status) {
      toast.success(`Agents are ${status.status} for ${repData.repName}`);
    } else {
      toast.error('Failed to check agent status');
    }
  };

  const getStatusBadge = () => {
    if (!lastResult) return null;

    if (lastResult.status.includes('✅')) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>;
    } else {
      return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Agent Initialization System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rep Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="repName">Rep Name</Label>
            <Input
              id="repName"
              value={repData.repName}
              onChange={(e) => setRepData(prev => ({ ...prev, repName: e.target.value }))}
              placeholder="Enter rep name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crmRepID">CRM Rep ID</Label>
            <Input
              id="crmRepID"
              value={repData.crmRepID}
              onChange={(e) => setRepData(prev => ({ ...prev, crmRepID: e.target.value }))}
              placeholder="Enter CRM ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repCalendar">Rep Calendar</Label>
            <Input
              id="repCalendar"
              value={repData.repCalendar}
              onChange={(e) => setRepData(prev => ({ ...prev, repCalendar: e.target.value }))}
              placeholder="Enter calendar email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repTone">Rep Tone</Label>
            <Select value={repData.repTone} onValueChange={(value) => setRepData(prev => ({ ...prev, repTone: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="assertive">Assertive</SelectItem>
                <SelectItem value="consultative">Consultative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleInitializeAgents} 
            disabled={isInitializing}
            className="flex items-center gap-2"
          >
            {isInitializing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
            Initialize Agents
          </Button>

          <Button variant="outline" onClick={handleCheckStatus}>
            Check Status
          </Button>
        </div>

        {/* Status Display */}
        {lastResult && (
          <div className="p-4 rounded-lg bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Initialization Result</h4>
              {getStatusBadge()}
            </div>
            
            <div className="space-y-2 text-sm">
              <div><strong>Rep:</strong> {lastResult.rep}</div>
              {lastResult.salesAgent && <div><strong>Sales Agent:</strong> {lastResult.salesAgent}</div>}
              {lastResult.automationAgent && <div><strong>Automation Agent:</strong> {lastResult.automationAgent}</div>}
              {lastResult.developerAgent && <div><strong>Developer Agent:</strong> {lastResult.developerAgent}</div>}
              {lastResult.error && <div className="text-red-600"><strong>Error:</strong> {lastResult.error}</div>}
            </div>
          </div>
        )}

        {/* Agent Overview */}
        <div className="space-y-3">
          <h4 className="font-medium">Agent Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border bg-blue-50">
              <div className="font-medium text-blue-900">Sales Agent (Sam)</div>
              <div className="text-sm text-blue-700">Personalized for each rep</div>
            </div>
            <div className="p-3 rounded-lg border bg-green-50">
              <div className="font-medium text-green-900">Automation Agent (Atlas)</div>
              <div className="text-sm text-green-700">Shared automation queue</div>
            </div>
            <div className="p-3 rounded-lg border bg-purple-50">
              <div className="font-medium text-purple-900">Developer Agent (Nova)</div>
              <div className="text-sm text-purple-700">Error monitoring & fixes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentInitializationPanel;
