import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Calendar,
  Phone, 
  Mail, 
  MessageSquare,
  ChevronRight,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface OptimizedPipelinePulseProps {
  leads: Lead[];
}

const OptimizedPipelinePulse: React.FC<OptimizedPipelinePulseProps> = ({ leads }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    description: '',
    reminder: ''
  });
  const [reminderData, setReminderData] = useState({
    title: '',
    triggerType: 'time',
    triggerValue: '',
    description: ''
  });

  const handleScheduleEvent = (lead: Lead) => {
    setSelectedLead(lead);
    setIsScheduleModalOpen(true);
  };

  const handleAddReminder = (lead: Lead) => {
    setSelectedLead(lead);
    setIsReminderModalOpen(true);
  };

  const handleScheduleSubmit = () => {
    // Log to Lead Profile > Tasks Sub-tab
    // Log to Global Reminder Dashboard
    // Log to TSAM Master Brain
    console.log('Schedule event:', { lead: selectedLead, ...scheduleData });
    setIsScheduleModalOpen(false);
    setScheduleData({ date: '', time: '', description: '', reminder: '' });
  };

  const handleReminderSubmit = () => {
    // Log to Lead Profile > Tasks Sub-tab
    // Log to Global Reminder Dashboard
    // Log to TSAM Master Brain
    console.log('Add reminder:', { lead: selectedLead, ...reminderData });
    setIsReminderModalOpen(false);
    setReminderData({ title: '', triggerType: 'time', triggerValue: '', description: '' });
  };

  const filteredLeads = leads.filter(lead => 
    ['new', 'contacted', 'qualified', 'proposal'].includes(lead.status)
  );

  const totalValue = filteredLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const avgScore = filteredLeads.length > 0 
    ? Math.round(filteredLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / filteredLeads.length)
    : 0;

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Pipeline Pulse
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              AI Optimized
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Pipeline Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredLeads.length}</div>
              <div className="text-sm text-gray-600">Active Leads</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Pipeline Value</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{avgScore}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </div>

          {/* Lead Cards */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{lead.name}</h4>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {lead.status}
                    </Badge>
                    <span className="text-sm font-medium">{lead.score}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleScheduleEvent(lead)}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAddReminder(lead)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Remind
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Event Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Event - {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Event description..."
                value={scheduleData.description}
                onChange={(e) => setScheduleData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="reminder">Reminder (minutes before)</Label>
              <Input
                id="reminder"
                type="number"
                placeholder="15"
                value={scheduleData.reminder}
                onChange={(e) => setScheduleData(prev => ({ ...prev, reminder: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleSubmit}>
                Schedule Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Task Modal */}
      <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Reminder Task - {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Follow up on proposal..."
                value={reminderData.title}
                onChange={(e) => setReminderData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="triggerType">Trigger Type</Label>
              <select
                id="triggerType"
                className="w-full p-2 border rounded-md"
                value={reminderData.triggerType}
                onChange={(e) => setReminderData(prev => ({ ...prev, triggerType: e.target.value }))}
              >
                <option value="time">Time-based</option>
                <option value="funnel">Funnel stage</option>
              </select>
            </div>
            <div>
              <Label htmlFor="triggerValue">
                {reminderData.triggerType === 'time' ? 'Date/Time' : 'Funnel Stage'}
              </Label>
              {reminderData.triggerType === 'time' ? (
                <Input
                  id="triggerValue"
                  type="datetime-local"
                  value={reminderData.triggerValue}
                  onChange={(e) => setReminderData(prev => ({ ...prev, triggerValue: e.target.value }))}
                />
              ) : (
                <select
                  id="triggerValue"
                  className="w-full p-2 border rounded-md"
                  value={reminderData.triggerValue}
                  onChange={(e) => setReminderData(prev => ({ ...prev, triggerValue: e.target.value }))}
                >
                  <option value="">Select stage...</option>
                  <option value="contacted">When contacted</option>
                  <option value="qualified">When qualified</option>
                  <option value="proposal">When proposal sent</option>
                </select>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description..."
                value={reminderData.description}
                onChange={(e) => setReminderData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReminderModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReminderSubmit}>
                Add Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OptimizedPipelinePulse;
