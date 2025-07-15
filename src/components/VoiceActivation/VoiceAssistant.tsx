
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { VoiceInteractionState, VoiceInteractionOptions } from '@/hooks/voice/types';

interface VoiceAssistantProps {
  isActive: boolean;
  onToggle: () => void;
  workspace: string;
  onCommand?: (command: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isActive,
  onToggle,
  workspace,
  onCommand
}) => {
  const [voiceState, setVoiceState] = useState<VoiceInteractionState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isWakeWordActive: false,
    isDetecting: false,
    transcript: '',
    response: '',
    error: null,
    permissionState: 'unknown',
    microphoneSupported: false
  });

  const [isEnabled] = useState(false); // AI features disabled
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setVoiceState(prev => ({ ...prev, microphoneSupported: isSupported }));

    if (isSupported && isActive && isEnabled) {
      initializeSpeechRecognition();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isActive, isEnabled]);

  const initializeSpeechRecognition = () => {
    if (!isEnabled) return; // Skip if AI disabled

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setVoiceState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setVoiceState(prev => ({ ...prev, transcript: fullTranscript }));

      if (finalTranscript) {
        handleVoiceCommand(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      setVoiceState(prev => ({
        ...prev,
        error: `Speech recognition error: ${event.error}`,
        isListening: false
      }));
    };

    recognition.onend = () => {
      setVoiceState(prev => ({ ...prev, isListening: false }));
      
      if (isActive && isEnabled) {
        setTimeout(() => {
          recognition.start();
        }, 1000);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleVoiceCommand = async (command: string) => {
    if (!isEnabled) return; // Skip if AI disabled

    const lowerCommand = command.toLowerCase();
    
    // Check for wake word
    if (lowerCommand.includes('hey sam') || lowerCommand.includes('hello sam')) {
      setVoiceState(prev => ({ ...prev, isWakeWordActive: true }));
      
      // Process the command after wake word
      const actualCommand = lowerCommand.replace(/hey sam|hello sam/g, '').trim();
      if (actualCommand) {
        await processCommand(actualCommand);
      }
      
      // Reset wake word state after processing
      setTimeout(() => {
        setVoiceState(prev => ({ ...prev, isWakeWordActive: false }));
      }, 3000);
    }
  };

  const processCommand = async (command: string) => {
    if (!isEnabled) return; // Skip if AI disabled

    setVoiceState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // Mock response since AI is disabled
      const response = "AI features are currently disabled in demo mode.";
      
      setVoiceState(prev => ({ 
        ...prev, 
        response,
        isProcessing: false 
      }));

      if (onCommand) {
        onCommand(command);
      }

    } catch (error) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Failed to process voice command',
        isProcessing: false
      }));
    }
  };

  const handleToggle = () => {
    if (isActive && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onToggle();
  };

  if (!voiceState.microphoneSupported) {
    return (
      <Card className="w-80 border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="text-center text-yellow-700">
            Voice features not supported in this browser
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-80 transition-all duration-300 ${
      isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={handleToggle}
              disabled={!isEnabled}
              className="flex items-center gap-2"
            >
              {voiceState.isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              {isActive ? 'Active' : 'Inactive'}
            </Button>
            {voiceState.isWakeWordActive && (
              <div className="animate-pulse text-blue-600 text-sm font-medium">
                Listening...
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {voiceState.isSpeaking ? (
              <Volume2 className="h-4 w-4 text-green-500" />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>

        {!isEnabled && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-blue-700 text-sm font-medium">Demo Mode</div>
            <div className="text-blue-600 text-xs mt-1">
              AI features are disabled. Architecture is ready for activation.
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">Current Workspace</div>
            <div className="text-sm text-gray-700 capitalize">{workspace}</div>
          </div>

          {voiceState.transcript && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Last Command</div>
              <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                {voiceState.transcript}
              </div>
            </div>
          )}

          {voiceState.response && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Response</div>
              <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                {voiceState.response}
              </div>
            </div>
          )}

          {voiceState.error && (
            <div>
              <div className="text-xs font-medium text-red-500 mb-1">Error</div>
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {voiceState.error}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Status: {voiceState.isListening ? 'Listening' : 'Standby'} • 
            Wake word: "Hey Sam"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
