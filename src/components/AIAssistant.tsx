
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AIMessage {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

const AIAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 1,
      text: "Good morning! 👋 You're having a great sales day! You've already completed 3 calls and scheduled 1 follow-up meeting. Your energy levels seem high - perfect time to tackle those 5 priority leads from LinkedIn.",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      const userMessage: AIMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
      setInputMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        let aiResponse = '';
        
        if (inputMessage.toLowerCase().includes('call') || inputMessage.toLowerCase().includes('dial')) {
          aiResponse = "Let me set up your next call. Based on your schedule, I recommend calling Michael from Acme Corp. He's most likely to answer right now based on his past engagement patterns.";
        } else if (inputMessage.toLowerCase().includes('script')) {
          aiResponse = "Based on your next lead's profile, I suggest using our 'Tech Solution' pitch script. I'll adapt it to highlight cost savings since their recent quarterly report mentioned budget concerns.";
        } else if (inputMessage.toLowerCase().includes('break') || inputMessage.toLowerCase().includes('rest')) {
          aiResponse = "Taking a short break is a great idea! You've been on calls for 2 hours straight. I'll block 15 minutes on your calendar and resume notifications after.";
        } else {
          aiResponse = "I'm here to help you succeed today! Would you like me to prepare your call queue, review your performance stats, or suggest your next best action?";
        }
        
        const aiMessage: AIMessage = {
          id: messages.length + 2,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className={`fixed bottom-0 right-6 transition-all duration-300 z-10 ${isExpanded ? 'w-96' : 'w-72'}`}>
      <Card className="shadow-lg border-salesCyan">
        <CardHeader className="p-3 bg-gradient-to-r from-salesBlue to-salesCyan text-white cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white animate-pulse-soft"></span>
              {isExpanded ? 'Your AI Sales Assistant' : 'AI Assistant'}
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-white p-0 h-auto hover:bg-salesBlue-light">
              {isExpanded ? '⌄' : '⌃'}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <>
            <CardContent className="p-3 h-80 overflow-y-auto bg-white">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`${message.sender === 'ai' ? 'bg-slate-100 rounded-br-lg rounded-tl-lg rounded-tr-lg' : 'bg-salesCyan-light text-slate-800 rounded-bl-lg rounded-tl-lg rounded-tr-lg ml-auto'} p-3 max-w-[85%] animate-fade-in`}
                  >
                    {message.text}
                    <div className="text-[10px] text-slate-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-3 bg-white border-t">
              <div className="flex w-full gap-2">
                <Input 
                  placeholder="Ask your AI assistant..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  className="bg-salesCyan hover:bg-salesCyan-dark"
                >
                  Send
                </Button>
              </div>
            </CardFooter>
          </>
        )}
        
        {!isExpanded && (
          <CardContent className="p-3 bg-white">
            <div className="text-sm animate-slide-up">
              You've got 5 new <span className="font-semibold text-salesBlue">priority leads</span> ready to call. Click for details.
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIAssistant;
