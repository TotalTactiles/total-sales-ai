
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, MessageSquare, Clock, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react';

const Inbox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const contactOutcomes = [
    {
      id: 1,
      contact: 'Sarah Chen',
      company: 'TechCorp',
      type: 'phone',
      outcome: 'interested',
      timestamp: '2 hours ago',
      aiSuggestion: 'Send pricing deck - she mentioned budget approval timeline',
      priority: 'high',
      followUpDue: 'Today, 4:00 PM'
    },
    {
      id: 2,
      contact: 'Mike Rodriguez',
      company: 'StartupX',
      type: 'email',
      outcome: 'objection',
      timestamp: '4 hours ago',
      aiSuggestion: 'Address implementation concerns with case study',
      priority: 'medium',
      followUpDue: 'Tomorrow, 10:00 AM'
    },
    {
      id: 3,
      contact: 'Lisa Wang',
      company: 'Enterprise Co',
      type: 'sms',
      outcome: 'no_response',
      timestamp: '1 day ago',
      aiSuggestion: 'Try different communication channel - LinkedIn message',
      priority: 'low',
      followUpDue: 'Friday, 2:00 PM'
    }
  ];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'interested': return 'bg-green-500';
      case 'objection': return 'bg-yellow-500';
      case 'no_response': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return Phone;
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      default: return Phone;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pl-72">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-600">All contact outcomes with AI-suggested follow-ups</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="follow-up">Follow-up Due</TabsTrigger>
            <TabsTrigger value="interested">Interested</TabsTrigger>
            <TabsTrigger value="objections">Objections</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {contactOutcomes.map((contact) => {
                const TypeIcon = getTypeIcon(contact.type);
                return (
                  <Card key={contact.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-5 w-5 text-gray-600" />
                            <div className={`w-3 h-3 rounded-full ${getOutcomeColor(contact.outcome)}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{contact.contact}</h3>
                            <p className="text-gray-600">{contact.company}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{contact.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(contact.priority)}>
                          {contact.priority}
                        </Badge>
                      </div>

                      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800">AI Suggestion:</p>
                            <p className="text-blue-700">{contact.aiSuggestion}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Follow-up due: {contact.followUpDue}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="follow-up">
            <div className="text-center py-8">
              <p className="text-gray-500">Follow-up due contacts will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="interested">
            <div className="text-center py-8">
              <p className="text-gray-500">Interested contacts will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="objections">
            <div className="text-center py-8">
              <p className="text-gray-500">Contacts with objections will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inbox;
