
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Zap,
  Brain,
  Play,
  Pause,
  SkipForward,
  Settings,
  Target
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

import LeadPriorityQueue from './LeadPriorityQueue';
import AIAssistantPanel from './AIAssistantPanel';
import CallFeedback from './CallFeedback';
import DialerOverlay from './DialerOverlay';
import SpeedToLeadAlert from './SpeedToLeadAlert';
import AIAutopilotToggle from './AIAutopilotToggle';

interface EnhancedAutoDialerInterfaceProps {
  leads: Lead[];
  currentLead?: Lead | null;
  onLeadSelect: (lead: Lead) => void;
}

const EnhancedAutoDialerInterface: React.FC<EnhancedAutoDialerInterfaceProps> = ({
  leads,
  currentLead,
  onLeadSelect
}) => {
  const [isAutoDialing, setIsAutoDialing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDialerOverlay, setShowDialerOverlay] = useState(false);
  const [dialerStats, setDialerStats] = useState({
    totalCalls: 0,
    connected: 0,
    voicemails: 0,
    noAnswers: 0,
    conversions: 0
  });
  const [showCallFeedback, setShowCallFeedback] = useState(false);
  const [lastCallOutcome, setLastCallOutcome] = useState('');

  // Enhanced lead filtering with priority levels
  const highPriorityLeads = leads.filter(lead => 
    lead.priority === 'high' && 
    lead.conversionLikelihood > 70 &&
    !lead.doNotCall
  );

  const mediumPriorityLeads = leads.filter(lead => 
    lead.priority === 'medium' && 
    lead.conversionLikelihood > 40 &&
    !lead.doNotCall
  );

  const lowPriorityLeads = leads.filter(lead => 
    lead.priority === 'low' && 
    !lead.doNotCall
  );

  // Speed-to-Lead: Fresh leads (0-15 minutes old)
  const speedToLeadCritical = leads.filter(lead => 
    lead.speedToLead !== undefined && 
    lead.speedToLead < 15 && 
    !lead.doNotCall
  );

  // AI Autopilot enabled leads
  const autopilotLeads = leads.filter(lead => lead.autopilotEnabled);

  const handleStartAutoDialer = () => {
    if (!currentLead) {
      toast.error('Please select a lead first');
      return;
    }
    
    setIsAutoDialing(true);
    setIsPaused(false);
    toast.success('Auto-dialer started - AI optimizing call sequence');
    
    // Simulate AI-optimized calling sequence
    setTimeout(() => {
      if (currentLead) {
        handleCallLead(currentLead);
      }
    }, 2000);
  };

  const handlePauseDialer = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Auto-dialer resumed' : 'Auto-dialer paused');
  };

  const handleStopDialer = () => {
    setIsAutoDialing(false);
    setIsPaused(false);
    toast.info('Auto-dialer stopped');
  };

  const handleCallLead = (lead: Lead) => {
    setShowDialerOverlay(true);
    toast.success(`Initiating call to ${lead.name} via Twilio AU`);
  };

  const handleEndCall = () => {
    setShowDialerOverlay(false);
    
    // Show feedback modal
    setLastCallOutcome('connected');
    setShowCallFeedback(true);
    
    // Update stats
    setDialerStats(prev => ({
      ...prev,
      totalCalls: prev.totalCalls + 1,
      connected: prev.connected + 1
    }));

    // AI-driven next lead selection
    if (isAutoDialing && !isPaused) {
      setTimeout(() => {
        const nextLead = getAIOptimizedNextLead();
        if (nextLead) {
          onLeadSelect(nextLead);
          toast.info(`AI selected next lead: ${nextLead.name} (${nextLead.conversionLikelihood}% likely)`);
          setTimeout(() => handleCallLead(nextLead), 3000);
        }
      }, 2000);
    }
  };

  const getAIOptimizedNextLead = () => {
    // AI logic: Prioritize by speed-to-lead, then conversion likelihood, then priority
    const availableLeads = leads.filter(lead => 
      lead.id !== currentLead?.id && 
      !lead.doNotCall &&
      lead.status !== 'closed'
    );

    // First: Speed-to-Lead critical (0-5 minutes)
    const criticalSpeedLeads = availableLeads.filter(lead => (lead.speedToLead || 0) < 5);
    if (criticalSpeedLeads.length > 0) {
      return criticalSpeedLeads.sort((a, b) => (b.conversionLikelihood || 0) - (a.conversionLikelihood || 0))[0];
    }

    // Second: High priority with high conversion
    const highPriorityHighConversion = availableLeads.filter(lead => 
      lead.priority === 'high' && (lead.conversionLikelihood || 0) > 70
    );
    if (highPriorityHighConversion.length > 0) {
      return highPriorityHighConversion[0];
    }

    // Third: Fresh leads (5-15 minutes)
    const freshLeads = availableLeads.filter(lead => 
      (lead.speedToLead || 0) >= 5 && (lead.speedToLead || 0) < 15
    );
    if (freshLeads.length > 0) {
      return freshLeads.sort((a, b) => (b.conversionLikelihood || 0) - (a.conversionLikelihood || 0))[0];
    }

    // Fourth: Best conversion likelihood overall
    return availableLeads.sort((a, b) => (b.conversionLikelihood || 0) - (a.conversionLikelihood || 0))[0];
  };

  const handleSkipLead = () => {
    const nextLead = getAIOptimizedNextLead();
    if (nextLead) {
      onLeadSelect(nextLead);
      toast.info(`AI selected: ${nextLead.name} (${nextLead.conversionLikelihood}% conversion likelihood)`);
    }
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Call feedback:', feedback);
    toast.success('Feedback submitted - AI learning from your experience');
  };

  const handleAutopilotChange = (lead: Lead, enabled: boolean) => {
    // Update lead autopilot status
    toast.success(enabled 
      ? `AI Autopilot enabled for ${lead.name}` 
      : `AI Autopilot disabled for ${lead.name}`
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Enhanced Lead Queue */}
      <div className="w-96 bg-white border-r overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI-Powered Dialer</h2>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
          
          {/* Enhanced Dialer Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dialerStats.totalCalls}</div>
              <div className="text-sm text-blue-600">Total Calls</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {dialerStats.connected > 0 ? Math.round((dialerStats.connected / dialerStats.totalCalls) * 100) : 0}%
              </div>
              <div className="text-sm text-green-600">Connect Rate</div>
            </div>
          </div>

          {/* Speed-to-Lead Alert */}
          <SpeedToLeadAlert
            freshLeads={speedToLeadCritical}
            onCallLead={handleCallLead}
            onSelectLead={onLeadSelect}
          />

          {/* AI Autopilot Summary */}
          {autopilotLeads.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Zap className="h-5 w-5" />
                  AI Autopilot Active
                  <Badge className="bg-green-600 text-white">
                    {autopilotLeads.length} leads
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  AI is managing {autopilotLeads.length} leads automatically. 
                  Next actions scheduled for the next 2 hours.
                </p>
              </CardContent>
            </Card>
          )}

          <LeadPriorityQueue
            leads={leads}
            currentLead={currentLead}
            onLeadSelect={onLeadSelect}
            hotLeads={highPriorityLeads}
            speedToLeadCritical={speedToLeadCritical}
          />
        </div>
      </div>

      {/* Center Panel - Enhanced Dialer Controls */}
      <div className="flex-1 bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current Lead Display */}
          {currentLead ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-xl">{currentLead.name}</div>
                      <div className="text-sm text-gray-600">{currentLead.company}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={currentLead.priority === 'high' ? 'destructive' : 'secondary'}>
                        {currentLead.priority} priority
                      </Badge>
                      <Badge variant="outline">{currentLead.conversionLikelihood}% likely</Badge>
                      {currentLead.speedToLead !== undefined && currentLead.speedToLead < 15 && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Fresh {currentLead.speedToLead}min
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-mono">{currentLead.phone}</div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleCallLead(currentLead)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call Now (Twilio AU)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Autopilot Toggle */}
              <AIAutopilotToggle
                lead={currentLead}
                onAutopilotChange={(enabled) => handleAutopilotChange(currentLead, enabled)}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Lead Selected</h3>
                <p className="text-gray-500">AI will optimize your call sequence - select a lead to start</p>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Auto-Dialer Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI-Powered Auto-Dialer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                {!isAutoDialing ? (
                  <Button 
                    onClick={handleStartAutoDialer}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!currentLead}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start AI Dialer
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handlePauseDialer}
                      variant="outline"
                    >
                      {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button 
                      onClick={handleStopDialer}
                      variant="destructive"
                    >
                      Stop Dialer
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={handleSkipLead}
                  variant="outline"
                  disabled={!currentLead}
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  AI Next Lead
                </Button>
              </div>

              {isAutoDialing && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-800">
                      AI Dialer is {isPaused ? 'paused' : 'optimizing call sequence'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Next: Speed-to-lead prioritization → High conversion leads → Warm follow-ups
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                AI Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dialerStats.connected > 0 ? Math.round((dialerStats.connected / dialerStats.totalCalls) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Connect Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{highPriorityLeads.length}</div>
                  <div className="text-sm text-gray-600">Hot Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{speedToLeadCritical.length}</div>
                  <div className="text-sm text-gray-600">Fresh Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{autopilotLeads.length}</div>
                  <div className="text-sm text-gray-600">AI Managed</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    AI Recommendation: Focus on {speedToLeadCritical.length > 0 ? 'speed-to-lead' : 'high conversion'} leads for best results
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel - Enhanced AI Assistant */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <AIAssistantPanel
          currentLead={currentLead}
          isCallActive={showDialerOverlay}
          onSuggestion={(suggestion) => toast.info(`AI: ${suggestion}`)}
        />
      </div>

      {/* Dialer Overlay */}
      <DialerOverlay
        lead={currentLead!}
        isOpen={showDialerOverlay}
        onClose={() => setShowDialerOverlay(false)}
        onEndCall={handleEndCall}
      />

      {/* Call Feedback Modal */}
      <CallFeedback
        isOpen={showCallFeedback}
        onClose={() => setShowCallFeedback(false)}
        callOutcome={lastCallOutcome}
        leadName={currentLead?.name || ''}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default EnhancedAutoDialerInterface;
