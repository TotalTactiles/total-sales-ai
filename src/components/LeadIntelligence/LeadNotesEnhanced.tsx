
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Paperclip, 
  User, 
  Brain, 
  Calendar,
  Image,
  File,
  Mic,
  Video,
  Phone,
  Plus,
  CheckSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

interface LeadNotesEnhancedProps {
  lead: Lead;
  aiDelegationMode: boolean;
}

interface Note {
  id: string;
  content: string;
  author: string;
  authorType: 'user' | 'ai' | 'system';
  timestamp: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'document' | 'audio' | 'video';
    url: string;
  }>;
  source?: 'manual' | 'dialer' | 'ai_assistant' | 'form';
}

const LeadNotesEnhanced: React.FC<LeadNotesEnhancedProps> = ({ lead, aiDelegationMode }) => {
  const [newNote, setNewNote] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Initial discovery call completed. Emily expressed strong interest in ROI tracking features and mentioned budget approval for Q1 implementation. Key pain point: manual reporting taking 3+ hours weekly.',
      author: 'Sarah Johnson',
      authorType: 'user',
      timestamp: '2024-01-14T16:30:00Z',
      source: 'manual',
      attachments: [
        {
          id: 'att1',
          name: 'Discovery Call Notes.pdf',
          type: 'document',
          url: '#'
        }
      ]
    },
    {
      id: '2',
      content: 'Follow-up call scheduled for Thursday 2 PM EST. Emily mentioned HIPAA compliance concerns - need to prepare compliance documentation.',
      author: 'Michael Chen',
      authorType: 'user',
      timestamp: '2024-01-15T09:20:00Z',
      source: 'dialer',
      attachments: [
        {
          id: 'att2',
          name: 'Call Recording.mp3',
          type: 'audio',
          url: '#'
        }
      ]
    },
    {
      id: '3',
      content: 'AI Analysis: Based on engagement patterns, Emily shows 89% buying intent. Similar healthcare companies convert at 76% rate when contacted within 48 hours of pricing download.',
      author: 'AI Assistant',
      authorType: 'ai',
      timestamp: '2024-01-15T14:15:00Z',
      source: 'ai_assistant'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoFillSuggestions = [
    'Discussed budget range of $10K-$50K',
    'Decision maker identified',
    'Competitor mentioned: Salesforce',
    'Timeline: Q1 implementation',
    'Follow-up scheduled for next week'
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User',
      authorType: 'user',
      timestamp: new Date().toISOString(),
      source: 'manual'
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');
    setShowSuggestions(false);
    toast.success('Note added successfully');
  };

  const handleAddTask = () => {
    if (!newNote.trim()) return;

    // Convert note to task and open task modal
    toast.success('Opening task creation modal...');
    // This would open a modal to convert the note into a task
  };

  const handleAINote = () => {
    const aiNote: Note = {
      id: Date.now().toString(),
      content: `AI Generated Note: ${lead.name} from ${lead.company} is showing strong engagement signals. Recent activity includes multiple pricing page visits and case study downloads. Recommend scheduling follow-up call within 24 hours for optimal conversion probability.`,
      author: 'AI Assistant',
      authorType: 'ai',
      timestamp: new Date().toISOString(),
      source: 'ai_assistant'
    };

    setNotes(prev => [aiNote, ...prev]);
    toast.success('AI note generated');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      toast.success(`File "${file.name}" attached (demo)`);
      // In real implementation, would upload file and add to current note
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewNote(prev => prev + (prev ? ' ' : '') + suggestion);
    setShowSuggestions(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSourceBadge = (source?: string, authorType?: string) => {
    if (authorType === 'ai') {
      return <Badge className="bg-blue-100 text-blue-800 text-xs"><Brain className="h-3 w-3 mr-1" />AI Generated</Badge>;
    }
    
    switch (source) {
      case 'dialer':
        return <Badge className="bg-green-100 text-green-800 text-xs"><Phone className="h-3 w-3 mr-1" />Call Session</Badge>;
      case 'ai_assistant':
        return <Badge className="bg-blue-100 text-blue-800 text-xs"><Brain className="h-3 w-3 mr-1" />AI Assistant</Badge>;
      case 'form':
        return <Badge className="bg-purple-100 text-purple-800 text-xs">Form Entry</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Manual</Badge>;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-3 w-3" />;
      case 'document': return <File className="h-3 w-3" />;
      case 'audio': return <Mic className="h-3 w-3" />;
      case 'video': return <Video className="h-3 w-3" />;
      default: return <File className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Always-visible Note Input */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                placeholder={`Add a note about ${lead.name}...`}
                value={newNote}
                onChange={(e) => {
                  setNewNote(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                className="min-h-[80px] text-sm resize-none"
                onFocus={() => setShowSuggestions(newNote.length > 0)}
              />
              
              {/* Auto-fill Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b bg-gray-50">
                    <span className="text-xs text-gray-600">Suggestions</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {autoFillSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs"
                >
                  <Paperclip className="h-3 w-3 mr-1" />
                  Attach
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAINote}
                  className="h-7 text-xs"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  AI Note
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTask}
                  disabled={!newNote.trim()}
                  className="h-7 text-xs"
                >
                  <CheckSquare className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
                
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4,.mov"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Notes Timeline Feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Notes Timeline ({notes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {notes.map((note, index) => (
            <div key={note.id}>
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={`text-xs ${
                    note.authorType === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {note.authorType === 'ai' ? (
                      <Brain className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium">{note.author}</span>
                    {getSourceBadge(note.source, note.authorType)}
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatTimestamp(note.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    {note.content}
                  </p>
                  
                  {note.attachments && note.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-1 bg-slate-50 border rounded px-2 py-1 text-xs hover:bg-slate-100 cursor-pointer"
                        >
                          {getAttachmentIcon(attachment.type)}
                          <span className="text-slate-600">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {index < notes.length - 1 && (
                <div className="ml-5 mt-4 border-l border-gray-200 h-4"></div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadNotesEnhanced;
