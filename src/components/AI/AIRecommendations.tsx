import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  X,
  Edit3
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'call' | 'email' | 'schedule' | 'follow-up';
  leadName?: string;
  daysActive: number;
}

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Call Sarah Johnson',
      description: 'Follow up on pricing discussion from last week. High probability of closing.',
      priority: 'high',
      type: 'call',
      leadName: 'Sarah Johnson',
      daysActive: 1
    },
    {
      id: '2',
      title: 'Send proposal to TechCorp',
      description: 'Requested detailed proposal after demo. Strike while iron is hot.',
      priority: 'high',
      type: 'email',
      leadName: 'Mike Chen',
      daysActive: 0
    },
    {
      id: '3',
      title: 'Schedule demo with StartupX',
      description: 'Expressed strong interest in product features. Book demo this week.',
      priority: 'medium',
      type: 'schedule',
      leadName: 'Lisa Wong',
      daysActive: 3
    }
  ]);

  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [reminderData, setReminderData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  const handleRecommendationClick = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsActionModalOpen(true);
  };

  const handleActNow = () => {
    if (!selectedRecommendation) return;
    
    // Log interaction to Rep Activity Tracker, Lead Profile > Comms/Tasks, TSAM Master Brain
    console.log('Act Now:', selectedRecommendation);
    
    // Remove from recommendations (acted = removed)
    setRecommendations(prev => prev.filter(rec => rec.id !== selectedRecommendation.id));
    setIsActionModalOpen(false);
    
    // Open appropriate action based on type
    switch (selectedRecommendation.type) {
      case 'call':
        // Open dialer
        break;
      case 'email':
        // Open email composer
        break;
      case 'schedule':
        // Open calendar
        break;
    }
  };

  const handleRemindLater = () => {
    if (!selectedRecommendation) return;
    
    // Log interaction
    console.log('Remind Later:', selectedRecommendation, reminderData);
    
    // Keep in recommendations but mark as snoozed
    setIsActionModalOpen(false);
  };

  const handleAddToCalendar = () => {
    if (!selectedRecommendation) return;
    
    // Log interaction and add to calendar
    console.log('Add to Calendar:', selectedRecommendation);
    setIsActionModalOpen(false);
  };

  const handleDismiss = () => {
    if (!selectedRecommendation) return;
    
    // Log interaction
    console.log('Dismiss:', selectedRecommendation);
    
    // Remove from recommendations
    setRecommendations(prev => prev.filter(rec => rec.id !== selectedRecommendation.id));
    setIsActionModalOpen(false);
  };

  const handleModify = () => {
    // Allow user to modify the recommendation
    console.log('Modify:', selectedRecommendation);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'schedule': return Calendar;
      default: return Clock;
    }
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Recommendations
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {recommendations.length} Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>All recommendations completed!</p>
              <p className="text-sm">Great work staying on top of your leads.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recommendations.map((rec) => {
                const IconComponent = getTypeIcon(rec.type);
                return (
                  <div
                    key={rec.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleRecommendationClick(rec)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold">{rec.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(rec.priority)} variant="outline">
                          {rec.priority}
                        </Badge>
                        {rec.daysActive > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {rec.daysActive}d active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    {rec.leadName && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Lead:</span>
                        <span className="text-xs font-medium">{rec.leadName}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRecommendation && (
                <>
                  {React.createElement(getTypeIcon(selectedRecommendation.type), { className: "h-5 w-5" })}
                  {selectedRecommendation.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecommendation && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">{selectedRecommendation.description}</p>
                {selectedRecommendation.leadName && (
                  <p className="text-xs text-gray-500 mt-2">
                    Lead: {selectedRecommendation.leadName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleActNow} className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Act Now
                </Button>
                <Button variant="outline" onClick={handleAddToCalendar} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>

              <div className="space-y-3">
                <Label>Remind Me Later</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={reminderData.date}
                    onChange={(e) => setReminderData(prev => ({ ...prev, date: e.target.value }))}
                  />
                  <Input
                    type="time"
                    value={reminderData.time}
                    onChange={(e) => setReminderData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <Textarea
                  placeholder="Additional notes..."
                  value={reminderData.notes}
                  onChange={(e) => setReminderData(prev => ({ ...prev, notes: e.target.value }))}
                />
                <Button variant="outline" onClick={handleRemindLater} className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Remind Me Later
                </Button>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleModify}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modify
                </Button>
                <Button variant="destructive" onClick={handleDismiss}>
                  <X className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIRecommendations;
