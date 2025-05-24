
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useGmailIntegration } from '@/hooks/useGmailIntegration';

const GmailIntegrationCard: React.FC = () => {
  const { 
    isLoading, 
    connectionStatus, 
    checkGmailConnection, 
    connectGmail 
  } = useGmailIntegration();

  useEffect(() => {
    // Check connection status on component mount
    checkGmailConnection();
  }, []);

  const handleConnect = async () => {
    await connectGmail();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Integration
          {connectionStatus.connected ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="border-orange-500 text-orange-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          {connectionStatus.connected ? (
            <div>
              <p className="font-medium text-green-700">✅ Gmail Connected</p>
              <p>Account: {connectionStatus.email}</p>
              <p className="text-xs mt-1">You can now send emails directly from the platform</p>
            </div>
          ) : (
            <div>
              <p>Connect your Gmail account to send emails directly from the platform.</p>
              <p className="text-xs mt-1">Enables: Email sending, AI email drafts, thread management</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {connectionStatus.connected ? (
            <Button 
              variant="outline" 
              onClick={checkGmailConnection}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Refresh Status
            </Button>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
              Connect Gmail
            </Button>
          )}
        </div>

        {connectionStatus.message && (
          <p className="text-xs text-gray-500">{connectionStatus.message}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GmailIntegrationCard;
