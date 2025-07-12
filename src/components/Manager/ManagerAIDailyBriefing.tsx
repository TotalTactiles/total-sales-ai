
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Mic,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const ManagerAIDailyBriefing: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [duration] = useState(180); // 3 minutes

  const briefingData = {
    title: "Daily Sales Briefing",
    date: "Wednesday, July 9, 2025",
    highlights: [
      "5 high-priority leads require immediate attention",
      "23% conversion rate improvement this week",
      "3 scheduled demos for today",
      "Pipeline value increased by $45K"
    ],
    fullSummary: `Good morning Manager! Here's your comprehensive AI-powered daily briefing for maximum sales performance.

🎯 PRIORITY ALERTS:
• 5 high-priority leads require immediate attention today
• TechCorp deal shows 85% close probability - follow up by 2 PM
• MegaInc requested pricing - proposal deadline is tomorrow

📈 PERFORMANCE INSIGHTS:
• Team conversion rate improved by 23% this week - excellent work!
• 3 product demos scheduled for today
• Pipeline value increased by $45,000 since last week
• Team response time average is 2.4 hours (18% faster than industry average)

🔥 RECOMMENDED ACTIONS:
1. Review Sarah Chen's performance - she's leading with 145% quota
2. Schedule coaching session with Michael Chen - needs support
3. Focus on closing 3 enterprise deals in final negotiation
4. Implement peer mentoring program for knowledge sharing

💡 AI COACHING TIP:
Your team shows 40% higher close rates when focusing on value-based selling rather than feature presentations.

🎯 TODAY'S GOAL:
Help team convert at least 2 high-priority leads and maintain the winning momentum!`
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      toast.success('Voice briefing started (Demo Mode)');
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / duration);
          if (newProgress >= 100) {
            setIsPlaying(false);
            toast.info('Voice briefing completed');
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    } else {
      setIsPlaying(false);
      toast.info('Voice briefing paused');
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(false);
    toast.info('Voice briefing reset');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((progress / 100) * duration);
  const remainingTime = duration - currentTime;

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{briefingData.title}</h3>
              <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                <Calendar className="h-4 w-4" />
                {briefingData.date}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
            Demo Mode
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Audio Controls */}
        <div className="bg-white/10 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-0 flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </Button>
            
            <Button
              onClick={handleRestart}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-right">
              <div className="text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-white/70">
              <span>Playing: AI Voice Briefing</span>
              <span>{formatTime(remainingTime)} remaining</span>
            </div>
          </div>
        </div>

        {/* Today's Key Points */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <h4 className="font-semibold">Today's Key Points</h4>
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            {briefingData.highlights.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-white/90 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Daily Summary */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between text-white hover:bg-white/10 border-0 p-0"
          >
            <span className="font-semibold">AI Daily Summary</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
          
          {isExpanded && (
            <div className="space-y-3">
              <div className="text-sm text-white/90 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line">
                {briefingData.fullSummary}
              </div>
              <Button
                variant="ghost"
                className="text-blue-200 hover:text-white hover:bg-white/10 border-0 p-0 h-auto text-sm"
              >
                Show full summary
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerAIDailyBriefing;
