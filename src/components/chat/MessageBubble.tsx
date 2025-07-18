
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pin, 
  MoreVertical, 
  File, 
  Image, 
  Mic, 
  ExternalLink,
  Bot
} from 'lucide-react';
import { Message } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  currentUser: any;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  currentUser
}) => {
  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'text':
        return (
          <div className="break-words">
            {message.content}
          </div>
        );
        
      case 'file':
        return (
          <div className="flex items-center gap-2 p-2 bg-muted rounded border">
            <File className="h-4 w-4" />
            <span className="text-sm">{message.file_name}</span>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        );
        
      case 'image':
        return (
          <div className="max-w-xs">
            <img 
              src={message.file_url} 
              alt={message.file_name}
              className="rounded-lg w-full h-auto"
            />
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
        
      case 'audio':
        return (
          <div className="flex items-center gap-2 p-2 bg-muted rounded">
            <Mic className="h-4 w-4" />
            <span className="text-sm">Voice message</span>
            <audio controls className="max-w-xs">
              <source src={message.file_url} />
            </audio>
          </div>
        );
        
      case 'ai':
        return (
          <div className="flex items-start gap-2">
            <Bot className="h-4 w-4 mt-1 text-blue-500" />
            <div className="break-words">
              {message.content}
            </div>
          </div>
        );
        
      case 'lead_share':
        return (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-700 dark:text-blue-300">Shared Lead</span>
            </div>
            <p className="text-sm">{message.content}</p>
          </div>
        );
        
      default:
        return <span>Unsupported message type</span>;
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex items-start gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        {!isOwnMessage && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 mt-1" />
        )}
        
        {/* Message Content */}
        <div>
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwnMessage
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            {renderMessageContent()}
          </div>
          
          {/* Message Meta */}
          <div className={`flex items-center gap-2 mt-1 px-2 ${isOwnMessage ? 'justify-end' : ''}`}>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
            
            {message.is_pinned && (
              <Pin className="h-3 w-3 text-muted-foreground" />
            )}
            
            {message.edited_at && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        </div>
        
        {/* Message Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
