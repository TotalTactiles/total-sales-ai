
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Role } from '@/contexts/auth/types';
import { ThemeToggle } from '@/components/ThemeProvider';
import Logo from '@/components/Logo';
import AuthLoginForm from './components/AuthLoginForm';
import AuthSignupForm from './components/AuthSignupForm';
import AuthDemoOptions from './components/AuthDemoOptions';
import AuthLoadingScreen from './components/AuthLoadingScreen';

const AuthPage = () => {
  const { user, profile, loading, setLastSelectedRole, getLastSelectedRole, initializeDemoMode, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>(getLastSelectedRole());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  // Show loading screen while auth state is being determined
  if (loading && !isTransitioning) {
    return (
      <AuthLoadingScreen 
        role={selectedRole} 
        isDemoMode={isDemoMode()} 
      />
    );
  }

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && profile) {
      console.log("AuthPage: User is logged in, redirecting based on role:", profile.role);
      const redirectPath = profile.role === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
      const from = location.state?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
    } else if (!loading && isDemoMode()) {
      // Check if demo mode is active
      const demoRole = localStorage.getItem('demoRole') as Role | null;
      if (demoRole) {
        const redirectPath = demoRole === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
        console.log("AuthPage: Demo mode active, redirecting to", redirectPath);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, profile, loading, navigate, isDemoMode, location]);

  const handleRoleChange = (role: Role) => {
    console.log("AuthPage: Role changed to", role);
    setSelectedRole(role);
    setLastSelectedRole(role);
  };

  const simulateLoginTransition = () => {
    setIsTransitioning(true);
    // Simulate loading and transition to dashboard
    setTimeout(() => {
      const redirectPath = selectedRole === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
      console.log("AuthPage: Transitioning to", redirectPath);
      navigate(redirectPath, { replace: true });
      setIsTransitioning(false);
    }, 1500);
  };

  // If transitioning, show loading screen
  if (isTransitioning) {
    return (
      <AuthLoadingScreen 
        role={selectedRole} 
        isDemoMode={isDemoMode()} 
      />
    );
  }

  // Don't show auth page if user is already authenticated
  if (!loading && user && profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/80 dark:from-dark dark:to-dark/90">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="max-w-md w-full p-8 shadow-lg border border-border/40 rounded-xl dark:bg-dark-card dark:border-dark-border">
        <div className="text-center mb-6">
          <Logo />
          <h2 className="text-2xl font-bold mt-4 text-foreground dark:text-white">Welcome to SalesOS</h2>
          <p className="text-muted-foreground dark:text-gray-400 mt-1">Your AI-powered sales acceleration platform</p>
        </div>
      
        <Tabs 
          defaultValue={selectedRole} 
          value={selectedRole}
          onValueChange={(value) => handleRoleChange(value as Role)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="manager" className="flex items-center gap-2">
              Manager View
            </TabsTrigger>
            <TabsTrigger value="sales_rep" className="flex items-center gap-2">
              Sales Rep View
            </TabsTrigger>
          </TabsList>
        
          <div className="space-y-6">
            <div className="text-center p-4 mb-4 border border-dashed border-border rounded-lg dark:border-dark-border">
              <h3 className="font-medium text-lg mb-1">
                {selectedRole === 'manager' ? 'Manager Dashboard' : 'Sales Rep Dashboard'}
              </h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {selectedRole === 'manager' 
                  ? 'Team analysis, performance tracking & AI coaching' 
                  : 'Smart dialer, call scripts & AI sales assistant'}
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              {isLogin ? (
                <AuthLoginForm 
                  setIsTransitioning={setIsTransitioning} 
                  simulateLoginTransition={simulateLoginTransition}
                  formData={{
                    email: formData.email,
                    password: formData.password
                  }}
                  setFormData={(data: { email: string; password: string; }) => {
                    setFormData(prev => ({
                      ...prev,
                      ...data
                    }));
                  }}
                />
              ) : (
                <AuthSignupForm 
                  selectedRole={selectedRole}
                  setIsLogin={setIsLogin}
                />
              )}
              
              <div className="flex items-center justify-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:text-primary/80 bg-transparent border-none cursor-pointer"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              </div>
            </div>
            
            <AuthDemoOptions 
              selectedRole={selectedRole} 
              setIsTransitioning={setIsTransitioning}
              simulateLoginTransition={simulateLoginTransition}
              setFormData={(data: { email: string; password: string; }) => {
                setFormData(prev => ({
                  ...prev,
                  ...data
                }));
              }}
            />
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
