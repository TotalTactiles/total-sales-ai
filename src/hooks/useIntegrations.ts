
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
            user_id: user.id,
            company_id: profile.company_id,
            log_type: 'interaction',
            feature: 'twilio_call',
            action: 'initiate',
            outcome: 'success',
            context: window.location.pathname,
            metadata: { 
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
            user_id: user.id,
            company_id: profile.company_id,
            log_type: 'interaction',
            feature: 'twilio_sms',
            action: 'send',
            outcome: 'success',
            context: window.location.pathname,
            metadata: { 
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
            user_id: user.id,
            company_id: profile.company_id,
            log_type: 'interaction',
            feature: 'gmail_send',
            action: 'send',
            outcome: 'success',
            context: window.location.pathname,
            metadata: { 
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
    connectGmail,
    isLoading
  };
};
