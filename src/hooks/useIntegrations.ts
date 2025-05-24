
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const connectGmail = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gmail-oauth', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      // Open OAuth window
      if (data?.authUrl) {
        window.open(data.authUrl, 'gmail-auth', 'width=500,height=600');
        return { success: true };
      }

      return { success: false, error: 'No auth URL received' };
    } catch (error) {
      console.error('Gmail connection error:', error);
      toast.error('Failed to connect Gmail');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (
    to: string, 
    subject: string, 
    body: string, 
    leadId: string, 
    leadName: string
  ) => {
    if (!user?.id) {
      toast.error('Authentication required');
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-lead-email', {
        body: {
          to,
          subject,
          body,
          leadId,
          leadName,
          userId: user.id
        }
      });

      if (error) throw error;

      return { 
        success: true, 
        messageId: data?.emailId,
        emailId: data?.emailId 
      };
    } catch (error) {
      console.error('Email send error:', error);
      toast.error('Failed to send email');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connectGmail,
    sendEmail,
    isLoading
  };
};
