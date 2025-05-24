
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

interface LearningProgress {
  completionPercentage: number;
  streak: number;
}

interface AcademyHeaderProps {
  learningProgress: LearningProgress;
}

const AcademyHeader: React.FC<AcademyHeaderProps> = ({ learningProgress }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sales Academy</h1>
            <p className="text-slate-600">Your AI-powered learning companion</p>
          </div>
        </div>
        
        {/* Progress Overview */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{learningProgress.completionPercentage}%</div>
                <div className="text-xs text-slate-600">Complete</div>
              </div>
              <div className="w-16 h-16 relative">
                <Progress 
                  value={learningProgress.completionPercentage} 
                  className="transform rotate-90 w-16"
                />
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{learningProgress.streak}</div>
                <div className="text-xs text-slate-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcademyHeader;
