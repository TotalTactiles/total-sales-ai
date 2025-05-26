
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Trophy, Bell } from 'lucide-react';

const ManagerRecognitionEngine = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-salesGreen" />
          Recognition Engine
        </CardTitle>
        <CardDescription>
          Boost team morale and productivity through strategic recognition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-slate-600">
            Recognition increases team productivity by up to 31%. Use these tools to keep your team motivated and engaged.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-salesCyan mx-auto mb-2" />
                <h3 className="font-medium mb-1">Personal Awards</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Celebrate individual achievements and milestones
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Create Award
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-salesGreen mx-auto mb-2" />
                <h3 className="font-medium mb-1">Team Challenges</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Launch competitive team challenges and contests
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 text-salesBlue mx-auto mb-2" />
                <h3 className="font-medium mb-1">Public Recognition</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Share wins and achievements with the entire team
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Create Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerRecognitionEngine;
