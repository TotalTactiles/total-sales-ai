
import React from 'react';
import { Lead } from '@/types/lead';
import DialerControls from './DialerControls';
import DialerQueue from './DialerQueue';
import ActiveCallInterface from './ActiveCallInterface';
import ABTestInterface from './ABTestInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ChevronRight } from 'lucide-react';

interface AutoDialerMainLayoutProps {
  repQueue: Lead[];
  aiQueue: Lead[];
  currentLead: Lead | null;
  isDialing: boolean;
  isCallActive: boolean;
  callDuration: number;
  complianceStatus: {
    dncChecked: boolean;
    timeCompliant: boolean;
    auditEnabled: boolean;
  };
  onStartDialing: () => void;
  onPauseDialing: () => void;
  onEndCall: () => void;
  onCallAnswered: () => void;
  onCallMissed: () => void;
  onMoveLeadBetweenQueues: (leadId: string, fromQueue: 'rep' | 'ai', toQueue: 'rep' | 'ai') => void;
  onLeadSelect: (lead: Lead) => void;
}

const AutoDialerMainLayout: React.FC<AutoDialerMainLayoutProps> = ({
  repQueue,
  aiQueue,
  currentLead,
  isDialing,
  isCallActive,
  callDuration,
  complianceStatus,
  onStartDialing,
  onPauseDialing,
  onEndCall,
  onCallAnswered,
  onCallMissed,
  onMoveLeadBetweenQueues,
  onLeadSelect
}) => {
  return (
    <div className="flex gap-4 flex-1">
      {/* Left Panel - Queue Management */}
      <div className="w-1/3 space-y-4">
        <DialerControls
          isDialing={isDialing}
          isCallActive={isCallActive}
          onStartDialing={onStartDialing}
          onPauseDialing={onPauseDialing}
          onEndCall={onEndCall}
          canStart={repQueue.length > 0 && complianceStatus.dncChecked && complianceStatus.timeCompliant}
        />
        
        <DialerQueue
          repQueue={repQueue}
          aiQueue={aiQueue}
          currentLead={currentLead}
          onMoveLeadBetweenQueues={onMoveLeadBetweenQueues}
          onLeadSelect={onLeadSelect}
        />
      </div>

      {/* Center Panel - Active Call Interface */}
      <div className="flex-1">
        <ActiveCallInterface
          currentLead={currentLead}
          isCallActive={isCallActive}
          callDuration={callDuration}
          onCallAnswered={onCallAnswered}
          onCallMissed={onCallMissed}
          onEndCall={onEndCall}
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
  );
};

export default AutoDialerMainLayout;
