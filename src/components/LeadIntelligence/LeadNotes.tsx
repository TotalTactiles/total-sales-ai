
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Plus, 
  Paperclip, 
  User, 
  Brain, 
  Calendar,
  MessageSquare,
  Image,
  File
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Lead } from '@/types/lead';

interface LeadNotesProps {
  lead: Lead;
  aiDelegationMode: boolean;
}

interface Note {
  id: string;
  content: string;
  author: string;
  authorType: 'user' | 'ai';
  timestamp: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'document' | 'link';
    url: string;
  }>;
}

const LeadNotes: React.FC<LeadNotesProps> = ({ lead, aiDelegationMode }) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { trackEvent } = useUsageTracking();

  // Mock notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Initial discovery call completed. Emily expressed strong interest in ROI tracking features and mentioned budget approval for Q1 implementation. Key pain point: manual reporting taking 3+ hours weekly.',
      author: 'Sarah Johnson',
      authorType: 'user',
      timestamp: '2024-01-14T16:30:00Z',
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
      content: 'AI Analysis: Based on engagement patterns, Emily shows 89% buying intent. Similar healthcare companies convert at 76% rate when contacted within 48 hours of pricing download. Recommend immediate follow-up with ROI calculator.',
      author: 'AI Assistant',
      authorType: 'ai',
      timestamp: '2024-01-14T17:15:00Z'
    },
    {
      id: '3',
      content: 'Sent personalized ROI calculator showing potential $45K annual savings. Emily responded within 2 hours requesting demo for her team. Scheduled for Thursday 2 PM EST.',
      author: 'Michael Chen',
      authorType: 'user',
      timestamp: '2024-01-15T09:20:00Z'
    },
    {
      id: '4',
      content: 'Follow-up required: Emily mentioned HIPAA compliance concerns during last call. Need to prepare compliance documentation for Thursday\'s demo.',
      author: 'Sarah Johnson',
      authorType: 'user',
      timestamp: '2024-01-15T14:45:00Z',
      attachments: [
        {
          id: 'att2',
          name: 'HIPAA Compliance Checklist.docx',
          type: 'document',
          url: '#'
        },
        {
          id: 'att3',
          name: 'Security Overview.png',
          type: 'image',
          url: '#'
        }
      ]
    }
  ]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User',
      authorType: 'user',
      timestamp: new Date().toISOString()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');
    setIsAddingNote(false);

    trackEvent({
      feature: 'lead_notes',
      action: 'add_note',
      context: 'lead_intelligence',
      metadata: { leadId: lead.id, noteLength: newNote.length }
    });

    toast.success('Note added successfully');
  };

  const handleAINote = () => {
    const aiNote: Note = {
      id: Date.now().toString(),
      content: `AI Generated Note: ${lead.name} from ${lead.company} is showing strong engagement signals. Recent activity includes multiple pricing page visits and case study downloads. Recommend scheduling follow-up call within 24 hours for optimal conversion probability.`,
      author: 'AI Assistant',
      authorType: 'ai',
      timestamp: new Date().toISOString()
    };

    setNotes(prev => [aiNote, ...prev]);

    trackEvent({
      feature: 'lead_notes',
      action: 'ai_generate_note',
      context: 'lead_intelligence',
      metadata: { leadId: lead.id }
    });

    toast.success('AI note generated');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-3 w-3" />;
      case 'document': return <File className="h-3 w-3" />;
      case 'link': return <FileText className="h-3 w-3" />;
      default: return <File className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Add Note Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Add Note
            </CardTitle>
            <div className="flex gap-2">
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
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isAddingNote ? (
            <div className="space-y-3">
              <Textarea
                placeholder={`Add a note about ${lead.name}...`}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Paperclip className="h-3 w-3 mr-1" />
                    Attach
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote('');
                    }}
                    className="h-7 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="h-7 text-xs"
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full h-8 text-sm justify-start"
              onClick={() => setIsAddingNote(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add a note about {lead.name}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notes History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4" />
            Notes History ({notes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{note.author}</span>
                    {note.authorType === 'ai' && (
                      <Badge variant="secondary" className="text-xs h-4 px-1">
                        AI
                      </Badge>
                    )}
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
              
              {index < notes.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadNotes;
