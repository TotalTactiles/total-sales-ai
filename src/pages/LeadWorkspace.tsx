
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Building,
  MapPin,
  Star
} from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

const LeadWorkspace = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { leads: mockLeads } = useMockData();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (leadId) {
      const foundLead = mockLeads.find(l => l.id === leadId);
      if (foundLead) {
        setLead(convertMockLeadToLead(foundLead));
      }
    }
  }, [leadId, mockLeads]);

  const handleBack = () => {
    navigate('/sales/leads');
  };

  const handleQuickAction = (action: string) => {
    if (!lead) return;
    
    switch (action) {
      case 'call':
        toast.success(`Initiating call to ${lead.name}`);
        break;
      case 'email':
        toast.success(`Opening email composer for ${lead.name}`);
        break;
      case 'sms':
        toast.success(`Opening SMS composer for ${lead.name}`);
        break;
      case 'meeting':
        toast.success(`Scheduling meeting with ${lead.name}`);
        break;
      default:
        break;
    }
  };

  if (!lead) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Lead not found</h2>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-slate-600 bg-slate-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{lead.name}</h1>
              <p className="text-muted-foreground">{lead.company}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button onClick={() => handleQuickAction('call')}>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" onClick={() => handleQuickAction('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" onClick={() => handleQuickAction('sms')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </Button>
          <Button variant="outline" onClick={() => handleQuickAction('meeting')}>
            <Calendar className="h-4 w-4 mr-2" />
            Meeting
          </Button>
        </div>
      </div>

      {/* Status and Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={`mt-1 ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lead Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className={`h-4 w-4 ${getScoreColor(lead.score)}`} />
                  <span className={`text-xl font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <Badge className={`mt-1 ${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-xl font-bold">
                    {lead.conversionLikelihood}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Source</p>
                      <p className="text-sm text-muted-foreground">{lead.source}</p>
                    </div>
                  </div>
                </div>
                
                {lead.lastContact && (
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Contact</p>
                      <p className="text-sm text-muted-foreground">{lead.lastContact}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags and Additional Info */}
            <div className="space-y-6">
              {lead.tags && lead.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle>Lead Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversion Likelihood</span>
                    <span className="text-sm font-medium">{lead.conversionLikelihood}%</span>
                  </div>
                  {lead.speedToLead !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Speed to Lead</span>
                      <span className="text-sm font-medium">{lead.speedToLead} min</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sensitive Lead</span>
                    <span className="text-sm font-medium">{lead.isSensitive ? 'Yes' : 'No'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>No activity recorded yet</p>
                <p className="text-sm">Start engaging with this lead to see activity here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                <p>No communications yet</p>
                <p className="text-sm">Start a conversation to see history here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>No notes added yet</p>
                <p className="text-sm">Add notes to track important information about this lead</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>No documents attached</p>
                <p className="text-sm">Upload documents related to this lead</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadWorkspace;
