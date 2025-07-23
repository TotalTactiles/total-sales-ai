
import { useState, useEffect } from 'react';
import { DialerService, DialerCampaign, DialerQueueItem } from '@/services/telephony/dialerService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useDialerCampaign = (campaignId?: string) => {
  const [campaign, setCampaign] = useState<DialerCampaign | null>(null);
  const [queue, setQueue] = useState<DialerQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const queueData = await DialerService.getCampaignQueue(campaignId);
        setQueue(queueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaign data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId]);

  const createCampaign = async (campaignData: Omit<DialerCampaign, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newCampaign = await DialerService.createCampaign({
        ...campaignData,
        company_id: profile.company_id,
        user_id: user.id
      });

      if (newCampaign) {
        setCampaign(newCampaign);
        toast.success('Campaign created successfully');
        return newCampaign;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

    return null;
  };

  const addToQueue = async (leadId: string, phoneNumber: string, priority: number = 1) => {
    if (!campaignId) return false;

    try {
      const queueItem = await DialerService.addToQueue({
        campaign_id: campaignId,
        lead_id: leadId,
        phone_number: phoneNumber,
        priority,
        attempts: 0,
        status: 'pending'
      });

      if (queueItem) {
        setQueue(prev => [...prev, queueItem]);
        toast.success('Lead added to queue');
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add lead to queue';
      setError(errorMessage);
      toast.error(errorMessage);
    }

    return false;
  };

  const startDialing = async () => {
    if (!campaignId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const result = await DialerService.startDialing(campaignId);
      
      if (result.success) {
        toast.success('Auto-dialer started');
        return true;
      } else {
        throw new Error(result.error || 'Failed to start dialer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start dialer';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const pauseDialing = async () => {
    if (!campaignId) return false;

    try {
      const result = await DialerService.pauseDialing(campaignId);
      
      if (result.success) {
        toast.success('Auto-dialer paused');
        return true;
      } else {
        throw new Error(result.error || 'Failed to pause dialer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause dialer';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    campaign,
    queue,
    isLoading,
    error,
    createCampaign,
    addToQueue,
    startDialing,
    pauseDialing
  };
};
