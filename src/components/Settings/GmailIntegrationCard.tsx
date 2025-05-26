
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, CheckCircle, AlertCircle, Loader2, Send, Clock, Settings } from 'lucide-react';
import { useGmailIntegration } from '@/hooks/useGmailIntegration';

const GmailIntegrationCard: React.FC = () => {
  const { 
    isLoading, 
    connectionStatus, 
    checkGmailConnection, 
    connectGmail,
    disconnectGmail
  } = useGmailIntegration();

  const [emailStats, setEmailStats] = useState({
    sent: 0,
    scheduled: 0,
    automationRules: 0
  });

  useEffect(() => {
    // Check connection status on component mount
    checkGmailConnection();
    
    // Fetch email automation stats
    fetchEmailStats();
  }, [checkGmailConnection]);

  const fetchEmailStats = async () => {
    // This would fetch actual stats from Supabase
    // For now, using mock data
    setEmailStats({
      sent: 45,
      scheduled: 3,
      automationRules: 7
    });
  };

  const handleConnect = async () => {
    await connectGmail();
  };

  const handleDisconnect = async () => {
    await disconnectGmail();
  };

  const handleRefresh = async () => {
    await checkGmailConnection();
    await fetchEmailStats();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gmail Integration & Email Automation
          </div>
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
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="text-sm text-gray-600">
          {connectionStatus.connected ? (
            <div className="space-y-2">
              <p className="font-medium text-green-700">✅ Gmail Connected</p>
              <p>Account: {connectionStatus.email}</p>
              <p className="text-xs">Connected since: {connectionStatus.lastChecked?.toLocaleDateString()}</p>
              <p className="text-xs mt-1 text-blue-600">
                ✨ AI Email Automation Active - Emails can be sent automatically
              </p>
            </div>
          ) : (
            <div>
              <p>Connect your Gmail account to enable AI-powered email automation.</p>
              <p className="text-xs mt-1">
                Features: Auto-drafting, scheduling, sequences, response tracking
              </p>
            </div>
          )}
        </div>

        {/* Email Automation Stats */}
        {connectionStatus.connected && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Email Automation Stats
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Send className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-medium">{emailStats.sent}</p>
                  <p className="text-xs text-gray-600">Emails Sent</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                  <p className="text-sm font-medium">{emailStats.scheduled}</p>
                  <p className="text-xs text-gray-600">Scheduled</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Settings className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-sm font-medium">{emailStats.automationRules}</p>
                  <p className="text-xs text-gray-600">Auto Rules</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {connectionStatus.connected ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Refresh Status
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={isLoading}
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
              Connect Gmail & Enable Automation
            </Button>
          )}
        </div>

        {/* Connection Message */}
        {connectionStatus.message && (
          <p className="text-xs text-gray-500 border-t pt-3">
            Status: {connectionStatus.message}
          </p>
        )}

        {/* AI Features Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 font-medium">🤖 AI Email Features</p>
          <p className="text-xs text-blue-700 mt-1">
            Once connected, the AI will automatically draft emails, schedule follow-ups, 
            and create personalized sequences based on lead behavior and engagement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GmailIntegrationCard;
