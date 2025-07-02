
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Mic,
  Headphones,
  Clock,
  Calendar
} from 'lucide-react';
import { aiConfig, generateMockAIResponse } from '@/config/ai';
import { toast } from 'sonner';

interface VoiceBriefingProps {
  userName: string;
  className?: string;
}

const VoiceBriefing: React.FC<VoiceBriefingProps> = ({ userName, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration] = useState(180); // 3 minutes
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const briefingData = {
    title: "Daily Sales Briefing",
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    highlights: [
      "5 high-priority leads require immediate attention",
      "23% conversion rate improvement this week",
      "3 scheduled demos for today",
      "Pipeline value increased by $45K"
    ],
    voiceText: `Good morning ${userName}! Here's your AI-powered daily briefing. You have 5 high-priority leads that require immediate attention today. Your conversion rate has improved by 23% this week - excellent work! You have 3 product demos scheduled, and your pipeline value has increased by $45,000. The AI recommends focusing on the TechCorp deal first, as they've shown strong buying signals. Have a productive day!`
  };

  const handlePlayPause = () => {
    if (!aiConfig.enabled) {
      // Demo mode - simulate audio playback
      if (!isPlaying) {
        setIsPlaying(true);
        toast.success('Voice briefing started (Demo Mode)');
        
        // Simulate progress
        intervalRef.current = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + (100 / duration);
            if (newProgress >= 100) {
              setIsPlaying(false);
              toast.info('Voice briefing completed');
              if (intervalRef.current) clearInterval(intervalRef.current);
              return 100;
            }
            return newProgress;
          });
        }, 1000);
      } else {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        toast.info('Voice briefing paused');
      }
      return;
    }

    // Real audio implementation would go here
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
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
    <Card className={`${className} border-gradient-to-r from-blue-200 to-purple-200`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5" />
          <span>{briefingData.title}</span>
          {!aiConfig.enabled && (
            <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
              Demo Mode
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-blue-100">
          <Calendar className="h-4 w-4" />
          {briefingData.date}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Audio Controls */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Playing: AI Voice Briefing</span>
              <span>{formatTime(remainingTime)} remaining</span>
            </div>
          </div>
        </div>

        {/* Briefing Highlights */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Mic className="h-4 w-4 text-blue-600" />
            Today's Key Points
          </h4>
          <div className="space-y-2">
            {briefingData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript Preview */}
        <div className="bg-blue-50 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-900 mb-2">Transcript Preview</h5>
          <p className="text-sm text-blue-800 line-clamp-3">
            {briefingData.voiceText}
          </p>
        </div>
      </CardContent>
      
      {/* Hidden audio element for future real implementation */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </Card>
  );
};

export default VoiceBriefing;
