
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  onScheduleEvent?: (leadName: string) => void;
  onAddReminder?: (leadName: string) => void;
}

const OptimizedPipelinePulse: React.FC<OptimizedPipelinePulseProps> = ({ 
  leads, 
  onScheduleEvent, 
  onAddReminder 
}) => {
  const filteredLeads = leads.filter(lead => 
    ['new', 'contacted', 'qualified', 'proposal'].includes(lead.status)
  );

  const totalValue = filteredLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const avgScore = filteredLeads.length > 0 
    ? Math.round(filteredLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / filteredLeads.length)
    : 0;

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

  return (
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
                    onClick={() => handleScheduleEvent(lead.name)}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddReminder(lead.name)}
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
  );
};

export default OptimizedPipelinePulse;
