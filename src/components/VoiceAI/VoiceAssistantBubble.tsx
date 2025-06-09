
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Loader2,
  Play,
  Pause,
  X,
  AlertTriangle,
  Shield,
  Settings
} from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { cn } from '@/lib/utils';

interface VoiceAssistantBubbleProps {
  context?: string;
  workspaceData?: any;
  wakeWord?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const VoiceAssistantBubble: React.FC<VoiceAssistantBubbleProps> = ({
  context = 'general',
  workspaceData,
  wakeWord = 'Hey Jarvis',
  className = '',
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

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
  } = useVoiceInteraction({ wakeWord, context, workspaceData });

  // Auto-expand when listening or processing
  useEffect(() => {
    if (isListening || isProcessing || isSpeaking || error) {
      setIsExpanded(true);
      setShowTranscript(true);
    }
  }, [isListening, isProcessing, isSpeaking, error]);

  // Auto-collapse after response completes
  useEffect(() => {
    if (!isListening && !isProcessing && !isSpeaking && response && !error) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
        setShowTranscript(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isListening, isProcessing, isSpeaking, response, error]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left': return 'bottom-6 left-6';
      case 'top-right': return 'top-6 right-6';
      case 'top-left': return 'top-6 left-6';
      default: return 'bottom-6 right-6';
    }
  };

  const getState = () => {
    if (!microphoneSupported) return 'unsupported';
    if (permissionState === 'denied') return 'permission_denied';
    if (error) return 'error';
    if (isSpeaking) return 'speaking';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    if (isDetecting) return 'detecting';
    if (isWakeWordActive) return 'active';
    return 'inactive';
  };

  const getStateColor = () => {
    switch (getState()) {
      case 'unsupported': return 'bg-gray-400';
      case 'permission_denied': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      case 'speaking': return 'bg-purple-500';
      case 'processing': return 'bg-yellow-500';
      case 'listening': return 'bg-blue-500';
      case 'detecting': return 'bg-cyan-500';
      case 'active': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStateAnimation = () => {
    switch (getState()) {
      case 'listening': return 'animate-pulse';
      case 'detecting': return 'animate-pulse';
      case 'processing': return 'animate-spin';
      case 'speaking': return 'animate-bounce';
      default: return '';
    }
  };

  const getStateIcon = () => {
    switch (getState()) {
      case 'unsupported': return <Settings className="h-8 w-8 text-white" />;
      case 'permission_denied': return <Shield className="h-8 w-8 text-white" />;
      case 'error': return <AlertTriangle className="h-8 w-8 text-white" />;
      case 'processing': return <Loader2 className="h-8 w-8 text-white animate-spin" />;
      case 'speaking': return <Volume2 className="h-8 w-8 text-white" />;
      case 'listening': return <Mic className="h-8 w-8 text-white" />;
      case 'detecting': return <Mic className="h-8 w-8 text-white" />;
      default: return <Brain className="h-8 w-8 text-white" />;
    }
  };

  const getStateBadgeText = () => {
    switch (getState()) {
      case 'unsupported': return 'Unsupported';
      case 'permission_denied': return 'No Access';
      case 'error': return 'Error';
      case 'listening': return 'Listening';
      case 'detecting': return 'Detecting';
      case 'processing': return 'Processing';
      case 'speaking': return 'Speaking';
      case 'active': return 'Active';
      default: return 'Inactive';
    }
  };

  const handleMainButtonClick = () => {
    if (getState() === 'permission_denied') {
      requestMicrophonePermission();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleEnableVoice = async () => {
    await requestMicrophonePermission();
  };

  return (
    <div className={cn(`fixed ${getPositionClasses()} z-50`, className)}>
      {/* Main Voice Bubble */}
      <div className="relative">
        <Button
          onClick={handleMainButtonClick}
          className={cn(
            'relative rounded-full w-16 h-16 p-0 shadow-lg transition-all duration-300',
            getStateColor(),
            getStateAnimation(),
            'hover:scale-110'
          )}
        >
          {getStateIcon()}

          {/* Pulse rings for listening state */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping animation-delay-75" />
            </>
          )}

          {/* Speaking waveform animation */}
          {isSpeaking && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </Button>

        {/* State Badge */}
        <Badge 
          className={cn(
            'absolute -top-2 -right-2 text-xs px-2 py-1 transition-all duration-300',
            error || getState() === 'permission_denied' || getState() === 'unsupported' ? 'bg-red-100 text-red-800' :
            isListening ? 'bg-blue-100 text-blue-800' :
            isProcessing ? 'bg-yellow-100 text-yellow-800' :
            isSpeaking ? 'bg-purple-100 text-purple-800' :
            isDetecting ? 'bg-cyan-100 text-cyan-800' :
            isWakeWordActive ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          )}
        >
          {getStateBadgeText()}
        </Badge>
      </div>

      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="absolute bottom-20 right-0 w-80 shadow-xl border border-slate-200 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Voice Assistant</h3>
              <div className="flex items-center gap-2">
                {microphoneSupported && permissionState === 'granted' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleWakeWord}
                    className={cn(
                      'h-8 w-8 p-0',
                      isWakeWordActive ? 'text-green-600' : 'text-gray-400'
                    )}
                  >
                    {isWakeWordActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Permission/Support Status */}
            {!microphoneSupported && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Voice features are not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.
                </AlertDescription>
              </Alert>
            )}

            {microphoneSupported && permissionState === 'denied' && (
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p>Microphone access is required for voice features.</p>
                  <Button
                    onClick={handleEnableVoice}
                    size="sm"
                    className="w-full"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Enable Microphone
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {microphoneSupported && permissionState === 'prompt' && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p>Click the button below to enable voice features.</p>
                  <Button
                    onClick={handleEnableVoice}
                    size="sm"
                    className="w-full"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Grant Microphone Access
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Wake Word Info - Only show if permissions are granted */}
            {microphoneSupported && permissionState === 'granted' && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  Say "<strong>{wakeWord}</strong>" to activate
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Context: {context}
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="h-6 text-xs"
                  >
                    Dismiss
                  </Button>
                  {permissionState === 'denied' && (
                    <Button
                      onClick={handleEnableVoice}
                      size="sm"
                      className="h-6 text-xs"
                    >
                      Enable Microphone
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Transcript */}
            {(transcript || showTranscript) && permissionState === 'granted' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">You said:</h4>
                <p className="text-sm text-blue-700">
                  {transcript || 'Listening...'}
                </p>
              </div>
            )}

            {/* AI Response */}
            {response && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-2">AI Response:</h4>
                <p className="text-sm text-green-700">{response}</p>
              </div>
            )}

            {/* Manual Controls - Only show if permissions are granted */}
            {microphoneSupported && permissionState === 'granted' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Listen
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceAssistantBubble;
