
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2,
  Circle,
  Square
} from 'lucide-react';
import { toast } from 'sonner';
import { assistantVoiceService } from '@/services/ai/assistantVoiceService';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Lead } from '@/types/lead';

interface VoiceAssistantProps {
  lead: Lead;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  onVoiceCommand: (command: string) => void;
  onActionExecute?: (action: { type: string; data: any }) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  lead,
  voiceEnabled,
  onVoiceToggle,
  onVoiceCommand,
  onActionExecute
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [listeningMode, setListeningMode] = useState<'passive' | 'active'>('passive');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [voiceHistory, setVoiceHistory] = useState<Array<{
    timestamp: string;
    command: string;
    response: string;
    success: boolean;
  }>>([]);

  const { trackEvent } = useUsageTracking();

  useEffect(() => {
    // Set lead context when component mounts or lead changes
    assistantVoiceService.setLeadContext(lead);
    assistantVoiceService.setCommandCallback(onVoiceCommand);
  }, [lead, onVoiceCommand]);

  const handleVoiceToggle = () => {
    onVoiceToggle();
    if (!voiceEnabled) {
      toast.success('Voice mode activated. Say "Hey TSAM" or use push-to-talk.');
    } else {
      toast.info('Voice mode deactivated.');
      if (isListening) {
        stopListening();
      }
    }
  };

  const startListening = async () => {
    if (!voiceEnabled) {
      toast.error('Voice mode is disabled. Enable it first.');
      return;
    }

    try {
      setIsListening(true);
      trackEvent({
        feature: 'voice_assistant',
        action: 'start_listening',
        context: 'lead_intelligence',
        metadata: { leadId: lead.id, mode: listeningMode }
      });

      const started = await assistantVoiceService.startListening();
      if (!started) {
        setIsListening(false);
        toast.error('Failed to start voice recording');
        return;
      }

      toast.info(`Listening for voice commands${listeningMode === 'passive' ? ' (say "Hey TSAM")' : ''}...`);
    } catch (error) {
      setIsListening(false);
      toast.error('Failed to start voice recording');
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      setIsProcessing(true);

      const command = await assistantVoiceService.stopListening();
      
      if (!command) {
        toast.warning('No voice command detected. Please try again.');
        setIsProcessing(false);
        return;
      }

      setLastCommand(command.transcript);
      toast.info('Processing voice command...');

      // Execute the voice command
      const response = await assistantVoiceService.executeVoiceCommand(command);
      
      // Add to voice history
      const historyEntry = {
        timestamp: new Date().toLocaleTimeString(),
        command: command.transcript,
        response: response.text,
        success: response.success
      };
      setVoiceHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10

      if (response.success) {
        toast.success('Voice command executed successfully');
        
        // Execute action if provided
        if (response.action && onActionExecute) {
          onActionExecute(response.action);
        }
      } else {
        toast.error('Failed to execute voice command');
      }

      trackEvent({
        feature: 'voice_assistant',
        action: 'command_executed',
        context: 'lead_intelligence',
        metadata: { 
          leadId: lead.id, 
          intent: command.intent,
          success: response.success
        }
      });

    } catch (error) {
      toast.error('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListeningMode = () => {
    setListeningMode(prev => prev === 'passive' ? 'active' : 'passive');
    toast.info(`Switched to ${listeningMode === 'passive' ? 'active' : 'passive'} mode`);
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardContent className="p-3 space-y-3">
        {/* Voice Controls Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleVoiceToggle}
                className="h-8 px-2"
              >
                {voiceEnabled ? (
                  <Volume2 className="h-3 w-3" />
                ) : (
                  <VolumeX className="h-3 w-3" />
                )}
                <span className="ml-1 text-xs">
                  {voiceEnabled ? 'On' : 'Off'}
                </span>
              </Button>
            </div>
            
            {voiceEnabled && (
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer"
                onClick={toggleListeningMode}
              >
                {listeningMode === 'passive' ? 'Wake Word' : 'Push-to-Talk'}
              </Badge>
            )}
          </div>

          {voiceEnabled && (
            <div className="flex items-center gap-1">
              {isProcessing ? (
                <Button disabled size="sm" className="h-8 px-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </Button>
              ) : isListening ? (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={stopListening}
                  className="h-8 px-2 animate-pulse"
                >
                  <Square className="h-3 w-3" />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={startListening}
                  className="h-8 px-2"
                >
                  <Mic className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Voice Status */}
        {voiceEnabled && (
          <div className="text-xs text-center">
            <div className="flex items-center justify-center gap-2">
              <Circle className={`h-2 w-2 ${
                isListening ? 'fill-red-500 text-red-500 animate-pulse' : 
                voiceEnabled ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
              }`} />
              <span className="text-slate-600">
                {isProcessing ? 'Processing...' : 
                 isListening ? 'Listening...' : 
                 'Ready for voice commands'}
              </span>
            </div>
            
            {listeningMode === 'passive' && (
              <p className="text-slate-500 mt-1">
                Say "Hey TSAM" to activate
              </p>
            )}
          </div>
        )}

        {/* Last Command */}
        {lastCommand && (
          <div className="text-xs bg-white rounded p-2 border">
            <div className="font-medium text-slate-700">Last Command:</div>
            <div className="text-slate-600 italic">"{lastCommand}"</div>
          </div>
        )}

        {/* Voice Command Examples */}
        {voiceEnabled && (
          <div className="text-xs space-y-1">
            <div className="font-medium text-slate-700">Voice Commands:</div>
            <div className="text-slate-500 space-y-0.5">
              <div>• "Update status to qualified"</div>
              <div>• "Add note: Great conversation"</div>
              <div>• "Call {lead.name}"</div>
              <div>• "Remind me to follow up in 3 days"</div>
              <div>• "Analyze this lead"</div>
            </div>
          </div>
        )}

        {/* Voice History (if any) */}
        {voiceHistory.length > 0 && (
          <div className="text-xs">
            <div className="font-medium text-slate-700 mb-1">Recent Commands:</div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {voiceHistory.slice(0, 3).map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-slate-600">
                  <Circle className={`h-1.5 w-1.5 ${
                    entry.success ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500'
                  }`} />
                  <span className="truncate">{entry.command}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
