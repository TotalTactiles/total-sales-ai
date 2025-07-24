
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import DemoLoginCards from '@/components/auth/DemoLoginCards';
import AuthLoginForm from '@/pages/auth/components/AuthLoginForm';
import AuthSignupForm from '@/pages/auth/components/AuthSignupForm';
import AuthLoadingScreen from '@/pages/auth/components/AuthLoadingScreen';
import { logDemoLogin } from '@/data/demo.mock.data';

const AuthPage: React.FC = () => {
  const { user, signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/sales/dashboard" replace />;
  }

  // Show loading screen during transition
  if (isTransitioning) {
    return <AuthLoadingScreen />;
  }

  const handleDemoLogin = async (email: string, password: string) => {
    setIsTransitioning(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Demo login failed:', error);
        logDemoLogin(email, false);
        setIsTransitioning(false);
      } else {
        logDemoLogin(email, true);
        // Successful login will be handled by auth state change
      }
    } catch (error) {
      console.error('Demo login error:', error);
      logDemoLogin(email, false);
      setIsTransitioning(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-6">
        {/* TSAM Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TSAM</h1>
          <p className="text-gray-600">AI-Powered Sales Management Platform</p>
        </div>

        {/* Auth Tabs */}
        <Tabs value={isLogin ? "demo" : "auth"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="demo" 
              onClick={() => setIsLogin(true)}
              className="data-[state=active]:bg-[#7B61FF] data-[state=active]:text-white"
            >
              Demo Access
            </TabsTrigger>
            <TabsTrigger 
              value="auth"
              onClick={() => setIsLogin(false)}
              className="data-[state=active]:bg-[#7B61FF] data-[state=active]:text-white"
            >
              Login/Signup
            </TabsTrigger>
          </TabsList>

          {/* Demo Access Tab */}
          <TabsContent value="demo" className="space-y-0">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <DemoLoginCards onDemoLogin={handleDemoLogin} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Login/Signup Tab */}
          <TabsContent value="auth" className="space-y-0">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-lg">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {isLogin ? (
                  <AuthLoginForm setIsTransitioning={setIsTransitioning} />
                ) : (
                  <AuthSignupForm setIsLogin={setIsLogin} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
