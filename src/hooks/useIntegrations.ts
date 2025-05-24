
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

  const makeCall = async (phoneNumber: string, leadId: string, leadName: string) => {
    setIsLoading(true);
    
    try {
      // For demo purposes, simulate Twilio call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock call SID
      const callSid = `CA${Math.random().toString(36).substring(2, 15)}`;
      
      // Log the call attempt
      if (user?.id && profile?.company_id) {
        await supabase
          .from('ai_brain_logs')
          .insert({
            company_id: profile.company_id,
            type: 'interaction',
            event_summary: `Call initiated to ${leadName}`,
            payload: { 
              user_id: user.id,
              feature: 'twilio_call',
              action: 'initiate',
              outcome: 'success',
              context: window.location.pathname,
              phoneNumber, 
              leadId, 
              leadName, 
              callSid,
              timestamp: new Date().toISOString() 
            }
          });
      }
      
      return { success: true, callSid };
    } catch (error) {
      console.error('Call failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsLoading(false);
    }
  };

  const sendSMS = async (phoneNumber: string, message: string, leadId: string, leadName: string) => {
    setIsLoading(true);
    
    try {
      // Add Australian compliance text
      const compliantMessage = `${message}\n\nReply STOP to unsubscribe`;
      
      // For demo purposes, simulate Twilio SMS
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock message SID
      const messageSid = `SM${Math.random().toString(36).substring(2, 15)}`;
      
      // Log the SMS
      if (user?.id && profile?.company_id) {
        await supabase
          .from('ai_brain_logs')
          .insert({
            company_id: profile.company_id,
            type: 'interaction',
            event_summary: `SMS sent to ${leadName}`,
            payload: { 
              user_id: user.id,
              feature: 'twilio_sms',
              action: 'send',
              outcome: 'success',
              context: window.location.pathname,
              phoneNumber, 
              message: compliantMessage, 
              leadId, 
              leadName, 
              messageSid,
              timestamp: new Date().toISOString() 
            }
          });
      }
      
      return { success: true, messageSid };
    } catch (error) {
      console.error('SMS failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (to: string, subject: string, body: string, leadId: string, leadName: string) => {
    setIsLoading(true);
    
    try {
      // For demo purposes, simulate Gmail API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock message ID
      const messageId = `${Math.random().toString(36).substring(2, 15)}@gmail.com`;
      
      // Log the email
      if (user?.id && profile?.company_id) {
        await supabase
          .from('ai_brain_logs')
          .insert({
            company_id: profile.company_id,
            type: 'interaction',
            event_summary: `Email sent to ${leadName}`,
            payload: { 
              user_id: user.id,
              feature: 'gmail_send',
              action: 'send',
              outcome: 'success',
              context: window.location.pathname,
              to, 
              subject, 
              bodyLength: body.length, 
              leadId, 
              leadName, 
              messageId,
              timestamp: new Date().toISOString() 
            }
          });
      }
      
      return { success: true, messageId };
    } catch (error) {
      console.error('Email failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleCalendarEvent = async (eventDetails: any, leadId: string, leadName: string) => {
    setIsLoading(true);
    
    try {
      // For demo purposes, simulate Google Calendar API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock event ID
      const eventId = `event_${Math.random().toString(36).substring(2, 15)}`;
      
      // Log the calendar event
      if (user?.id && profile?.company_id) {
        await supabase
          .from('ai_brain_logs')
          .insert({
            company_id: profile.company_id,
            type: 'interaction',
            event_summary: `Calendar event scheduled with ${leadName}`,
            payload: { 
              user_id: user.id,
              feature: 'google_calendar',
              action: 'schedule',
              outcome: 'success',
              context: window.location.pathname,
              eventDetails, 
              leadId, 
              leadName, 
              eventId,
              timestamp: new Date().toISOString() 
            }
          });
      }
      
      return { success: true, eventId };
    } catch (error) {
      console.error('Calendar event failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsLoading(false);
    }
  };

  const connectGmail = async () => {
    setIsLoading(true);
    
    try {
      // For demo purposes, simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In real implementation, this would open OAuth window
      window.open('https://accounts.google.com/oauth/authorize?client_id=demo&scope=gmail', '_blank');
      
      return { success: true };
    } catch (error) {
      console.error('Gmail connection failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makeCall,
    sendSMS,
    sendEmail,
    scheduleCalendarEvent,
    connectGmail,
    isLoading
  };
};
