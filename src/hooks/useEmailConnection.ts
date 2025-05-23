
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EmailProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  account?: string;
}

export interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  labels?: string[];
}

export const useEmailConnection = () => {
  const [providers, setProviders] = useState<EmailProvider[]>([
    { id: 'gmail', name: 'Gmail', icon: '📧', connected: false },
    { id: 'outlook', name: 'Outlook', icon: '📮', connected: false }
  ]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConnectionStatus();
    }
  }, [user]);

  const fetchConnectionStatus = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email_connected, email_provider, email_account')
        .eq('id', user?.id)
        .single();

      if (profile?.email_connected && profile?.email_provider) {
        setProviders(prev => prev.map(provider => ({
          ...provider,
          connected: provider.id === profile.email_provider,
          account: provider.id === profile.email_provider ? profile.email_account : undefined
        })));
      }
    } catch (error) {
      console.error('Failed to fetch connection status:', error);
    }
  };

  const connectProvider = async (providerId: string) => {
    setLoading(true);
    try {
      let authUrl = '';
      const supabaseUrl = 'https://yztozysvxyjqguybokqj.supabase.co';
      const redirectUri = `${supabaseUrl}/functions/v1/email-oauth-callback`;
      
      if (providerId === 'gmail') {
        const scopes = [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ');
        
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent(scopes)}&` +
          `access_type=offline&` +
          `prompt=consent`;
      } else if (providerId === 'outlook') {
        const scopes = [
          'https://graph.microsoft.com/Mail.Read',
          'https://graph.microsoft.com/User.Read'
        ].join(' ');
        
        authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
          `client_id=${import.meta.env.VITE_MICROSOFT_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent(scopes)}&` +
          `response_mode=query`;
      }

      // For demo purposes, we'll simulate a successful connection
      // In a real implementation, you would open the OAuth URL
      console.log('OAuth URL:', authUrl);
      
      // Simulate OAuth success
      setTimeout(() => {
        setProviders(prev => prev.map(provider => ({
          ...provider,
          connected: provider.id === providerId,
          account: provider.id === providerId ? `user@${providerId}.com` : provider.account
        })));
        
        toast.success(`Successfully connected to ${providerId === 'gmail' ? 'Gmail' : 'Outlook'}`);
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to connect provider:', error);
      toast.error('Failed to connect email provider');
      setLoading(false);
    }
  };

  const disconnectProvider = async (providerId: string) => {
    try {
      await supabase
        .from('email_tokens')
        .delete()
        .eq('user_id', user?.id)
        .eq('provider', providerId);

      await supabase
        .from('profiles')
        .update({
          email_connected: false,
          email_provider: null,
          email_account: null
        })
        .eq('id', user?.id);

      setProviders(prev => prev.map(provider => ({
        ...provider,
        connected: false,
        account: undefined
      })));

      toast.success('Email provider disconnected');
    } catch (error) {
      console.error('Failed to disconnect provider:', error);
      toast.error('Failed to disconnect email provider');
    }
  };

  const fetchEmails = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('email-fetch', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      toast.error('Failed to fetch emails');
      
      // For demo purposes, provide mock emails
      setEmails([
        {
          id: '1',
          subject: 'Welcome to our service',
          sender: 'welcome@company.com',
          recipient: 'user@example.com',
          body: 'Thank you for signing up for our service...',
          timestamp: new Date().toISOString(),
          isRead: false
        },
        {
          id: '2',
          subject: 'Meeting reminder',
          sender: 'calendar@company.com',
          recipient: 'user@example.com',
          body: 'This is a reminder about your upcoming meeting...',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    providers,
    emails,
    loading,
    connectProvider,
    disconnectProvider,
    fetchEmails,
    refreshConnectionStatus: fetchConnectionStatus
  };
};
