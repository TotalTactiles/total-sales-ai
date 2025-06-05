import { logger } from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Database, Wifi, Mic, Speaker, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { voiceService } from '@/services/ai/voiceService';
import { unifiedAIService } from '@/services/ai/unifiedAIService';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  icon: React.ComponentType<any>;
  lastChecked: Date;
}
const HealthMonitor: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  useEffect(() => {
    runHealthChecks();

    // Run health checks every 5 minutes
    const interval = setInterval(runHealthChecks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  const runHealthChecks = async () => {
    setIsChecking(true);
    const checks: HealthCheck[] = [await checkDatabase(), await checkAIServices(), await checkVoiceCapabilities(), await checkNetworkConnectivity(), await checkBrowserFeatures()];
    setHealthChecks(checks);
    setIsChecking(false);

    // Log health status
    const hasErrors = checks.some(check => check.status === 'error');
    const hasWarnings = checks.some(check => check.status === 'warning');
    logger.info('System Health Check:', {
      overall: hasErrors ? 'error' : hasWarnings ? 'warning' : 'healthy',
      checks: checks.map(c => ({
        name: c.name,
        status: c.status,
        message: c.message
      }))
    });
  };
  const checkDatabase = async (): Promise<HealthCheck> => {
    try {
      const {
        error
      } = await supabase.from('profiles').select('id').limit(1);
      return {
        name: 'Database Connection',
        status: error ? 'error' : 'healthy',
        message: error ? `Database error: ${error.message}` : 'Database connection active',
        icon: Database,
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        name: 'Database Connection',
        status: 'error',
        message: 'Failed to connect to database',
        icon: Database,
        lastChecked: new Date()
      };
    }
  };
  const checkAIServices = async (): Promise<HealthCheck> => {
    try {
      const response = await unifiedAIService.generateResponse('Health check test', 'Reply with just "OK" for health check', 'health_check');
      return {
        name: 'AI Services',
        status: response.response ? 'healthy' : 'warning',
        message: response.response ? `AI services active (${response.source})` : 'AI response incomplete',
        icon: Brain,
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        name: 'AI Services',
        status: 'error',
        message: 'AI services unavailable',
        icon: Brain,
        lastChecked: new Date()
      };
    }
  };
  const checkVoiceCapabilities = async (): Promise<HealthCheck> => {
    try {
      // Check if browser supports required features
      const hasMediaDevices = 'mediaDevices' in navigator;
      const hasGetUserMedia = hasMediaDevices && 'getUserMedia' in navigator.mediaDevices;
      const hasSpeechSynthesis = 'speechSynthesis' in window;
      const hasMediaRecorder = 'MediaRecorder' in window;
      if (!hasGetUserMedia || !hasSpeechSynthesis || !hasMediaRecorder) {
        return {
          name: 'Voice Capabilities',
          status: 'error',
          message: 'Browser lacks required voice features',
          icon: Mic,
          lastChecked: new Date()
        };
      }

      // Check microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        stream.getTracks().forEach(track => track.stop());
        return {
          name: 'Voice Capabilities',
          status: 'healthy',
          message: 'Voice features ready',
          icon: Mic,
          lastChecked: new Date()
        };
      } catch (permissionError) {
        return {
          name: 'Voice Capabilities',
          status: 'warning',
          message: 'Microphone permission needed',
          icon: Mic,
          lastChecked: new Date()
        };
      }
    } catch (error) {
      return {
        name: 'Voice Capabilities',
        status: 'error',
        message: 'Voice system error',
        icon: Mic,
        lastChecked: new Date()
      };
    }
  };
  const checkNetworkConnectivity = async (): Promise<HealthCheck> => {
    try {
      const online = navigator.onLine;
      if (!online) {
        return {
          name: 'Network Connectivity',
          status: 'error',
          message: 'No internet connection',
          icon: Wifi,
          lastChecked: new Date()
        };
      }

      // Test actual connectivity with a quick fetch
      const response = await fetch('https://api.github.com/zen', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return {
        name: 'Network Connectivity',
        status: response.ok ? 'healthy' : 'warning',
        message: response.ok ? 'Network connection stable' : 'Network connection unstable',
        icon: Wifi,
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        name: 'Network Connectivity',
        status: 'warning',
        message: 'Network connectivity issues detected',
        icon: Wifi,
        lastChecked: new Date()
      };
    }
  };
  const checkBrowserFeatures = async (): Promise<HealthCheck> => {
    const features = {
      localStorage: typeof Storage !== 'undefined',
      webGL: (() => {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      })(),
      webWorkers: typeof Worker !== 'undefined',
      notifications: 'Notification' in window,
      clipboard: 'clipboard' in navigator
    };
    const missingFeatures = Object.entries(features).filter(([_, supported]) => !supported).map(([feature]) => feature);
    return {
      name: 'Browser Features',
      status: missingFeatures.length === 0 ? 'healthy' : 'warning',
      message: missingFeatures.length === 0 ? 'All browser features supported' : `Missing: ${missingFeatures.join(', ')}`,
      icon: Speaker,
      lastChecked: new Date()
    };
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return XCircle;
      default:
        return AlertCircle;
    }
  };
  const overallStatus = healthChecks.some(c => c.status === 'error') ? 'error' : healthChecks.some(c => c.status === 'warning') ? 'warning' : 'healthy';
  return <Card className="w-full max-w-md">
      
      
      
    </Card>;
};
export default HealthMonitor;
