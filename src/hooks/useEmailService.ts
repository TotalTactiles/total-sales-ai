
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Simple logger for client-side
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'sequence' | 'one_off';
}

export const useEmailService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

  const sendTransactionalEmail = async (
    to: string,
    subject: string,
    body: string,
    metadata?: Record<string, any>
  ) => {
    if (!user?.id) {
      toast.error('Authentication required');
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          body,
          metadata,
          userId: user.id
        }
      });

      if (error) throw error;

      toast.success('Email sent successfully');
      return { success: true, data };
    } catch (error) {
      logger.error('Email send error:', error);
      toast.error('Failed to send email');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailSequence = async (
    leadId: string,
    sequenceId: string
  ) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('start-email-sequence', {
        body: {
          leadId,
          sequenceId,
          companyId: profile.company_id,
          userId: user.id
        }
      });

      if (error) throw error;

      toast.success('Email sequence started');
      return { success: true, data };
    } catch (error) {
      logger.error('Email sequence error:', error);
      toast.error('Failed to start email sequence');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendTransactionalEmail,
    sendEmailSequence,
    isLoading
  };
};
