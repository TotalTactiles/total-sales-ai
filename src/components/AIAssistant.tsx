import { logger } from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, ChevronUp, ChevronDown, Zap, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
// import { useUnifiedAI } from "@/contexts/UnifiedAIContext";
import { toast } from "sonner";

// Import our components
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
      text: "Hello! 👋 I'm your enhanced AI Assistant powered by both ChatGPT and Claude. I can help with calls, emails, notes, strategy, and provide coaching. Claude handles complex analysis while ChatGPT provides quick responses. Try asking me: 'Analyze my sales performance' or 'Draft a follow-up email'",
      sender: 'ai',
      timestamp: new Date(),
      suggestedActions: ['Analyze performance', 'Draft email', 'Create strategy']
    }
  ]);

  const [notifications, setNotifications] = useState<AINotification[]>([
    {
      id: 1,
      title: 'Speed-to-Lead Alert',
      message: 'You have 3 fresh leads under 5 minutes old. Call now for 21x better results!',
      type: 'alert',
      icon: '📞',
      read: false,
      timestamp: new Date(Date.now() - 2 * 60000) // 2 mins ago
    },
    {
      id: 2,
      title: 'Coaching Insight',
      message: 'Your close rate improves 34% when you mention ROI within first 3 minutes.',
      type: 'tip',
      icon: '🎯',
      read: false,
      timestamp: new Date(Date.now() - 15 * 60000) // 15 mins ago
    }
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    { 
      type: 'alert', 
      enabled: true, 
      description: 'Critical notifications like fresh leads and urgent actions',
      icon: '🚨'
    },
    { 
      type: 'tip', 
      enabled: true, 
      description: 'AI coaching tips and performance insights',
      icon: '💡'
    },
    { 
      type: 'achievement', 
      enabled: true, 
      description: 'Milestone celebrations and feature unlocks',
      icon: '🏆'
    },
  ]);
  
  const { user } = useAuth();
  // const { generateAIResponse, generateStrategyResponse, generateCommunication } = useUnifiedAI();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle sending a message using the Unified AI Service
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
      
      const currentInput = inputMessage;
      setInputMessage('');
      setIsLoading(true);
      
      if (!user) {
        // Handle unauthenticated user
        const aiMessage: AIMessage = {
          id: messages.length + 2,
          text: "Please log in to access the full AI assistant capabilities with Claude and ChatGPT integration.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setIsLoading(false);
        return;
      }
      
      try {
        // Determine which AI service to use based on content
        let response: string;
        const inputLower = currentInput.toLowerCase();
        
        if (inputLower.includes('strategy') || inputLower.includes('analyze') || inputLower.includes('plan')) {
          // response = await generateStrategyResponse(currentInput);
          response = 'Strategy service disabled in safe mode.';
        } else if (inputLower.includes('email') || inputLower.includes('draft') || inputLower.includes('write')) {
          // response = await generateCommunication(currentInput);
          response = 'Communication service disabled in safe mode.';
        } else {
          // response = await generateAIResponse(currentInput);
          response = 'AI response disabled in safe mode.';
          
        }
        
        // Add AI response to messages
        const aiMessage: AIMessage = {
          id: messages.length + 2,
          text: response,
          sender: 'ai',
          timestamp: new Date(),
          suggestedActions: inputLower.includes('strategy') ? ['Review plan', 'Get insights'] : 
                          inputLower.includes('email') ? ['Send email', 'Edit draft'] : 
                          ['Follow up', 'Get more help']
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        
      } catch (err: any) {
        logger.error("Error processing AI response:", err);
        toast.error("Failed to get AI response");
        
        // Add error message
        const aiMessage: AIMessage = {
          id: messages.length + 2,
          text: "I'm having trouble connecting to my AI services right now. Both ChatGPT and Claude are temporarily unavailable. Please try again in a moment.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } finally {
        setIsLoading(false);
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
    setIsLoading(true);
    
    if (!user) {
      // Handle unauthenticated user
      const aiMessage: AIMessage = {
        id: messages.length + 2,
        text: "Please log in to use the AI assistant features with Claude and ChatGPT.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsLoading(false);
      return;
    }
    
    try {
      let response: string;
      
      // Route to appropriate AI service based on action type
      if (action.toLowerCase().includes('strategy') || action.toLowerCase().includes('analyze')) {
        // response = await generateStrategyResponse(`Execute action: ${action}`);
        response = 'Strategy service disabled in safe mode.';
      } else if (action.toLowerCase().includes('email') || action.toLowerCase().includes('draft')) {
        // response = await generateCommunication(`Execute action: ${action}`);
        response = 'Communication service disabled in safe mode.';
      } else {
        // response = await generateAIResponse(`Execute action: ${action}`);
        response = 'AI response disabled in safe mode.';
      }
      
      // Add AI response
      const aiMessage: AIMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        suggestedActions: ['Continue', 'Get more help', 'Try something else']
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      
    } catch (err) {
      logger.error("Error processing suggested action:", err);
      
      // Add error message
      const aiMessage: AIMessage = {
        id: messages.length + 2,
        text: "I'm having trouble processing that action right now. Both my AI engines are temporarily busy. Let's try something else.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle notification preference changes
  const handlePreferenceChange = (type: 'alert' | 'tip' | 'achievement', enabled: boolean) => {
    setNotificationPreferences(prevPrefs => 
      prevPrefs.map(pref => 
        pref.type === type ? { ...pref, enabled } : pref
      )
    );
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  // Filter notifications based on user preferences
  const filteredNotifications = notifications.filter(notification => {
    const preference = notificationPreferences.find(pref => pref.type === notification.type);
    return preference?.enabled;
  });
  
  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className={`fixed bottom-6 ${isExpanded ? 'right-[384px]' : 'right-6'} transition-all duration-300 z-20`}>
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
              {/* ... keep existing code (notification badge) */}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Claude + ChatGPT AI Assistant</p>
          </TooltipContent>
        </Tooltip>
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
                Claude + ChatGPT AI
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
            <div className="text-xs text-blue-100 mt-1">
              Intelligent routing between Claude & ChatGPT for optimal responses
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
          message="AI Assistant ready! Click to access coaching, drafts, and insights."
          icon="🤖"
        />
      </div>
    </>
  );
};

export default AIAssistant;
