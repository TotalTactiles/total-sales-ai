
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ManagerCoaching: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Coaching</h1>
        <Button>Schedule Coaching Session</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>John Smith</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Sarah Johnson</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Good</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Mike Wilson</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">Needs Improvement</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coaching Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Cold Calling Techniques</h4>
                <p className="text-sm text-gray-600">3 team members need improvement</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Objection Handling</h4>
                <p className="text-sm text-gray-600">2 team members need support</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Closing Techniques</h4>
                <p className="text-sm text-gray-600">1 team member needs training</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerCoaching;
