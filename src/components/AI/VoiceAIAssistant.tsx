
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Brain, Loader2 } from 'lucide-react';
import { enhancedVoiceService } from '@/services/ai/enhancedVoiceService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface VoiceAIAssistantProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  context: {
    workspace: string;
    currentLead?: any;
    isCallActive?: boolean;
  };
}

const VoiceAIAssistant: React.FC<VoiceAIAssistantProps> = ({ 
  isActive, 
  onToggle, 
  context 
}) => {
  const { user, profile } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [assistantName] = useState('Jarvis');

  useEffect(() => {
    enhancedVoiceService.setAssistantName(assistantName);
  }, [assistantName]);

  const startListening = async () => {
    if (!user?.id || !profile?.company_id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setIsListening(true);
      const success = await enhancedVoiceService.startListening(user.id, profile.company_id);
      
      if (!success) {
        setIsListening(false);
        toast.error('Failed to start voice recognition');
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      toast.error('Voice recognition error');
    }
  };

  const stopListening = async () => {
    try {
      const command = await enhancedVoiceService.stopListening();
      setIsListening(false);

      if (command && user?.id && profile?.company_id) {
        setLastCommand(command.transcript);
        
        // Process the command
        setIsSpeaking(true);
        const response = await enhancedVoiceService.processVoiceCommand(
          command,
          user.id,
          profile.company_id,
          context
        );

        // Handle any actions
        if (response.action) {
          handleVoiceAction(response.action);
        }

        setIsSpeaking(false);
        toast.success('Command processed successfully');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      setIsListening(false);
      setIsSpeaking(false);
      toast.error('Failed to process voice command');
    }
  };

  const handleVoiceAction = (action: { type: string; data: any }) => {
    switch (action.type) {
      case 'initiate_call':
        toast.info(`Initiating call to ${action.data.contactName || 'contact'}`);
        break;
      case 'open_email_composer':
        toast.info('Opening email composer');
        break;
      case 'open_calendar':
        toast.info('Opening calendar');
        break;
      case 'show_priorities':
        toast.info('Showing daily priorities');
        break;
      case 'show_error':
        toast.error(action.data.message);
        break;
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else if (isActive) {
      startListening();
    }
    onToggle(!isActive);
  };

  const getStatusColor = () => {
    if (isSpeaking) return 'bg-blue-500 animate-pulse';
    if (isListening) return 'bg-red-500 animate-pulse';
    if (isActive) return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (isSpeaking) return 'Speaking';
    if (isListening) return 'Listening';
    if (isActive) return 'Ready';
    return 'Inactive';
  };

  return (
    <div className="flex items-center gap-3">
      {/* Voice Indicator */}
      <Card className="p-2">
        <CardContent className="flex items-center gap-3 p-0">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">{assistantName}</span>
            <Badge variant="outline" className="text-xs">
              {getStatusText()}
            </Badge>
          </div>
          
          {isSpeaking && (
            <div className="flex items-center gap-1">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <Loader2 className="h-3 w-3 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Control Button */}
      <Button
        onClick={toggleVoice}
        variant={isActive ? "default" : "outline"}
        size="sm"
        className={`${
          isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' :
          isSpeaking ? 'bg-blue-600 hover:bg-blue-700' :
          'bg-purple-600 hover:bg-purple-700'
        }`}
        disabled={isSpeaking}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        <span className="ml-2">
          {isListening ? 'Stop' : 
           isSpeaking ? 'Speaking...' : 
           `Hey ${assistantName}`}
        </span>
      </Button>

      {/* Last Command Display */}
      {lastCommand && (
        <div className="text-xs text-gray-500 max-w-xs truncate">
          Last: "{lastCommand}"
        </div>
      )}
    </div>
  );
};

export default VoiceAIAssistant;
