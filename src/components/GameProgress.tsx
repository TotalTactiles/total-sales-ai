
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const GameProgress = () => {
  return (
    <Card className="border-dashGreen/20 bg-gradient-to-br from-dashGreen/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-lg">🏆</span> 
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Level 12</span>
              <span className="text-sm text-muted-foreground">750/1000 XP</span>
            </div>
            <Progress value={75} className="h-2 bg-muted" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-accent/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Daily Streak</div>
              <div className="text-xl font-bold text-foreground flex gap-1 items-center">
                7 <span className="text-dashRed text-sm">🔥</span>
              </div>
            </div>
            <div className="bg-accent/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Credit Balance</div>
              <div className="text-xl font-bold text-foreground">
                580
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-sm font-medium mb-2">Recent Achievements</div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-dashGreen">Cold Call Champion</Badge>
              <Badge className="bg-dashBlue">Fast Response Pro</Badge>
              <Badge className="bg-dashYellow text-black border-dashYellow">Notes Wizard</Badge>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-sm font-medium mb-2">Daily Challenges</div>
            <div className="space-y-2 bg-card rounded-lg p-2">
              <div className="flex justify-between items-center text-sm card-action">
                <div className="flex items-center gap-2">
                  <span className="text-dashGreen">•</span>
                  Make 10 more calls
                </div>
                <span className="text-xs text-muted-foreground">40/50</span>
              </div>
              <div className="flex justify-between items-center text-sm card-action">
                <div className="flex items-center gap-2">
                  <span className="text-dashBlue">•</span>
                  Book 2 more meetings
                </div>
                <span className="text-xs text-muted-foreground">1/3</span>
              </div>
              <div className="flex justify-between items-center text-sm card-action">
                <div className="flex items-center gap-2">
                  <span className="text-dashRed">•</span>
                  Respond to all leads within 5 min
                </div>
                <span className="text-xs text-muted-foreground">Complete ✓</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameProgress;
