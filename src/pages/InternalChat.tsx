
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatThread from '@/components/chat/ChatThread';
import ChatRightPanel from '@/components/chat/ChatRightPanel';
import { Chat, Message } from '@/types/chat';
import { MessageSquare } from 'lucide-react';

const InternalChat: React.FC = () => {
  const { user, profile } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Load user chats
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        const { data, error } = await supabase
          .from('chats')
          .select(`
            *,
            messages:messages(
              id,
              content,
              created_at,
              sender_id,
              message_type
            )
          `)
          .contains('participants', [user.id])
          .order('last_message_at', { ascending: false });

        if (error) throw error;
        setChats(data || []);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chats' },
        () => loadChats()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Load messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', activeChat.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`messages-${activeChat.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `chat_id=eq.${activeChat.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChat]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Chat List */}
      <div className="w-72 border-r border-border bg-card">
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onChatSelect={setActiveChat}
          currentUser={user}
          userProfile={profile}
        />
      </div>

      {/* Middle - Active Chat Thread */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <ChatThread
            chat={activeChat}
            messages={messages}
            currentUser={user}
            onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
            showRightPanel={showRightPanel}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No chat selected</h3>
              <p className="text-sm">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Files, Links, etc. */}
      {showRightPanel && activeChat && (
        <div className="w-80 border-l border-border bg-card">
          <ChatRightPanel chatId={activeChat.id} />
        </div>
      )}
    </div>
  );
};

export default InternalChat;
