
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Save, Mic, Phone, Mail, User, FileText, Paperclip, Send } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import UnifiedAIAssistant from '../../UnifiedAI/UnifiedAIAssistant';

interface LeadNotesTabProps {
  lead: Lead;
}

const LeadNotesTab: React.FC<LeadNotesTabProps> = ({ lead }) => {
  const [newNote, setNewNote] = useState('');
  const [isAIAssisting, setIsAIAssisting] = useState(false);

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
      case 'suggest_note':
        setNewNote(`Follow-up call with ${lead.name} - ${new Date().toLocaleDateString()}\n\nKey Discussion Points:\n• \n• \n• \n\nNext Steps:\n• \n• \n\nDecision Timeline: \nBudget: \nStakeholders: `);
        toast.success('AI note template added');
        break;
      default:
        console.log('Notes AI Action:', action, data);
    }
  };

  const handleVoiceNote = () => {
    toast.info('Say "Hey TSAM" to dictate your note');
    setIsAIAssisting(true);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'call':
        return <Phone className="h-3 w-3 text-green-600" />;
      case 'email':
        return <Mail className="h-3 w-3 text-blue-600" />;
      case 'meeting':
        return <User className="h-3 w-3 text-purple-600" />;
      default:
        return <FileText className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Always-visible Note Input */}
      <Card className="mb-6 border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Add Note for {lead.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Add a note about ${lead.name}... 

Pro tip: Say "Hey TSAM" to dictate your note or get AI assistance!`}
              className="min-h-[120px] pr-12 resize-none"
              rows={5}
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceNote}
                className="h-8 w-8 p-0"
                title="Voice dictation"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAIAction('suggest_note')}
                className="h-8"
              >
                <Brain className="h-3 w-3 mr-1" />
                AI Template
              </Button>
              <span className="text-xs text-gray-500">
                {newNote.length} characters
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewNote('')}
                disabled={!newNote}
                className="h-8"
              >
                Clear
              </Button>
              <Button
                onClick={handleSaveNote}
                disabled={!newNote.trim()}
                className="h-8"
              >
                <Save className="h-3 w-3 mr-1" />
                Save Note
              </Button>
            </div>
          </div>
          
          {/* Quick Note Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-xs text-gray-600 font-medium mr-2">Quick Actions:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewNote(prev => prev + '\n\n📞 Call completed - ')}
              className="h-6 text-xs px-2"
            >
              📞 Call Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewNote(prev => prev + '\n\n📧 Email sent - ')}
              className="h-6 text-xs px-2"
            >
              📧 Email Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewNote(prev => prev + '\n\n🤝 Meeting - ')}
              className="h-6 text-xs px-2"
            >
              🤝 Meeting Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewNote(prev => prev + '\n\n✅ Next steps: ')}
              className="h-6 text-xs px-2"
            >
              ✅ Next Steps
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes History */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notes History ({mockNotes.length})</h3>
          <Button variant="outline" size="sm">
            <FileText className="h-3 w-3 mr-1" />
            Export All
          </Button>
        </div>
        
        {mockNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getSourceIcon(note.source)}
                  <span className="text-sm font-medium text-gray-700">{note.author}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{note.timestamp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Brain className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>
              
              {note.source === 'call' && (
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    Follow Up
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Mail className="h-3 w-3 mr-1" />
                    Send Summary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Assistant for Notes Context */}
      <UnifiedAIAssistant
        context={{
          workspace: 'notes',
          currentLead: lead
        }}
        onAction={handleAIAction}
        className="notes-ai-assistant"
      />
    </div>
  );
};

export default LeadNotesTab;
