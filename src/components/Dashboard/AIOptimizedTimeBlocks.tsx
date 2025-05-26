
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Clock } from 'lucide-react';

interface TimeBlock {
  id: string;
  time: string;
  type: 'calls' | 'emails' | 'follow-ups';
  title: string;
  duration: string;
}

interface AIOptimizedTimeBlocksProps {
  isFullUser: boolean;
}

const AIOptimizedTimeBlocks: React.FC<AIOptimizedTimeBlocksProps> = ({ isFullUser }) => {
  const timeBlocks: TimeBlock[] = [
    { id: '1', time: '09:00', type: 'calls', title: 'Priority Lead Calls', duration: '2h' },
    { id: '2', time: '11:30', type: 'emails', title: 'Follow-up Emails', duration: '30m' },
    { id: '3', time: '14:00', type: 'calls', title: 'Warm Lead Outreach', duration: '1.5h' },
    { id: '4', time: '16:00', type: 'follow-ups', title: 'Deal Review & Notes', duration: '45m' },
  ];

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'calls': return 'bg-blue-500';
      case 'emails': return 'bg-green-500';
      case 'follow-ups': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`w-full ${isFullUser ? 'border-2 border-gradient-to-r from-cyan-400 to-blue-500' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>{isFullUser ? 'AI-Optimized Time Blocks' : 'Suggested Schedule'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {timeBlocks.map((block) => (
          <Tooltip key={block.id}>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{block.time}</span>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getBlockColor(block.type)}`} />
                  <span className="text-sm">{block.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{block.duration}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to add to your calendar</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            {isFullUser ? 
              'AI analyzed your performance patterns for optimal scheduling' :
              'Suggested based on your activity patterns'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIOptimizedTimeBlocks;
