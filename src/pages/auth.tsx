
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock authentication for demo
      console.log('Sign in attempt:', { email, password });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="text-center py-8">
        <Logo />
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Welcome to SalesOS</h1>
        <p className="text-gray-600 mt-2">Your AI-powered sales acceleration platform</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-md">
        {/* Auth Form */}
        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-center text-gray-800">Sign In</h2>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Test Access - Only visible in development */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">🧪 Test Access</h3>
            <p className="text-sm text-orange-700 mb-3">
              Access test onboarding for development and design iteration
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/test-onboarding')}
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Open Test Onboarding
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
