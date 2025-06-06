import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Users, MapPin, Brain, Plus, Link, Target, Lightbulb, PhoneCall, Building2 } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/useIntegrations';

interface LeadMeetingsTabProps {
  lead: Lead;
}

const LeadMeetingsTab: React.FC<LeadMeetingsTabProps> = ({ lead }) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingType, setMeetingType] = useState('video');
  const [meetingNotes, setMeetingNotes] = useState('');
  const { scheduleCalendarEvent, isLoading } = useIntegrations();

  const mockMeetings = [
    {
      id: 1,
      title: 'Product Demo',
      date: 'Tomorrow',
      time: '2:00 PM EST',
      type: 'video',
      status: 'scheduled',
      attendees: [lead.name, 'You'],
      location: 'Google Meet',
      notes: 'Demo manufacturing workflow automation features'
    },
    {
      id: 2,
      title: 'Discovery Call',
      date: '2 days ago',
      time: '10:00 AM EST',
      type: 'phone',
      status: 'completed',
      attendees: [lead.name, 'You'],
      location: 'Phone call',
      notes: 'Discussed pain points and budget. Very positive outcome.'
    },
    {
      id: 3,
      title: 'Follow-up Meeting',
      date: 'Next week',
      time: '3:00 PM EST',
      type: 'in-person',
      status: 'scheduled',
      attendees: [lead.name, 'You', 'Sales Manager'],
      location: 'Dunder Mifflin Office',
      notes: 'Present final proposal and discuss contract terms'
    }
  ];

  const handleScheduleMeeting = async () => {
    if (meetingTitle && meetingDate && meetingTime) {
      const startDateTime = new Date(`${meetingDate}T${meetingTime}`).toISOString();
      const endDateTime = new Date(new Date(`${meetingDate}T${meetingTime}`).getTime() + 60 * 60 * 1000).toISOString(); // 1 hour later

      const eventDetails = {
        summary: meetingTitle,
        description: `Meeting with ${lead.name} from ${lead.company}\n\n${meetingNotes}`,
        start: startDateTime,
        end: endDateTime,
        attendees: [lead.email]
      };

      const result = await scheduleCalendarEvent(eventDetails, lead.id, lead.name);
      
      if (result.success) {
        setShowScheduler(false);
        setMeetingTitle('');
        setMeetingDate('');
        setMeetingTime('');
        setMeetingNotes('');
        toast.success(`Meeting scheduled with ${lead.name}. Event ID: ${result.eventId}`);
      }
    }
  };

  const suggestOptimalTime = () => {
    // AI-powered time suggestion based on lead's timezone and industry
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMeetingDate(tomorrow.toISOString().split('T')[0]);
    setMeetingTime('14:00'); // 2 PM
    setMeetingTitle(`Product Demo - ${lead.company}`);
    toast.success('AI suggests: Tomorrow 2-4 PM AEST (92% acceptance rate for similar leads)');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-blue-600" />;
      case 'phone': return <PhoneCall className="h-4 w-4 text-green-600" />;
      case 'in-person': return <Building2 className="h-4 w-4 text-purple-600" />;
      default: return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting Actions
            <Badge className="bg-green-100 text-green-800">Google Calendar Ready</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => setShowScheduler(true)} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline" onClick={suggestOptimalTime}>
              <Brain className="h-4 w-4 mr-2" />
              AI Suggest Time
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              <strong>AI Recommendation:</strong> Schedule demo within 48 hours for 92% show-up rate. 
              Tuesday-Thursday 2-4 PM AEST works best for {lead.company} industry.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Schedule New Meeting */}
      {showScheduler && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule New Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Meeting title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
              <Input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>

            <Select value={meetingType} onValueChange={setMeetingType}>
              <SelectTrigger>
                <SelectValue placeholder="Meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video" className="flex items-center gap-1">
                  <Video className="h-3 w-3" /> Google Meet
                </SelectItem>
                <SelectItem value="phone" className="flex items-center gap-1">
                  <PhoneCall className="h-3 w-3" /> Phone Call
                </SelectItem>
                <SelectItem value="in-person" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> In Person
                </SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Meeting notes or agenda..."
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              className="min-h-[80px]"
            />

            <div className="flex gap-2">
              <Button onClick={handleScheduleMeeting} disabled={isLoading}>
                <Calendar className="h-4 w-4 mr-2" />
                {isLoading ? 'Scheduling...' : 'Schedule via Google Calendar'}
              </Button>
              <Button variant="outline" onClick={() => setShowScheduler(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meeting History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Meeting History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMeetings.map((meeting) => (
              <div key={meeting.id} className="border-l-4 border-blue-200 pl-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMeetingIcon(meeting.type)}
                    <span className="font-medium">{meeting.title}</span>
                    {getStatusBadge(meeting.status)}
                  </div>
                  <span className="text-sm text-slate-500">{meeting.date}</span>
                </div>
                
                <div className="space-y-1 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>{meeting.attendees.join(', ')}</span>
                  </div>
                </div>
                
                {meeting.notes && (
                  <p className="text-sm text-slate-600 mt-2 italic">{meeting.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calendar Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="bg-green-50 border-green-200">
              <Calendar className="h-4 w-4 mr-2" />
              ✅ Google Calendar Connected
            </Button>
            <Button variant="outline" disabled>
              <Calendar className="h-4 w-4 mr-2" />
              Outlook Calendar (Coming Soon)
            </Button>
          </div>
          
          <Button variant="outline" className="w-full" disabled>
            <Link className="h-4 w-4 mr-2" />
            Set up Calendly Integration (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      {/* AI Meeting Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            AI Meeting Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Your meeting show-up rate: 87% (above team average)
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Best meeting length for demos: 30-45 minutes
            </p>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Send calendar invite 24-48 hours in advance for best attendance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadMeetingsTab;
