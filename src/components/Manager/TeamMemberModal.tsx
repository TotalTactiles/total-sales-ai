
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle, 
  Phone, 
  Clock,
  CheckCircle
} from 'lucide-react';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: string;
    full_name: string | null;
    role: string;
    stats: {
      call_count: number;
      win_count: number;
      current_streak: number;
      burnout_risk: number;
      last_active: string | null;
      mood_score: number | null;
    };
  };
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  member
}) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [message, setMessage] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSchedule1on1 = async () => {
    setIsScheduling(true);
    // Simulate AI scheduling
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsScheduling(false);
    setShowScheduler(false);
    // Mock success notification
    console.log(`1-on-1 scheduled with ${member.full_name}`);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    // Simulate message sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setMessage('');
    setShowMessaging(false);
    // Mock success notification
    console.log(`Message sent to ${member.full_name}: ${message}`);
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600 bg-red-50';
    if (risk >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getMoodColor = (mood: number | null) => {
    if (!mood) return 'text-gray-600 bg-gray-50';
    if (mood >= 80) return 'text-green-600 bg-green-50';
    if (mood >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  {member.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{member.full_name || 'Team Member'}</CardTitle>
                <p className="text-blue-100 capitalize">{member.role.replace('_', ' ')}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{member.stats.call_count}</div>
              <div className="text-sm text-blue-600">Calls</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{member.stats.win_count}</div>
              <div className="text-sm text-green-600">Wins</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{member.stats.current_streak}</div>
              <div className="text-sm text-purple-600">Streak</div>
            </div>
            <div className={`rounded-lg p-3 text-center ${getMoodColor(member.stats.mood_score)}`}>
              <div className="text-2xl font-bold">{member.stats.mood_score || '--'}%</div>
              <div className="text-sm">Mood</div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              AI Insights
            </h4>
            
            {/* Strengths */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Strength</span>
              </div>
              <p className="text-sm text-green-700">
                Excellent at discovery calls (92% success rate)
              </p>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Area for Improvement</span>
              </div>
              <p className="text-sm text-red-700">
                Follow-up timing needs work (avg 3.2 days)
              </p>
            </div>

            {/* Burnout Risk */}
            <div className={`border rounded-lg p-4 ${getRiskColor(member.stats.burnout_risk)}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Burnout Risk: {member.stats.burnout_risk}%</span>
              </div>
              <p className="text-sm">
                {member.stats.burnout_risk >= 70 
                  ? 'High risk - immediate attention needed'
                  : member.stats.burnout_risk >= 40
                  ? 'Moderate risk - monitor closely'
                  : 'Low risk - performing well'
                }
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-700">Completed call with Acme Corp</span>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">Watched "Objection Handling" lesson</span>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => setShowScheduler(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              disabled={isScheduling}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isScheduling ? 'Scheduling...' : 'Schedule 1-on-1'}
            </Button>
            <Button
              onClick={() => setShowMessaging(true)}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>

          {/* Scheduler Interface */}
          {showScheduler && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-blue-900">AI-Optimized Scheduling</h5>
              <p className="text-sm text-blue-700">
                Finding optimal time slot based on both calendars...
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">Suggested Time:</p>
                <p className="text-sm text-gray-600">Tomorrow at 2:00 PM (30 minutes)</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSchedule1on1}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isScheduling}
                >
                  {isScheduling ? 'Confirming...' : 'Confirm'}
                </Button>
                <Button
                  onClick={() => setShowScheduler(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Messaging Interface */}
          {showMessaging && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <h5 className="font-medium text-gray-900">Send Message</h5>
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSending || !message.trim()}
                >
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
                <Button
                  onClick={() => {
                    setShowMessaging(false);
                    setMessage('');
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMemberModal;
