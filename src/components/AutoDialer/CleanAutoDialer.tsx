
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import ComplianceBanner from './ComplianceBanner';
import DialerControlPanel from './DialerControlPanel';
import RepQueue from './RepQueue';
import LiveCallPanel from './LiveCallPanel';
import ABTestingPanel from './ABTestingPanel';

interface CleanAutoDialerProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

const CleanAutoDialer: React.FC<CleanAutoDialerProps> = ({ leads, onLeadSelect }) => {
  const [isDialing, setIsDialing] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [complianceStatus, setComplianceStatus] = useState({
    dncChecked: false,
    timeCompliant: true,
    auditEnabled: true
  });

  // Initialize queues
  const repQueue = leads.filter(lead => lead.priority === 'high').slice(0, 5);
  const aiQueue = leads.filter(lead => lead.priority !== 'high').slice(0, 5);

  const complianceOK = complianceStatus.dncChecked && complianceStatus.timeCompliant;

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleStartDialing = () => {
    if (!complianceOK) {
      toast.error('Please resolve compliance issues before dialing');
      return;
    }
    if (repQueue.length === 0) {
      toast.error('No leads in queue');
      return;
    }
    setIsDialing(true);
    const firstLead = repQueue[0];
    setCurrentLead(firstLead);
    onLeadSelect(firstLead);
    toast.success('Auto-dialer started');
  };

  const handleStopDialing = () => {
    setIsDialing(false);
    setIsCallActive(false);
    setCurrentLead(null);
    toast.info('Auto-dialer stopped');
  };

  const handleCallAnswered = () => {
    setIsCallActive(true);
    toast.success('Call connected!');
  };

  const handleCallMissed = () => {
    setIsCallActive(false);
    toast.info('Call missed - Moving to next lead');
    // Move to next lead logic would go here
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    toast.info('Call ended');
  };

  const handleDemoMockCall = () => {
    if (repQueue.length === 0) {
      toast.error('No leads available for demo');
      return;
    }
    const demoLead = repQueue[0];
    setCurrentLead(demoLead);
    setIsCallActive(true);
    onLeadSelect(demoLead);
    toast.success(`Starting demo call with ${demoLead.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auto-Dialer System</h1>
            <p className="text-gray-600">AI-Augmented Legal Compliant Dialing</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleDemoMockCall} className="bg-purple-600 hover:bg-purple-700">
              Demo Mock Call
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Rep Queue: {repQueue.length}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                AI Queue: {aiQueue.length}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                {isDialing ? 'Active' : 'Stopped'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Banner */}
      <div className="px-6 py-4">
        <ComplianceBanner 
          status={complianceStatus}
          onStatusChange={setComplianceStatus}
        />
      </div>

      {/* Main Layout - 3 Column Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Left Column - Controls & Queue */}
          <div className="space-y-6">
            <DialerControlPanel
              isDialing={isDialing}
              complianceOK={complianceOK}
              queueCount={repQueue.length}
              onStartDialing={handleStartDialing}
              onStopDialing={handleStopDialing}
            />
            
            <RepQueue
              leads={repQueue}
              currentLead={currentLead}
              onLeadSelect={(lead) => {
                setCurrentLead(lead);
                onLeadSelect(lead);
              }}
            />
          </div>

          {/* Center Column - Live Call */}
          <div className="col-span-2">
            <LiveCallPanel
              currentLead={currentLead}
              isCallActive={isCallActive}
              callDuration={callDuration}
              onCallAnswered={handleCallAnswered}
              onCallMissed={handleCallMissed}
              onEndCall={handleEndCall}
            />
          </div>

          {/* Right Column - A/B Testing & Analytics */}
          <div>
            <ABTestingPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanAutoDialer;
