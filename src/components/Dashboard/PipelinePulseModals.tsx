
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  onScheduleEvent: (eventData: any) => void;
}

interface ReminderTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  onAddReminder: (reminderData: any) => void;
}

export const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({
  isOpen,
  onClose,
  leadName,
  onScheduleEvent
}) => {
  const [eventData, setEventData] = useState({
    date: '',
    time: '',
    description: '',
    reminder: '15'
  });

  const handleSubmit = () => {
    onScheduleEvent(eventData);
    setEventData({ date: '', time: '', description: '', reminder: '15' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Schedule Event - {leadName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={eventData.date}
              onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={eventData.time}
              onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Event description..."
              value={eventData.description}
              onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="reminder">Reminder (minutes before)</Label>
            <Input
              id="reminder"
              type="number"
              placeholder="15"
              value={eventData.reminder}
              onChange={(e) => setEventData(prev => ({ ...prev, reminder: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Schedule Event</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ReminderTaskModal: React.FC<ReminderTaskModalProps> = ({
  isOpen,
  onClose,
  leadName,
  onAddReminder
}) => {
  const [reminderData, setReminderData] = useState({
    title: '',
    triggerType: 'time',
    triggerValue: '',
    description: ''
  });

  const handleSubmit = () => {
    onAddReminder(reminderData);
    setReminderData({ title: '', triggerType: 'time', triggerValue: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Add Reminder Task - {leadName}
          </DialogTitle>
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
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Reminder</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
