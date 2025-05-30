
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
  SkipForward
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

import LeadPriorityQueue from './LeadPriorityQueue';
import AIAssistantPanel from './AIAssistantPanel';
import CallFeedback from './CallFeedback';
import MockCallInterface from './MockCallInterface';

interface AutoDialerInterfaceProps {
  leads: Lead[];
  currentLead?: Lead | null;
  onLeadSelect: (lead: Lead) => void;
}

const AutoDialerInterface: React.FC<AutoDialerInterfaceProps> = ({
  leads,
  currentLead,
  onLeadSelect
}) => {
  const [isAutoDialing, setIsAutoDialing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dialerStats, setDialerStats] = useState({
    totalCalls: 0,
    connected: 0,
    voicemails: 0,
    noAnswers: 0
  });
  const [showCallFeedback, setShowCallFeedback] = useState(false);
  const [lastCallOutcome, setLastCallOutcome] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  // Filter leads for different priorities
  const hotLeads = leads.filter(lead => 
    lead.priority === 'high' && 
    lead.conversionLikelihood > 70 &&
    !lead.doNotCall
  );

  const speedToLeadCritical = leads.filter(lead => 
    lead.speedToLead !== undefined && 
    lead.speedToLead < 15 && // Less than 15 minutes old
    !lead.doNotCall
  );

  // Mock dialer functionality
  const handleStartAutoDialer = () => {
    if (!currentLead) {
      toast.error('Please select a lead first');
      return;
    }
    
    setIsAutoDialing(true);
    setIsPaused(false);
    toast.success('Auto-dialer started');
    
    // Simulate calling the current lead after 2 seconds
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
    setIsInCall(true);
    setCallStartTime(new Date());
    toast.success(`Calling ${lead.name}...`);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallStartTime(null);
    
    // Show feedback modal
    setLastCallOutcome('connected');
    setShowCallFeedback(true);
    
    // Update stats
    setDialerStats(prev => ({
      ...prev,
      totalCalls: prev.totalCalls + 1,
      connected: prev.connected + 1
    }));

    // Move to next lead if auto-dialing
    if (isAutoDialing && !isPaused) {
      setTimeout(() => {
        const nextLead = getNextLead();
        if (nextLead) {
          onLeadSelect(nextLead);
          setTimeout(() => handleCallLead(nextLead), 3000);
        }
      }, 2000);
    }
  };

  const getNextLead = () => {
    // Prioritize hot leads, then speed-to-lead critical, then regular leads
    const availableLeads = leads.filter(lead => 
      lead.id !== currentLead?.id && 
      !lead.doNotCall &&
      lead.status !== 'closed_won' && 
      lead.status !== 'closed_lost'
    );

    return availableLeads.find(lead => lead.priority === 'high') ||
           availableLeads.find(lead => (lead.speedToLead || 0) < 15) ||
           availableLeads[0];
  };

  const handleSkipLead = () => {
    const nextLead = getNextLead();
    if (nextLead) {
      onLeadSelect(nextLead);
      toast.info(`Skipped to ${nextLead.name}`);
    }
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Call feedback:', feedback);
    toast.success('Feedback submitted successfully');
  };

  // Mock toggle for testing the in-call interface
  const [showMockCall, setShowMockCall] = useState(false);

  if (showMockCall && currentLead) {
    return (
      <div className="h-full">
        <div className="p-4 bg-white border-b">
          <Button 
            variant="outline" 
            onClick={() => setShowMockCall(false)}
            className="mb-2"
          >
            ← Back to Dialer
          </Button>
          <h2 className="text-lg font-semibold">Mock In-Call Interface</h2>
        </div>
        <MockCallInterface 
          lead={currentLead} 
          onEndCall={() => setShowMockCall(false)}
        />
      </div>
    );
  }

  if (isInCall && currentLead) {
    return (
      <MockCallInterface 
        lead={currentLead} 
        onEndCall={handleEndCall}
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Panel - Lead Queue */}
      <div className="w-96 bg-white border-r overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Auto-Dialer Queue</h2>
          
          {/* Dialer Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dialerStats.totalCalls}</div>
              <div className="text-sm text-blue-600">Total Calls</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{dialerStats.connected}</div>
              <div className="text-sm text-green-600">Connected</div>
            </div>
          </div>

          <LeadPriorityQueue
            leads={leads}
            currentLead={currentLead}
            onLeadSelect={onLeadSelect}
            hotLeads={hotLeads}
            speedToLeadCritical={speedToLeadCritical}
          />
        </div>
      </div>

      {/* Center Panel - Dialer Controls */}
      <div className="flex-1 bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Current Lead Display */}
          {currentLead ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-xl">{currentLead.name}</div>
                    <div className="text-sm text-gray-600">{currentLead.company}</div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={currentLead.priority === 'high' ? 'destructive' : 'secondary'}>
                      {currentLead.priority}
                    </Badge>
                    <Badge variant="outline">{currentLead.conversionLikelihood}%</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-mono">{currentLead.phone}</div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowMockCall(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Preview Call Interface
                    </Button>
                    <Button 
                      onClick={() => handleCallLead(currentLead)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardContent className="text-center py-12">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Lead Selected</h3>
                <p className="text-gray-500">Select a lead from the queue to start dialing</p>
              </CardContent>
            </Card>
          )}

          {/* Auto-Dialer Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Auto-Dialer Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {!isAutoDialing ? (
                  <Button 
                    onClick={handleStartAutoDialer}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!currentLead}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Auto-Dialer
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
                  Skip Lead
                </Button>
              </div>

              {isAutoDialing && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-800">
                      Auto-dialer is {isPaused ? 'paused' : 'active'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dialerStats.connected > 0 ? Math.round((dialerStats.connected / dialerStats.totalCalls) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Connect Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{hotLeads.length}</div>
                  <div className="text-sm text-gray-600">Hot Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{speedToLeadCritical.length}</div>
                  <div className="text-sm text-gray-600">Fresh Leads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel - AI Assistant */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <AIAssistantPanel
          currentLead={currentLead}
          isCallActive={isInCall}
          onSuggestion={(suggestion) => toast.info(`AI: ${suggestion}`)}
        />
      </div>

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

export default AutoDialerInterface;
