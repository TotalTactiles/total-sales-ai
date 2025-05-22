
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Calendar,
  Download,
  ArrowDownUp,
  Play,
  Phone,
  MessageSquare,
  UserCheck,
  Calendar as CalendarIcon,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AIAgentHistory = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample call history data
  const callHistory = [
    { 
      id: 'call1', 
      company: 'Nexus Technologies',
      contact: 'James Wilson',
      phone: '(555) 123-4567',
      date: '2025-05-22',
      time: '09:15 AM',
      duration: '2:45',
      outcome: 'Goal Achieved',
      outcomeDetail: 'Meeting Booked',
      notes: 'Scheduled demo with technical team for next Tuesday at 2pm.',
      sentiment: 'Positive'
    },
    { 
      id: 'call2', 
      company: 'Pinnacle Solutions',
      contact: 'Emma Rodriguez',
      phone: '(555) 234-5678',
      date: '2025-05-21',
      time: '02:30 PM',
      duration: '3:12',
      outcome: 'Info Gathered',
      outcomeDetail: 'Decision Maker Identified',
      notes: 'CFO Marcus Lee is the decision maker. Best time to reach is mornings.',
      sentiment: 'Neutral'
    },
    { 
      id: 'call3', 
      company: 'Quantum Dynamics',
      contact: 'Daniel Park',
      phone: '(555) 345-6789',
      date: '2025-05-21',
      time: '11:05 AM',
      duration: '1:47',
      outcome: 'Rejected',
      outcomeDetail: 'Not Interested',
      notes: 'Currently implementing a competitor solution. Follow up in 6 months.',
      sentiment: 'Negative'
    },
    { 
      id: 'call4', 
      company: 'Vertex Industries',
      contact: 'Sophie Taylor',
      phone: '(555) 456-7890',
      date: '2025-05-20',
      time: '04:22 PM',
      duration: '0:45',
      outcome: 'Reception Only',
      outcomeDetail: 'Gatekeeper Blocked',
      notes: 'Receptionist would not transfer. Try calling earlier in the day.',
      sentiment: 'Neutral'
    },
    { 
      id: 'call5', 
      company: 'Horizon Group',
      contact: 'Michael Brown',
      phone: '(555) 567-8901',
      date: '2025-05-20',
      time: '10:08 AM',
      duration: '2:33',
      outcome: 'Goal Achieved',
      outcomeDetail: 'Meeting Booked',
      notes: 'Scheduled initial consultation with VP of Operations for Friday.',
      sentiment: 'Positive'
    },
  ];
  
  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'Goal Achieved':
        return <Badge className="bg-green-500">Goal Achieved</Badge>;
      case 'Info Gathered':
        return <Badge className="bg-blue-500">Info Gathered</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'Reception Only':
        return <Badge className="bg-amber-500">Reception Only</Badge>;
      case 'No Answer':
        return <Badge className="bg-slate-500">No Answer</Badge>;
      default:
        return <Badge className="bg-slate-500">{outcome}</Badge>;
    }
  };
  
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'neutral':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'negative':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const handlePlayRecording = (callId: string) => {
    toast({
      title: "Call Recording",
      description: "Playing call recording. This feature is currently in beta.",
    });
  };
  
  const handleDownloadTranscript = (callId: string) => {
    toast({
      title: "Transcript Downloaded",
      description: "Call transcript has been downloaded to your device.",
    });
  };
  
  const handleFollowup = (callId: string) => {
    toast({
      title: "Follow-up Scheduled",
      description: "A follow-up action has been scheduled for this call.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Call History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search call history..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-10">
                  <Calendar className="h-4 w-4" />
                  Date Range
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-10">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-10">
                  <ArrowDownUp className="h-4 w-4" />
                  Sort
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1 h-10">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
            
            {/* Call History Table */}
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Call Details</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Date & Time</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Duration</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Outcome</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Notes</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {callHistory.map((call) => (
                    <tr key={call.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{call.company}</p>
                            <p className="text-sm text-slate-500">{call.contact}</p>
                            <p className="text-xs text-slate-400">{call.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                            {call.date}
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                            {call.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm">{call.duration}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getOutcomeBadge(call.outcome)}
                            {getSentimentIcon(call.sentiment)}
                          </div>
                          <p className="text-xs text-slate-500">{call.outcomeDetail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <p className="text-sm text-slate-600 truncate" title={call.notes}>{call.notes}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handlePlayRecording(call.id)}
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleDownloadTranscript(call.id)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleFollowup(call.id)}
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">Showing 5 of 121 calls</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAgentHistory;
