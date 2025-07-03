
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Eye,
  Brain,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  name: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  priority: 'high' | 'medium' | 'low';
  value: number;
  lastActivity: string;
  aiPriority: 'Low' | 'Medium' | 'High';
  nextAction: string;
  lastAIInsight: string;
}

interface PipelinePulseProps {
  leads: Lead[];
  className?: string;
}

const PipelinePulse: React.FC<PipelinePulseProps> = ({ leads, className = '' }) => {
  const navigate = useNavigate();

  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Contact 1',
      company: 'TechCorp',
      status: 'new',
      priority: 'high',
      value: 51515,
      lastActivity: 'Called 2d ago',
      aiPriority: 'High',
      nextAction: 'Follow-up call',
      lastAIInsight: 'Strong buying signals detected'
    },
    {
      id: '2',
      name: 'Contact 2',
      company: 'InnovateCo',
      status: 'negotiation',
      priority: 'high',
      value: 101911,
      lastActivity: 'Email sent 5h ago',
      aiPriority: 'High',
      nextAction: 'Send pricing proposal',
      lastAIInsight: 'Budget concerns mentioned'
    },
    {
      id: '3',
      name: 'Contact 3',
      company: 'GlobalSoft',
      status: 'new',
      priority: 'medium',
      value: 59527,
      lastActivity: 'No contact yet',
      aiPriority: 'Medium',
      nextAction: 'Initial outreach',
      lastAIInsight: 'Company expanding team'
    },
    {
      id: '4',
      name: 'Contact 4',
      company: 'DataDriven',
      status: 'proposal',
      priority: 'high',
      value: 81900,
      lastActivity: 'Demo completed 1d ago',
      aiPriority: 'High',
      nextAction: 'Follow-up on demo',
      lastAIInsight: 'Decision maker engaged'
    },
    {
      id: '5',
      name: 'Contact 5',
      company: 'CloudFirst',
      status: 'proposal',
      priority: 'medium',
      value: 39917,
      lastActivity: 'Called 3h ago',
      aiPriority: 'Medium',
      nextAction: 'Send contract',
      lastAIInsight: 'Ready to move forward'
    }
  ];

  const displayLeads = leads.length > 0 ? leads : mockLeads;

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '📊';
      case 'low': return '🧊';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAIPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleLeadClick = (leadId: string) => {
    navigate(`/sales/leads/${leadId}`);
  };

  const handleActionClick = (e: React.MouseEvent, actionType: string, leadId: string) => {
    e.stopPropagation();
    console.log(`${actionType} action for lead ${leadId}`);
  };

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Pipeline Pulse
          <Badge className="bg-white/20 text-white text-xs">
            AI Optimized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop View - Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Lead</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Status</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Value</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Last Activity</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">AI Priority</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">Next Action</th>
                <th className="text-left p-4 font-medium text-gray-600 text-sm">AI Insight</th>
                <th className="text-center p-4 font-medium text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayLeads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={`border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer ${
                    index === 0 ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => handleLeadClick(lead.id)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPriorityIcon(lead.priority)}</span>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">${lead.value.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{lead.lastActivity}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getAIPriorityColor(lead.aiPriority)}>
                      {lead.aiPriority}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Brain className="h-3 w-3 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">{lead.nextAction}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 italic">{lead.lastAIInsight}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                        onClick={(e) => handleActionClick(e, 'call', lead.id)}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 transition-colors"
                        onClick={(e) => handleActionClick(e, 'email', lead.id)}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-purple-100 hover:border-purple-300 transition-colors"
                        onClick={(e) => handleActionClick(e, 'message', lead.id)}
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 hover:bg-indigo-100 hover:border-indigo-300 transition-colors"
                        onClick={(e) => handleActionClick(e, 'view', lead.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="lg:hidden space-y-3 p-4">
          {displayLeads.map((lead, index) => (
            <div
              key={lead.id}
              className={`p-4 border rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer ${
                index === 0 ? 'bg-blue-50/50' : ''
              }`}
              onClick={() => handleLeadClick(lead.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.company}</div>
                  </div>
                </div>
                <span className="font-medium text-gray-900">${lead.value.toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Status:</span>
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">AI Priority:</span>
                  <Badge className={getAIPriorityColor(lead.aiPriority)}>{lead.aiPriority}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">{lead.lastActivity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="h-3 w-3 text-purple-500" />
                  <span className="text-gray-700">{lead.nextAction}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 italic mb-3">{lead.lastAIInsight}</div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  onClick={(e) => handleActionClick(e, 'call', lead.id)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 hover:bg-green-100 hover:border-green-300 transition-colors"
                  onClick={(e) => handleActionClick(e, 'email', lead.id)}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelinePulse;
