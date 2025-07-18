
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Save, Plus, Phone, Paperclip, FileText } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface LeadNotesTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate: (field: string, value: any) => void;
}

const LeadNotesTab: React.FC<LeadNotesTabProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  const [newNote, setNewNote] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const mockNotes = [
    {
      id: 1,
      content: 'Discovery call went very well. Michael is the decision maker and has budget approved for Q1. Main pain point is manual processes taking 20+ hours per week.',
      timestamp: '2 days ago',
      author: 'You',
      source: 'manual',
      attachments: []
    },
    {
      id: 2,
      content: 'Call with John Smith - 04/06/2025\n\nDuration: 27:30\nKey Points:\n• Very interested in automation features\n• Budget range: $50k-100k\n• Decision timeline: Q1 2025',
      timestamp: '2 weeks ago',
      author: 'You',
      source: 'call',
      attachments: ['call-recording.mp3']
    }
  ];

  const handleSaveNote = () => {
    if (newNote.trim()) {
      toast.success('Note saved successfully');
      setNewNote('');
    }
  };

  const handleCreateTask = () => {
    if (newNote.trim()) {
      toast.success('Task created from note');
      setNewNote('');
    }
  };

  const handleAINote = async () => {
    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const aiNote = `AI Summary for ${lead.name} (${new Date().toLocaleDateString()}):\n\nLead is highly engaged with ${lead.score}% score. Recent activity shows strong interest in our solution. Recommended next steps:\n• Follow up on pricing discussion\n• Schedule demo for next week\n• Send ROI calculator\n\nBest contact time: Tuesday-Thursday 10 AM - 2 PM`;
      setNewNote(aiNote);
      toast.success('AI has generated a contextual note');
    } catch (error) {
      toast.error('Failed to generate AI note');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'call':
        return <Phone className="h-3 w-3 text-green-600" />;
      case 'manual':
        return <FileText className="h-3 w-3 text-blue-600" />;
      default:
        return <FileText className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Always-visible Note Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write a note about your interaction with this lead..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[120px]"
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Add Note
            </Button>
            
            <Button variant="outline" onClick={handleCreateTask} disabled={!newNote.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleAINote}
              disabled={isGeneratingAI}
            >
              <Bot className="h-4 w-4 mr-2" />
              {isGeneratingAI ? 'Generating...' : 'AI Note'}
            </Button>
            
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes Timeline Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNotes.map((note) => (
              <div key={note.id} className="border-l-4 border-blue-200 pl-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{note.author}</span>
                    {getSourceIcon(note.source)}
                    {note.source === 'call' && (
                      <Badge variant="secondary" className="text-xs">
                        📞 Call Session
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{note.timestamp}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{note.content}</p>
                
                {note.attachments.length > 0 && (
                  <div className="mt-2">
                    {note.attachments.map((attachment, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1">
                        <Paperclip className="h-3 w-3 mr-1" />
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadNotesTab;
