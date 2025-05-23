
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  X, 
  Brain, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail,
  Calendar,
  User,
  TrendingUp,
  Clock,
  HelpCircle,
  Mic,
  Send
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface LeadSlidePanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const LeadSlidePanel: React.FC<LeadSlidePanelProps> = ({ lead, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [autoSummaryEnabled, setAutoSummaryEnabled] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [aiDraftMode, setAiDraftMode] = useState(false);

  const { trackEvent } = useUsageTracking();

  if (!isOpen || !lead) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackEvent({
      feature: 'lead_slide_panel_tab',
      action: 'change',
      context: 'lead_management',
      metadata: { tab, leadId: lead.id }
    });
  };

  const handleAIAssist = () => {
    trackEvent({
      feature: 'ai_assist_draft',
      action: 'generate',
      context: 'lead_slide_panel'
    });
    
    // Mock AI draft generation
    const aiDraft = `Hi ${lead.name.split(' ')[0]},\n\nI wanted to follow up on our previous conversation about ${lead.company}'s needs. Based on your current engagement score of ${lead.score}%, I believe we can help you achieve significant ROI.\n\nWould you be available for a 15-minute call this week to discuss next steps?\n\nBest regards`;
    setNewNote(aiDraft);
    setAiDraftMode(true);
  };

  const mockTimeline = [
    {
      id: 1,
      type: 'call',
      title: 'Discovery Call Completed',
      description: 'Discussed budget and timeline. Very interested in Q1 implementation.',
      timestamp: '2 days ago',
      sentiment: 'positive'
    },
    {
      id: 2,
      type: 'email',
      title: 'Pricing Information Sent',
      description: 'Forwarded detailed pricing breakdown and ROI calculator.',
      timestamp: '5 days ago',
      sentiment: 'neutral'
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Initial Demo Scheduled',
      description: 'Set up product demo for next Tuesday at 2 PM EST.',
      timestamp: '1 week ago',
      sentiment: 'positive'
    }
  ];

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[600px] lg:w-[700px] bg-white shadow-xl transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="font-semibold">{lead.name}</h2>
              <p className="text-sm text-slate-500">{lead.company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${
              lead.priority === 'high' ? 'bg-red-100 text-red-800' :
              lead.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {lead.priority} priority
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AI Summary Toggle */}
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AI Auto-Summary</span>
            </div>
            <Switch 
              checked={autoSummaryEnabled} 
              onCheckedChange={setAutoSummaryEnabled}
            />
          </div>
          
          {autoSummaryEnabled && (
            <div className="mt-3 p-3 bg-white rounded-lg border">
              <p className="text-sm text-slate-700">
                <strong>What's happening:</strong> {lead.name} from {lead.company} is highly engaged ({lead.score}% score) 
                but hasn't responded to the last follow-up. They downloaded pricing info 3x this week.
              </p>
              <p className="text-sm text-blue-600 mt-2">
                <strong>Next step:</strong> Send ROI calculator with personalized savings estimate. 
                Call probability: 78% if contacted within 24 hours.
              </p>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="communication">Comms</TabsTrigger>
              <TabsTrigger value="ai-assist">AI Assist</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4 space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Score</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{lead.score}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium">Last Contact</span>
                    </div>
                    <p className="text-sm font-semibold">{lead.lastContact || 'Never'}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <div className="space-y-4">
                {mockTimeline.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.type === 'call' ? 'bg-green-100' :
                          event.type === 'email' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {event.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                          {event.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {event.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <span className="text-xs text-slate-500">{event.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="communication" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    New Communication
                    <Button variant="outline" size="sm" onClick={handleAIAssist}>
                      <Brain className="h-4 w-4 mr-2" />
                      AI Draft
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Write a note, email, or task..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  {aiDraftMode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">AI-Generated Draft</span>
                      </div>
                      <p className="text-xs text-blue-600">
                        This draft is optimized for {lead.company}'s industry and your success patterns.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Save Note
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-assist" className="mt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-600" />
                      AI Assistant for {lead.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Generate follow-up sequence
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analyze engagement patterns
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Find similar successful leads
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Get team collaboration help
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LeadSlidePanel;
