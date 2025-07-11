
import { logger } from '@/utils/logger';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2, Loader2, ChevronDown, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { voiceService } from '@/services/ai/voiceService';
import { unifiedAIService } from '@/services/ai/unifiedAIService';
import { validateStringParam } from '@/types/actions';

interface AIDailySummaryProps {
  summary: any;
  isFullUser: boolean;
}

const AIDailySummary: React.FC<AIDailySummaryProps> = ({
  summary,
  isFullUser
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime] = useState("3:00");
  const [remainingTime, setRemainingTime] = useState("3:00 remaining");

  const playAudio = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      logger.info('Starting audio playback for summary');
      toast.info('Generating voice summary... (Demo Mode)');

      // Simulate audio playback
      let seconds = 0;
      const interval = setInterval(() => {
        seconds += 1;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setCurrentTime(`${minutes}:${remainingSeconds.toString().padStart(2, '0')}`);
        
        const totalSeconds = 180; // 3 minutes
        const remaining = totalSeconds - seconds;
        const remainingMinutes = Math.floor(remaining / 60);
        const remainingSecondsLeft = remaining % 60;
        setRemainingTime(`${remainingMinutes}:${remainingSecondsLeft.toString().padStart(2, '0')} remaining`);
        
        if (seconds >= totalSeconds) {
          clearInterval(interval);
          setIsPlaying(false);
          setCurrentTime("0:00");
          setRemainingTime("3:00 remaining");
        }
      }, 1000);

      // Use the unified AI service to generate voice response
      const validSummary = validateStringParam(summary, 'No summary available');
      const voiceText = await unifiedAIService.generateVoiceResponse(validSummary);
      await voiceService.generateVoiceResponse(voiceText);
      
      toast.success('Summary played successfully (Demo Mode)');
    } catch (error) {
      logger.error('Error playing audio summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to play audio summary';
      const safeErrorMessage = validateStringParam(errorMessage, 'Audio playback failed');
      toast.error(safeErrorMessage);
      setIsPlaying(false);
    }
  };

  const keyPoints = [
    "5 high-priority leads require immediate attention",
    "23% conversion rate improvement this week", 
    "3 scheduled demos for today",
    "Pipeline value increased by $45K"
  ];

  return (
    <Card className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                Daily Sales Briefing
              </CardTitle>
              <p className="text-sm text-white/80 mt-1">Friday, July 11, 2025</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
            Demo Mode
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Audio Controls */}
        <div className="bg-white/10 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={playAudio}
              disabled={isPlaying}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-0 flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 border-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 border-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-right">
              <div className="text-sm font-medium">{currentTime} / {totalTime}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              {isPlaying ? "Playing: AI Voice Briefing" : "Ready: AI Voice Briefing"}
            </div>
            <div className="text-xs text-white/70">
              {remainingTime}
            </div>
          </div>
        </div>

        {/* Today's Key Points */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <h3 className="font-semibold">Today's Key Points</h3>
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-white/90 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Daily Summary Section */}
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
              <p className="text-sm text-white/90 leading-relaxed">
                Good morning User! Here's your comprehensive AI-powered daily briefing for maximum sales performance.
              </p>
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

export default AIDailySummary;
