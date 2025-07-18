
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Pin, Users } from 'lucide-react';
import { Chat } from '@/types/chat';
import NewChatDialog from './NewChatDialog';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  currentUser: any;
  userProfile: any;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onChatSelect,
  currentUser,
  userProfile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.participants.some(p => p.includes(searchTerm.toLowerCase()))
  );

  const pinnedChats = filteredChats.filter(chat => 
    // Logic for pinned chats would go here
    false
  );

  const regularChats = filteredChats.filter(chat => 
    !pinnedChats.includes(chat)
  );

  const getChatName = (chat: Chat) => {
    if (chat.name) return chat.name;
    if (chat.type === 'direct') {
      // For direct chats, show the other participant's name
      const otherParticipant = chat.participants.find(p => p !== currentUser?.id);
      return otherParticipant ? `Direct Chat` : 'You';
    }
    return `Group Chat (${chat.participants.length})`;
  };

  const getLastMessagePreview = (chat: Chat) => {
    // Placeholder - would get from messages
    return 'Last message preview...';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button 
            size="sm" 
            onClick={() => setShowNewChat(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Pinned Chats */}
          {pinnedChats.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                <Pin className="h-3 w-3" />
                PINNED
              </div>
              {pinnedChats.map(chat => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChat?.id === chat.id}
                  onClick={() => onChatSelect(chat)}
                  chatName={getChatName(chat)}
                  lastMessage={getLastMessagePreview(chat)}
                  isPinned
                />
              ))}
            </div>
          )}

          {/* Recent Chats */}
          <div className="mb-2">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
              RECENT
            </div>
            {regularChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={() => onChatSelect(chat)}
                chatName={getChatName(chat)}
                lastMessage={getLastMessagePreview(chat)}
              />
            ))}
          </div>

          {filteredChats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {showNewChat && (
        <NewChatDialog
          isOpen={showNewChat}
          onClose={() => setShowNewChat(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  chatName: string;
  lastMessage: string;
  isPinned?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onClick,
  chatName,
  lastMessage,
  isPinned
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted'
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          {chat.type === 'group' ? (
            <Users className="h-5 w-5" />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-sm truncate">{chatName}</h3>
          <div className="flex items-center gap-1">
            {isPinned && <Pin className="h-3 w-3" />}
            <span className="text-xs opacity-70">
              {chat.last_message_at && formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        <p className="text-xs opacity-70 truncate">{lastMessage}</p>
      </div>
    </div>
  );
};

export default ChatSidebar;
