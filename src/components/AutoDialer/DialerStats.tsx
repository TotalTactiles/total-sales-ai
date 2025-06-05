
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Brain, 
  Phone, 
  Target
} from 'lucide-react';

interface DialerStatsProps {
  repQueueCount: number;
  aiQueueCount: number;
  consecutiveMissed: number;
  isDialing: boolean;
}

const DialerStats: React.FC<DialerStatsProps> = ({
  repQueueCount,
  aiQueueCount,
  consecutiveMissed,
  isDialing
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-xs text-slate-600">Rep Queue:</span>
        <Badge variant="outline" className="text-xs font-medium">{repQueueCount}</Badge>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Brain className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-xs text-slate-600">AI Queue:</span>
        <Badge variant="outline" className="text-xs font-medium">{aiQueueCount}</Badge>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Target className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-xs text-slate-600">Missed:</span>
        <Badge variant={consecutiveMissed >= 8 ? "destructive" : "outline"} className="text-xs font-medium">
          {consecutiveMissed}/10
        </Badge>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${isDialing ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
        <span className="text-xs text-slate-600">{isDialing ? "Active" : "Stopped"}</span>
      </div>
    </div>
  );
};

export default DialerStats;
