
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AuthLoginForm from './components/AuthLoginForm';
import DemoModeSelector from '@/components/auth/DemoModeSelector';
import { Role } from '@/contexts/auth/types';
import { logger } from '@/utils/logger';

const AuthPage: React.FC = () => {
  const { user, profile, loading, isDemoMode } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('sales_rep');

  // Redirect if already authenticated
  useEffect(() => {
    if (user && profile && !loading) {
      logger.info('User already authenticated, redirecting...');
    }
  }, [user, profile, loading]);

  const simulateLoginTransition = (role?: Role) => {
    setIsTransitioning(true);
    if (role) setSelectedRole(role);
  };

  // Show loading state during authentication
  if (loading || isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">
            {isTransitioning ? 'Logging you in...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users
  if (user && profile) {
    const roleRoutes = {
      developer: '/developer',
      admin: '/developer',
      manager: '/manager',
      sales_rep: '/sales'
    };
    return <Navigate to={roleRoutes[profile.role] || '/sales'} replace />;
  }

  // Redirect demo users
  if (isDemoMode() && profile) {
    const roleRoutes = {
      developer: '/developer',
      admin: '/developer',
      manager: '/manager',
      sales_rep: '/sales'
    };
    return <Navigate to={roleRoutes[profile.role] || '/sales'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
              T
            </div>
            <h1 className="text-3xl font-bold">TSAM</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Advanced Sales Operating System
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="demo">Demo Mode</TabsTrigger>
            <TabsTrigger value="login">Account Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="space-y-6">
            <DemoModeSelector />
          </TabsContent>
          
          <TabsContent value="login" className="space-y-6">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Access your TSAM account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthLoginForm
                  setIsTransitioning={setIsTransitioning}
                  simulateLoginTransition={simulateLoginTransition}
                  selectedRole={selectedRole}
                />
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                Don't have an account yet? Try the demo mode above to explore the platform.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
