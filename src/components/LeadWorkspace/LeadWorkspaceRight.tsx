
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
  Send,
  Zap,
  Calculator,
  Users
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadWorkspaceRightProps {
  lead: Lead;
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
      case 'email': return 85;
      case 'call': return lead.conversionLikelihood;
      case 'sms': return 65;
      case 'meetings': return 92;
      default: return 78;
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
                Send personalized ROI calculator. Similar companies saw 3.2x response rates.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-amber-600" />
                <span className="text-xs font-medium">Optimal Timing</span>
              </div>
              <p className="text-sm text-slate-700">
                Best contact window: Today 2-4 PM EST (67% answer rate)
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

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Follow-up call</span>
                <Badge variant="outline" className="text-xs">Tomorrow</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Send proposal</span>
                <Badge variant="outline" className="text-xs">This week</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Demo preparation</span>
                <Badge variant="outline" className="text-xs">Next week</Badge>
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
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
              📄 Pricing_Proposal_v2.pdf
            </div>
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
              📊 ROI_Calculator.xlsx
            </div>
            <div className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
              🎥 Product_Demo.mp4
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
              <p className="text-xs text-slate-600">
                🎯 Your email response rate is 23% higher when including industry stats
              </p>
              <p className="text-xs text-slate-600">
                📞 Best call success: Tuesday-Thursday, 2-4 PM
              </p>
              <p className="text-xs text-slate-600">
                💡 Similar leads respond well to case studies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadWorkspaceRight;
