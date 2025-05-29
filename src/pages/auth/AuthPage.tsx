
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
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
  const { user, profile, setLastSelectedRole, getLastSelectedRole, initializeDemoMode, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>(getLastSelectedRole());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check for existing authentication and redirect if needed
  useEffect(() => {
    console.log("AuthPage: Checking login status. User:", !!user, "Profile:", !!profile, "Demo mode:", isDemoMode());
    
    // Only redirect if we have both user and profile (fully authenticated)
    if (user && profile && !isTransitioning) {
      console.log("AuthPage: User is logged in, redirecting to dashboard");
      
      // Navigate using OS structure
      let targetPath = '/sales/dashboard';
      
      switch (profile.role) {
        case 'developer':
        case 'admin':
          targetPath = '/developer/dashboard';
          break;
        case 'manager':
          targetPath = '/manager/dashboard';
          break;
        case 'sales_rep':
        default:
          targetPath = '/sales/dashboard';
          break;
      }
      
      navigate(targetPath);
    }
  }, [user, profile, navigate, isDemoMode, isTransitioning]);

  const handleRoleChange = (role: Role) => {
    console.log("AuthPage: Role changed to", role);
    setSelectedRole(role);
    setLastSelectedRole(role);
  };

  const simulateLoginTransition = () => {
    // Simulate loading and transition to dashboard
    setTimeout(() => {
      // Use OS structure
      let targetPath = '/sales/dashboard';
      
      switch (selectedRole) {
        case 'developer':
        case 'admin':
          targetPath = '/developer/dashboard';
          break;
        case 'manager':
          targetPath = '/manager/dashboard';
          break;
        case 'sales_rep':
        default:
          targetPath = '/sales/dashboard';
          break;
      }
      
      console.log("AuthPage: Transitioning to", targetPath);
      navigate(targetPath);
    }, 1500);
  };

  // If transitioning, show loading screen
  if (isTransitioning) {
    return (
      <AuthLoadingScreen 
        role={selectedRole} 
        isDemoMode={false} 
      />
    );
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
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="sales_rep" className="flex items-center gap-2">
              Sales Rep
            </TabsTrigger>
            <TabsTrigger value="manager" className="flex items-center gap-2">
              Manager
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2">
              Developer
            </TabsTrigger>
          </TabsList>
        
          <div className="space-y-6">
            <div className="text-center p-4 mb-4 border border-dashed border-border rounded-lg dark:border-dark-border">
              <h3 className="font-medium text-lg mb-1">
                {selectedRole === 'developer' ? 'Developer OS' : 
                 selectedRole === 'manager' ? 'Manager OS' : 'Sales Rep OS'}
              </h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {selectedRole === 'developer' 
                  ? 'System monitoring, AI brain, sandbox & dev tools' 
                  : selectedRole === 'manager'
                  ? 'Team analysis, performance tracking & AI coaching' 
                  : 'Smart dialer, call scripts & AI sales assistant'}
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              {isLogin ? (
                <AuthLoginForm 
                  setIsTransitioning={setIsTransitioning} 
                  simulateLoginTransition={simulateLoginTransition}
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
            />
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
