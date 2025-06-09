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
import { logger } from '@/utils/logger';
const AuthPage = () => {
  const {
    user,
    profile,
    loading,
    setLastSelectedRole,
    getLastSelectedRole,
    initializeDemoMode,
    isDemoMode
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>(getLastSelectedRole());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  // Prefill credentials based on selected role
  useEffect(() => {
    if (selectedRole === 'developer') {
      setFormData({ email: 'krishdev@tsam.com', password: 'badabing2024', fullName: '' });
    } else if (selectedRole === 'manager') {
      setFormData({ email: 'manager@salesos.com', password: 'manager123', fullName: '' });
    } else {
      setFormData({ email: 'sales.rep@company.com', password: 'fulluser123', fullName: '' });
    }
  }, [selectedRole]);

  // Show loading screen while auth state is being determined
  if (loading) {
    return <AuthLoadingScreen role={selectedRole} isDemoMode={isDemoMode()} />;
  }

  // Redirect based on actual profile role if logged in
  if (user && profile && !isTransitioning) {
    logger.info("AuthPage: User is logged in, profile role:", profile.role);

    // Check if this is a new user (no previous login)
    const isNewUser = !localStorage.getItem('hasCompletedOnboarding');
    if (isNewUser && !showOnboarding) {
      setShowOnboarding(true);
    }
    const redirectPath = profile.role === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
    const from = location.state?.from?.pathname || redirectPath;
    logger.info("AuthPage: Redirecting to:", from);
    return <Navigate to={from} replace />;
  }

  // Check if demo mode is active and redirect accordingly
  if (isDemoMode() && !user) {
    const demoRole = localStorage.getItem('demoRole') as Role | null;
    if (demoRole) {
      const redirectPath = demoRole === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
      logger.info("AuthPage: Demo mode active, redirecting to", redirectPath);
      return <Navigate to={redirectPath} replace />;
    }
  }
  const handleRoleChange = (role: Role) => {
    logger.info("AuthPage: Role changed to", role);
    setSelectedRole(role);
    setLastSelectedRole(role);
  };
  const simulateLoginTransition = () => {
    setIsTransitioning(true);
    // Simulate loading and transition to dashboard
    setTimeout(() => {
      const redirectPath = selectedRole === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
      logger.info("AuthPage: Transitioning to", redirectPath);
      navigate(redirectPath, {
        replace: true
      });
      setIsTransitioning(false);
    }, 1500);
  };

  // If transitioning, show loading screen
  if (isTransitioning) {
    return <AuthLoadingScreen role={selectedRole} isDemoMode={isDemoMode()} />;
  }
  return <div className="min-h-screen flex flex-col items-center justify-center gradient-secondary">
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
              {isLogin ? <AuthLoginForm selectedRole={selectedRole} setIsTransitioning={setIsTransitioning} simulateLoginTransition={simulateLoginTransition} formData={{
              email: formData.email,
              password: formData.password
            }} setFormData={(data: {
              email: string;
              password: string;
            }) => {
              setFormData(prev => ({
                ...prev,
                ...data
              }));
            }} /> : <AuthSignupForm selectedRole={selectedRole} setIsLogin={setIsLogin} />}
              
              <div className="flex items-center justify-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:text-primary/80 bg-transparent border-none cursor-pointer font-medium">
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              </div>
            </div>
            
            <AuthDemoOptions selectedRole={selectedRole} setIsTransitioning={setIsTransitioning} simulateLoginTransition={simulateLoginTransition} setFormData={(data: {
            email: string;
            password: string;
          }) => {
            setFormData(prev => ({
              ...prev,
              ...data
            }));
          }} />
          </div>
        </Tabs>
      </Card>
    </div>;
};
export default AuthPage;