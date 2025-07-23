
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Volume2,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VoiceTonalityProps {
  sessionId?: string;
  isActive: boolean;
}

const VoiceTonalityComponent: React.FC<VoiceTonalityProps> = ({ sessionId, isActive }) => {
  const [currentTone, setCurrentTone] = useState(50);
  const [targetTone, setTargetTone] = useState(60);
  const [pitch, setPitch] = useState(45);
  const [volume, setVolume] = useState(70);
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isActive) {
      startVoiceAnalysis();
    } else {
      stopVoiceAnalysis();
    }
    
    return () => stopVoiceAnalysis();
  }, [isActive]);

  const startVoiceAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Get user media for voice analysis
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const analyze = () => {
        if (!isAnalyzing) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate tone metrics
        const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        const newTone = Math.min(100, (avgFrequency / 255) * 100);
        const newVolume = Math.min(100, (avgFrequency / 128) * 100);
        const newPitch = Math.min(100, (dataArray[10] / 255) * 100);
        
        setCurrentTone(newTone);
        setVolume(newVolume);
        setPitch(newPitch);
        
        // Determine sentiment based on tone patterns
        if (newTone > 60 && newVolume > 50) {
          setSentiment('positive');
        } else if (newTone < 40 && newVolume < 30) {
          setSentiment('negative');
        } else {
          setSentiment('neutral');
        }
        
        // Draw waveform
        drawWaveform(dataArray);
        
        // Send analysis to backend
        if (sessionId) {
          sendVoiceAnalysis({
            tone: newTone,
            pitch: newPitch,
            volume: newVolume,
            sentiment
          });
        }
        
        animationRef.current = requestAnimationFrame(analyze);
      };
      
      analyze();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsAnalyzing(false);
    }
  };

  const stopVoiceAnalysis = () => {
    setIsAnalyzing(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const drawWaveform = (dataArray: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw target line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, height - (targetTone / 100) * height);
    ctx.lineTo(width, height - (targetTone / 100) * height);
    ctx.stroke();
    
    // Draw current tone line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, height - (currentTone / 100) * height);
    ctx.lineTo(width, height - (currentTone / 100) * height);
    ctx.stroke();
    
    // Draw waveform
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    const sliceWidth = width / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
  };

  const sendVoiceAnalysis = async (analysis: any) => {
    try {
      await supabase.functions.invoke('voice-analysis', {
        body: {
          audioData: analysis,
          sessionId,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
    } catch (error) {
      console.error('Error sending voice analysis:', error);
    }
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getToneStatus = () => {
    const diff = Math.abs(currentTone - targetTone);
    if (diff < 10) return { status: 'On Target', color: 'text-green-600', icon: Target };
    if (diff < 20) return { status: 'Close', color: 'text-yellow-600', icon: TrendingUp };
    return { status: 'Adjust', color: 'text-red-600', icon: TrendingDown };
  };

  const toneStatus = getToneStatus();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Voice Tonality
          </span>
          <Badge className={getSentimentColor()}>
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Waveform Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={120}
            className="w-full h-24 bg-gray-50 rounded border"
          />
          <div className="absolute top-2 left-2 text-xs text-gray-500">
            Live Waveform
          </div>
        </div>

        {/* Tone Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Tone</span>
              <span className="text-sm text-blue-600">{currentTone.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentTone}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Volume</span>
              <span className="text-sm text-purple-600">{volume.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>

        {/* Target Setting */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Tone</label>
          <Slider
            value={[targetTone]}
            onValueChange={(value) => setTargetTone(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Calm</span>
            <span>{targetTone}%</span>
            <span>Energetic</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <div className="flex items-center space-x-2">
            <toneStatus.icon className={`h-4 w-4 ${toneStatus.color}`} />
            <span className={`text-sm font-medium ${toneStatus.color}`}>
              {toneStatus.status}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Pitch: {pitch.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <Button
            variant={isAnalyzing ? 'destructive' : 'default'}
            size="sm"
            onClick={isAnalyzing ? stopVoiceAnalysis : startVoiceAnalysis}
          >
            {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceTonalityComponent;
