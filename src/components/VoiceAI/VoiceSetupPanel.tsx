
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Mic, 
  Volume2, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TestTube,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { retellAIService } from '@/services/ai/retellAIService';
import { elevenLabsService } from '@/services/ai/elevenLabsService';
import { useVoicePermissions } from '@/hooks/useVoicePermissions';

const VoiceSetupPanel: React.FC = () => {
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
  };

  const testVoiceGeneration = async () => {
    setIsTestingVoice(true);
    
    try {
      const audioUrl = await elevenLabsService.generateSpeech(
        "Hello! This is a test of the ElevenLabs voice generation system. Everything sounds great!"
      );

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
        toast.success('ElevenLabs voice test completed successfully!');
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
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Retell AI (Calls)</span>
              </div>
              {getStatusIcon(retellEnabled)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">ElevenLabs (UI Voice)</span>
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

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            Voice Services Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Retell AI - Phone Calls</span>
            </div>
            <p className="text-sm text-blue-700">
              Handles all automated phone calls and conversations with leads. 
              Provides full conversational AI with optimized phone infrastructure.
            </p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">ElevenLabs - UI Voice Feedback</span>
            </div>
            <p className="text-sm text-purple-700">
              Provides high-quality text-to-speech for AI assistant responses, 
              notifications, and UI interactions within the application.
            </p>
          </div>

          {elevenLabsEnabled && (
            <Button
              variant="outline"
              onClick={testVoiceGeneration}
              disabled={isTestingVoice}
              className="w-full"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTestingVoice ? 'Testing ElevenLabs Voice...' : 'Test ElevenLabs Voice'}
            </Button>
          )}
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
                <div className="font-medium">AI Phone Calls (Retell AI)</div>
                <div className="text-sm text-gray-600">Autonomous AI agent phone conversations</div>
              </div>
              <Switch checked={retellEnabled} disabled />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">UI Voice Feedback (ElevenLabs)</div>
                <div className="text-sm text-gray-600">High-quality voice responses in the app</div>
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
