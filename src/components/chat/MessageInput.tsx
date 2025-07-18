
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Smile, 
  ExternalLink,
  Bot
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MessageInputProps {
  chatId: string;
  currentUser: any;
  onTyping: (isTyping: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  currentUser,
  onTyping
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTSAM, setShowTSAM] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      let messageType = 'text';
      let content = message.trim();
      
      // Check if it's a TSAM command
      if (content.startsWith('/Hey TSAM')) {
        messageType = 'ai';
        // Process TSAM command
        await processTSAMCommand(content);
        setMessage('');
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: currentUser.id,
          content,
          message_type: messageType
        });

      if (error) throw error;

      setMessage('');
      onTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const processTSAMCommand = async (command: string) => {
    try {
      // First, send the user's TSAM command
      await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: currentUser.id,
          content: command,
          message_type: 'text'
        });

      // Then simulate TSAM response (you would integrate with actual AI here)
      const tsamResponse = `I understand you asked: "${command.replace('/Hey TSAM ', '')}". This is a placeholder response from TSAM. In production, this would connect to your AI assistant.`;
      
      await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: 'tsam-bot', // Special ID for TSAM
          content: tsamResponse,
          message_type: 'ai'
        });

    } catch (error) {
      console.error('Error processing TSAM command:', error);
      toast.error('Failed to process TSAM command');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Show TSAM suggestions if user types /
    setShowTSAM(value.startsWith('/'));
    
    // Typing indicator logic
    onTyping(value.length > 0);
  };

  return (
    <div className="p-4 space-y-2">
      {/* TSAM Suggestions */}
      {showTSAM && (
        <div className="bg-muted rounded-lg p-2 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-blue-500" />
            <span className="font-medium">TSAM Commands</span>
          </div>
          <div className="space-y-1 text-xs">
            <div 
              className="cursor-pointer hover:bg-background p-1 rounded"
              onClick={() => setMessage('/Hey TSAM summarize this thread')}
            >
              /Hey TSAM summarize this thread
            </div>
            <div 
              className="cursor-pointer hover:bg-background p-1 rounded"
              onClick={() => setMessage('/Hey TSAM suggest a response')}
            >
              /Hey TSAM suggest a response
            </div>
            <div 
              className="cursor-pointer hover:bg-background p-1 rounded"
              onClick={() => setMessage('/Hey TSAM analyze lead data')}
            >
              /Hey TSAM analyze lead data
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... (use /Hey TSAM for AI assistance)"
            className="pr-12 resize-none"
            disabled={isLoading}
          />
          
          {/* Input Actions */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={handleFileUpload}
            >
              <Paperclip className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
            >
              <Smile className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Mic className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>

        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => {
          // Handle file uploads here
          console.log('Files selected:', e.target.files);
        }}
      />
    </div>
  );
};

export default MessageInput;
