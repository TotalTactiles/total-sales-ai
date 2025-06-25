
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Settings,
  Play,
  Pause
} from 'lucide-react';

interface ContextAwareVoiceAssistantProps {
  className?: string;
}

const ContextAwareVoiceAssistant: React.FC<ContextAwareVoiceAssistantProps> = ({ className = '' }) => {
  const { profile } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentInput, setCurrentInput] = useState('');

  // Early return if no profile
  if (!profile) {
    return null;
  }

  const assistantName = profile.assistant_name || 'AI Assistant';
  const voiceStyle = profile.voice_style || 'professional';

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start listening logic here
      console.log('Started listening with assistant:', assistantName);
    } else {
      // Stop listening logic here
      console.log('Stopped listening');
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      // Start speaking logic here
      console.log('Started speaking with voice style:', voiceStyle);
    } else {
      // Stop speaking logic here
      console.log('Stopped speaking');
    }
  };

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      setIsListening(false);
      setIsSpeaking(false);
    }
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>{assistantName}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {voiceStyle}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Voice Assistant</span>
          <Button
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleEnabled}
            className="flex items-center gap-2"
          >
            {isEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {isEnabled && (
          <>
            {/* Voice Controls */}
            <div className="flex gap-2">
              <Button
                variant={isListening ? "destructive" : "secondary"}
                size="sm"
                onClick={toggleListening}
                disabled={!isEnabled}
                className="flex-1"
              >
                {isListening ? <MicOff className="h-3 w-3 mr-1" /> : <Mic className="h-3 w-3 mr-1" />}
                {isListening ? 'Stop' : 'Listen'}
              </Button>

              <Button
                variant={isSpeaking ? "destructive" : "secondary"}
                size="sm"
                onClick={toggleSpeaking}
                disabled={!isEnabled}
                className="flex-1"
              >
                {isSpeaking ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                {isSpeaking ? 'Stop' : 'Speak'}
              </Button>
            </div>

            {/* Status Display */}
            {(isListening || isSpeaking) && (
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-700 font-medium">
                  {isListening && 'Listening...'}
                  {isSpeaking && 'Speaking...'}
                </div>
                {currentInput && (
                  <div className="text-xs text-gray-600 mt-1">
                    "{currentInput}"
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            <div className="pt-2 border-t">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-3 w-3 mr-2" />
                Voice Settings
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContextAwareVoiceAssistant;
