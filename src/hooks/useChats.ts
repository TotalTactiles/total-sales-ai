
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Chat {
  id: string;
  name: string | null;
  type: 'direct' | 'group';
  participants: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  company_id: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  reply_to: string | null;
  is_edited: boolean;
  edited_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchChats = async () => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('company_id', profile.company_id)
        .contains('participants', [user.id])
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (participantIds: string[], name?: string) => {
    if (!user || !profile) return null;

    try {
      const chatData = {
        name,
        type: participantIds.length > 2 ? 'group' : 'direct',
        participants: [user.id, ...participantIds],
        created_by: user.id,
        company_id: profile.company_id
      };

      const { data, error } = await supabase
        .from('chats')
        .insert(chatData)
        .select()
        .single();

      if (error) throw error;
      
      await fetchChats();
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user && profile) {
      fetchChats();
    }
  }, [user, profile]);

  return {
    chats,
    loading,
    fetchChats,
    createChat
  };
};
