
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AuthLoginForm from './components/AuthLoginForm';
import AuthSignupForm from './components/AuthSignupForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';

const AuthPage: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'manager' | 'sales_rep' | 'developer'>('sales_rep');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('sales.rep@company.com');
  const [password, setPassword] = useState('••••••••••');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || loading) {
        return;
      }

      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('onboarding_complete, role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking user status:', error);
          return;
        }

        console.log('🔍 User profile check:', profileData);

        if (!profileData) {
          console.log('➡️ No profile found, redirecting to onboarding');
          navigate('/onboarding');
          return;
        }

        if (!profileData.onboarding_complete) {
          console.log('➡️ Redirecting to role-specific onboarding');
          if (profileData.role === 'manager') {
            navigate('/onboarding/manager');
          } else if (profileData.role === 'sales_rep' || !profileData.role) {
            navigate('/onboarding/sales-rep');
          } else {
            navigate('/onboarding');
          }
          return;
        }

        console.log('➡️ Redirecting to dashboard');
        if (profileData.role === 'manager') {
          navigate('/os/manager/dashboard');
        } else if (profileData.role === 'developer' || profileData.role === 'admin') {
          navigate('/os/dev/dashboard');
        } else {
          navigate('/os/rep/dashboard');
        }
        
      } catch (error) {
        console.error('❌ Error checking user status:', error);
        navigate('/onboarding');
      }
    };

    checkUserStatus();
  }, [user, loading, navigate]);

  const handleRoleSelect = (role: 'manager' | 'sales_rep' | 'developer') => {
    setSelectedRole(role);
    setShowLoginForm(true);
  };

  const handleLoginAsFullUser = async () => {
    setIsTransitioning(true);
    // Simulate login - in a real app this would authenticate with the backend
    setTimeout(() => {
      if (selectedRole === 'sales_rep') {
        navigate('/os/rep/dashboard');
      } else if (selectedRole === 'manager') {
        navigate('/manager/overview');
      } else {
        navigate('/dev');
      }
    }, 1000);
  };

  if (loading || isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        {!showLoginForm ? (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">TSAM</h1>
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Welcome to TSAM</CardTitle>
              <p className="text-gray-600 text-sm">Your AI-powered sales acceleration platform</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedRole === 'manager' ? 'default' : 'outline'}
                  onClick={() => handleRoleSelect('manager')}
                  className="h-12 text-sm"
                >
                  Manager
                </Button>
                <Button
                  variant={selectedRole === 'sales_rep' ? 'default' : 'outline'}
                  onClick={() => handleRoleSelect('sales_rep')}
                  className="h-12 text-sm"
                >
                  Sales Rep
                </Button>
                <Button
                  variant={selectedRole === 'developer' ? 'default' : 'outline'}
                  onClick={() => handleRoleSelect('developer')}
                  className="h-12 text-sm"
                >
                  Developer
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">TSAM</h1>
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Welcome to TSAM</CardTitle>
              <p className="text-gray-600 text-sm">Your AI-powered sales acceleration platform</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 mb-6">
                <Button
                  variant={selectedRole === 'manager' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('manager')}
                  className="h-12 text-sm"
                >
                  Manager
                </Button>
                <Button
                  variant={selectedRole === 'sales_rep' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('sales_rep')}
                  className="h-12 text-sm"
                >
                  Sales Rep
                </Button>
                <Button
                  variant={selectedRole === 'developer' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('developer')}
                  className="h-12 text-sm"
                >
                  Developer
                </Button>
              </div>

              <Card className="bg-gray-50 border">
                <CardHeader className="text-center py-4">
                  <CardTitle className="text-lg">
                    {selectedRole === 'sales_rep' && 'Sales Rep Dashboard'}
                    {selectedRole === 'manager' && 'Manager Dashboard'}
                    {selectedRole === 'developer' && 'Developer Dashboard'}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {selectedRole === 'sales_rep' && 'Smart dialer, call scripts & AI sales assistant'}
                    {selectedRole === 'manager' && 'Team analytics, performance tracking & insights'}
                    {selectedRole === 'developer' && 'System monitoring, API access & integrations'}
                  </p>
                </CardHeader>
              </Card>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleLoginAsFullUser}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={isTransitioning}
                >
                  {isTransitioning ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Logging in...
                    </div>
                  ) : (
                    '→ Login as Full User'
                  )}
                </Button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Back to role selection
                </button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Auto-filled with full user credentials
                </p>
              </div>

              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Don't have an account? Sign Up
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
