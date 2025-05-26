
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';

interface AIDailySummaryProps {
  summary: string;
  isFullUser: boolean;
}

const AIDailySummary: React.FC<AIDailySummaryProps> = ({ summary, isFullUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const truncatedSummary = summary.length > 150 ? summary.substring(0, 150) + '...' : summary;

  return (
    <Card className={`w-full ${isFullUser ? 'border-2 border-gradient-to-r from-blue-500 to-purple-600' : ''}`}>
      <CardHeader className={`${isFullUser ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'} rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">AI Daily Summary</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={playAudio}
            disabled={isPlaying}
            className="text-white hover:bg-white/10"
          >
            <Play className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isExpanded ? summary : truncatedSummary}
          </p>
          {summary.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="h-3 w-3 ml-1" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="h-3 w-3 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDailySummary;
