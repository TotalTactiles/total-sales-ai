
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Role } from '@/contexts/auth/types';
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

  // Redirect if already logged in or in demo mode
  useEffect(() => {
    if (user && profile) {
      const redirectPath = profile.role === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
      navigate(redirectPath);
    } else if (isDemoMode()) {
      // Check if demo mode is active but navigation didn't happen
      const demoRole = localStorage.getItem('demoRole') as Role | null;
      if (demoRole) {
        const redirectPath = demoRole === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
        navigate(redirectPath);
      }
    }
  }, [user, profile, navigate, isDemoMode]);

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setLastSelectedRole(role);
  };

  const simulateLoginTransition = () => {
    // Simulate loading and transition to dashboard
    setTimeout(() => {
      const redirectPath = selectedRole === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
      navigate(redirectPath);
    }, 2000);
  };

  // If already in demo mode or transitioning, show loading screen
  if (isDemoMode() || isTransitioning) {
    return (
      <AuthLoadingScreen 
        role={localStorage.getItem('demoRole') as Role || selectedRole} 
        isDemoMode={isDemoMode()} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <Logo />
          <h2 className="text-2xl font-bold mt-4 text-salesBlue">Welcome to SalesOS</h2>
          <p className="text-slate-500 mt-1">Your AI-powered sales acceleration platform</p>
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
            <div className="text-center p-4 mb-4 border border-dashed border-slate-300 rounded-lg">
              <h3 className="font-medium text-lg mb-1">
                {selectedRole === 'manager' ? 'Manager Dashboard' : 'Sales Rep Dashboard'}
              </h3>
              <p className="text-sm text-slate-500">
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
                  className="text-sm text-salesBlue hover:text-salesBlue-dark bg-transparent border-none cursor-pointer"
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
      </div>
    </div>
  );
};

export default AuthPage;
