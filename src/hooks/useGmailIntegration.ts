
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GmailConnectionStatus {
  connected: boolean;
  email?: string;
  message: string;
}

export const useGmailIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<GmailConnectionStatus>({
    connected: false,
    message: 'Not connected'
  });

  const checkGmailConnection = async (): Promise<GmailConnectionStatus> => {
    try {
      const { data, error } = await supabase.functions.invoke('gmail-oauth', {
        body: { action: 'checkStatus' }
      });

      if (error) throw error;

      const status = {
        connected: data.connected || false,
        email: data.email,
        message: data.message || 'Unknown status'
      };

      setConnectionStatus(status);
      return status;
    } catch (error) {
      console.error('Failed to check Gmail connection:', error);
      const status = {
        connected: false,
        message: 'Failed to check connection status'
      };
      setConnectionStatus(status);
      return status;
    }
  };

  const connectGmail = async (): Promise<{ success: boolean; authUrl?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-oauth', {
        body: { action: 'getAuthUrl' }
      });

      if (error) throw error;

      if (data.authUrl) {
        // Open OAuth window
        const authWindow = window.open(
          data.authUrl,
          'gmail-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Monitor for completion
        return new Promise((resolve) => {
          const checkClosed = setInterval(() => {
            if (authWindow?.closed) {
              clearInterval(checkClosed);
              // Check connection status after window closes
              checkGmailConnection().then((status) => {
                if (status.connected) {
                  toast.success(`Gmail connected successfully! ${status.email}`);
                  resolve({ success: true });
                } else {
                  toast.error('Gmail connection was not completed');
                  resolve({ success: false });
                }
              });
            }
          }, 1000);

          // Timeout after 5 minutes
          setTimeout(() => {
            clearInterval(checkClosed);
            if (authWindow && !authWindow.closed) {
              authWindow.close();
            }
            toast.error('Gmail connection timed out');
            resolve({ success: false });
          }, 300000);
        });
      }

      return { success: false };
    } catch (error) {
      console.error('Failed to connect Gmail:', error);
      toast.error('Failed to initiate Gmail connection');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (to: string, subject: string, body: string, leadId?: string, leadName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-send', {
        body: { to, subject, body, leadId, leadName }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        return { success: true, messageId: data.messageId, threadId: data.threadId };
      }

      throw new Error(data.error || 'Failed to send email');
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast.error(error.message || 'Failed to send email');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    connectionStatus,
    checkGmailConnection,
    connectGmail,
    sendEmail
  };
};
