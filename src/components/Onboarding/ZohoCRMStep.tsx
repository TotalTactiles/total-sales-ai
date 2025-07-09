
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { zohoCRMIntegration } from '@/services/integrations/zohoCRM';

interface ZohoCRMStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const ZohoCRMStep: React.FC<ZohoCRMStepProps> = ({ onNext, onSkip }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const result = await zohoCRMIntegration.connect();
      
      if (result.success && result.authUrl) {
        // Open Zoho OAuth in a popup
        const popup = window.open(
          result.authUrl, 
          'zoho-auth', 
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Listen for the popup to close or send a message
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Check connection status after popup closes
            checkConnectionStatus();
          }
        }, 1000);

        toast.success('Zoho authentication window opened');
      } else {
        throw new Error(result.error || 'Failed to initiate Zoho connection');
      }
    } catch (error: any) {
      setConnectionError(error.message);
      toast.error('Failed to connect to Zoho CRM');
    } finally {
      setIsConnecting(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const status = await zohoCRMIntegration.getStatus();
      if (status.connected) {
        setIsConnected(true);
        toast.success('Zoho CRM connected successfully!');
        
        // Start initial sync
        const syncResult = await zohoCRMIntegration.syncLeads(true);
        if (syncResult.success) {
          toast.success(`Initial sync completed: ${syncResult.synced} leads imported`);
        }
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-8 w-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">
            Z
          </div>
          Connect Your Zoho CRM
        </CardTitle>
        <p className="text-muted-foreground">
          Sync your existing leads and streamline your sales process by connecting your Zoho CRM account.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="font-medium">
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          {isConnected && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <h4 className="font-medium">What you'll get:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Automatic lead import from your Zoho CRM
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Real-time bidirectional sync of lead updates
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              AI-enhanced lead scoring and insights
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Unified sales pipeline management
            </li>
          </ul>
        </div>

        {/* Error Display */}
        {connectionError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Connection failed</p>
              <p>{connectionError}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="flex-1"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Zoho CRM
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleContinue} className="flex-1">
              Continue Setup
            </Button>
          )}
          
          <Button variant="outline" onClick={onSkip}>
            Skip for Now
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
          <p className="font-medium mb-1">Need help?</p>
          <p>
            You'll need admin access to your Zoho CRM account to complete this connection. 
            You can always connect later from your integrations settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZohoCRMStep;
