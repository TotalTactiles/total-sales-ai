
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AuthLoginForm from './components/AuthLoginForm';
import AuthSignupForm from './components/AuthSignupForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/components/Logo';

const AuthPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Check if user has completed onboarding
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('onboarding_complete, role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        console.log('🔍 User profile check:', profileData);

        if (!profileData.onboarding_complete) {
          console.log('➡️ Redirecting to role-specific onboarding');
          // Redirect to role-specific onboarding
          if (profileData.role === 'manager') {
            navigate('/onboarding/manager');
          } else if (profileData.role === 'sales_rep' || !profileData.role) {
            navigate('/onboarding/sales-rep');
          } else {
            navigate('/onboarding');
          }
          return;
        }

        // User has completed onboarding, redirect to appropriate dashboard
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
        // If there's an error, redirect to onboarding to be safe
        navigate('/onboarding');
      }
    };

    checkUserStatus();
  }, [user, navigate]);

  // Show loading while checking user status
  if (isLoading || user || isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Welcome to SalesOS</h1>
          <p className="text-gray-600 mt-2">Your AI-powered sales assistant</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Sign In</TabsTrigger>
                <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthLoginForm setIsTransitioning={setIsTransitioning} />
              </TabsContent>
              <TabsContent value="signup">
                <AuthSignupForm setIsLogin={setIsLogin} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
