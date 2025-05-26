
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface GmailConnectionStatus {
  connected: boolean;
  email?: string;
  message: string;
  lastChecked?: Date;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  leadId?: string;
  leadName?: string;
  isHtml?: boolean;
}

export const useGmailIntegration = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<GmailConnectionStatus>({
    connected: false,
    message: 'Not connected'
  });

  const checkGmailConnection = useCallback(async (): Promise<GmailConnectionStatus> => {
    if (!user?.id) {
      const status = { connected: false, message: 'User not authenticated' };
      setConnectionStatus(status);
      return status;
    }

    try {
      const { data, error } = await supabase.functions.invoke('gmail-oauth', {
        body: { action: 'checkStatus' }
      });

      if (error) throw error;

      const status = {
        connected: data.connected || false,
        email: data.email,
        message: data.message || 'Unknown status',
        lastChecked: new Date()
      };

      setConnectionStatus(status);
      return status;
    } catch (error) {
      console.error('Failed to check Gmail connection:', error);
      const status = {
        connected: false,
        message: 'Failed to check connection status',
        lastChecked: new Date()
      };
      setConnectionStatus(status);
      return status;
    }
  }, [user?.id]);

  const connectGmail = useCallback(async (): Promise<{ success: boolean; authUrl?: string }> => {
    if (!user?.id) {
      toast.error('User authentication required');
      return { success: false };
    }

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
              setTimeout(() => {
                checkGmailConnection().then((status) => {
                  if (status.connected) {
                    toast.success(`Gmail connected successfully! ${status.email}`);
                    resolve({ success: true });
                  } else {
                    toast.error('Gmail connection was not completed');
                    resolve({ success: false });
                  }
                });
              }, 1000);
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
  }, [user?.id, checkGmailConnection]);

  const sendEmail = useCallback(async (emailData: EmailData) => {
    if (!user?.id) {
      toast.error('User authentication required');
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-send', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          leadId: emailData.leadId,
          leadName: emailData.leadName,
          isHtml: emailData.isHtml || false
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Email sent successfully');
        return { 
          success: true, 
          messageId: data.messageId, 
          threadId: data.threadId 
        };
      }

      throw new Error(data.error || 'Failed to send email');
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast.error(error.message || 'Failed to send email');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const disconnectGmail = useCallback(async () => {
    if (!user?.id) {
      toast.error('User authentication required');
      return { success: false };
    }

    try {
      // Delete tokens from database
      await supabase
        .from('email_tokens')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'gmail');

      // Update profile
      await supabase
        .from('profiles')
        .update({
          email_connected: false,
          email_provider: null,
          email_account: null
        })
        .eq('id', user.id);

      setConnectionStatus({
        connected: false,
        message: 'Disconnected',
        lastChecked: new Date()
      });

      toast.success('Gmail disconnected successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error);
      toast.error('Failed to disconnect Gmail');
      return { success: false };
    }
  }, [user?.id]);

  return {
    isLoading,
    connectionStatus,
    checkGmailConnection,
    connectGmail,
    sendEmail,
    disconnectGmail
  };
};
