import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Save, Plus } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface LeadNotesTabProps {
  lead: Lead;
}

const LeadNotesTab: React.FC<LeadNotesTabProps> = ({ lead }) => {
  const [newNote, setNewNote] = useState('');
  const [isAiAssisting, setIsAiAssisting] = useState(false);

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

  const handleAiAssist = () => {
    setIsAiAssisting(true);
    // Simulate AI processing
    setTimeout(() => {
      const aiSuggestion = `Hi ${lead.name.split(' ')[0]},\n\nFollowing up on our great conversation about streamlining your manual processes. Based on what you shared about spending 20+ hours per week on these tasks, I've prepared a customized ROI calculator that shows potential savings of $45,000+ annually.\n\nWould you be available for a 15-minute call this week to walk through the numbers?\n\nBest regards`;
      setNewNote(aiSuggestion);
      setIsAiAssisting(false);
      toast.success('AI has generated a personalized note based on your conversation history');
    }, 2000);
  };

  const handleSaveNote = () => {
    if (newNote.trim()) {
      toast.success('Note saved successfully');
      setNewNote('');
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* New Note Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Add New Note
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAiAssist}
              disabled={isAiAssisting}
            >
              <Brain className="h-4 w-4 mr-2" />
              {isAiAssisting ? 'AI Thinking...' : 'AI Assist'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write a note about your interaction with this lead..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[120px]"
          />
          
          {isAiAssisting && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
                <span className="text-sm text-blue-700">AI is analyzing your conversation history and generating suggestions...</span>
              </div>
            </div>
          )}
          
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
    </div>
  );
};

export default LeadNotesTab;
