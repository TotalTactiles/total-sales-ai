
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, TrendingUp, Target } from 'lucide-react';
import { TooltipInfo } from '@/components/ui/tooltip-info';

export const AIBriefingCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Brain className="h-5 w-5" />
          Your AI Briefing
          <TooltipInfo content="AI-powered insights based on your performance data and market trends. These suggestions are personalized to help you hit your targets faster." />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Performance Summary</p>
                <p className="text-sm text-gray-600">
                  You're crushing your call volume (+38% vs team) but revenue conversion could improve. 
                  Focus on qualifying higher-value prospects.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-purple-100">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Next Focus Area</p>
                <p className="text-sm text-gray-600">
                  Book 3 more demos this week to hit your monthly target. 
                  Tuesday-Thursday 2-4 PM shows highest response rates.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <ArrowRight className="h-4 w-4 mr-1" />
            View AI Suggestions
          </Button>
          <Button variant="outline" size="sm">
            Schedule Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
