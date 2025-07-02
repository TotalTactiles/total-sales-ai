
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeveloperSecretLogin from '@/components/Developer/DeveloperSecretLogin';
import DemoLoginCards from '@/components/auth/DemoLoginCards';
import AuthSignupForm from './components/AuthSignupForm';
import { useDeveloperSecretTrigger } from '@/hooks/useDeveloperSecretTrigger';
import { isDemoMode, demoUsers } from '@/data/demo.mock.data';
import { ensureDemoUsersExist } from '@/utils/demoSetup';
import { logger } from '@/utils/logger';

const roles = [
  { 
    label: 'Manager', 
    value: 'manager', 
    description: 'Team analytics, performance tracking & insights' 
  },
  { 
    label: 'Sales Rep', 
    value: 'sales_rep', 
    description: 'Smart dialer, call scripts & AI sales assistant' 
  }
];

const AuthPage: React.FC = () => {
  const { user, profile, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'sales_rep'>('sales_rep');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(isDemoMode ? 'demo' : 'login');
  const [demoUsersReady, setDemoUsersReady] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  
  // Developer secret trigger
  const { showDeveloperLogin, setShowDeveloperLogin } = useDeveloperSecretTrigger();

  // Ensure demo users exist on component mount
  useEffect(() => {
    if (isDemoMode) {
      ensureDemoUsersExist().then(() => {
        setDemoUsersReady(true);
        logger.info('Demo users setup complete', {}, 'auth');
      }).catch(error => {
        logger.error('Failed to setup demo users:', error, 'auth');
        setDemoUsersReady(true); // Continue anyway
      });
    } else {
      setDemoUsersReady(true);
    }
  }, []);

  // Auto-fill demo credentials based on selected role
  useEffect(() => {
    if (isDemoMode && activeTab === 'login') {
      const demoUser = demoUsers.find(u => u.role === selectedRole);
      if (demoUser) {
        setEmail(demoUser.email);
        setPassword(demoUser.password);
      }
    }
  }, [selectedRole, activeTab]);

  // Redirect authenticated users based on role
  useEffect(() => {
    if (!loading && user && profile) {
      logger.info('User authenticated, redirecting based on role:', { role: profile.role }, 'auth');
      
      const targetRoute = profile.role === 'manager' ? '/manager/dashboard'
        : profile.role === 'developer' ? '/developer/dashboard'
        : '/sales/dashboard';
      
      navigate(targetRoute, { replace: true });
    }
  }, [user, profile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
    setIsSubmitting(true);
    setAuthError('');

    try {
      logger.info('Login attempt for:', { email }, 'auth');
      
      const result = await signIn(email, password);
      
      if (result?.error) {
        logger.error('Login error:', result.error, 'auth');
        setAuthError(result.error.message || 'Login failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      logger.info('Login successful', {}, 'auth');
      // Don't set isSubmitting to false - let the redirect handle cleanup
    } catch (error) {
      logger.error('Login exception:', error, 'auth');
      setAuthError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setIsSubmitting(true);
    setAuthError('');
    
    try {
      logger.info('Demo login attempt for:', { email: demoEmail }, 'auth');
      
      const result = await signIn(demoEmail, demoPassword);
      if (result?.error) {
        logger.error('Demo login error:', result.error, 'auth');
        setAuthError(result.error.message || 'Demo login failed. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      logger.info('Demo login successful', {}, 'auth');
    } catch (error) {
      logger.error('Demo login exception:', error, 'auth');
      setAuthError('An unexpected error occurred during demo login.');
      setIsSubmitting(false);
    }
  };

  // Don't show loading for auth page - show the form immediately
  // The auth state is handled by redirects in useEffect

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

  const selectedRoleData = roles.find(role => role.value === selectedRole);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <h1 className="text-3xl font-bold text-[#7B61FF] mb-2">TSAM</h1>
            </div>
            <p className="text-gray-600 text-sm">Your AI-powered sales acceleration platform</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Display */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {authError}
              </div>
            )}

            {isDemoMode && demoUsersReady ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="demo">Demo Access</TabsTrigger>
                  <TabsTrigger value="login">Login/Signup</TabsTrigger>
                </TabsList>
                
                <TabsContent value="demo" className="space-y-4">
                  <DemoLoginCards onDemoLogin={handleDemoLogin} />
                </TabsContent>
                
                <TabsContent value="login" className="space-y-4">
                  {/* Role Selector */}
                  <div className="flex justify-center gap-2">
                    {roles.map((role) => (
                      <Button
                        key={role.value}
                        variant={selectedRole === role.value ? 'default' : 'outline'}
                        onClick={() => setSelectedRole(role.value as 'manager' | 'sales_rep')}
                        className={`px-4 py-2 text-sm font-medium transition-all ${
                          selectedRole === role.value 
                            ? 'bg-[#7B61FF] text-white shadow-md hover:bg-[#674edc]' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300'
                        }`}
                      >
                        {role.label}
                      </Button>
                    ))}
                  </div>

                  {/* Dashboard Description */}
                  <Card className="bg-gray-50 border border-gray-200 rounded-xl">
                    <CardHeader className="text-center py-4">
                      <CardTitle className="text-lg font-semibold">
                        {selectedRoleData?.label} Dashboard
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {selectedRoleData?.description}
                      </p>
                    </CardHeader>
                  </Card>

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      → Login
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      Credentials auto-filled for demo user
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Tabs value="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  {/* Role Selector */}
                  <div className="flex justify-center gap-2">
                    {roles.map((role) => (
                      <Button
                        key={role.value}
                        variant={selectedRole === role.value ? 'default' : 'outline'}
                        onClick={() => setSelectedRole(role.value as 'manager' | 'sales_rep')}
                        className={`px-4 py-2 text-sm font-medium transition-all ${
                          selectedRole === role.value 
                            ? 'bg-[#7B61FF] text-white shadow-md hover:bg-[#674edc]' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300'
                        }`}
                      >
                        {role.label}
                      </Button>
                    ))}
                  </div>

                  {/* Dashboard Description */}
                  <Card className="bg-gray-50 border border-gray-200 rounded-xl">
                    <CardHeader className="text-center py-4">
                      <CardTitle className="text-lg font-semibold">
                        {selectedRoleData?.label} Dashboard
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {selectedRoleData?.description}
                      </p>
                    </CardHeader>
                  </Card>

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      → Login
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <AuthSignupForm setIsLogin={() => {}} />
                </TabsContent>
              </Tabs>
            )}
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
