
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Brain, 
  Phone, 
  TrendingUp,
  Clock,
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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-600" />
        <span className="text-sm">Rep Queue:</span>
        <Badge variant="outline">{repQueueCount}</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-purple-600" />
        <span className="text-sm">AI Queue:</span>
        <Badge variant="outline">{aiQueueCount}</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-orange-600" />
        <span className="text-sm">Missed:</span>
        <Badge variant={consecutiveMissed >= 8 ? "destructive" : "outline"}>
          {consecutiveMissed}/10
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-green-600" />
        <Badge variant={isDialing ? "default" : "outline"}>
          {isDialing ? "Active" : "Stopped"}
        </Badge>
      </div>
    </div>
  );
};

export default DialerStats;
