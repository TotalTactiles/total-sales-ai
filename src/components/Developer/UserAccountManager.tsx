
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createAllDemoUsers, DEMO_USERS } from '@/utils/createDemoUsers';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

const UserAccountManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleCreateUsers = async () => {
    setIsCreating(true);
    try {
      const creationResults = await createAllDemoUsers();
      setResults(creationResults);
      
      const successCount = creationResults.filter(r => r.success).length;
      toast.success(`${successCount}/${creationResults.length} demo users processed successfully`);
    } catch (error) {
      logger.error('Error creating demo users:', error);
      toast.error('Failed to create demo users');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo User Account Manager</CardTitle>
        <CardDescription>
          Create the three core demo user accounts for testing all role-based functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {DEMO_USERS.map((user) => (
            <div key={user.email} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Badge variant={user.role === 'developer' ? 'destructive' : user.role === 'manager' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                <div>
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {results.find(r => r.email === user.email) && (
                <Badge variant={results.find(r => r.email === user.email)?.success ? 'default' : 'destructive'}>
                  {results.find(r => r.email === user.email)?.success ? 'Created' : 'Error'}
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleCreateUsers} 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Users...' : 'Create Demo Users'}
        </Button>
        
        {results.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded text-sm">
            <h4 className="font-medium mb-2">Creation Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="text-xs">
                {result.email}: {result.success ? '✅ Success' : '❌ Failed'}
                {result.message && ` - ${result.message}`}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserAccountManager;
