
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface VoiceControlsProps {
  enabled: boolean;
  onToggle: () => void;
  leadName: string;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ enabled, onToggle, leadName }) => {
  const [isListening, setIsListening] = useState(false);
  const { trackClick } = useUsageTracking();

  const handleVoiceCommand = () => {
    if (!enabled) {
      toast.error('Voice mode is disabled. Enable it first.');
      return;
    }

    setIsListening(!isListening);
    trackClick('voice_command', isListening ? 'stop' : 'start');

    if (!isListening) {
      toast.info(`Listening for voice commands about ${leadName}...`);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        toast.success('Voice command processed!');
      }, 3000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className={enabled ? 'border-blue-300 text-blue-700' : ''}
      >
        {enabled ? (
          <Volume2 className="h-4 w-4 mr-1" />
        ) : (
          <VolumeX className="h-4 w-4 mr-1" />
        )}
        Voice {enabled ? 'On' : 'Off'}
      </Button>
      
      {enabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleVoiceCommand}
          className={isListening ? 'border-red-300 text-red-700 animate-pulse' : 'border-green-300 text-green-700'}
        >
          {isListening ? (
            <MicOff className="h-4 w-4 mr-1" />
          ) : (
            <Mic className="h-4 w-4 mr-1" />
          )}
          {isListening ? 'Stop' : 'Listen'}
        </Button>
      )}
      
      {isListening && (
        <Badge className="bg-red-100 text-red-800 animate-pulse">
          Listening...
        </Badge>
      )}
    </div>
  );
};

export default VoiceControls;
