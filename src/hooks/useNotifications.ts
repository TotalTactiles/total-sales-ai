
import { useState, useEffect } from 'react';
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

interface Notification {
  id: string;
  type: 'system' | 'lead' | 'task' | 'ai' | 'integration';
  title: string;
  message: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

  const fetchNotifications = async () => {
    if (!user?.id || !profile?.company_id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      logger.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>) => {
    if (!user?.id || !profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          company_id: profile.company_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          metadata: notification.metadata
        })
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev => [data, ...prev]);
      toast.info(notification.title, { description: notification.message });
    } catch (error) {
      logger.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      logger.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id, profile?.company_id]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead
  };
};
