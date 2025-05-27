
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface VoicePermissionState {
  permissionState: 'granted' | 'denied' | 'prompt' | 'unknown';
  microphoneSupported: boolean;
  speechRecognitionSupported: boolean;
  isCheckingPermissions: boolean;
  error: string | null;
}

export const useVoicePermissions = () => {
  const [state, setState] = useState<VoicePermissionState>({
    permissionState: 'unknown',
    microphoneSupported: false,
    speechRecognitionSupported: false,
    isCheckingPermissions: false,
    error: null
  });

  // Check initial capabilities
  useEffect(() => {
    const checkCapabilities = async () => {
      setState(prev => ({ ...prev, isCheckingPermissions: true }));

      try {
        // Check speech recognition support
        const speechSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
        
        // Check microphone support
        const micSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        
        setState(prev => ({
          ...prev,
          microphoneSupported: micSupported,
          speechRecognitionSupported: speechSupported,
          error: !speechSupported ? 'Speech recognition not supported in this browser' : 
                 !micSupported ? 'Microphone access not supported' : null
        }));

        if (speechSupported && micSupported) {
          await checkMicrophonePermission();
        }
      } catch (error) {
        console.error('Error checking voice capabilities:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to check voice capabilities'
        }));
      } finally {
        setState(prev => ({ ...prev, isCheckingPermissions: false }));
      }
    };

    checkCapabilities();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setState(prev => ({ ...prev, permissionState: permission.state }));
        
        permission.onchange = () => {
          setState(prev => ({ ...prev, permissionState: permission.state }));
        };
      }
    } catch (error) {
      console.warn('Could not check microphone permission:', error);
      setState(prev => ({ ...prev, permissionState: 'unknown' }));
    }
  };

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, error: null, isCheckingPermissions: true }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setState(prev => ({ ...prev, permissionState: 'granted' }));
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      toast.success('Microphone access granted! Voice features are now available.');
      return true;
      
    } catch (error: any) {
      console.error('Microphone permission denied:', error);
      
      let errorMessage = 'Microphone access denied. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone access in your browser settings and reload the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Microphone is being used by another application.';
      } else {
        errorMessage += 'Please check your microphone settings.';
      }
      
      setState(prev => ({ 
        ...prev, 
        permissionState: 'denied',
        error: errorMessage
      }));
      
      toast.error(errorMessage);
      return false;
    } finally {
      setState(prev => ({ ...prev, isCheckingPermissions: false }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    requestMicrophonePermission,
    clearError,
    checkMicrophonePermission
  };
};
