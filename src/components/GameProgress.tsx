
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const GameProgress = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Level 12</span>
              <span className="text-sm text-slate-500">750/1000 XP</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-sm text-slate-500">Daily Streak</div>
              <div className="text-xl font-bold text-salesBlue flex gap-1 items-center">
                7 <span className="text-salesRed text-sm">🔥</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="text-sm text-slate-500">Credit Balance</div>
              <div className="text-xl font-bold text-salesBlue">
                580
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-sm font-medium mb-2">Recent Achievements</div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-salesGreen">Cold Call Champion</Badge>
              <Badge className="bg-salesCyan">Fast Response Pro</Badge>
              <Badge variant="outline" className="text-salesBlue border-salesBlue">Notes Wizard</Badge>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-sm font-medium mb-2">Daily Challenges</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-salesGreen">•</span>
                  Make 10 more calls
                </div>
                <span className="text-xs text-slate-500">40/50</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-salesCyan">•</span>
                  Book 2 more meetings
                </div>
                <span className="text-xs text-slate-500">1/3</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-salesRed">•</span>
                  Respond to all leads within 5 min
                </div>
                <span className="text-xs text-slate-500">Complete ✓</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameProgress;
