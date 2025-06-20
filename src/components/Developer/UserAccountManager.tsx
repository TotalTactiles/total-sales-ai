
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createAllDemoUsers, testDemoUserLogin, DEMO_USERS } from '@/utils/createDemoUsers';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, User, RefreshCw, AlertTriangle, Play, Shield } from 'lucide-react';

const UserAccountManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
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
        toast.success(`🎉 All ${successCount} demo users are ready! Testing login now...`);
        // Auto-test after creation
        await handleTestAllUsers();
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

  const handleTestAllUsers = async () => {
    setIsTesting(true);
    try {
      logger.info('Testing all demo user logins...');
      toast.info('Testing demo user logins...');
      
      const loginTests = [];
      for (const user of DEMO_USERS) {
        const testResult = await testDemoUserLogin(user.email, user.password);
        loginTests.push({
          email: user.email,
          role: user.role,
          ...testResult
        });
        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setTestResults(loginTests);
      
      const successfulLogins = loginTests.filter(t => t.success).length;
      if (successfulLogins === DEMO_USERS.length) {
        toast.success(`✅ All ${successfulLogins} users can login successfully!`);
      } else {
        toast.warning(`⚠️ ${successfulLogins}/${DEMO_USERS.length} users can login - some need fixing`);
      }
      
    } catch (error) {
      logger.error('Error testing user logins:', error);
      toast.error('Failed to test user logins');
    } finally {
      setIsTesting(false);
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

  const getTestStatusBadge = (testResult: any) => {
    if (!testResult) return <Badge variant="outline">Not Tested</Badge>;
    if (testResult.success) return <Badge variant="default" className="bg-blue-500">✅ Login OK</Badge>;
    if (testResult.hasAuth && !testResult.hasProfile) return <Badge variant="secondary" className="bg-yellow-500">⚠️ No Profile</Badge>;
    return <Badge variant="destructive">❌ Login Failed</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Demo User Account Manager
          </CardTitle>
          <CardDescription>
            Create and test the three core demo user accounts for all role-based functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {DEMO_USERS.map((user) => {
              const result = results.find(r => r.email === user.email);
              const testResult = testResults.find(t => t.email === user.email);
              
              return (
                <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
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
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result)}
                    {getTestStatusBadge(testResult)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateUsers} 
              disabled={isCreating}
              className="flex-1"
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
            
            <Button 
              onClick={handleTestAllUsers} 
              disabled={isTesting}
              variant="outline"
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Test All Logins
                </>
              )}
            </Button>
          </div>
          
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
                      <span className="text-green-600 font-medium">✅ {result.message}</span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        ❌ {result.error?.message || result.message || 'Failed'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {testResults.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Login Test Results:
              </h4>
              {testResults.map((test, index) => (
                <div key={index} className="text-xs mb-2 p-2 border rounded bg-white">
                  <div className="font-mono font-medium">{test.email}</div>
                  <div className="mt-1">
                    {test.success ? (
                      <span className="text-green-600 font-medium">✅ Login successful - role: {test.profile?.role}</span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        ❌ {test.error || 'Login failed'}
                        {test.hasAuth && !test.hasProfile && ' - Profile missing'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-700 font-medium">
                  🚀 <strong>Ready to test:</strong> Go to{' '}
                  <a href="/auth" className="text-primary hover:underline font-mono">
                    /auth
                  </a>
                  {' '}and login with any of the working credentials above.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountManager;
