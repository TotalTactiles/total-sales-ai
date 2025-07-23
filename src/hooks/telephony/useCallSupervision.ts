
import { useState, useEffect } from 'react';
import { CallSupervisionService, CallSupervision } from '@/services/telephony/callSupervisionService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCallSupervision = (sessionId?: string) => {
  const [supervisions, setSupervisions] = useState<CallSupervision[]>([]);
  const [activeSupervision, setActiveSupervision] = useState<CallSupervision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (sessionId) {
      fetchSupervisions();
      
      // Subscribe to supervision changes
      const channel = CallSupervisionService.subscribeToSupervision(sessionId, (supervision) => {
        setSupervisions(prev => {
          const existing = prev.find(s => s.id === supervision.id);
          if (existing) {
            return prev.map(s => s.id === supervision.id ? supervision : s);
          }
          return [...prev, supervision];
        });
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [sessionId]);

  const fetchSupervisions = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const data = await CallSupervisionService.getActiveSupervisions(sessionId);
      setSupervisions(data);
      setActiveSupervision(data.find(s => s.supervisor_id === user?.id && !s.ended_at) || null);
    } catch (error) {
      toast.error('Failed to fetch supervisions');
    } finally {
      setIsLoading(false);
    }
  };

  const startSupervision = async (type: 'listen' | 'whisper' | 'barge') => {
    if (!sessionId || !user?.id) return;

    setIsLoading(true);
    try {
      const supervision = await CallSupervisionService.startSupervision(sessionId, user.id, type);
      if (supervision) {
        setActiveSupervision(supervision);
        toast.success(`Started ${type} supervision`);
      }
    } catch (error) {
      toast.error(`Failed to start ${type} supervision`);
    } finally {
      setIsLoading(false);
    }
  };

  const endSupervision = async () => {
    if (!activeSupervision) return;

    setIsLoading(true);
    try {
      const success = await CallSupervisionService.endSupervision(activeSupervision.id);
      if (success) {
        setActiveSupervision(null);
        toast.success('Supervision ended');
        fetchSupervisions();
      }
    } catch (error) {
      toast.error('Failed to end supervision');
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotes = async (notes: string) => {
    if (!activeSupervision) return;

    try {
      const success = await CallSupervisionService.updateSupervisionNotes(activeSupervision.id, notes);
      if (success) {
        setActiveSupervision({ ...activeSupervision, notes });
        toast.success('Notes updated');
      }
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const canSupervise = user?.id && !activeSupervision;

  return {
    supervisions,
    activeSupervision,
    isLoading,
    canSupervise,
    startSupervision,
    endSupervision,
    updateNotes,
    refetch: fetchSupervisions
  };
};
