import { logger } from '@/utils/logger';

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

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
      logger.error('Gmail connection error:', error);
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
      logger.error('Email send error:', error);
      toast.error('Failed to send email');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const makeCall = async (phoneNumber: string, leadId: string, leadName: string) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('twilio-call', {
        body: {
          to: phoneNumber,
          leadId,
          leadName,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.success) {
        return {
          success: true,
          callSid: data.callSid
        };
      }

      return { success: false, error: data?.error || 'Call initiation failed' };
    } catch (error) {
      logger.error('Call initiation error:', error);
      toast.error('Failed to initiate call');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendSMS = async (phoneNumber: string, message: string, leadId: string, leadName: string) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('twilio-sms', {
        body: {
          to: phoneNumber,
          message,
          leadId,
          leadName,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.success) {
        return {
          success: true,
          messageSid: data.messageSid
        };
      }

      return { success: false, error: data?.error || 'SMS failed to send' };
    } catch (error) {
      logger.error('SMS send error:', error);
      toast.error('Failed to send SMS');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleCalendarEvent = async (eventDetails: any, leadId: string, leadName: string) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      // For now, we'll simulate calendar event creation
      // In a real implementation, this would connect to Google Calendar API
      logger.info(`Scheduling calendar event for ${leadName}:`, eventDetails);
      
      // Log the calendar event attempt
      await supabase.from('usage_events').insert({
        user_id: user.id,
        company_id: profile.company_id,
        feature: 'calendar_event',
        action: 'scheduled',
        context: 'lead_communication',
        metadata: { leadId, leadName, eventDetails }
      });

      // Simulate event ID for demo purposes
      const eventId = `event_${Math.random().toString(36).substr(2, 9)}`;
      
      return { 
        success: true, 
        eventId 
      };
    } catch (error) {
      logger.error('Calendar event error:', error);
      toast.error('Failed to schedule meeting');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connectGmail,
    sendEmail,
    makeCall,
    sendSMS,
    scheduleCalendarEvent,
    isLoading
  };
};
