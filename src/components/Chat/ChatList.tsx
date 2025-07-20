
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageCircle, X } from 'lucide-react';
import { useChats, Chat } from '@/hooks/useChats';
import { useCompanyUsers } from '@/hooks/useCompanyUsers';
import { format } from 'date-fns';

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  onClose: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, onClose }) => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const { chats, loading, createChat } = useChats();
  const { users } = useCompanyUsers();

  const handleCreateChat = async (userId: string) => {
    const chat = await createChat([userId]);
    if (chat) {
      onSelectChat(chat);
      setShowNewChatModal(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getChatDisplayName = (chat: Chat) => {
    if (chat.name) return chat.name;
    if (chat.type === 'direct') return 'Direct Chat';
    return `Group Chat (${chat.participants.length})`;
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Team Chat
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewChatModal(true)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-gray-500">Loading chats...</div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <MessageCircle className="h-8 w-8 text-gray-400 mb-2" />
            <div className="text-sm text-gray-500 text-center">
              No chats yet. Start a conversation with your team!
            </div>
          </div>
        ) : (
          <div className="p-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className="w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {getInitials(getChatDisplayName(chat))}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {getChatDisplayName(chat)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(chat.last_message_at), 'MMM d, HH:mm')}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="absolute inset-0 bg-white rounded-lg">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-semibold text-sm">Start New Chat</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewChatModal(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleCreateChat(user.id)}
                  className="w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.full_name}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.role.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ChatList;
