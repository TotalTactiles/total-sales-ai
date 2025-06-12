
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const RelevanceAPISettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected' | 'error'>('unknown');
  const [usageStats, setUsageStats] = useState<any>(null);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('relevance_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      testConnection(savedKey);
    }
  }, []);

  const testConnection = async (key?: string) => {
    const testKey = key || apiKey;
    if (!testKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('unknown');

    try {
      // Test connection to Relevance AI
      const response = await fetch('https://api-bcbe36.stack.tryrelevance.com/latest/health', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${testKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsConnected(true);
        setConnectionStatus('connected');
        localStorage.setItem('relevance_api_key', testKey);
        
        // Get usage stats
        try {
          const usageResponse = await fetch('https://api-bcbe36.stack.tryrelevance.com/latest/usage', {
            headers: {
              'Authorization': `Bearer ${testKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (usageResponse.ok) {
            const usage = await usageResponse.json();
            setUsageStats(usage);
          }
        } catch (usageError) {
          console.warn('Could not fetch usage stats:', usageError);
        }

        toast.success('Successfully connected to Relevance AI!');
      } else {
        setIsConnected(false);
        setConnectionStatus('error');
        toast.error('Invalid API key or connection failed');
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('error');
      toast.error('Failed to connect to Relevance AI');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const disconnect = () => {
    setApiKey('');
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setUsageStats(null);
    localStorage.removeItem('relevance_api_key');
    toast.info('Disconnected from Relevance AI');
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Failed';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Relevance AI Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Live' : 'Mock Mode'}
          </Badge>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Relevance AI API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={() => testConnection()}
              disabled={isTestingConnection || !apiKey.trim()}
            >
              {isTestingConnection ? 'Testing...' : 'Test'}
            </Button>
          </div>
        </div>

        {/* Usage Stats */}
        {usageStats && isConnected && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Usage Statistics</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {usageStats.requestsUsed || 0}
                </div>
                <div className="text-sm text-blue-600">Requests Used</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {usageStats.requestsLimit || 1000}
                </div>
                <div className="text-sm text-green-600">Monthly Limit</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isConnected ? (
            <Button variant="destructive" onClick={disconnect}>
              Disconnect
            </Button>
          ) : (
            <Button 
              onClick={() => testConnection()}
              disabled={isTestingConnection || !apiKey.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Connect to Relevance AI
            </Button>
          )}
        </div>

        {/* Help Text */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Get your API key from the Relevance AI dashboard. Once connected, 
            all AI agents will use live API calls instead of mock responses.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default RelevanceAPISettings;
