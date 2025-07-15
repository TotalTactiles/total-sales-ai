
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  FileText, 
  Image, 
  Folder,
  Memory,
  Upload,
  Zap,
  Users,
  BarChart3,
  Target,
  AlertTriangle,
  Mic,
  Send
} from 'lucide-react';
import { aiConfig, generateMockAIResponse } from '@/config/ai';

const AIAssistantPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const contextualPrompts = {
    team: [
      "Analyze current team performance metrics",
      "Suggest coaching priorities for underperforming reps",
      "Generate weekly team motivation strategies"
    ],
    operations: [
      "Review operational efficiency bottlenecks",
      "Optimize workflow automation sequences", 
      "Analyze cost reduction opportunities"
    ],
    marketing: [
      "Evaluate lead source performance",
      "Suggest campaign optimization strategies",
      "Generate competitive analysis insights"
    ],
    risk: [
      "Identify potential pipeline risks",
      "Analyze deal closure probability",
      "Review compliance and security status"
    ]
  };

  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    const userMessage = {
      role: 'user' as const,
      content: message || `[Uploaded ${selectedFiles.length} file(s)]`,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Mock AI response (disabled)
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        content: generateMockAIResponse('generic'),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
    setSelectedFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left Sidebar - Projects & Memory */}
      <div className="col-span-3 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">
              <p className="text-sm font-medium">Q4 Strategy Planning</p>
              <p className="text-xs text-muted-foreground">3 conversations</p>
            </div>
            <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">
              <p className="text-sm font-medium">Team Performance Review</p>
              <p className="text-xs text-muted-foreground">7 conversations</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              New Project
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Memory className="h-4 w-4" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">
              <p className="text-sm">Lead scoring insights</p>
              <p className="text-xs text-muted-foreground">Pinned</p>
            </div>
            <div className="p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted">
              <p className="text-sm">Pipeline optimization</p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Data Uploads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <input
              type="file"
              multiple
              accept=".doc,.docx,.pdf,.xlsx,.xls,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <span>Upload Files</span>
              </Button>
            </label>
            {selectedFiles.length > 0 && (
              <div className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-xs p-1 bg-muted rounded">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <div className="col-span-6 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <Badge variant={aiConfig.enabled ? "default" : "secondary"}>
                {aiConfig.enabled ? "Active" : "Demo Mode"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with your AI assistant</p>
                  <p className="text-sm">Upload files, ask questions, or use quick actions</p>
                </div>
              ) : (
                chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        chat.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{chat.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {chat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about team performance, strategy, or upload files for analysis..."
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="outline">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  Document
                </Button>
                <Button variant="outline" size="sm">
                  <Image className="h-3 w-3 mr-1" />
                  Image
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Spreadsheet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Context-Aware Quick Actions */}
      <div className="col-span-3 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="team" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
                <TabsTrigger value="ops" className="text-xs">Ops</TabsTrigger>
              </TabsList>
              
              <TabsContent value="team" className="space-y-2 mt-3">
                {contextualPrompts.team.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2"
                    onClick={() => setMessage(prompt)}
                  >
                    <Users className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="text-xs">{prompt}</span>
                  </Button>
                ))}
              </TabsContent>
              
              <TabsContent value="ops" className="space-y-2 mt-3">
                {contextualPrompts.operations.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2"
                    onClick={() => setMessage(prompt)}
                  >
                    <BarChart3 className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="text-xs">{prompt}</span>
                  </Button>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Marketing & Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contextualPrompts.marketing.slice(0, 2).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start h-auto p-2"
                onClick={() => setMessage(prompt)}
              >
                <Target className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="text-xs">{prompt}</span>
              </Button>
            ))}
            {contextualPrompts.risk.slice(0, 1).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start h-auto p-2"
                onClick={() => setMessage(prompt)}
              >
                <AlertTriangle className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="text-xs">{prompt}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {!aiConfig.enabled && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">
                AI features are disabled. Responses are simulated for demonstration.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPanel;
