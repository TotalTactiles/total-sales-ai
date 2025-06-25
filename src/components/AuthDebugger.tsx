
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AuthDebugger: React.FC = () => {
  const { user, profile, loading, session } = useAuth();
  const navigate = useNavigate();

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Loading:</strong> <Badge variant={loading ? "destructive" : "default"}>{loading ? "True" : "False"}</Badge>
        </div>
        
        <div>
          <strong>User:</strong> <Badge variant={user ? "default" : "secondary"}>{user ? "Authenticated" : "Not Authenticated"}</Badge>
          {user && <div className="text-sm text-gray-600">ID: {user.id}</div>}
        </div>
        
        <div>
          <strong>Session:</strong> <Badge variant={session ? "default" : "secondary"}>{session ? "Active" : "None"}</Badge>
        </div>
        
        <div>
          <strong>Profile:</strong> <Badge variant={profile ? "default" : "secondary"}>{profile ? "Loaded" : "Not Loaded"}</Badge>
          {profile && (
            <div className="text-sm text-gray-600">
              <div>Role: {profile.role}</div>
              <div>Name: {profile.full_name}</div>
              <div>Onboarding: {profile.onboarding_complete ? "Complete" : "Incomplete"}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate('/dev')}>Go to Dev</Button>
          <Button size="sm" onClick={() => navigate('/manager')}>Go to Manager</Button>
          <Button size="sm" onClick={() => navigate('/rep')}>Go to Rep</Button>
          <Button size="sm" onClick={() => navigate('/auth')}>Go to Auth</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugger;
