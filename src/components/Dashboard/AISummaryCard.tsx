import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Mail, PhoneCall, FileText, TrendingUp } from 'lucide-react';
interface AISummaryData {
  emailsDrafted: number;
  callsScheduled: number;
  proposalsGenerated: number;
  improvementPercentage: number;
}
interface AISummaryCardProps {
  data: AISummaryData;
  isFullUser: boolean;
}
const AISummaryCard: React.FC<AISummaryCardProps> = ({
  data,
  isFullUser
}) => {
  const aiActions = [{
    icon: Mail,
    label: 'Emails Drafted',
    value: data.emailsDrafted,
    color: 'text-blue-600'
  }, {
    icon: PhoneCall,
    label: 'Calls Scheduled',
    value: data.callsScheduled,
    color: 'text-green-600'
  }, {
    icon: FileText,
    label: 'Proposals Generated',
    value: data.proposalsGenerated,
    color: 'text-purple-600'
  }];
  return <Card className={`w-full ${isFullUser ? 'border-2 border-gradient-to-r from-blue-500 to-purple-600' : ''}`}>
      <CardHeader className={`${isFullUser ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'} rounded-t-lg`}>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span className="text-slate-50">AI Assistant Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiActions.map((action, index) => {
          const IconComponent = action.icon;
          return <div key={index} className="text-center">
                <IconComponent className={`h-8 w-8 mx-auto mb-2 ${action.color}`} />
                <p className="text-2xl font-bold">{action.value}</p>
                <p className="text-sm text-muted-foreground">{action.label}</p>
              </div>;
        })}
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Performance Improvement</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold text-green-600">
                +{data.improvementPercentage}%
              </span>
            </div>
          </div>
          <Progress value={data.improvementPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {isFullUser ? 'AI optimization has increased your productivity by this amount' : 'Compared to previous period'}
          </p>
        </div>
      </CardContent>
    </Card>;
};
export default AISummaryCard;