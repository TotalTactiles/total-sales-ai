
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from 'lucide-react';

interface ManagerBookingSystemProps {
  demoMode: boolean;
}

const ManagerBookingSystem: React.FC<ManagerBookingSystemProps> = ({ demoMode }) => {
  return (
    <Card className="rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-salesBlue" />
          1-on-1 Scheduling
        </CardTitle>
        <CardDescription>
          Manage coaching sessions and team meetings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-slate-600 mb-2">
            Regular 1-on-1s improve retention by 41% and performance by 27%.
          </p>
          
          <Card className="bg-slate-50 rounded-lg shadow-md">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Upcoming Sessions</h4>
              {demoMode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-salesBlue-light text-salesBlue">SJ</AvatarFallback>
                      </Avatar>
                      <span>Sarah Johnson</span>
                    </div>
                    <Badge>Tomorrow, 10:00 AM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-salesBlue-light text-salesBlue">MC</AvatarFallback>
                      </Avatar>
                      <span>Michael Chen</span>
                    </div>
                    <Badge>Friday, 2:00 PM</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No upcoming sessions scheduled.</p>
              )}
            </CardContent>
          </Card>
          
          <Button className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule New Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerBookingSystem;
