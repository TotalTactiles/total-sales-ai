
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { Chat } from '@/hooks/useChats';

const ChatButton: React.FC = () => {
  const [showChatList, setShowChatList] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const handleCloseChatList = () => {
    setShowChatList(false);
  };

  const handleCloseChatWindow = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowChatList(true)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MessageCircle className="h-5 w-5 text-gray-600" />
      </Button>

      {showChatList && (
        <ChatList onSelectChat={handleSelectChat} onClose={handleCloseChatList} />
      )}

      {selectedChat && (
        <ChatWindow chat={selectedChat} onClose={handleCloseChatWindow} />
      )}
    </>
  );
};

export default ChatButton;
