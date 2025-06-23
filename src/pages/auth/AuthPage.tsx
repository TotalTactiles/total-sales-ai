
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
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
  const { user, profile, loading, isDemoMode } = useAuth();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>('sales_rep');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get default credentials based on selected role
  const getDefaultCredentials = (role: Role) => {
    switch (role) {
      case 'developer':
        return { email: 'krishdev@tsam.com', password: 'badabing2024', fullName: 'Krish Developer' };
      case 'manager':
        return { email: 'manager@salesos.com', password: 'manager123', fullName: 'Sales Manager' };
      case 'sales_rep':
      default:
        return { email: 'rep@salesos.com', password: 'sales123', fullName: 'Sales Rep' };
    }
  };

  const [formData, setFormData] = useState(getDefaultCredentials(selectedRole));

  // Update credentials when role changes
  useEffect(() => {
    setFormData(getDefaultCredentials(selectedRole));
  }, [selectedRole]);

  // Show loading screen while auth state is being determined
  if (loading || isTransitioning) {
    return <AuthLoadingScreen role={selectedRole} isDemoMode={isDemoMode()} />;
  }

  // Only redirect if we have both user and profile, or if in demo mode
  if ((user && profile) || isDemoMode()) {
    const getRedirectPath = () => {
      if (isDemoMode()) {
        const demoRole = localStorage.getItem('demoRole');
        switch (demoRole) {
          case 'developer':
            return '/developer/dashboard';
          case 'manager':
            return '/manager/dashboard';
          case 'sales_rep':
          default:
            return '/sales/dashboard';
        }
      }
      
      if (profile) {
        switch (profile.role) {
          case 'developer':
          case 'admin':
            return '/developer/dashboard';
          case 'manager':
            return '/manager/dashboard';
          case 'sales_rep':
          default:
            return '/sales/dashboard';
        }
      }
      
      return '/sales/dashboard';
    };
    
    const redirectPath = getRedirectPath();
    const from = location.state?.from?.pathname || redirectPath;
    return <Navigate to={from} replace />;
  }

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
  };

  const simulateLoginTransition = () => {
    setIsTransitioning(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-secondary">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="max-w-md w-full mx-4 p-8 shadow-xl border-0 rounded-2xl gradient-card backdrop-blur-sm">
        <div className="text-center mb-8">
          <Logo />
          <h2 className="text-2xl font-bold mt-6 text-foreground font-poppins">Welcome to TSAM</h2>
          <p className="text-muted-foreground mt-2 text-sm">Your AI-powered sales acceleration platform</p>
        </div>
      
        <Tabs defaultValue={selectedRole} value={selectedRole} onValueChange={value => handleRoleChange(value as Role)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 bg-neutral-100 rounded-xl p-1">
            <TabsTrigger value="manager" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Manager
            </TabsTrigger>
            <TabsTrigger value="sales_rep" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Sales Rep
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Developer
            </TabsTrigger>
          </TabsList>
        
          <div className="space-y-6">
            <div className="text-center p-6 mb-6 border border-neutral-200 rounded-xl bg-neutral-50/50">
              <h3 className="font-semibold text-lg mb-2 font-poppins">
                {selectedRole === 'manager'
                  ? 'Manager Dashboard'
                  : selectedRole === 'developer'
                  ? 'Developer Dashboard'
                  : 'Sales Rep Dashboard'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedRole === 'manager'
                  ? 'Team analysis, performance tracking & AI coaching'
                  : selectedRole === 'developer'
                  ? 'System monitoring, logs & developer tools'
                  : 'Smart dialer, call scripts & AI sales assistant'}
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              {isLogin ? (
                <AuthLoginForm 
                  selectedRole={selectedRole} 
                  setIsTransitioning={setIsTransitioning} 
                  simulateLoginTransition={simulateLoginTransition} 
                  formData={{
                    email: formData.email,
                    password: formData.password
                  }} 
                  setFormData={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
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
                  className="text-sm text-primary hover:text-primary/80 bg-transparent border-none cursor-pointer font-medium"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              </div>
            </div>
            
            <AuthDemoOptions 
              selectedRole={selectedRole} 
              setIsTransitioning={setIsTransitioning} 
              simulateLoginTransition={simulateLoginTransition} 
              setFormData={(data) => {
                setFormData(prev => ({ ...prev, ...data }));
              }} 
            />
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
