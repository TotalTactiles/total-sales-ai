
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  MessageSquare, 
  MailPlus, 
  Phone, 
  X, 
  Settings, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  User,
  ArrowRight,
  Target,
  Lightbulb,
  FilePlus2,
  FileText,
  PlayCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { relevanceAIAgent } from '@/services/relevance/RelevanceAIAgentService';
import { relevanceAI } from '@/services/relevance/RelevanceAIService';

interface AIContext {
  workspace: string;
  currentLead?: any;
  isCallActive?: boolean;
  callDuration?: number;
}

interface EnhancedRelevanceAIBubbleProps {
  context: AIContext;
}

const EnhancedRelevanceAIBubble: React.FC<EnhancedRelevanceAIBubbleProps> = ({ context }) => {
  const { user, profile } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'ai', content: string, time: string, taskId?: string }>>([
    { 
      role: 'ai', 
      content: 'Hello! I\'m Relevance AI, your AI sales assistant. How can I help you today?', 
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [activeTab, setActiveTab] = useState('chat');
  const [toneOptions] = useState(['Professional', 'Friendly', 'Direct', 'Technical']);
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [quickActions, setQuickActions] = useState<Array<{ label: string, icon: React.ReactNode, taskType: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Context-aware quick actions
  useEffect(() => {
    const { workspace, currentLead, isCallActive } = context;
    
    let actions = [];
    
    // Default actions always available
    actions.push({ 
      label: 'Generate Email', 
      icon: <MailPlus className="h-4 w-4" />,
      taskType: 'email_draft'
    });
    
    // Workspace-specific actions
    if (workspace === 'leads' && currentLead) {
      actions.push({ 
        label: 'Lead Analysis', 
        icon: <Target className="h-4 w-4" />,
        taskType: 'lead_analysis'
      });
      actions.push({ 
        label: 'Follow-Up Strategy', 
        icon: <ArrowRight className="h-4 w-4" />,
        taskType: 'follow_up_generation'
      });
    }
    
    if (workspace === 'dialer' || isCallActive) {
      actions.push({ 
        label: 'Objection Handler', 
        icon: <AlertCircle className="h-4 w-4" />,
        taskType: 'objection_handling'
      });
      
      if (isCallActive) {
        actions.push({ 
          label: 'Real-Time Suggestions', 
          icon: <Lightbulb className="h-4 w-4" />,
          taskType: 'call_assistance'
        });
      }
    }
    
    if (workspace === 'notes' || workspace === 'email') {
      actions.push({ 
        label: 'Draft Message', 
        icon: <FilePlus2 className="h-4 w-4" />,
        taskType: 'content_generation'
      });
    }
    
    setQuickActions(actions);
    
  }, [context]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setQuery("What's the best follow-up strategy for this lead?");
        setIsListening(false);
        toast.success('Voice input captured');
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim() || loading) return;
    
    if (!user?.id || !profile?.company_id) {
      toast.error('You must be logged in to use the AI assistant');
      return;
    }
    
    // Add user message to conversation
    const userMessage = {
      role: 'user' as const,
      content: query,
      time: new Date().toLocaleTimeString()
    };
    
    setConversation([...conversation, userMessage]);
    setLoading(true);
    
    try {
      // Generate a response using Relevance AI
      const response = await relevanceAI.generateResponse(query, context);
      
      // Add AI response to conversation
      setConversation(prev => [
        ...prev,
        {
          role: 'ai',
          content: response,
          time: new Date().toLocaleTimeString()
        }
      ]);
      
      // Clear the input
      setQuery('');
      
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
      
      // Add error message to conversation
      setConversation(prev => [
        ...prev,
        {
          role: 'ai',
          content: 'I\'m sorry, I encountered an error processing your request. Please try again.',
          time: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (taskType: string) => {
    if (!user?.id || !profile?.company_id) {
      toast.error('You must be logged in to use the AI assistant');
      return;
    }
    
    setLoading(true);
    
    // Prepare input based on context and task type
    const input: any = {
      context: { ...context },
      timestamp: new Date().toISOString()
    };
    
    // Add specific inputs based on task type
    if (taskType === 'lead_analysis' && context.currentLead) {
      input.lead = context.currentLead;
    } else if (taskType === 'follow_up_generation' && context.currentLead) {
      input.lead = context.currentLead;
    } else if (taskType === 'objection_handling') {
      input.tone = selectedTone.toLowerCase();
    } else if (taskType === 'email_draft' && context.currentLead) {
      input.recipient = context.currentLead;
      input.tone = selectedTone.toLowerCase();
    }
    
    try {
      // Execute the agent task
      const task = await relevanceAIAgent.executeAgentTask(
        'salesAgent_v1',
        taskType,
        input,
        user.id,
        profile.company_id
      );
      
      if (task.status === 'completed' && task.output_payload) {
        // Add AI response to conversation
        setConversation(prev => [
          ...prev,
          {
            role: 'ai',
            content: task.output_payload.response || 'Task completed successfully.',
            time: new Date().toLocaleTimeString(),
            taskId: task.id
          }
        ]);
        
        toast.success(`${getTaskDisplayName(taskType)} completed`);
      } else {
        // Add error message to conversation
        setConversation(prev => [
          ...prev,
          {
            role: 'ai',
            content: `I couldn't complete the ${getTaskDisplayName(taskType)}. ${task.error_message || 'Please try again.'}`,
            time: new Date().toLocaleTimeString()
          }
        ]);
        
        toast.error(`Failed to complete ${getTaskDisplayName(taskType)}`);
      }
    } catch (error) {
      console.error(`Error executing ${taskType}:`, error);
      toast.error(`Failed to execute ${getTaskDisplayName(taskType)}`);
      
      // Add error message to conversation
      setConversation(prev => [
        ...prev,
        {
          role: 'ai',
          content: `I encountered an error while trying to ${getTaskDisplayName(taskType).toLowerCase()}. Please try again.`,
          time: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTaskDisplayName = (taskType: string): string => {
    const taskNames: Record<string, string> = {
      'lead_analysis': 'Lead Analysis',
      'follow_up_generation': 'Follow-up Strategy',
      'objection_handling': 'Objection Handling',
      'email_draft': 'Email Draft',
      'call_assistance': 'Call Assistance',
      'content_generation': 'Content Generation'
    };
    
    return taskNames[taskType] || taskType;
  };

  const handleFeedback = (messageIndex: number, isPositive: boolean) => {
    const message = conversation[messageIndex];
    if (!message || message.role !== 'ai') return;
    
    toast.success(`Thank you for your ${isPositive ? 'positive' : 'negative'} feedback`);
    
    // In a real implementation, this would send feedback to an API
    console.log('Feedback:', { messageId: messageIndex, isPositive, taskId: message.taskId });
  };

  const formatMessage = (content: string) => {
    // Simple formatting for line breaks
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Collapsed bubble */}
      {!expanded && (
        <div 
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setExpanded(true)}
        >
          <Brain className="h-6 w-6" />
        </div>
      )}

      {/* Expanded AI assistant */}
      <Drawer open={expanded} onOpenChange={setExpanded}>
        <DrawerContent className="fixed bottom-0 right-0 left-0 md:left-auto md:right-4 md:bottom-4 md:w-96 md:rounded-xl md:h-auto md:max-h-[80vh] max-h-[90vh] bg-background shadow-xl">
          <DrawerHeader className="border-b p-4">
            <DrawerTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Relevance AI Assistant</span>
                {context.currentLead && (
                  <Badge variant="outline" className="ml-2">
                    {context.currentLead.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowToneSelector(!showToneSelector);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerTitle>
            
            {/* Tone selector dropdown */}
            {showToneSelector && (
              <div className="mt-2 border rounded-md p-2 bg-background shadow-sm">
                <div className="text-xs font-medium mb-2">Select Response Tone:</div>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((tone) => (
                    <Badge 
                      key={tone}
                      variant={selectedTone === tone ? "default" : "outline"} 
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedTone(tone);
                        toast.success(`Tone set to ${tone}`);
                      }}
                    >
                      {tone}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </DrawerHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="p-2 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-2" />
                  Quick Actions
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0 p-0">
              {/* Conversation history */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {conversation.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center">
                          {message.role === 'user' ? (
                            <User className="h-3 w-3 mr-1" />
                          ) : (
                            <Bot className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === 'user' ? 'You' : 'Relevance AI'}
                          </span>
                        </div>
                        <span className="text-xs opacity-70 ml-2">{message.time}</span>
                      </div>
                      <div className="text-sm leading-relaxed">
                        {formatMessage(message.content)}
                      </div>
                      {message.role === 'ai' && (
                        <div className="flex mt-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleFeedback(index, true)}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleFeedback(index, false)}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              {/* Input area */}
              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <Textarea 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything..."
                    className="min-h-10 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="icon" 
                      className="h-9 w-9" 
                      onClick={handleSendMessage}
                      disabled={loading || !query.trim()}
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      size="icon" 
                      variant={isListening ? "destructive" : "outline"} 
                      className="h-9 w-9"
                      onClick={handleVoiceToggle}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {context.currentLead && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    <span>Context: {context.workspace} - {context.currentLead.name}</span>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="m-0 p-4 overflow-y-auto">
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => handleQuickAction(action.taskType)}
                    disabled={loading}
                  >
                    {action.icon}
                    <div className="flex flex-col items-start ml-2">
                      <span>{action.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {getTaskDisplayName(action.taskType)}
                      </span>
                    </div>
                  </Button>
                ))}
                
                {context.workspace === 'dialer' && context.isCallActive && (
                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center text-amber-800">
                        <PlayCircle className="h-4 w-4 mr-2 text-amber-600" />
                        Active Call Assistant
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-amber-700">
                      <p>Live call in progress: {context.callDuration}s</p>
                      <p>AI is analyzing and ready to assist</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full border-amber-300 text-amber-800"
                        onClick={() => handleQuickAction('call_assistance')}
                      >
                        <Brain className="h-3 w-3 mr-1 text-amber-600" />
                        Get Real-Time Suggestions
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {context.workspace === 'leads' && (
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      AI Templates
                    </div>
                    <div className="bg-slate-50 rounded-md p-3">
                      <div className="text-xs mb-2">Load a template for common tasks:</div>
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-start text-xs h-8 font-normal"
                          onClick={() => {
                            setActiveTab('chat');
                            setQuery("Draft a follow-up email for a lead who went cold after initial interest");
                          }}
                        >
                          Cold lead follow-up
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-start text-xs h-8 font-normal"
                          onClick={() => {
                            setActiveTab('chat');
                            setQuery("Generate 3 personalized value props based on this lead's company industry");
                          }}
                        >
                          Personalized value props
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-start text-xs h-8 font-normal"
                          onClick={() => {
                            setActiveTab('chat');
                            setQuery("Help me handle pricing objections");
                          }}
                        >
                          Price objection handling
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EnhancedRelevanceAIBubble;
