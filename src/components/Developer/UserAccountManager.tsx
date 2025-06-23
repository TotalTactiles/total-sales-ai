
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, User, RefreshCw, Shield, Database } from 'lucide-react';

interface UserInfo {
  email: string;
  role: string;
  full_name: string;
  hasProfile: boolean;
  profileData?: any;
}

const UserAccountManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);

  const expectedUsers = [
    { email: 'krishdev@tsam.com', role: 'developer', full_name: 'Krish Developer' },
    { email: 'manager@salesos.com', role: 'manager', full_name: 'Sales Manager' },
    { email: 'rep@salesos.com', role: 'sales_rep', full_name: 'Sales Rep' }
  ];

  useEffect(() => {
    checkUserProfiles();
  }, []);

  const checkUserProfiles = async () => {
    setIsLoading(true);
    try {
      logger.info('Checking user profiles...');
      
      const userStatuses: UserInfo[] = [];
      
      for (const expectedUser of expectedUsers) {
        // Check if profile exists in profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', expectedUser.role)
          .single();

        userStatuses.push({
          email: expectedUser.email,
          role: expectedUser.role,
          full_name: expectedUser.full_name,
          hasProfile: !!profile && !error,
          profileData: profile
        });
      }
      
      setUsers(userStatuses);
      logger.info('User profile check completed:', userStatuses);
      
    } catch (error) {
      logger.error('Error checking user profiles:', error);
      toast.error('Failed to check user profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (user: UserInfo) => {
    if (user.hasProfile) {
      return <Badge variant="default" className="bg-green-500">✅ Profile Active</Badge>;
    }
    return <Badge variant="destructive">❌ No Profile</Badge>;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'developer':
        return <Badge variant="destructive">Developer</Badge>;
      case 'manager':
        return <Badge variant="default">Manager</Badge>;
      case 'sales_rep':
        return <Badge variant="secondary">Sales Rep</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile Management
          </CardTitle>
          <CardDescription>
            Monitor and manage the three core user accounts and their profiles in Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {users.map((user) => (
              <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-blue-600" />
                  <div className="flex items-center gap-3">
                    {getRoleBadge(user.role)}
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.profileData && (
                        <p className="text-xs text-green-600">
                          Last login: {user.profileData.last_login ? new Date(user.profileData.last_login).toLocaleDateString() : 'Never'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(user)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={checkUserProfiles} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Refresh Status
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Authentication Information:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 border rounded bg-white">
                <strong>Login Credentials:</strong>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>• Developer: krishdev@tsam.com / badabing2024</li>
                  <li>• Manager: manager@salesos.com / manager123</li>
                  <li>• Sales Rep: rep@salesos.com / sales123</li>
                </ul>
              </div>
              
              <div className="mt-4 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-700 font-medium">
                  🚀 <strong>Ready to use:</strong> Go to{' '}
                  <a href="/auth" className="text-primary hover:underline font-mono">
                    /auth
                  </a>
                  {' '}and login with any of the credentials above.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountManager;
