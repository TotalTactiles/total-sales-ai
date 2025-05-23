
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";

interface AIInputBarProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

const AIInputBar: React.FC<AIInputBarProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyDown,
  isLoading
}) => {
  return (
    <div className="flex w-full gap-2">
      <Input 
        placeholder="Ask your AI assistant..." 
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 dark:bg-slate-800 dark:text-white"
        disabled={isLoading}
      />
      <Button 
        onClick={handleSendMessage} 
        className="bg-salesCyan hover:bg-salesCyan-dark dark:bg-salesBlue dark:hover:bg-salesBlue-dark"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : (
          <MessageCircle className="h-4 w-4 mr-1" />
        )}
        Send
      </Button>
    </div>
  );
};

export default AIInputBar;
