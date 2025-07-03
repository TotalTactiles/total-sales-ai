
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Clock, 
  Brain, 
  Calendar,
  Check,
  CalendarPlus,
  Zap,
  Phone,
  Mail,
  Users,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface TimeBlock {
  id: string;
  time: string;
  title: string;
  duration: string;
  type: 'calls' | 'emails' | 'outreach' | 'review';
  description: string;
  aiOptimized: boolean;
  synced: boolean;
}

const AIOptimizedSchedule: React.FC = () => {
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      time: '09:00',
      title: 'Priority Lead Calls',
      duration: '2 hours',
      type: 'calls',
      description: 'AI-prioritized high-value prospects with strong buying signals',
      aiOptimized: true,
      synced: false
    },
    {
      id: '2',
      time: '11:30',
      title: 'Follow-up Emails',
      duration: '30 minutes',
      type: 'emails',
      description: 'AI-drafted personalized follow-ups for warm leads',
      aiOptimized: true,
      synced: false
    },
    {
      id: '3',
      time: '14:00',
      title: 'Warm Lead Outreach',
      duration: '1.5 hours',
      type: 'outreach',
      description: 'AI-scored prospects with optimal contact timing',
      aiOptimized: true,
      synced: false
    },
    {
      id: '4',
      time: '16:00',
      title: 'Deal Review & Notes',
      duration: '45 minutes',
      type: 'review',
      description: 'AI insights and next-step recommendations',
      aiOptimized: true,
      synced: false
    }
  ]);

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'calls': return 'bg-blue-500';
      case 'emails': return 'bg-green-500';
      case 'outreach': return 'bg-orange-500';
      case 'review': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'calls': return <Phone className="h-4 w-4" />;
      case 'emails': return <Mail className="h-4 w-4" />;
      case 'outreach': return <Users className="h-4 w-4" />;
      case 'review': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleBlockClick = (block: TimeBlock) => {
    if (block.synced) {
      toast.info('This block is already synced to your calendar');
      return;
    }
    setSelectedBlock(block);
    setSyncDialogOpen(true);
  };

  const handleSyncToCalendar = () => {
    if (!selectedBlock) return;

    // Update the block as synced
    setTimeBlocks(blocks => 
      blocks.map(block => 
        block.id === selectedBlock.id 
          ? { ...block, synced: true }
          : block
      )
    );

    setSyncDialogOpen(false);
    setSelectedBlock(null);
    
    toast.success(`${selectedBlock.title} added to your calendar!`);
  };

  return (
    <>
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            AI-Optimized Schedule
            <Badge className="bg-white/20 text-white text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Smart
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {timeBlocks.map((block) => (
              <div
                key={block.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
                  ${block.synced 
                    ? 'bg-green-50 border-2 border-green-200 hover:bg-green-100' 
                    : 'hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
                onClick={() => handleBlockClick(block)}
              >
                <div className={`w-3 h-3 rounded-full ${getBlockColor(block.type)}`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {block.time}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{block.title}</span>
                    {block.aiOptimized && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        <Zap className="h-2 w-2 mr-1" />
                        AI
                      </Badge>
                    )}
                    {block.synced && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <Check className="h-2 w-2 mr-1" />
                        Synced
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{block.duration}</div>
                  <div className="text-xs text-gray-600">{block.description}</div>
                </div>
                <div className="flex items-center gap-1">
                  {getBlockIcon(block.type)}
                  {!block.synced && (
                    <CalendarPlus className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Brain className="h-3 w-3" />
              <span>AI analyzed your performance patterns for optimal scheduling</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <CalendarPlus className="h-3 w-3" />
              <span>Click any block to add to your calendar</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Add to Calendar
            </DialogTitle>
          </DialogHeader>
          {selectedBlock && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{selectedBlock.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedBlock.time} - {selectedBlock.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getBlockIcon(selectedBlock.type)}
                    <span>{selectedBlock.description}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                This will add the time block to your connected calendar and mark it as unavailable for other bookings.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSyncToCalendar} className="bg-green-600 hover:bg-green-700">
              <CalendarPlus className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIOptimizedSchedule;
