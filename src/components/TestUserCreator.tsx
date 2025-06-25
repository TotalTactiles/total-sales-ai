
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

const TestUserCreator: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const createTestUsers = async () => {
    setIsCreating(true);
    setResults(null);

    try {
      const response = await fetch('/functions/v1/create-test-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        setResults(result);
        toast.success('Test users created successfully!');
      } else {
        toast.error(`Failed to create test users: ${result.error}`);
        setResults({ success: false, error: result.error });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      setResults({ success: false, error: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    toast.success('Credentials copied to clipboard!');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Test User Setup
        </CardTitle>
        <p className="text-sm text-gray-600">
          Create test users to test both onboarding flows
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createTestUsers} 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Creating test users...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Test Users
            </>
          )}
        </Button>

        {results && (
          <div className="space-y-4">
            {results.success ? (
              <>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="font-medium">Test users created successfully!</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sales Rep Test User</p>
                        <p className="text-sm text-gray-600">salesrep@test.com</p>
                        <p className="text-sm text-gray-600">Password: test123456</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Sales Rep</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCredentials('salesrep@test.com', 'test123456')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Manager Test User</p>
                        <p className="text-sm text-gray-600">manager@test.com</p>
                        <p className="text-sm text-gray-600">Password: test123456</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Manager</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCredentials('manager@test.com', 'test123456')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {results.results && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Creation Results:</h4>
                    {results.results.map((result: any, index: number) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                        <span className="font-medium">{result.email}:</span>{' '}
                        <Badge 
                          variant={result.status === 'created' || result.status === 'updated' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {result.status}
                        </Badge>
                        {result.error && <span className="text-red-600 ml-2">{result.error}</span>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="font-medium mb-1">Testing Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Log out if currently logged in</li>
                    <li>Use the credentials above to test each onboarding flow</li>
                    <li>Sales Rep flow will redirect to: /onboarding/sales-rep</li>
                    <li>Manager flow will redirect to: /onboarding/manager</li>
                    <li>Complete the onboarding to see the personalized OS</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertCircle className="mr-2 h-4 w-4" />
                <span>Failed to create test users: {results.error}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestUserCreator;
