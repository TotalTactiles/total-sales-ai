
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText,
  Folder,
  Clock,
  Pin,
  Upload,
  Zap,
  Users,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Mic
} from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projects = [
    { id: '1', name: 'Q1 Sales Strategy', lastUpdated: new Date(), messageCount: 23 },
    { id: '2', name: 'Team Performance Review', lastUpdated: new Date(), messageCount: 15 },
    { id: '3', name: 'Lead Optimization', lastUpdated: new Date(), messageCount: 8 }
  ];

  const recentChats = [
    { id: '1', title: 'Sales Pipeline Analysis', timestamp: new Date(), pinned: true },
    { id: '2', title: 'Team Coaching Insights', timestamp: new Date(), pinned: false },
    { id: '3', title: 'Market Trend Discussion', timestamp: new Date(), pinned: true }
  ];

  const uploads = [
    { id: '1', name: 'Q4_Sales_Report.pdf', type: 'pdf', uploadDate: new Date() },
    { id: '2', name: 'Team_Performance.xlsx', type: 'excel', uploadDate: new Date() },
    { id: '3', name: 'Strategy_Diagram.png', type: 'image', uploadDate: new Date() }
  ];

  const quickActions = {
    team: [
      'Analyze team performance metrics',
      'Generate coaching recommendations',
      'Create motivation strategies',
      'Review individual rep progress'
    ],
    ops: [
      'Optimize sales process',
      'Review pipeline efficiency',
      'Analyze conversion rates',
      'Identify bottlenecks'
    ],
    marketing: [
      'Review lead quality',
      'Analyze campaign performance',
      'Generate content ideas',
      'Optimize targeting'
    ],
    risk: [
      'Identify at-risk deals',
      'Review retention metrics',
      'Analyze churn patterns',
      'Generate risk reports'
    ]
  };

  const [selectedCategory, setSelectedCategory] = useState<keyof typeof quickActions>('team');

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice activation logic would go here
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Message sending logic
      setMessage('');
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        
        {/* Projects */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Projects
          </h3>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  activeProject === project.id ? 'bg-primary/10' : 'hover:bg-muted'
                }`}
                onClick={() => setActiveProject(project.id)}
              >
                <div className="font-medium text-sm">{project.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  {project.messageCount} messages
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            <Folder className="h-3 w-3 mr-1" />
            New Project
          </Button>
        </div>

        {/* Memory */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Memory
          </h3>
          <div className="space-y-2">
            {recentChats.map((chat) => (
              <div key={chat.id} className="p-2 rounded hover:bg-muted cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm truncate">{chat.title}</div>
                  {chat.pinned && <Pin className="h-3 w-3 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Uploads */}
        <div className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Data Uploads
          </h3>
          <div className="space-y-2">
            {uploads.map((upload) => (
              <div key={upload.id} className="p-2 rounded hover:bg-muted cursor-pointer">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  <div className="font-medium text-sm truncate">{upload.name}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {upload.uploadDate.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">AI Assistant</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Zap className="h-3 w-3 mr-1" />
                AI Fusion Active
              </Badge>
              <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                onClick={handleVoiceToggle}
              >
                <Mic className="h-4 w-4 mr-1" />
                {isListening ? 'Listening...' : 'Hey Sam'}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-2">AI Assistant</div>
                <p>Hello! I'm your AI assistant. I can help you with team management, business operations, marketing insights, and more. Upload files, ask questions, or use the quick actions on the right to get started.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your business, team, or upload files for analysis..."
                  className="min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                      <Image className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                      multiple
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supports DOC, PDF, XLSX, and images
                  </div>
                </div>
              </div>
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Quick Actions */}
      <div className="w-80 border-l bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Context-aware prompts</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.keys(quickActions).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category as keyof typeof quickActions)}
                className="capitalize"
              >
                {category === 'team' && <Users className="h-3 w-3 mr-1" />}
                {category === 'ops' && <TrendingUp className="h-3 w-3 mr-1" />}
                {category === 'marketing' && <Zap className="h-3 w-3 mr-1" />}
                {category === 'risk' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {category}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {quickActions[selectedCategory].map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full text-left justify-start h-auto p-3"
                onClick={() => setMessage(action)}
              >
                <div className="text-sm">{action}</div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
