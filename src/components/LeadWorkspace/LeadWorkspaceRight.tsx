
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Clock,
  Target,
  FileText,
  BarChart2,
  Video,
  PhoneCall,
  Lightbulb,
  Send,
  Zap,
  Calculator,
  Users
} from 'lucide-react';
import { DatabaseLead } from '@/hooks/useLeads';

interface LeadWorkspaceRightProps {
  lead: DatabaseLead;
  activeTab: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const LeadWorkspaceRight: React.FC<LeadWorkspaceRightProps> = ({
  lead,
  activeTab,
  collapsed,
  onToggleCollapse
}) => {
  const getNextStepProbability = () => {
    switch (activeTab) {
      case 'email': return Math.min(85, lead.conversion_likelihood + 10);
      case 'call': return lead.conversion_likelihood;
      case 'sms': return Math.min(65, lead.conversion_likelihood - 5);
      case 'meetings': return Math.min(92, lead.conversion_likelihood + 15);
      default: return lead.conversion_likelihood;
    }
  };

  const getRecommendedAction = () => {
    if (lead.score >= 80) {
      return "Schedule a demo call - high engagement detected";
    } else if (lead.score >= 60) {
      return "Send personalized ROI calculator";
    } else {
      return "Share relevant case study to build interest";
    }
  };

  const getOptimalTiming = () => {
    const lastContact = lead.last_contact ? new Date(lead.last_contact) : null;
    if (!lastContact) {
      return "Contact ASAP - fresh lead";
    }
    
    const daysSince = Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 1) {
      return "Wait 2-3 hours before next touchpoint";
    } else if (daysSince < 3) {
      return "Good time for follow-up";
    } else {
      return "Overdue for follow-up";
    }
  };

  if (collapsed) {
    return (
      <div className="h-full p-4 flex flex-col items-center border-l">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col gap-3">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0"
            title="AI Insights"
          >
            <Brain className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0"
            title="Send ROI Calculator"
          >
            <Calculator className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0"
            title="Auto-nurture"
          >
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="p-6 bg-white border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">AI & Actions</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Summary Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">Next Step Probability</span>
              </div>
              <div className="text-lg font-bold text-green-700">{getNextStepProbability()}%</div>
              <p className="text-xs text-green-600">Success rate for current action</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium">Recommended Action</span>
              </div>
              <p className="text-sm text-slate-700">
                {getRecommendedAction()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-amber-600" />
                <span className="text-xs font-medium">Optimal Timing</span>
              </div>
              <p className="text-sm text-slate-700">
                {getOptimalTiming()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Send ROI Calculator
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send Follow-up
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Auto-nurture
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Team Collaboration
            </Button>
          </CardContent>
        </Card>

        {/* Lead Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lead Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lead Score</span>
                <Badge variant={lead.score >= 70 ? "default" : "outline"} className="text-xs">
                  {lead.score}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conversion Likelihood</span>
                <Badge variant={lead.conversion_likelihood >= 70 ? "default" : "outline"} className="text-xs">
                  {lead.conversion_likelihood}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Priority</span>
                <Badge variant={lead.priority === 'high' ? "destructive" : "outline"} className="text-xs">
                  {lead.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents & Files */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Docs & Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Pricing_Proposal_v2.pdf
            </div>
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1">
              <BarChart2 className="h-3 w-3" />
              ROI_Calculator.xlsx
            </div>
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1">
              <Video className="h-3 w-3" />
              Product_Demo.mp4
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2">
              Upload New File
            </Button>
          </CardContent>
        </Card>

        {/* AI Learning Insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Target className="h-3 w-3" />
                Your email response rate is 23% higher when including industry stats
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <PhoneCall className="h-3 w-3" />
                Best call success: Tuesday-Thursday, 2-4 PM
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                Similar leads from {lead.source} respond well to case studies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadWorkspaceRight;
