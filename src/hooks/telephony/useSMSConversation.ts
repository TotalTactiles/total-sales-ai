
import { useState, useEffect } from 'react';
import { SMSService, SMSConversation } from '@/services/telephony/smsService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useSMSConversation = (phoneNumber?: string) => {
  const [messages, setMessages] = useState<SMSConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!phoneNumber || !profile?.company_id) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const conversation = await SMSService.getSMSConversation(phoneNumber, profile.company_id);
        setMessages(conversation);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = SMSService.subscribeToSMSConversation(phoneNumber, (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [phoneNumber, profile?.company_id]);

  const sendSMS = async (message: string, leadId?: string) => {
    if (!phoneNumber || !user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await SMSService.sendSMS(
        phoneNumber,
        message,
        user.id,
        profile.company_id,
        leadId
      );

      if (result.success) {
        toast.success('SMS sent successfully');
        return true;
      } else {
        throw new Error(result.error || 'Failed to send SMS');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send SMS';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendSMS
  };
};
