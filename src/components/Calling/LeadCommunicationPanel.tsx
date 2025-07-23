
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Mail, 
  FileText, 
  Send, 
  Phone,
  Calendar,
  User
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LeadCommunicationPanelProps {
  lead: Lead;
  sessionId?: string;
}

interface Communication {
  id: string;
  type: 'note' | 'sms' | 'email' | 'call';
  content: string;
  direction: 'inbound' | 'outbound';
  created_at: string;
  status: 'sent' | 'delivered' | 'failed';
  metadata?: Record<string, any>;
}

const LeadCommunicationPanel: React.FC<LeadCommunicationPanelProps> = ({ lead, sessionId }) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newSMS, setNewSMS] = useState('');
  const [newEmail, setNewEmail] = useState({ subject: '', body: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    fetchCommunications();
  }, [lead.id]);

  const fetchCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  const sendCommunication = async (type: 'note' | 'sms' | 'email', content: string, metadata?: Record<string, any>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('unified-communication', {
        body: {
          type,
          leadId: lead.id,
          userId: (await supabase.auth.getUser()).data.user?.id,
          companyId: lead.company_id,
          content,
          metadata: {
            ...metadata,
            phone: lead.phone,
            email: lead.email,
            sessionId
          }
        }
      });

      if (error) throw error;

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent successfully`);
      
      // Clear form
      if (type === 'note') setNewNote('');
      if (type === 'sms') setNewSMS('');
      if (type === 'email') setNewEmail({ subject: '', body: '' });
      
      // Refresh communications
      fetchCommunications();
    } catch (error) {
      console.error(`Error sending ${type}:`, error);
      toast.error(`Failed to send ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNote = () => {
    if (!newNote.trim()) return;
    sendCommunication('note', newNote);
  };

  const handleSendSMS = () => {
    if (!newSMS.trim()) return;
    sendCommunication('sms', newSMS);
  };

  const handleSendEmail = () => {
    if (!newEmail.subject.trim() || !newEmail.body.trim()) return;
    sendCommunication('email', newEmail.body, { subject: newEmail.subject });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-800';
      case 'sms': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      case 'call': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {lead.name} - Communications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Note</label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                className="min-h-[100px]"
              />
              <Button onClick={handleSendNote} disabled={isLoading || !newNote.trim()}>
                <FileText className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Send SMS to {lead.phone}</label>
              <Textarea
                value={newSMS}
                onChange={(e) => setNewSMS(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {newSMS.length}/160 characters
                </span>
                <Button onClick={handleSendSMS} disabled={isLoading || !newSMS.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Send Email to {lead.email}</label>
              <Input
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                placeholder="Subject"
              />
              <Textarea
                value={newEmail.body}
                onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                placeholder="Email body..."
                className="min-h-[150px]"
              />
              <Button onClick={handleSendEmail} disabled={isLoading || !newEmail.subject.trim() || !newEmail.body.trim()}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {communications.map((comm) => (
                <div key={comm.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(comm.type)}>
                        {getTypeIcon(comm.type)}
                        <span className="ml-1">{comm.type.toUpperCase()}</span>
                      </Badge>
                      <Badge variant="outline">
                        {comm.direction === 'outbound' ? 'Sent' : 'Received'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(comm.created_at)}
                    </div>
                  </div>
                  <div className="text-sm">
                    {comm.metadata?.subject && (
                      <div className="font-medium mb-1">Subject: {comm.metadata.subject}</div>
                    )}
                    <div className="text-gray-700">{comm.content}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant={comm.status === 'sent' ? 'default' : comm.status === 'delivered' ? 'secondary' : 'destructive'}>
                      {comm.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeadCommunicationPanel;
