
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AuthDebugger from '@/components/AuthDebugger';

const DeveloperDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
          <p className="text-gray-600 mt-2">System monitoring and development tools</p>
        </div>

        <AuthDebugger />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Status
                <Badge variant="default">Online</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => navigate('/test-users')} className="w-full">
                Create Test Users
              </Button>
              <Button onClick={() => navigate('/auth')} variant="outline" className="w-full">
                Go to Auth
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => navigate('/rep')} size="sm" className="w-full">
                Sales Rep Dashboard
              </Button>
              <Button onClick={() => navigate('/manager')} size="sm" className="w-full">
                Manager Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
