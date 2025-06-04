
import React, { useState, useEffect } from 'react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import AutoDialerHeader from './AutoDialerHeader';
import AutoDialerMainLayout from './AutoDialerMainLayout';
import DialerCompliance from './DialerCompliance';
import MockCallInterface from './MockCallInterface';

interface AutoDialerSystemProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

const AutoDialerSystem: React.FC<AutoDialerSystemProps> = ({ leads, onLeadSelect }) => {
  const [isDialing, setIsDialing] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [repQueue, setRepQueue] = useState<Lead[]>([]);
  const [aiQueue, setAiQueue] = useState<Lead[]>([]);
  const [consecutiveMissed, setConsecutiveMissed] = useState(0);
  const [showMockCall, setShowMockCall] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState({
    dncChecked: false,
    timeCompliant: true,
    auditEnabled: true
  });

  // Initialize queues
  useEffect(() => {
    const priorityLeads = leads.filter(lead => lead.priority === 'high').slice(0, 5);
    const otherLeads = leads.filter(lead => lead.priority !== 'high').slice(0, 10);
    
    setRepQueue(priorityLeads);
    setAiQueue(otherLeads);
  }, [leads]);

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

  const handleStartMockCall = () => {
    if (repQueue.length === 0) {
      toast.error('No leads in queue for demo');
      return;
    }
    
    const demoLead = repQueue[0];
    setCurrentLead(demoLead);
    setShowMockCall(true);
    setIsCallActive(true);
    toast.success(`Starting mock call with ${demoLead.name}`);
  };

  const handleEndMockCall = () => {
    setShowMockCall(false);
    setIsCallActive(false);
    setCurrentLead(null);
    toast.info('Mock call ended');
  };

  const handleStartDialing = () => {
    if (repQueue.length === 0) {
      toast.error('No leads in queue');
      return;
    }

    if (!complianceStatus.dncChecked) {
      toast.error('Please verify DNC compliance before dialing');
      return;
    }

    if (!complianceStatus.timeCompliant) {
      toast.error('Calling outside permitted hours (9AM-8PM)');
      return;
    }

    setIsDialing(true);
    dialNextLead();
    toast.success('Auto-dialer started');
  };

  const dialNextLead = () => {
    if (repQueue.length > 0) {
      const nextLead = repQueue[0];
      setCurrentLead(nextLead);
      onLeadSelect(nextLead);
      
      setTimeout(() => {
        setIsCallActive(true);
        toast.info(`Calling ${nextLead.name}...`);
      }, 1000);
    }
  };

  const handleCallAnswered = () => {
    setConsecutiveMissed(0);
    toast.success('Call connected!');
  };

  const handleCallMissed = () => {
    setConsecutiveMissed(prev => prev + 1);
    
    if (consecutiveMissed >= 9) {
      aiReorderQueue();
      toast.info('AI is reordering queue based on recent patterns');
    }
    
    handleEndCall();
  };

  const aiReorderQueue = () => {
    const reorderedQueue = [...repQueue].sort((a, b) => {
      const aScore = (a.score || 0) + (a.conversionLikelihood || 0);
      const bScore = (b.score || 0) + (b.conversionLikelihood || 0);
      return bScore - aScore;
    });
    setRepQueue(reorderedQueue);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    
    if (currentLead) {
      setRepQueue(prev => prev.filter(lead => lead.id !== currentLead.id));
    }
    
    if (isDialing && repQueue.length > 1) {
      setTimeout(() => {
        dialNextLead();
      }, 2000);
    } else if (repQueue.length <= 1) {
      setIsDialing(false);
      toast.info('Queue completed');
    }
  };

  const handlePauseDialing = () => {
    setIsDialing(false);
    toast.info('Dialing paused');
  };

  const moveLeadBetweenQueues = (leadId: string, fromQueue: 'rep' | 'ai', toQueue: 'rep' | 'ai') => {
    const lead = fromQueue === 'rep' 
      ? repQueue.find(l => l.id === leadId)
      : aiQueue.find(l => l.id === leadId);
    
    if (!lead) return;

    if (fromQueue === 'rep') {
      setRepQueue(prev => prev.filter(l => l.id !== leadId));
    } else {
      setAiQueue(prev => prev.filter(l => l.id !== leadId));
    }

    if (toQueue === 'rep') {
      setRepQueue(prev => [...prev, lead]);
    } else {
      setAiQueue(prev => [...prev, lead]);
    }

    toast.success(`Moved ${lead.name} to ${toQueue} queue`);
  };

  // Show mock call interface if active
  if (showMockCall && currentLead) {
    return <MockCallInterface lead={currentLead} onEndCall={handleEndMockCall} />;
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header with Stats */}
      <AutoDialerHeader
        repQueueCount={repQueue.length}
        aiQueueCount={aiQueue.length}
        consecutiveMissed={consecutiveMissed}
        isDialing={isDialing}
        onStartMockCall={handleStartMockCall}
        canStartMockCall={repQueue.length > 0}
      />

      {/* Compliance Panel */}
      <DialerCompliance 
        status={complianceStatus}
        onStatusChange={setComplianceStatus}
      />

      {/* Main Layout */}
      <AutoDialerMainLayout
        repQueue={repQueue}
        aiQueue={aiQueue}
        currentLead={currentLead}
        isDialing={isDialing}
        isCallActive={isCallActive}
        callDuration={callDuration}
        complianceStatus={complianceStatus}
        onStartDialing={handleStartDialing}
        onPauseDialing={handlePauseDialing}
        onEndCall={handleEndCall}
        onCallAnswered={handleCallAnswered}
        onCallMissed={handleCallMissed}
        onMoveLeadBetweenQueues={moveLeadBetweenQueues}
        onLeadSelect={onLeadSelect}
      />
    </div>
  );
};

export default AutoDialerSystem;
