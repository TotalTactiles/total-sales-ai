
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: Date;
  confidence: number;
}

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceLog, setVoiceLog] = useState<VoiceCommand[]>([]);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);

      // Check for "Hey Sam" wake word
      if (transcript.toLowerCase().includes('hey sam')) {
        handleVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
  };

  const handleVoiceCommand = (command: string) => {
    const response = processCommand(command);
    
    const voiceCommand: VoiceCommand = {
      id: Date.now().toString(),
      command: command,
      response: response,
      timestamp: new Date(),
      confidence: 0.95
    };

    setVoiceLog(prev => [voiceCommand, ...prev.slice(0, 9)]);
    
    // Speak the response
    speakResponse(response);
  };

  const processCommand = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('show leads')) {
      return 'Displaying your lead dashboard now';
    } else if (lowerCommand.includes('team performance')) {
      return 'Here are your team performance metrics';
    } else if (lowerCommand.includes('schedule meeting')) {
      return 'Opening calendar to schedule a new meeting';
    } else if (lowerCommand.includes('revenue report')) {
      return 'Generating your latest revenue report';
    } else if (lowerCommand.includes('help')) {
      return 'I can help you with leads, team management, reports, and scheduling. What would you like to do?';
    } else {
      return 'I understand. Let me help you with that request';
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <Card className="max-w-md">
        <CardContent className="p-4 text-center">
          <MicOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Voice recognition is not supported in your browser
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Voice Assistant - "Hey Sam"</h3>
            <Badge variant={isListening ? "default" : "outline"}>
              {isListening ? 'Listening...' : 'Ready'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="sm"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
          </div>

          {transcript && (
            <div className="p-2 bg-muted rounded text-sm">
              <strong>Heard:</strong> {transcript}
            </div>
          )}
        </CardContent>
      </Card>

      {voiceLog.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Command Log
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {voiceLog.map((log) => (
                <div key={log.id} className="border rounded p-2">
                  <div className="text-sm">
                    <strong>Command:</strong> {log.command}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Response:</strong> {log.response}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {log.timestamp.toLocaleTimeString()} 
                    <Badge variant="outline" className="ml-2 text-xs">
                      {Math.round(log.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceAssistant;
