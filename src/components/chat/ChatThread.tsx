
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Pin, 
  Info, 
  Users,
  Phone,
  Video
} from 'lucide-react';
import { Chat, Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { formatDistanceToNow } from 'date-fns';

interface ChatThreadProps {
  chat: Chat;
  messages: Message[];
  currentUser: any;
  onToggleRightPanel: () => void;
  showRightPanel: boolean;
}

const ChatThread: React.FC<ChatThreadProps> = ({
  chat,
  messages,
  currentUser,
  onToggleRightPanel,
  showRightPanel
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getChatTitle = () => {
    if (chat.name) return chat.name;
    if (chat.type === 'direct') {
      return 'Direct Message';
    }
    return `Group Chat (${chat.participants.length} members)`;
  };

  const getParticipantCount = () => {
    return chat.participants.length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            {chat.type === 'group' ? (
              <Users className="h-5 w-5" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">{getChatTitle()}</h3>
            <p className="text-sm text-muted-foreground">
              {chat.type === 'group' 
                ? `${getParticipantCount()} members` 
                : 'Online'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleRightPanel}
            className={showRightPanel ? 'bg-muted' : ''}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.sender_id === currentUser?.id}
              currentUser={currentUser}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-300"></div>
              </div>
              Someone is typing...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border bg-card">
        <MessageInput 
          chatId={chat.id} 
          currentUser={currentUser}
          onTyping={setIsTyping}
        />
      </div>
    </div>
  );
};

export default ChatThread;
