import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, ChevronUp, ChevronDown, Zap, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAIAgent } from "@/hooks/useAIAgent";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Import our new components
import AIMessageList from './AIAssistant/AIMessageList';
import AINotificationList from './AIAssistant/AINotificationList';
import AIInputBar from './AIAssistant/AIInputBar';
import MiniNotification from './AIAssistant/MiniNotification';
import NotificationSettings from './AIAssistant/NotificationSettings';
import { AIMessage, AINotification, NotificationPreference } from './AIAssistant/types';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    { 
      type: 'alert', 
      enabled: true, 
      description: 'Important notifications about sales performance and trends',
      icon: '📈'
    },
    { 
      type: 'tip', 
      enabled: true, 
      description: 'Helpful advice to improve your sales process',
      icon: '💡'
    },
    { 
      type: 'achievement', 
      enabled: true, 
      description: 'Notifications when you unlock new features or reach goals',
      icon: '🏆'
    },
  ]);
  
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
  
  // Handle notification preference changes
  const handlePreferenceChange = (type: 'alert' | 'tip' | 'achievement', enabled: boolean) => {
    // Update the preferences
    setNotificationPreferences(prevPrefs => 
      prevPrefs.map(pref => 
        pref.type === type ? { ...pref, enabled } : pref
      )
    );
    
    // Show toast confirmation
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${enabled ? 'enabled' : 'disabled'}`);
    
    // In a real application, this would save to user preferences in the database
  };
  
  // Filter notifications based on user preferences
  const filteredNotifications = notifications.filter(notification => {
    const preference = notificationPreferences.find(pref => pref.type === notification.type);
    return preference?.enabled;
  });
  
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
                  onClick={() => setIsSettingsOpen(true)}
                  title="Notification Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white p-1 h-auto hover:bg-white/10"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <div className="relative">
                    <Badge className="absolute -top-1 -right-1 bg-salesRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                      {filteredNotifications.filter(n => !n.read).length}
                    </Badge>
                    <span>🔔</span>
                  </div>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {showNotifications ? (
            <CardContent className="p-0 flex-grow overflow-y-auto bg-white dark:bg-dark-card">
              <AINotificationList notifications={filteredNotifications} />
            </CardContent>
          ) : (
            <CardContent className="p-4 flex-grow overflow-y-auto bg-white dark:bg-dark-card">
              <AIMessageList 
                messages={messages} 
                onSuggestedActionClick={handleSuggestedAction}
                isLoading={isLoading}
              />
            </CardContent>
          )}
          
          <CardFooter className="p-4 bg-white dark:bg-dark-card border-t dark:border-dark-border flex-shrink-0">
            <AIInputBar
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              handleKeyDown={handleKeyDown}
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>
      </div>
      
      {/* Notification Settings Dialog */}
      <NotificationSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={notificationPreferences}
        onPreferenceChange={handlePreferenceChange}
      />
      
      {/* Simplified AI Assistant (when collapsed) */}
      <div className={`fixed bottom-24 right-6 transition-all duration-300 z-10 max-w-xs transform ${isExpanded ? 'translate-y-10 opacity-0 invisible' : 'translate-y-0 opacity-100'}`}>
        <MiniNotification 
          message="You've got 5 new leads ready to call. Click for details."
          icon="📞"
        />
      </div>
    </>
  );
};

export default AIAssistant;
