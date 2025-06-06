import { logger } from '@/utils/logger';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Save, Plus, Phone, Target, TrendingUp, Clock } from 'lucide-react';
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
      author: 'You',
      source: 'call'
    },
    {
      id: 2,
      content: 'Follow-up email sent with pricing info. He mentioned they\'re also talking to CompetitorX but we have a good relationship advantage.',
      timestamp: '1 week ago',
      author: 'You',
      source: 'email'
    },
    {
      id: 3,
      content: 'Call with John Smith - 04/06/2025\n\nDuration: 27:30\nCompany: TechCorp Solutions\n\nKey Points:\n• Very interested in automation features\n• Current manual process taking 15+ hours/week\n• Budget range: $50k-100k\n• Decision timeline: Q1 2025\n\nNext Steps:\n• Send technical demo link\n• Schedule follow-up for next week\n• Prepare ROI calculator\n\nDecision Timeline: Q1 2025\nBudget: $50,000 - $100,000\nStakeholders: John (VP Sales), Mary (CFO)',
      timestamp: '2 weeks ago',
      author: 'You',
      source: 'call'
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
        logger.info('Notes AI Action:', action, data);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'call':
        return <Phone className="h-3 w-3 text-green-600" />;
      case 'email':
        return <div className="h-3 w-3 bg-blue-600 rounded-full" />;
      default:
        return null;
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

      {/* Sync Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">Call Notes Sync</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Notes taken during live calls automatically appear here. All notes are synchronized across the dialer and lead management.
          </p>
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{note.author}</span>
                    {getSourceIcon(note.source)}
                  </div>
                  <span className="text-xs text-slate-500">{note.timestamp}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{note.content}</p>
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
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Key themes: Budget approved, Q1 timeline, manual process pain
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Sentiment trend: Positive → Very positive (improving)
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last substantive update: 2 days ago (follow-up recommended)
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
