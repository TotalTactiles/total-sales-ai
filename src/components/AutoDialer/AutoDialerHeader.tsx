
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Lead } from '@/types/lead';
import DialerStats from './DialerStats';

interface AutoDialerHeaderProps {
  repQueueCount: number;
  aiQueueCount: number;
  consecutiveMissed: number;
  isDialing: boolean;
  onStartMockCall: () => void;
  canStartMockCall: boolean;
}

const AutoDialerHeader: React.FC<AutoDialerHeaderProps> = ({
  repQueueCount,
  aiQueueCount,
  consecutiveMissed,
  isDialing,
  onStartMockCall,
  canStartMockCall
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="flat-heading-xl">Auto-Dialer System</h1>
        <p className="text-sm text-gray-600">AI-Augmented Legal Compliant Dialing</p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={onStartMockCall}
          disabled={!canStartMockCall}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="h-4 w-4 mr-2" />
          Demo Mock Call
        </Button>
        <DialerStats 
          repQueueCount={repQueueCount}
          aiQueueCount={aiQueueCount}
          consecutiveMissed={consecutiveMissed}
          isDialing={isDialing}
        />
      </div>
    </div>
  );
};

export default AutoDialerHeader;
