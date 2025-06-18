
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const NavigationFallback = () => {
  const { user, profile, signOut } = useAuth();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Navigation Error
          </CardTitle>
          <CardDescription>
            Unable to determine proper navigation for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded text-sm">
            <p><strong>User ID:</strong> {user?.id || 'Not found'}</p>
            <p><strong>Email:</strong> {user?.email || 'Not found'}</p>
            <p><strong>Role:</strong> {profile?.role || 'Not found'}</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            This usually happens when:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your profile hasn't been created yet</li>
              <li>There's a role mismatch</li>
              <li>Authentication state is corrupted</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleSignOut} variant="default" className="flex-1">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationFallback;
