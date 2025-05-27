
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Mic, 
  Volume2, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TestTube
} from 'lucide-react';
import { toast } from 'sonner';
import { retellAIService } from '@/services/ai/retellAIService';
import { elevenLabsService } from '@/services/ai/elevenLabsService';
import { useVoicePermissions } from '@/hooks/useVoicePermissions';

const VoiceSetupPanel: React.FC = () => {
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [retellEnabled, setRetellEnabled] = useState(false);
  const [elevenLabsEnabled, setElevenLabsEnabled] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  
  const {
    permissionState,
    microphoneSupported,
    speechRecognitionSupported,
    requestMicrophonePermission,
    isCheckingPermissions
  } = useVoicePermissions();

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    // Check Retell AI status
    const retellReady = await retellAIService.initialize();
    setRetellEnabled(retellReady);

    // Check ElevenLabs status
    const elevenLabsReady = await elevenLabsService.initialize();
    setElevenLabsEnabled(elevenLabsReady);

    // Load saved API key
    const savedKey = localStorage.getItem('elevenlabs_api_key');
    if (savedKey) {
      setElevenLabsApiKey(savedKey.slice(0, 8) + '...');
    }
  };

  const handleElevenLabsSetup = async () => {
    if (!elevenLabsApiKey.trim()) {
      toast.error('Please enter your ElevenLabs API key');
      return;
    }

    elevenLabsService.setApiKey(elevenLabsApiKey);
    const initialized = await elevenLabsService.initialize();
    setElevenLabsEnabled(initialized);

    if (initialized) {
      toast.success('ElevenLabs connected successfully!');
      setElevenLabsApiKey(elevenLabsApiKey.slice(0, 8) + '...');
    } else {
      toast.error('Failed to connect to ElevenLabs. Please check your API key.');
    }
  };

  const testVoiceGeneration = async () => {
    setIsTestingVoice(true);
    
    try {
      const audioData = await elevenLabsService.generateSpeech({
        text: "Hello! This is a test of the voice generation system. Everything sounds great!",
        voiceId: '9BWtsMINqrJLrRacOk9x' // Aria voice
      });

      if (audioData && audioData !== 'native_speech_used') {
        // Play the generated audio
        const audio = new Audio(audioData);
        await audio.play();
        toast.success('Voice test completed successfully!');
      } else {
        toast.success('Voice test completed using browser speech synthesis');
      }
    } catch (error) {
      toast.error('Voice test failed');
    } finally {
      setIsTestingVoice(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getPermissionBadge = () => {
    switch (permissionState) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Granted</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      case 'prompt':
        return <Badge className="bg-yellow-100 text-yellow-800">Prompt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Voice System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="text-sm">Microphone</span>
              </div>
              {getStatusIcon(microphoneSupported)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Speech Recognition</span>
              </div>
              {getStatusIcon(speechRecognitionSupported)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm">Retell AI</span>
              </div>
              {getStatusIcon(retellEnabled)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm">ElevenLabs</span>
              </div>
              {getStatusIcon(elevenLabsEnabled)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="text-sm font-medium">Microphone Permission</span>
              <div className="text-xs text-gray-600">Required for voice input</div>
            </div>
            <div className="flex items-center gap-2">
              {getPermissionBadge()}
              {permissionState !== 'granted' && (
                <Button
                  size="sm"
                  onClick={requestMicrophonePermission}
                  disabled={isCheckingPermissions}
                >
                  {isCheckingPermissions ? 'Checking...' : 'Grant Access'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ElevenLabs Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            ElevenLabs Voice Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <div className="text-sm text-blue-800">
              ElevenLabs provides high-quality AI voice generation. 
              <a 
                href="https://elevenlabs.io/app/speech-synthesis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                Get your API key here
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">API Key</label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="password"
                  placeholder="Enter your ElevenLabs API key..."
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  disabled={elevenLabsEnabled}
                />
                <Button
                  onClick={handleElevenLabsSetup}
                  disabled={elevenLabsEnabled || !elevenLabsApiKey.trim()}
                >
                  {elevenLabsEnabled ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </div>

            {elevenLabsEnabled && (
              <Button
                variant="outline"
                onClick={testVoiceGeneration}
                disabled={isTestingVoice}
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTestingVoice ? 'Testing Voice...' : 'Test Voice Generation'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Voice Features Status */}
      <Card>
        <CardHeader>
          <CardTitle>Available Voice Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">AI Conversational Calls</div>
                <div className="text-sm text-gray-600">Autonomous AI agent phone calls</div>
              </div>
              <Switch checked={retellEnabled} disabled />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">High-Quality Voice Synthesis</div>
                <div className="text-sm text-gray-600">ElevenLabs AI voice generation</div>
              </div>
              <Switch checked={elevenLabsEnabled} disabled />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Voice Commands</div>
                <div className="text-sm text-gray-600">Speech-to-text input</div>
              </div>
              <Switch checked={speechRecognitionSupported && permissionState === 'granted'} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceSetupPanel;
