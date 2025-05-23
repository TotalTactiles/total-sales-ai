
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Mail, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useEmailConnection } from '@/hooks/useEmailConnection';

const EmailSettingsPanel = () => {
  const { 
    providers, 
    loading, 
    connectProvider, 
    disconnectProvider, 
    refreshConnectionStatus 
  } = useEmailConnection();

  useEffect(() => {
    refreshConnectionStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Email Provider Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Provider Connections
          </CardTitle>
          <CardDescription>
            Connect your email accounts to enable AI-powered email management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.icon}</span>
                <div>
                  <h4 className="font-medium">{provider.name}</h4>
                  {provider.connected && provider.account && (
                    <p className="text-sm text-muted-foreground">{provider.account}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {provider.connected ? (
                  <>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => disconnectProvider(provider.id)}
                      disabled={loading}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="text-gray-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </Badge>
                    <Button 
                      onClick={() => connectProvider(provider.id)}
                      disabled={loading}
                      size="sm"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Connect
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Automation Settings
          </CardTitle>
          <CardDescription>
            Configure how AI should interact with your emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Auto-categorize emails</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically categorize incoming emails using AI
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Smart reply suggestions</h4>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered reply suggestions for emails
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Priority detection</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically detect and flag high-priority emails
                </p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Lead extraction</h4>
                <p className="text-sm text-muted-foreground">
                  Extract potential leads from email conversations
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
          <CardDescription>
            Manage how your email data is processed and stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Data Security
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your email tokens are encrypted and stored securely. We never store email content permanently.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Data retention</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically delete processed email data after 30 days
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Analytics opt-in</h4>
                <p className="text-sm text-muted-foreground">
                  Allow anonymous usage analytics to improve AI performance
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettingsPanel;
