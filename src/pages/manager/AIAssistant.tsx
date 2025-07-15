
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Plus,
  MessageCircle,
  Database,
  Upload,
  Users,
  TrendingUp,
  Settings,
  Target,
  AlertTriangle,
  Brain,
  Sparkles,
  Clock,
  Pin,
  Trash2,
  Download,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'file' | 'image';
    name: string;
    url: string;
    size: number;
  }>;
  metadata?: {
    model?: string;
    sources?: string[];
    confidence?: number;
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  sessionId: string;
}

const AIAssistant: React.FC = () => {
  const { user, profile } = useAuth();
  const { executeAgentTask } = useUnifiedAI();
  
  // State management
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick actions for right sidebar
  const quickActions = [
    {
      category: 'Team',
      actions: [
        { 
          label: 'Team Performance Summary', 
          icon: <Users className="h-4 w-4" />,
          prompt: 'Analyze current team performance metrics and provide actionable insights for improvement'
        },
        { 
          label: 'Rep Coaching Opportunities', 
          icon: <Target className="h-4 w-4" />,
          prompt: 'Identify which team members need coaching and specific areas for development'
        },
        { 
          label: 'Team Workload Analysis', 
          icon: <TrendingUp className="h-4 w-4" />,
          prompt: 'Analyze team workload distribution and suggest optimizations'
        }
      ]
    },
    {
      category: 'Performance',
      actions: [
        { 
          label: 'Goal Progress Review', 
          icon: <Target className="h-4 w-4" />,
          prompt: 'Review current goal progress and identify areas that need attention'
        },
        { 
          label: 'Conversion Rate Analysis', 
          icon: <TrendingUp className="h-4 w-4" />,
          prompt: 'Analyze conversion rates across different channels and suggest improvements'
        },
        { 
          label: 'Revenue Forecast', 
          icon: <Sparkles className="h-4 w-4" />,
          prompt: 'Generate revenue forecast based on current pipeline and historical data'
        }
      ]
    },
    {
      category: 'Operations',
      actions: [
        { 
          label: 'Workflow Optimization', 
          icon: <Settings className="h-4 w-4" />,
          prompt: 'Identify workflow bottlenecks and suggest process improvements'
        },
        { 
          label: 'Resource Allocation', 
          icon: <Database className="h-4 w-4" />,
          prompt: 'Analyze resource allocation and suggest optimizations'
        },
        { 
          label: 'System Performance Review', 
          icon: <Brain className="h-4 w-4" />,
          prompt: 'Review system performance metrics and identify optimization opportunities'
        }
      ]
    },
    {
      category: 'Marketing',
      actions: [
        { 
          label: 'Campaign Performance', 
          icon: <TrendingUp className="h-4 w-4" />,
          prompt: 'Analyze marketing campaign performance and ROI'
        },
        { 
          label: 'Lead Source Analysis', 
          icon: <Target className="h-4 w-4" />,
          prompt: 'Analyze lead sources and their conversion rates'
        },
        { 
          label: 'Market Trends', 
          icon: <Sparkles className="h-4 w-4" />,
          prompt: 'Identify relevant market trends and their impact on our business'
        }
      ]
    },
    {
      category: 'Risk',
      actions: [
        { 
          label: 'Risk Assessment', 
          icon: <AlertTriangle className="h-4 w-4" />,
          prompt: 'Identify potential risks and mitigation strategies'
        },
        { 
          label: 'Compliance Review', 
          icon: <FileText className="h-4 w-4" />,
          prompt: 'Review compliance status and identify areas needing attention'
        },
        { 
          label: 'Performance Alerts', 
          icon: <AlertTriangle className="h-4 w-4" />,
          prompt: 'Identify performance issues that need immediate attention'
        }
      ]
    }
  ];

  // Initialize with a default session
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !currentSession) return;

    const newFiles = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      sessionId: currentSession.id
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setSelectedFiles(Array.from(files));
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
    handleSendMessage(prompt);
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage;
    if (!content.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
      attachments: selectedFiles.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'file',
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      }))
    };

    // Update current session with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      updatedAt: new Date(),
      title: currentSession.messages.length === 0 ? content.slice(0, 50) + '...' : currentSession.title
    };

    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
    setInputMessage('');
    setSelectedFiles([]);
    setIsLoading(true);

    try {
      // Use the agent orchestrator to get AI response
      const response = await executeAgentTask(
        'managerAgent_v1',
        'strategic_analysis',
        {
          query: content,
          attachments: selectedFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          })),
          context: {
            sessionId: currentSession.id,
            previousMessages: currentSession.messages.slice(-5) // Last 5 messages for context
          }
        }
      );

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'ai',
        content: response.output_payload?.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
        metadata: {
          model: response.output_payload?.model || 'managerAgent_v1',
          sources: response.output_payload?.sources || [],
          confidence: response.output_payload?.confidence || 0.85
        }
      };

      // Update session with AI response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        updatedAt: new Date()
      };

      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? finalSession : s));

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };

      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage],
        updatedAt: new Date()
      };

      setCurrentSession(errorSession);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? errorSession : s));
      
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const togglePinSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, isPinned: !session.isPinned }
        : session
    ));
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setCurrentSession(remainingSessions[0] || null);
    }
  };

  const exportSession = (session: ChatSession) => {
    const content = session.messages.map(msg => 
      `${msg.type.toUpperCase()} [${msg.timestamp.toLocaleString()}]: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-session-${session.title.replace(/[^a-z0-9]/gi, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">AI Assistant</h2>
              <Button onClick={createNewSession} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="p-4">
              <div className="space-y-4">
                {/* Projects Section */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Projects
                  </h3>
                  <ScrollArea className="h-60">
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentSession?.id === session.id
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                          onClick={() => setCurrentSession(session)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {session.title}
                              </p>
                              <p className="text-xs text-slate-500">
                                {session.updatedAt.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {session.isPinned && (
                                <Pin className="h-3 w-3 text-blue-500" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinSession(session.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Pin className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSession(session.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Separator />

                {/* Data Uploads Section */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Data Uploads
                  </h3>
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentSession ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                      {currentSession.title}
                    </h1>
                    <p className="text-sm text-slate-500">
                      Your intelligent COO companion
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportSession(currentSession)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <div className="flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2 bg-slate-50 px-2 py-1 rounded">
                                  <FileText className="h-3 w-3" />
                                  <span className="text-xs">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.metadata && (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {message.metadata.model}
                              </Badge>
                              {message.metadata.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(message.metadata.confidence * 100)}%
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-slate-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="bg-white border-t border-slate-200 p-4">
                {selectedFiles.length > 0 && (
                  <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Selected Files ({selectedFiles.length})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFiles([])}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white px-2 py-1 rounded border">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about your business, team, or strategy..."
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Welcome to your AI Assistant
                </h2>
                <p className="text-slate-600 mb-4">
                  Your intelligent COO companion for strategic insights
                </p>
                <Button onClick={createNewSession} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="w-80 bg-white border-l border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {quickActions.map((category) => (
                <div key={category.category}>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => handleQuickAction(action.prompt)}
                      >
                        <div className="flex items-center space-x-2">
                          {action.icon}
                          <span className="text-xs">{action.label}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".doc,.docx,.pdf,.xlsx,.xls,.txt,.csv"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default AIAssistant;
