
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, ChevronUp, ChevronDown, Zap, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAIAgent, AIResponse } from "@/hooks/useAIAgent";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AIMessage {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  suggestedActions?: string[];
}

interface AINotification {
  id: number;
  title: string;
  message: string;
  type: 'alert' | 'tip' | 'achievement';
  icon: string;
  read: boolean;
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
      suggestedActions: ['Show me my priority leads', 'Schedule my next call', 'Give me a winning script']
    }
  ]);

  const [notifications, setNotifications] = useState<AINotification[]>([
    {
      id: 1,
      title: 'Objection Trending',
      message: 'The objection "Too expensive" has increased 25% this week across your team.',
      type: 'alert',
      icon: '📈',
      read: false,
      timestamp: new Date(Date.now() - 35 * 60000) // 35 mins ago
    },
    {
      id: 2,
      title: 'Achievement Unlocked',
      message: 'You reached Level 12! New script templates are now available in the Store.',
      type: 'achievement',
      icon: '🏆',
      read: false,
      timestamp: new Date(Date.now() - 3 * 3600000) // 3 hours ago
    },
    {
      id: 3,
      title: 'Lead Source Performance',
      message: 'LinkedIn leads are converting 33% better than Facebook leads this month.',
      type: 'tip',
      icon: '💡',
      read: false,
      timestamp: new Date(Date.now() - 7 * 3600000) // 7 hours ago
    }
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { callAIAgent, isLoading, error } = useAIAgent();
  
  // Handle sending a message using the AI Agent
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      // Add user message
      const userMessage: AIMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage('');
      
      if (!user) {
        // Handle unauthenticated user
        const aiMessage: AIMessage = {
          id: messages.length + 2,
          text: "Please log in to use the AI assistant features.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        return;
      }
      
      try {
        // Call the AI agent with the user's message
        const response = await callAIAgent({
          prompt: inputMessage
        });
        
        if (response) {
          // Add AI response to messages
          const aiMessage: AIMessage = {
            id: messages.length + 2,
            text: response.response,
            sender: 'ai',
            timestamp: new Date(),
            suggestedActions: response.suggestedAction ? [response.suggestedAction.type] : undefined
          };
          setMessages(prevMessages => [...prevMessages, aiMessage]);
        } else if (error) {
          // Handle error from AI agent
          const aiMessage: AIMessage = {
            id: messages.length + 2,
            text: `I'm having trouble responding right now. Please try again later. (Error: ${error})`,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages(prevMessages => [...prevMessages, aiMessage]);
        }
      } catch (err: any) {
        console.error("Error processing AI response:", err);
        toast.error("Failed to get AI response");
        
        // Add error message
        const aiMessage: AIMessage = {
          id: messages.length + 2,
          text: "I'm having trouble connecting to my brain right now. Please try again in a moment.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };
  
  const handleSuggestedAction = async (action: string) => {
    const userMessage: AIMessage = {
      id: messages.length + 1,
      text: action,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    if (!user) {
      // Handle unauthenticated user
      const aiMessage: AIMessage = {
        id: messages.length + 2,
        text: "Please log in to use the AI assistant features.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      return;
    }
    
    try {
      // Call AI agent with the selected action
      const response = await callAIAgent({
        prompt: `Perform this action: ${action}`
      });
      
      if (response) {
        // Add AI response
        const aiMessage: AIMessage = {
          id: messages.length + 2,
          text: response.response,
          sender: 'ai',
          timestamp: new Date(),
          suggestedActions: response.suggestedAction ? 
            [response.suggestedAction.type] : undefined
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      }
    } catch (err) {
      console.error("Error processing suggested action:", err);
      
      // Add error message
      const aiMessage: AIMessage = {
        id: messages.length + 2,
        text: "I'm having trouble processing that action right now. Let's try something else.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }
  };
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Show a confetti animation when achievements are unlocked
  useEffect(() => {
    const hasUnreadAchievement = notifications.some(
      notif => notif.type === 'achievement' && !notif.read
    );
    
    if (hasUnreadAchievement) {
      // This would trigger a confetti animation in a real implementation
      console.log('Achievement unlocked! Showing confetti animation');
      
      // Mark achievement as read after a delay
      setTimeout(() => {
        setNotifications(prevNotifs => 
          prevNotifs.map(notif => 
            notif.type === 'achievement' ? { ...notif, read: true } : notif
          )
        );
      }, 3000);
    }
  }, []);
  
  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className={`fixed bottom-6 ${isExpanded ? 'right-[384px]' : 'right-6'} transition-all duration-300 z-20`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg ${isExpanded ? 'bg-salesRed hover:bg-salesRed-dark' : 'bg-salesCyan hover:bg-salesCyan-dark'}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-6 w-6" />
                ) : (
                  <MessageCircle className="h-6 w-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Your AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* AI Assistant Panel */}
      <div className={`fixed bottom-0 right-0 transition-all duration-300 z-10 w-96 transform ${isExpanded ? 'translate-x-0' : 'translate-x-full'}`}>
        <Card className="shadow-lg border-salesCyan h-[600px] flex flex-col">
          <CardHeader className="p-4 bg-gradient-to-r from-salesBlue to-salesCyan text-white flex-shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <div className="relative">
                  <Zap className="h-5 w-5" />
                  <div className="w-2 h-2 rounded-full bg-white absolute -top-0.5 -right-0.5 animate-pulse-soft"></div>
                </div>
                Your AI Sales Assistant
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white p-1 h-auto hover:bg-white/10"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <div className="relative">
                    <Badge className="absolute -top-1 -right-1 bg-salesRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                    <span>🔔</span>
                  </div>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {showNotifications ? (
            <CardContent className="p-0 flex-grow overflow-y-auto bg-white dark:bg-dark-card">
              <div className="p-4 border-b dark:border-dark-border">
                <h3 className="text-sm font-semibold text-salesBlue dark:text-salesCyan">Recent Notifications</h3>
              </div>
              <div className="divide-y dark:divide-dark-border">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${notification.read ? 'opacity-70' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="text-xl">{notification.icon}</div>
                      <div>
                        <div className="font-medium text-sm dark:text-white">{notification.title}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{notification.message}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-4 flex-grow overflow-y-auto bg-white dark:bg-dark-card">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
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
                            onClick={() => handleSuggestedAction(action)}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          )}
          
          <CardFooter className="p-4 bg-white dark:bg-dark-card border-t dark:border-dark-border flex-shrink-0">
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
          </CardFooter>
        </Card>
      </div>
      
      {/* Simplified AI Assistant (when collapsed) */}
      <div className={`fixed bottom-24 right-6 transition-all duration-300 z-10 max-w-xs transform ${isExpanded ? 'translate-y-10 opacity-0 invisible' : 'translate-y-0 opacity-100'}`}>
        <Card className="shadow-lg border-salesCyan-light dark:border-salesBlue">
          <CardContent className="p-3 bg-white dark:bg-dark-card">
            <div className="text-sm animate-slide-up flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-salesCyan-light flex items-center justify-center text-salesBlue dark:bg-salesBlue/20 dark:text-salesCyan">
                <Zap className="h-4 w-4" />
              </div>
              <div className="dark:text-white">
                You've got <span className="font-semibold text-salesRed dark:text-salesRed-light">5 new leads</span> ready to call. Click for details.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AIAssistant;
