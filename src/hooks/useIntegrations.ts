
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const makeCall = async (phoneNumber: string, leadId: string, leadName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-call', {
        body: {
          to: phoneNumber,
          leadId,
          leadName,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        return { success: true, callSid: data.callSid };
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Call error:', error);
      toast.error(`Call failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const sendSMS = async (phoneNumber: string, message: string, leadId: string, leadName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-sms', {
        body: {
          to: phoneNumber,
          message,
          leadId,
          leadName,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        return { success: true, messageSid: data.messageSid };
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('SMS error:', error);
      toast.error(`SMS failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const connectGmail = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-oauth', {
        body: { action: 'getAuthUrl' }
      });

      if (error) throw error;

      if (data.authUrl) {
        window.open(data.authUrl, '_blank', 'width=500,height=600');
        return { success: true, authUrl: data.authUrl };
      } else {
        throw new Error('Failed to get auth URL');
      }
    } catch (error: any) {
      console.error('Gmail connection error:', error);
      toast.error(`Gmail connection failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (to: string, subject: string, body: string, leadId: string, leadName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-send', {
        body: {
          to,
          subject,
          body,
          leadId,
          leadName
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        return { success: true, messageId: data.messageId };
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Email error:', error);
      toast.error(`Email failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleCalendarEvent = async (eventDetails: {
    summary: string;
    description: string;
    start: string;
    end: string;
    attendees: string[];
  }, leadId: string, leadName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'create',
          event: eventDetails,
          leadId,
          leadName
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(data.message);
        return { success: true, eventId: data.eventId };
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Calendar error:', error);
      toast.error(`Meeting scheduling failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const generateVoice = async (text: string, voiceId?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice', {
        body: { text, voiceId }
      });

      if (error) throw error;

      return { success: true, audioData: data };
    } catch (error: any) {
      console.error('Voice generation error:', error);
      toast.error(`Voice generation failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makeCall,
    sendSMS,
    connectGmail,
    sendEmail,
    scheduleCalendarEvent,
    generateVoice,
    isLoading
  };
};
