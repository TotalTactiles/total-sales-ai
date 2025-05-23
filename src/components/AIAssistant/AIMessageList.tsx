
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import AIMessage from './AIMessage';

interface AIMessageListProps {
  messages: {
    id: number;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    suggestedActions?: string[];
  }[];
  onSuggestedActionClick: (action: string) => void;
  isLoading: boolean;
}

const AIMessageList: React.FC<AIMessageListProps> = ({ 
  messages, 
  onSuggestedActionClick,
  isLoading 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <AIMessage 
          key={message.id}
          message={message}
          onSuggestedActionClick={onSuggestedActionClick}
        />
      ))}
      {isLoading && (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-br-lg rounded-tl-lg rounded-tr-lg p-3 max-w-[85%] animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-salesCyan rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-salesCyan rounded-full animate-pulse delay-150"></div>
            <div className="h-2 w-2 bg-salesCyan rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AIMessageList;
