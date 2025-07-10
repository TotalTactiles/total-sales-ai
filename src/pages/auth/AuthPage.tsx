
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DeveloperSecretLogin from '@/components/Developer/DeveloperSecretLogin';
import { isDemoMode, demoUsers, logDemoLogin } from '@/data/demo.mock.data';
import { ensureDemoUsersExist } from '@/utils/demoSetup';

const AuthPage: React.FC = () => {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'sales_rep'>('sales_rep');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signUpRole, setSignUpRole] = useState<'manager' | 'sales_rep'>('sales_rep');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('sales_rep');
  const [authError, setAuthError] = useState<string>('');
  const [showDeveloperLogin, setShowDeveloperLogin] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Ensure demo users exist
  useEffect(() => {
    if (isDemoMode) {
      ensureDemoUsersExist().catch(error => {
        console.error('Failed to setup demo users:', error);
      });
    }
  }, []);

  // Developer secret trigger - triple dot press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '.') {
        setDotCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setShowDeveloperLogin(true);
            return 0;
          }
          return newCount;
        });
      } else {
        setDotCount(0);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  // Handle logout on page load if logout flag is present
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const isLogout = location.state?.logout || urlParams.get('logout') === 'true';
    
    if (isLogout && user && !isLoggingOut) {
      setIsLoggingOut(true);
      console.log('Logout detected, signing out user');
      signOut().then(() => {
        setIsLoggingOut(false);
        // Clear the logout state
        navigate('/auth', { replace: true });
      });
    }
  }, [location, user, signOut, navigate, isLoggingOut]);

  // Redirect authenticated users based on their role
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const isLogout = location.state?.logout || urlParams.get('logout') === 'true';

    // Prevent redirect loops by ensuring we're on the /auth page
    if (location.pathname !== '/auth') return;

    if (!loading && user && profile && !isLogout && !isLoggingOut) {
      console.log('User authenticated, redirecting based on role:', profile.role);

      // Wait a moment to ensure state is fully updated
      setTimeout(() => {
        const targetRoute = profile.role === 'manager' ? '/manager/dashboard'
          : profile.role === 'developer' ? '/dev/dashboard'
          : '/sales/dashboard';

        navigate(targetRoute, { replace: true });
      }, 100);
    }
  }, [user, profile, loading, navigate, location, isLoggingOut]);

  // Auto-fill demo credentials based on selected role
  useEffect(() => {
    if (isDemoMode) {
      const demoUser = demoUsers.find(u => u.role === selectedRole);
      if (demoUser) {
        setEmail(demoUser.email);
        setPassword(demoUser.password);
      }
    }
  }, [selectedRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
    setIsSubmitting(true);
    setAuthError('');

    try {
      console.log('Login attempt for:', email);
      
      const result = await signIn(email, password);
      
      if (result?.error) {
        console.error('Login error:', result.error);
        setAuthError(result.error.message || 'Login failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Login successful');
      // Don't set isSubmitting to false here - let the redirect handle it
    } catch (error) {
      console.error('Login exception:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'manager' | 'sales_rep') => {
    const demoUser = demoUsers.find(u => u.role === role);
    if (!demoUser) {
      setAuthError('Demo user not found');
      return;
    }

    setIsSubmitting(true);
    setAuthError('');
    
    try {
      console.log('Demo login attempt for:', demoUser.email, 'Role:', role);
      logDemoLogin(demoUser.email, true);

      const result = await signIn(demoUser.email, demoUser.password);
      if (result?.error) {
        console.error('Demo login error:', result.error);
        setAuthError(result.error.message || 'Demo login failed. Please try again.');
        setIsSubmitting(false);
        logDemoLogin(demoUser.email, false);
        return;
      }

      console.log('Demo login successful for role:', role);

      // Explicitly route based on the demo user's role
      const destination = role === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
      navigate(destination, { replace: true });
    } catch (error) {
      console.error('Demo login exception:', error);
      setAuthError('An unexpected error occurred during demo login.');
      setIsSubmitting(false);
      logDemoLogin(demoUser.email, false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password || !fullName) return;

    setIsSubmitting(true);
    setAuthError('');

    try {
      const result = await signUp(email, password, {
        data: {
          full_name: fullName,
          role: signUpRole
        }
      });
      
      if (result?.error) {
        console.error('Signup error:', result.error);
        setAuthError(result.error.message || 'Sign up failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Signup successful');
    } catch (error) {
      console.error('Signup exception:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show loading state while auth is initializing or logging out
  if (loading || isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            {isLoggingOut ? 'Signing you out...' : 'Loading TSAM OS...'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {isLoggingOut ? 'Please wait' : 'Preparing your workspace'}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state during form submission
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Signing you in...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <h1 className="text-3xl font-bold text-[#7B61FF] mb-2">TSAM</h1>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Welcome to TSAM</CardTitle>
            <p className="text-gray-600 text-sm">Your AI-powered sales acceleration platform</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Display */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {authError}
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manager">Manager</TabsTrigger>
                <TabsTrigger value="sales_rep">Sales Rep</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Manager Tab */}
              <TabsContent value="manager" className="space-y-4">
                <Card className="bg-gray-50 border border-gray-200 rounded-xl">
                  <CardHeader className="text-center py-4">
                    <CardTitle className="text-lg font-semibold">Manager Dashboard</CardTitle>
                    <p className="text-sm text-gray-600">Team analytics, performance tracking & insights</p>
                  </CardHeader>
                </Card>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="manager-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="manager-email"
                      type="email"
                      value={selectedRole === 'manager' ? email : ''}
                      onChange={(e) => {
                        setSelectedRole('manager');
                        setEmail(e.target.value);
                      }}
                      className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                      placeholder="manager@company.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="manager-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                      id="manager-password"
                      type="password"
                      value={selectedRole === 'manager' ? password : ''}
                      onChange={(e) => {
                        setSelectedRole('manager');
                        setPassword(e.target.value);
                      }}
                      className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#7B61FF] hover:bg-[#674edc] text-white font-semibold transition-colors"
                  >
                    → Login as Full User
                  </Button>
                </form>

                {isDemoMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin('manager')}
                    disabled={isSubmitting}
                    className="w-full h-12 border-2 border-[#7B61FF] text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white font-semibold transition-colors"
                  >
                    Login as Demo Manager
                  </Button>
                )}
              </TabsContent>
              
              {/* Sales Rep Tab */}
              <TabsContent value="sales_rep" className="space-y-4">
                <Card className="bg-gray-50 border border-gray-200 rounded-xl">
                  <CardHeader className="text-center py-4">
                    <CardTitle className="text-lg font-semibold">Sales Rep Dashboard</CardTitle>
                    <p className="text-sm text-gray-600">Smart dialer, call scripts & AI sales assistant</p>
                  </CardHeader>
                </Card>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="sales-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="sales-email"
                      type="email"
                      value={selectedRole === 'sales_rep' ? email : ''}
                      onChange={(e) => {
                        setSelectedRole('sales_rep');
                        setEmail(e.target.value);
                      }}
                      className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                      placeholder="sales.rep@company.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sales-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                      id="sales-password"
                      type="password"
                      value={selectedRole === 'sales_rep' ? password : ''}
                      onChange={(e) => {
                        setSelectedRole('sales_rep');
                        setPassword(e.target.value);
                      }}
                      className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#7B61FF] hover:bg-[#674edc] text-white font-semibold transition-colors"
                  >
                    → Login as Full User
                  </Button>
                </form>

                {isDemoMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin('sales_rep')}
                    disabled={isSubmitting}
                    className="w-full h-12 border-2 border-[#7B61FF] text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white font-semibold transition-colors"
                  >
                    Login as Demo Sales Rep
                  </Button>
                )}
              </TabsContent>
              
              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-role" className="text-sm font-medium text-gray-700">Role</Label>
                    <Select value={signUpRole} onValueChange={(value: 'manager' | 'sales_rep') => setSignUpRole(value)}>
                      <SelectTrigger className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales_rep">Sales Rep</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#7B61FF] hover:bg-[#674edc] text-white font-semibold transition-colors"
                  >
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Developer Secret Login Modal */}
      <DeveloperSecretLogin 
        isOpen={showDeveloperLogin}
        onClose={() => setShowDeveloperLogin(false)}
      />
    </div>
  );
};

export default AuthPage;
