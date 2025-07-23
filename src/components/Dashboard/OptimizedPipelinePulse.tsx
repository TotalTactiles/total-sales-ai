
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Target, Clock, Calendar, Phone, Mail, MessageSquare, ChevronRight, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Lead } from '@/types/lead';

interface OptimizedPipelinePulseProps {
  leads: Lead[];
  onScheduleEvent?: (leadName: string) => void;
  onAddReminder?: (leadName: string) => void;
  onCallInitiate?: (lead: Lead) => void;
}

const OptimizedPipelinePulse: React.FC<OptimizedPipelinePulseProps> = ({
  leads,
  onScheduleEvent,
  onAddReminder,
  onCallInitiate
}) => {
  const filteredLeads = leads.filter(lead => ['new', 'contacted', 'qualified', 'proposal'].includes(lead.status));
  const totalValue = filteredLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const avgScore = filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / filteredLeads.length) : 0;

  const handleCallClick = (lead: Lead) => {
    if (onCallInitiate) {
      onCallInitiate(lead);
    }
  };

  const handleScheduleEvent = (leadName: string) => {
    if (onScheduleEvent) {
      onScheduleEvent(leadName);
    }
  };

  const handleAddReminder = (leadName: string) => {
    if (onAddReminder) {
      onAddReminder(leadName);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500 text-white';
      case 'contacted':
        return 'bg-yellow-500 text-white';
      case 'qualified':
        return 'bg-green-500 text-white';
      case 'proposal':
        return 'bg-purple-500 text-white';
      case 'negotiation':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLeadInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDaysAgo = (lastActivity: string) => {
    try {
      if (lastActivity.includes('T')) {
        const date = new Date(lastActivity);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}d ago`;
      }
      return lastActivity;
    } catch {
      return lastActivity;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Pipeline Pulse
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            AI Prioritized
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Cards */}
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

        {/* Lead List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredLeads.slice(0, 5).map(lead => (
            <div key={lead.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                {/* Left Side - Lead Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {getLeadInitial(lead.name)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">${lead.value?.toLocaleString() || '0'}</div>
                        <div className="text-sm text-gray-600">{lead.name} • {lead.company}</div>
                      </div>
                      
                      <Badge className={`${getStatusColor(lead.status)} text-xs px-2 py-1`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* AI Insight */}
                    <div className="text-sm text-gray-600 italic mb-2">
                      "{lead.lastAIInsight || 'AI analyzing lead behavior...'}"
                    </div>
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-3"
                    onClick={() => handleCallClick(lead)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-3">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-3" onClick={() => handleScheduleEvent(lead.name)}>
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-3" onClick={() => handleAddReminder(lead.name)}>
                    <Clock className="h-3 w-3 mr-1" />
                    Remind
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Leads Button */}
        <div className="pt-3 border-t">
          <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-800">
            View All Leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedPipelinePulse;
