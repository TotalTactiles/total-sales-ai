
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createAllDemoUsers, DEMO_USERS } from '@/utils/createDemoUsers';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, User, RefreshCw, AlertTriangle } from 'lucide-react';

const UserAccountManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [autoCreateAttempted, setAutoCreateAttempted] = useState(false);

  // Auto-create users on component mount if not already attempted
  useEffect(() => {
    if (!autoCreateAttempted) {
      setAutoCreateAttempted(true);
      handleCreateUsers();
    }
  }, [autoCreateAttempted]);

  const handleCreateUsers = async () => {
    setIsCreating(true);
    try {
      logger.info('Starting demo user creation process...');
      toast.info('Creating demo users... Please wait.');
      
      const creationResults = await createAllDemoUsers();
      setResults(creationResults);
      
      const successCount = creationResults.filter(r => r.success).length;
      const totalCount = creationResults.length;
      
      if (successCount === totalCount) {
        toast.success(`🎉 All ${successCount} demo users are ready! You can now login at /auth`);
      } else if (successCount > 0) {
        toast.success(`${successCount}/${totalCount} demo users processed successfully`);
      } else {
        toast.error('❌ Failed to create demo users - check console for details');
      }
      
      logger.info('Demo user creation process completed', { successCount, totalCount });
    } catch (error) {
      logger.error('Error creating demo users:', error);
      toast.error('Failed to create demo users');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusIcon = (result: any) => {
    if (!result) return <User className="h-4 w-4 text-muted-foreground" />;
    if (result.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (result: any) => {
    if (!result) return <Badge variant="secondary">Pending</Badge>;
    if (result.success) return <Badge variant="default" className="bg-green-500">✅ Ready</Badge>;
    return <Badge variant="destructive">❌ Error</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Demo User Account Manager
        </CardTitle>
        <CardDescription>
          Create and manage the three core demo user accounts for testing all role-based functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {DEMO_USERS.map((user) => {
            const result = results.find(r => r.email === user.email);
            return (
              <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result)}
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      user.role === 'developer' ? 'destructive' : 
                      user.role === 'manager' ? 'default' : 'secondary'
                    }>
                      {user.role.replace('_', ' ')}
                    </Badge>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Password: {user.password}
                      </p>
                    </div>
                  </div>
                </div>
                {getStatusBadge(result)}
              </div>
            );
          })}
        </div>
        
        <Button 
          onClick={handleCreateUsers} 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Creating Users...
            </>
          ) : (
            'Recreate Demo Users'
          )}
        </Button>
        
        {results.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Creation Results:
            </h4>
            {results.map((result, index) => (
              <div key={index} className="text-xs mb-2 p-2 border rounded">
                <div className="font-mono font-medium">{result.email}</div>
                <div className="mt-1">
                  {result.success ? (
                    <span className="text-green-600 font-medium">✅ Ready for login</span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ❌ {result.error?.message || 'Failed'}
                    </span>
                  )}
                </div>
                {result.message && (
                  <div className="text-muted-foreground mt-1">
                    💡 {result.message}
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-4 pt-3 border-t border-muted-foreground/20">
              <p className="text-xs text-muted-foreground font-medium">
                🚀 <strong>Next step:</strong> Go to{' '}
                <a href="/auth" className="text-primary hover:underline font-mono">
                  /auth
                </a>
                {' '}and login with any of the credentials above.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserAccountManager;
