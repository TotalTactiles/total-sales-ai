import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AIAssistantHelperProps {
  agentName?: string;
  // Optional tone settings
  tone?: {
    humor?: number;
    formality?: number;
    pushiness?: number;
    detail?: number;
  };
  // Optional introduction message override
  introMessage?: string;
  // Tour steps for initial guided tour
  tourSteps?: Array<{
    title: string;
    description: string;
    targetSelector?: string;
  }>;
}

const AIAssistantHelper: React.FC<AIAssistantHelperProps> = ({ 
  agentName = 'SalesOS',
  tone = { 
    humor: 50,
    formality: 50,
    pushiness: 30,
    detail: 50 
  },
  introMessage,
  tourSteps = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isTouring, setIsTouring] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const { user, profile } = useAuth();

  // Generate personality-based messages
  const generateMessage = (purpose: 'greeting' | 'help' | 'tour'): string => {
    // Humor affects language
    const humor = tone?.humor || 50;
    const humorous = humor > 70;
    const serious = humor < 30;
    
    // Formality affects sentence structure and word choice
    const formality = tone?.formality || 50;
    const formal = formality > 70;
    const casual = formality < 30;
    
    // Pushiness affects call-to-action strength
    const pushiness = tone?.pushiness || 30;
    const pushy = pushiness > 70;
    
    // Detail affects message length
    const detail = tone?.detail || 50;
    const detailed = detail > 70;
    const concise = detail < 30;
    
    // Generate different messages based on purpose and personality
    switch (purpose) {
      case 'greeting':
        if (humorous && casual) {
          return `Hey there! ${agentName} at your service. What's on your mind today?`;
        } else if (formal) {
          return `Welcome. I am ${agentName}, your sales assistant. How may I assist you today?`;
        } else {
          return `Hi there! I'm ${agentName}, your AI assistant. How can I help you?`;
        }
      
      case 'help':
        if (humorous && casual) {
          return `Need a hand with something? I'm all ears!`;
        } else if (formal) {
          return `I'm here to provide assistance with your sales activities. What information do you require?`;
        } else {
          return `How can I assist you with your sales activities today?`;
        }
        
      case 'tour':
        if (pushy) {
          return `Let me show you around! This tour will help you master the platform quickly.`;
        } else if (detailed) {
          return `Would you like a comprehensive tour of the platform? I can explain each feature in detail to help you get started.`;
        } else if (concise) {
          return `Quick tour?`;
        } else {
          return `Would you like a quick tour of the platform?`;
        }
        
      default:
        return `Hi, I'm ${agentName}. How can I help?`;
    }
  };

  // On first load, check if we should offer a tour
  useEffect(() => {
    const checkTourStatus = async () => {
      if (!user?.id) return;
      
      try {
        // Check if this user has completed the guided tour
        const { data, error } = await supabase
          .from('company_settings')
          .select('guided_tour_completed')
          .eq('company_id', profile?.company_id)
          .single();
          
        if (error) {
          logger.error('Error checking tour status:', error);
          return;
        }
        
        // If tour hasn't been completed, show the assistant with tour option
        if (data && !data.guided_tour_completed && tourSteps?.length > 0) {
          setIsMinimized(false);
          setMessage(generateMessage('tour'));
          
          // Log this interaction
          await supabase.from('usage_analytics').insert({
            company_id: profile?.company_id,
            user_id: user.id,
            event_type: 'assistant_tour_offered',
            event_data: {}
          });
        } else {
          // Just set a normal greeting message
          setMessage(introMessage || generateMessage('greeting'));
        }
      } catch (err) {
        logger.error('Error in checkTourStatus:', err);
      }
    };
    
    checkTourStatus();
  }, [
    user?.id,
    profile?.company_id,
    tourSteps.length,
    introMessage,
    generateMessage
  ]);
  }, [user?.id, profile?.company_id, generateMessage, introMessage, tourSteps.length]);

  // Start the guided tour
  const startTour = async () => {
    setIsTouring(true);
    setCurrentTourStep(0);
    
    // Track tour start
    try {
      await supabase.from('usage_analytics').insert({
        company_id: profile?.company_id,
        user_id: user?.id,
        event_type: 'guided_tour_started',
        event_data: {}
      });
    } catch (err) {
      logger.error('Error tracking tour start:', err);
    }
  };

  // Complete the tour
  const completeTour = async () => {
    setIsTouring(false);
    
    // Mark tour as completed in database
    try {
      // Update company settings
      await supabase
        .from('company_settings')
        .update({ guided_tour_completed: true })
        .eq('company_id', profile?.company_id);
        
      // Track completion
      await supabase.from('usage_analytics').insert({
        company_id: profile?.company_id,
        user_id: user?.id,
        event_type: 'guided_tour_completed',
        event_data: { steps_viewed: currentTourStep + 1 }
      });
      
      // Set a new message
      setMessage(`Great! You're all set to use ${agentName}. Let me know if you need anything else.`);
    } catch (err) {
      logger.error('Error completing tour:', err);
    }
  };

  // Move through tour steps
  const nextTourStep = () => {
    if (currentTourStep < tourSteps.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const prevTourStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(prev => prev - 1);
    }
  };

  // Toggle chat open/closed
  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Minimize chat
  const minimizeChat = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button when minimized */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="cursor-pointer"
          >
            <Button
              className="rounded-full w-12 h-12 p-0 shadow-lg"
              onClick={toggleChat}
            >
              <MessageSquare size={20} />
            </Button>
          </motion.div>
        )}
        
        {/* Helper popup */}
        {!isMinimized && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-80 shadow-lg">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">{agentName}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={minimizeChat}>
                    <X size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Chat content */}
              <div className="p-4 h-64 overflow-y-auto">
                {isTouring ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold">{tourSteps[currentTourStep]?.title}</h4>
                    <p className="text-sm text-muted-foreground">{tourSteps[currentTourStep]?.description}</p>
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={prevTourStep}
                        disabled={currentTourStep === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={nextTourStep}
                      >
                        {currentTourStep < tourSteps.length - 1 ? (
                          <>
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          'Finish'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {message && (
                      <div className="bg-primary/10 rounded-lg p-3 text-sm">
                        {message}
                      </div>
                    )}
                    
                    {tourSteps.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={startTour}
                      >
                        Take a quick tour
                      </Button>
                    )}
                    
                    {/* Additional action buttons would go here */}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistantHelper;
