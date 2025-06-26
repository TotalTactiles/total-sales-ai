
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeveloperSecretLogin from '@/components/Developer/DeveloperSecretLogin';
import DemoLoginCards from '@/components/auth/DemoLoginCards';
import { useDeveloperSecretTrigger } from '@/hooks/useDeveloperSecretTrigger';
import { isDemoMode, demoUsers } from '@/data/demo.mock.data';

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
  const [activeTab, setActiveTab] = useState('demo');
  
  // Developer secret trigger
  const { showDeveloperLogin, setShowDeveloperLogin } = useDeveloperSecretTrigger();

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

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || loading) {
        console.log('🔍 AuthPage: Waiting for user/loading state', { user: !!user, loading });
        return;
      }

      console.log('🔍 AuthPage: Checking user status', { 
        userId: user.id, 
        userEmail: user.email,
        profile: !!profile
      });

      try {
        // Check if this is a demo user first
        const isDemoUser = demoUsers.some(du => du.email === user.email || du.id === user.id);
        console.log('🎭 Is demo user?', isDemoUser);

        if (isDemoUser) {
          const demoUserData = demoUsers.find(du => du.email === user.email || du.id === user.id);
          console.log('🎭 Demo user found:', demoUserData);
          
          // Route demo users directly to their OS
          if (demoUserData?.role === 'manager') {
            console.log('➡️ Routing demo manager to /manager/overview');
            navigate('/manager/overview');
          } else if (demoUserData?.role === 'developer') {
            console.log('➡️ Routing demo developer to /developer/dashboard');
            navigate('/developer/dashboard');
          } else {
            console.log('➡️ Routing demo sales rep to /os/rep/dashboard');
            navigate('/os/rep/dashboard');
          }
          return;
        }

        // For non-demo users, check profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('onboarding_complete, role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Error checking user status:', error);
          return;
        }

        console.log('🔍 User profile check:', profileData);

        if (!profileData) {
          console.log('➡️ No profile found, redirecting to onboarding');
          navigate('/onboarding');
          return;
        }

        if (profileData.onboarding_complete) {
          console.log('➡️ Redirecting to dashboard for role:', profileData.role);
          if (profileData.role === 'manager') {
            navigate('/manager/overview');
          } else if (profileData.role === 'developer') {
            navigate('/developer/dashboard');
          } else {
            navigate('/os/rep/dashboard');
          }
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
        
      } catch (error) {
        console.error('❌ Error checking user status:', error);
        navigate('/onboarding');
      }
    };

    checkUserStatus();
  }, [user, loading, navigate, profile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔐 Login attempt for:', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('❌ Login error:', error);
        return;
      }

      console.log('✅ Login successful');
      // Success - the useEffect above will handle the redirect
    } catch (error) {
      console.error('❌ Login exception:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setIsSubmitting(true);
    try {
      console.log('🎭 Demo login attempt for:', demoEmail);
      
      // First, let's check if the user exists in Supabase auth
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(demoEmail);
      console.log('🎭 Existing user check:', existingUser);

      const { data, error } = await signIn(demoEmail, demoPassword);
      if (error) {
        console.error('❌ Demo login error:', error);
        // If user doesn't exist, we might need to create them
        console.log('🎭 Demo login failed, user might not exist in auth.users table');
      } else {
        console.log('✅ Demo login successful', data);
      }
    } catch (error) {
      console.error('❌ Demo login exception:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B61FF]"></div>
      </div>
    );
  }

  if (user) {
    console.log('🔍 User exists, showing loading while checking status...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B61FF]"></div>
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
            {isDemoMode ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="demo">Demo Access</TabsTrigger>
                  <TabsTrigger value="login">Manual Login</TabsTrigger>
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
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#7B61FF] hover:bg-[#674edc] text-white font-semibold transition-colors"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Logging in...
                        </div>
                      ) : (
                        '→ Login'
                      )}
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
              // Non-demo mode - original login form
              <div className="space-y-4">
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
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#7B61FF] hover:bg-[#674edc] text-white font-semibold transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Logging in...
                      </div>
                    ) : (
                      '→ Login'
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Footer */}
            <div className="text-center space-y-2">
              <button className="text-sm text-[#7B61FF] hover:text-[#674edc] hover:underline transition-colors">
                Don't have an account? Sign Up
              </button>
            </div>
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
