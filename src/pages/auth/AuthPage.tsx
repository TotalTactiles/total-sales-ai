import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DeveloperSecretLogin from '@/components/Developer/DeveloperSecretLogin';
import DemoLoginCards from '@/components/auth/DemoLoginCards';
import AuthSignupForm from './components/AuthSignupForm';
import { useDeveloperSecretTrigger } from '@/hooks/useDeveloperSecretTrigger';
import { isDemoMode, demoUsers } from '@/data/demo.mock.data';
import { ensureDemoUsersExist } from '@/utils/demoSetup';

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
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'sales_rep'>('sales_rep');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(isDemoMode ? 'demo' : 'login');
  const [isLogin, setIsLogin] = useState(true);
  const [demoUsersReady, setDemoUsersReady] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [authMessage, setAuthMessage] = useState<string>('');
  
  const { showDeveloperLogin, setShowDeveloperLogin } = useDeveloperSecretTrigger();

  // Handle URL params for messages
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'access-required') {
      setAuthMessage('Access restricted. Please log in with an authorized account.');
    } else if (message === 'profile-required') {
      setAuthMessage('Profile setup required. Please complete your login.');
    } else if (message === 'logout-success') {
      setAuthMessage('Successfully logged out.');
    }
  }, [searchParams]);

  // Ensure demo users exist on component mount
  useEffect(() => {
    if (isDemoMode) {
      ensureDemoUsersExist().then(() => {
        setDemoUsersReady(true);
        console.log('🎭 Demo users setup complete');
      }).catch(error => {
        console.error('🎭 Failed to setup demo users:', error);
        setDemoUsersReady(true);
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

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && profile) {
      console.log('🔍 User authenticated, redirecting based on role:', profile.role);
      
      const targetRoute = 
        profile.role === 'developer' || profile.role === 'admin' ? '/developer/dashboard' :
        profile.role === 'manager' ? '/manager/dashboard' :
        '/sales/dashboard';
      
      navigate(targetRoute, { replace: true });
    }
  }, [user, profile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
    setIsSubmitting(true);
    setAuthError('');
    setAuthMessage('');

    try {
      console.log('🔐 Login attempt for:', email);
      
      const result = await signIn(email, password);
      
      if (result?.error) {
        console.error('❌ Login error:', result.error);
        let errorMessage = 'Login failed. Please try again.';
        
        if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (result.error.message?.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link.';
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }
        
        setAuthError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Login successful - redirect will happen automatically');
    } catch (error) {
      console.error('❌ Login exception:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setIsSubmitting(true);
    setAuthError('');
    setAuthMessage('');
    
    try {
      console.log('🎭 Demo login attempt for:', demoEmail);
      
      const result = await signIn(demoEmail, demoPassword);
      if (result?.error) {
        console.error('❌ Demo login error:', result.error);
        setAuthError('Demo login failed. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Demo login successful');
    } catch (error) {
      console.error('❌ Demo login exception:', error);
      setAuthError('An unexpected error occurred during demo login.');
      setIsSubmitting(false);
    }
  };

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading TSAM OS...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your workspace</p>
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
            {/* Messages Display */}
            {authMessage && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-700">
                  {authMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {authError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {authError}
                </AlertDescription>
              </Alert>
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
              <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(value) => setIsLogin(value === 'login')} className="w-full">
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
                  <AuthSignupForm setIsLogin={setIsLogin} />
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
