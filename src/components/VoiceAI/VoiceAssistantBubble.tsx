
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { cn } from '@/lib/utils';

interface VoiceAssistantBubbleProps {
  className?: string;
  context?: {
    workspace?: string;
    currentLead?: any;
    isCallActive?: boolean;
  };
}

const VoiceAssistantBubble: React.FC<VoiceAssistantBubbleProps> = ({ 
  className,
  context 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    isListening,
    isProcessing,
    isSpeaking,
    isWakeWordActive,
    isDetecting,
    transcript,
    response,
    error,
    permissionState,
    microphoneSupported,
    startListening,
    stopListening,
    toggleWakeWord,
    clearError,
    requestMicrophonePermission
  } = useVoiceInteraction({
    context: context?.workspace || 'general',
    workspaceData: context
  });

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  if (!microphoneSupported) {
    return (
      <Card className={cn("p-4 bg-red-50 border-red-200", className)}>
        <p className="text-red-600 text-sm">Voice features not supported in this browser</p>
      </Card>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4", className)}>
      <Card className="p-4 bg-white shadow-lg border">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleToggleListening}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className={cn(
              "rounded-full",
              isListening && "animate-pulse"
            )}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button
            onClick={toggleWakeWord}
            variant={isWakeWordActive ? "default" : "outline"}
            size="sm"
          >
            {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
          >
            {isExpanded ? "−" : "+"}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-2">
            {error && (
              <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                {error}
                <Button
                  onClick={clearError}
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  Clear
                </Button>
              </div>
            )}

            {transcript && (
              <div className="text-sm p-2 bg-blue-50 rounded">
                <strong>You said:</strong> {transcript}
              </div>
            )}

            {response && (
              <div className="text-sm p-2 bg-green-50 rounded">
                <strong>AI Response:</strong> {response}
              </div>
            )}

            {isProcessing && (
              <div className="text-sm text-gray-600 p-2">
                Processing your request...
              </div>
            )}

            {permissionState === 'denied' && (
              <div className="text-sm p-2 bg-yellow-50 rounded">
                <p>Microphone access denied.</p>
                <Button
                  onClick={requestMicrophonePermission}
                  variant="outline"
                  size="sm"
                  className="mt-1"
                >
                  Request Permission
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default VoiceAssistantBubble;
