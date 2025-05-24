import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Save, Plus } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import UnifiedAIAssistant from '../../UnifiedAI/UnifiedAIAssistant';

interface LeadNotesTabProps {
  lead: Lead;
}

const LeadNotesTab: React.FC<LeadNotesTabProps> = ({ lead }) => {
  const [newNote, setNewNote] = useState('');

  const mockNotes = [
    {
      id: 1,
      content: 'Discovery call went very well. Michael is the decision maker and has budget approved for Q1. Main pain point is manual processes taking 20+ hours per week. Interested in ROI calculator.',
      timestamp: '2 days ago',
      author: 'You'
    },
    {
      id: 2,
      content: 'Follow-up email sent with pricing info. He mentioned they\'re also talking to CompetitorX but we have a good relationship advantage.',
      timestamp: '1 week ago',
      author: 'You'
    },
    {
      id: 3,
      content: 'Initial contact - very responsive and friendly. Seems like a good cultural fit. Company has 150 employees in manufacturing.',
      timestamp: '2 weeks ago',
      author: 'You'
    }
  ];

  const handleSaveNote = () => {
    if (newNote.trim()) {
      toast.success('Note saved successfully');
      setNewNote('');
    }
  };

  const handleAIAction = (action: string, data?: any) => {
    switch (action) {
      case 'ai_response':
        if (data?.response) {
          setNewNote(data.response);
          toast.success('AI has generated note content');
        }
        break;
      default:
        console.log('Notes AI Action:', action, data);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* New Note Section */}
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
          
          <div className="flex gap-2">
            <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Save as Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Previous Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNotes.map((note) => (
              <div key={note.id} className="border-l-4 border-blue-200 pl-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{note.author}</span>
                  <span className="text-xs text-slate-500">{note.timestamp}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights on Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            AI Note Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-xs text-slate-600">
              🎯 Key themes: Budget approved, Q1 timeline, manual process pain
            </p>
            <p className="text-xs text-slate-600">
              📈 Sentiment trend: Positive → Very positive (improving)
            </p>
            <p className="text-xs text-slate-600">
              ⏰ Last substantive update: 2 days ago (follow-up recommended)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unified AI Assistant */}
      <UnifiedAIAssistant
        context={{
          workspace: 'notes',
          currentLead: lead
        }}
        onAction={handleAIAction}
      />
    </div>
  );
};

export default LeadNotesTab;
