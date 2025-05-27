
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { voiceService } from '@/services/ai/voiceService';

interface VoiceControlsProps {
  enabled: boolean;
  onToggle: () => void;
  leadName: string;
  onVoiceCommand?: (command: string) => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  enabled, 
  onToggle, 
  leadName, 
  onVoiceCommand 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { trackClick } = useUsageTracking();

  // Check microphone permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permitted = await voiceService.requestMicrophonePermission();
        setHasPermission(permitted);
      } catch (error) {
        console.error('Permission check failed:', error);
        setHasPermission(false);
      }
    };

    if (enabled) {
      checkPermission();
    }
  }, [enabled]);

  const handleVoiceCommand = async () => {
    if (!enabled) {
      toast.error('Voice mode is disabled. Enable it first.');
      return;
    }

    if (hasPermission === false) {
      toast.error('Microphone permission is required for voice commands.');
      return;
    }

    if (isListening) {
      // Stop listening
      await stopListening();
    } else {
      // Start listening
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      trackClick('voice_command', 'start');
      
      const started = await voiceService.startRecording();
      if (!started) {
        setIsListening(false);
        return;
      }

      toast.info(`Listening for voice commands about ${leadName}...`);
      console.log('Voice recording started successfully');

    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
      toast.error('Failed to start voice recording');
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      setIsProcessing(true);
      trackClick('voice_command', 'stop');

      console.log('Stopping voice recording...');
      const audioBlob = await voiceService.stopRecording();
      
      if (!audioBlob || audioBlob.size === 0) {
        toast.warning('No audio recorded. Please try speaking again.');
        setIsProcessing(false);
        return;
      }

      console.log('Processing voice command...');
      toast.info('Processing your voice command...');

      // Process the audio
      const transcription = await voiceService.processAudioCommand(audioBlob, 'current-user');
      
      if (transcription && transcription.trim()) {
        console.log('Voice command transcribed:', transcription);
        toast.success('Voice command processed successfully!');
        
        // Call the callback with the transcribed text
        if (onVoiceCommand) {
          onVoiceCommand(transcription);
        }

        // Generate voice response
        const response = `I heard: "${transcription}". Processing your request about ${leadName}.`;
        await voiceService.generateVoiceResponse(response);
      } else {
        toast.warning('Could not understand the voice command. Please try again.');
      }

    } catch (error) {
      console.error('Voice command processing failed:', error);
      toast.error(error.message || 'Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        voiceService.stopRecording();
      }
    };
  }, [isListening]);

  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    if (!enabled) return 'disabled';
    if (hasPermission === false) return 'no-permission';
    return 'ready';
  };

  const getButtonProps = () => {
    const state = getButtonState();
    
    switch (state) {
      case 'processing':
        return {
          className: 'border-yellow-300 text-yellow-700',
          disabled: true,
          icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />,
          text: 'Processing...'
        };
      case 'listening':
        return {
          className: 'border-red-300 text-red-700 animate-pulse',
          disabled: false,
          icon: <MicOff className="h-4 w-4 mr-1" />,
          text: 'Stop'
        };
      case 'disabled':
        return {
          className: 'border-gray-300 text-gray-500',
          disabled: true,
          icon: <MicOff className="h-4 w-4 mr-1" />,
          text: 'Voice Off'
        };
      case 'no-permission':
        return {
          className: 'border-orange-300 text-orange-700',
          disabled: false,
          icon: <MicOff className="h-4 w-4 mr-1" />,
          text: 'Grant Access'
        };
      default:
        return {
          className: 'border-green-300 text-green-700',
          disabled: false,
          icon: <Mic className="h-4 w-4 mr-1" />,
          text: 'Listen'
        };
    }
  };

  const buttonProps = getButtonProps();

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
          className={buttonProps.className}
          disabled={buttonProps.disabled}
        >
          {buttonProps.icon}
          {buttonProps.text}
        </Button>
      )}
      
      {isListening && (
        <Badge className="bg-red-100 text-red-800 animate-pulse">
          Listening...
        </Badge>
      )}

      {isProcessing && (
        <Badge className="bg-yellow-100 text-yellow-800">
          Processing...
        </Badge>
      )}
    </div>
  );
};

export default VoiceControls;
