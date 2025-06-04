
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  PhoneCall, 
  Pause, 
  Play, 
  SkipForward,
  Clock,
  Users,
  Brain,
  AlertTriangle,
  CheckCircle,
  Mic,
  MicOff,
  Settings,
  BarChart3,
  TestTube2,
  ChevronRight
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import DialerQueue from './DialerQueue';
import ActiveCallInterface from './ActiveCallInterface';
import DialerControls from './DialerControls';
import DialerCompliance from './DialerCompliance';
import DialerStats from './DialerStats';
import ABTestInterface from './ABTestInterface';

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

  const handleStartDialing = () => {
    if (repQueue.length === 0) {
      toast.error('No leads in queue');
      return;
    }

    // DNC Compliance check
    if (!complianceStatus.dncChecked) {
      toast.error('Please verify DNC compliance before dialing');
      return;
    }

    // Time compliance check
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
      
      // Simulate dialing
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
    
    if (consecutiveMissed >= 9) { // Will be 10 after increment
      // AI reorders queue
      aiReorderQueue();
      toast.info('AI is reordering queue based on recent patterns');
    }
    
    handleEndCall();
  };

  const aiReorderQueue = () => {
    // AI logic to reorder based on lead score, activity, urgency
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
    
    // Remove current lead from queue
    if (currentLead) {
      setRepQueue(prev => prev.filter(lead => lead.id !== currentLead.id));
    }
    
    // Auto-advance to next lead if dialing
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flat-heading-xl">Auto-Dialer System</h1>
          <p className="text-sm text-gray-600">AI-Augmented Legal Compliant Dialing</p>
        </div>
        <div className="flex items-center gap-4">
          <DialerStats 
            repQueueCount={repQueue.length}
            aiQueueCount={aiQueue.length}
            consecutiveMissed={consecutiveMissed}
            isDialing={isDialing}
          />
        </div>
      </div>

      {/* Compliance Panel */}
      <DialerCompliance 
        status={complianceStatus}
        onStatusChange={setComplianceStatus}
      />

      <div className="flex gap-4 flex-1">
        {/* Left Panel - Queue Management */}
        <div className="w-1/3 space-y-4">
          <DialerControls
            isDialing={isDialing}
            isCallActive={isCallActive}
            onStartDialing={handleStartDialing}
            onPauseDialing={handlePauseDialing}
            onEndCall={handleEndCall}
            canStart={repQueue.length > 0 && complianceStatus.dncChecked && complianceStatus.timeCompliant}
          />
          
          <DialerQueue
            repQueue={repQueue}
            aiQueue={aiQueue}
            currentLead={currentLead}
            onMoveLeadBetweenQueues={moveLeadBetweenQueues}
            onLeadSelect={onLeadSelect}
          />
        </div>

        {/* Center Panel - Active Call Interface */}
        <div className="flex-1">
          <ActiveCallInterface
            currentLead={currentLead}
            isCallActive={isCallActive}
            callDuration={callDuration}
            onCallAnswered={handleCallAnswered}
            onCallMissed={handleCallMissed}
            onEndCall={handleEndCall}
          />
        </div>

        {/* Right Panel - A/B Testing & Quick Tools */}
        <div className="w-80 space-y-4">
          <ABTestInterface currentLead={currentLead} isCallActive={isCallActive} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flat-heading-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Call Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Connected Today</span>
                <span className="font-bold">12/18</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Conversion Rate</span>
                <span className="font-bold text-green-600">22%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>AI Assist Usage</span>
                <span className="font-bold text-blue-600">85%</span>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs">
                <ChevronRight className="h-3 w-3 mr-1" />
                View Full Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutoDialerSystem;
