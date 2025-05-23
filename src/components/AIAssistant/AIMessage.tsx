
import React from 'react';
import { Button } from "@/components/ui/button";

interface AIMessageProps {
  message: {
    id: number;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    suggestedActions?: string[];
  };
  onSuggestedActionClick: (action: string) => void;
}

const AIMessage: React.FC<AIMessageProps> = ({ message, onSuggestedActionClick }) => {
  return (
    <div 
      className={`${
        message.sender === 'ai' 
          ? 'bg-slate-100 dark:bg-slate-800 rounded-br-lg rounded-tl-lg rounded-tr-lg' 
          : 'bg-salesCyan-light dark:bg-salesBlue/30 text-slate-800 dark:text-slate-100 rounded-bl-lg rounded-tl-lg rounded-tr-lg ml-auto'
      } p-3 max-w-[85%] animate-fade-in`}
    >
      {message.text}
      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      {message.suggestedActions && message.suggestedActions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {message.suggestedActions.map((action, i) => (
            <Button 
              key={i} 
              size="sm" 
              variant="outline" 
              className="bg-white dark:bg-slate-700 text-xs h-auto py-1 px-2 dark:text-white"
              onClick={() => onSuggestedActionClick(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMessage;
